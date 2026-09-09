const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
let htmlAudio: HTMLAudioElement | null = null;
export function createAudioContext(): AudioContext {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new AC();
}
export function unlockAudio(ctx: AudioContext) {
  if (ctx.state === "suspended") void ctx.resume();
  if (!htmlAudio) {
    htmlAudio = new Audio(SILENT_WAV);
    htmlAudio.loop = true;
    htmlAudio.setAttribute("playsinline", "");
    htmlAudio.volume = 0.01;
  }
  void htmlAudio.play().catch(() => {});
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = 0.05;
    o.frequency.value = 80;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.07);
  } catch { /* noop */ }
}
