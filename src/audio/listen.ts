/** Mic tap-tempo, room lock, and rush/drag vs the sequencer grid. */

export type Timing = "idle" | "late" | "locked" | "early";

let taps: number[] = [];
let onsets: number[] = [];
let stream: MediaStream | null = null;
let proc: ScriptProcessorNode | null = null;
let srcNode: MediaStreamAudioSourceNode | null = null;
let lastOnset = 0;

export function tapNow(): number | null {
  const t = performance.now();
  taps.push(t);
  if (taps.length > 8) taps = taps.slice(-8);
  if (taps.length < 3) return null;
  const gaps: number[] = [];
  for (let i = 1; i < taps.length; i++) gaps.push(taps[i] - taps[i - 1]);
  const mid = gaps.slice().sort((a, b) => a - b)[Math.floor(gaps.length / 2)];
  if (mid < 250 || mid > 1500) return null;
  return Math.round(60000 / mid);
}

export function resetTaps() {
  taps = [];
}

export function resetOnsets() {
  onsets = [];
}

export function timingFromError(sec: number): Timing {
  const ms = sec * 1000;
  if (Math.abs(ms) < 45) return "locked";
  return ms < 0 ? "early" : "late";
}

/** How far this onset is from the nearest 16th at bpm. Negative = early. */
export function gridError(bpm: number, ctxTime: number, origin: number): number {
  const step = 60 / Math.max(40, bpm) / 4;
  const pos = ctxTime - origin;
  if (pos < 0) return 0;
  const nearest = Math.round(pos / step) * step;
  return pos - nearest;
}

/** BPM from mic onsets when conductor is off — quarter-note gaps. */
export function bpmFromOnsets(ctxTimes: number[]): number | null {
  if (ctxTimes.length < 4) return null;
  const gaps: number[] = [];
  for (let i = 1; i < ctxTimes.length; i++) {
    const g = (ctxTimes[i] - ctxTimes[i - 1]) * 1000;
    if (g >= 250 && g <= 1500) gaps.push(g);
  }
  if (gaps.length < 3) return null;
  const mid = gaps.slice().sort((a, b) => a - b)[Math.floor(gaps.length / 2)];
  return Math.round(60000 / mid);
}

export function pushOnset(ctxTime: number): number[] {
  onsets.push(ctxTime);
  if (onsets.length > 10) onsets = onsets.slice(-10);
  return onsets;
}

export async function startMic(ctx: AudioContext, onOnset: (ctxTime: number) => void): Promise<void> {
  await stopMic();
  stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true },
    video: false,
  });
  srcNode = ctx.createMediaStreamSource(stream);
  proc = ctx.createScriptProcessor(2048, 1, 1);
  let prev = 0;
  proc.onaudioprocess = (ev) => {
    const d = ev.inputBuffer.getChannelData(0);
    let sum = 0;
    for (let i = 0; i < d.length; i++) sum += d[i] * d[i];
    const rms = Math.sqrt(sum / d.length);
    const now = ctx.currentTime;
    if (rms > 0.04 && rms > prev * 1.6 && now - lastOnset > 0.12) {
      lastOnset = now;
      onOnset(now);
    }
    prev = rms * 0.6 + prev * 0.4;
  };
  srcNode.connect(proc);
  const mute = ctx.createGain();
  mute.gain.value = 0;
  proc.connect(mute);
  mute.connect(ctx.destination);
}

export async function stopMic() {
  proc?.disconnect();
  srcNode?.disconnect();
  stream?.getTracks().forEach((t) => t.stop());
  proc = null;
  srcNode = null;
  stream = null;
}

export function estimateSwing(gapsMs: number[]): number {
  if (gapsMs.length < 4) return 0;
  const short = gapsMs.filter((g) => g < 400);
  const long = gapsMs.filter((g) => g >= 400 && g < 900);
  if (!short.length || !long.length) return 0;
  const s = short.reduce((a, b) => a + b, 0) / short.length;
  const l = long.reduce((a, b) => a + b, 0) / long.length;
  const ratio = l / (s + l);
  return Math.max(0, Math.min(0.3, ratio - 0.5));
}
