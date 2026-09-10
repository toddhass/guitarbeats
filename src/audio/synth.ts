import { SampleBank } from "./samples";

export type DrumVoice = "kick" | "snare" | "clap" | "rim" | "hat" | "openHat" | "pedalHat" | "ride" | "crash" | "splash" | "china" | "highTom" | "tom" | "floor" | "cowbell";
export type Kit = "dry" | "room";

export class Synth {
  ctx: AudioContext;
  dest: AudioNode;
  noise: AudioBuffer;
  kit: Kit = "room";
  samples: SampleBank;
  constructor(ctx: AudioContext, dest: AudioNode) {
    this.ctx = ctx;
    this.dest = dest;
    this.samples = new SampleBank(ctx);
    void this.samples.load("room");
    void this.samples.load("dry");
    const n = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = n;
  }
  private env(t: number, peak: number, dec: number) {
    const g = this.ctx.createGain();
    const s = Math.max(t, this.ctx.currentTime);
    g.gain.setValueAtTime(0.0001, s);
    try {
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), s + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.004 + dec);
    } catch {
      g.gain.linearRampToValueAtTime(peak, s + 0.004);
      g.gain.linearRampToValueAtTime(0.0001, s + dec);
    }
    return g;
  }
  private ns(t: number, dur: number) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    s.start(t);
    s.stop(t + dur);
    return s;
  }
  private roomy() {
    return this.kit === "room";
  }
  kick(t: number, v: number) {
    const room = this.roomy();
    const o = this.ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(room ? 168 : 140, t);
    o.frequency.exponentialRampToValueAtTime(room ? 36 : 48, t + (room ? 0.12 : 0.07));
    const g = this.env(t, (room ? 1.55 : 1.15) * v, room ? 0.42 : 0.22);
    o.connect(g); g.connect(this.dest);
    o.start(t); o.stop(t + (room ? 0.45 : 0.22));
  }
  snare(t: number, v: number) {
    const room = this.roomy();
    const n = this.ns(t, room ? 0.32 : 0.14);
    const bp = this.ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = room ? 1600 : 2200;
    const g = this.env(t, (room ? 0.95 : 0.7) * v, room ? 0.22 : 0.1);
    n.connect(bp); bp.connect(g); g.connect(this.dest);
    const o = this.ctx.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(room ? 180 : 210, t);
    const tg = this.env(t, (room ? 0.42 : 0.28) * v, room ? 0.14 : 0.07);
    o.connect(tg); tg.connect(this.dest); o.start(t); o.stop(t + 0.18);
  }
  hat(t: number, v: number, dec: number) {
    const room = this.roomy();
    const n = this.ns(t, dec + (room ? 0.06 : 0.02));
    const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = room ? 6200 : 7800;
    const g = this.env(t, (dec > 0.1 ? 0.28 : 0.2) * v * (room ? 1 : 0.85), dec * (room ? 1.15 : 0.75));
    n.connect(hp); hp.connect(g); g.connect(this.dest);
  }
  crash(t: number, v: number) {
    const n = this.ns(t, this.roomy() ? 1.1 : 0.55);
    const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = this.roomy() ? 4800 : 6200;
    const g = this.env(t, 0.45 * v, this.roomy() ? 0.95 : 0.45);
    n.connect(hp); hp.connect(g); g.connect(this.dest);
  }
  tom(t: number, v: number, f: number) {
    const o = this.ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t + (this.roomy() ? 0.2 : 0.12));
    const g = this.env(t, 0.7 * v, this.roomy() ? 0.24 : 0.14);
    o.connect(g); g.connect(this.dest); o.start(t); o.stop(t + 0.25);
  }
  stick(t: number, v: number, downbeat: boolean) {
    const o = this.ctx.createOscillator(); o.type = "square";
    o.frequency.setValueAtTime(downbeat ? 1400 : 1900, t);
    const g = this.env(t, (downbeat ? 0.28 : 0.16) * v, downbeat ? 0.06 : 0.035);
    o.connect(g); g.connect(this.dest);
    o.start(t); o.stop(t + 0.08);
  }
  trig(voice: DrumVoice, t: number, v: number) {
    v = Math.max(0.05, Math.min(1.6, v));
    const sampleVoice =
      voice === "clap" ? "snare" :
      voice === "openHat" || voice === "pedalHat" || voice === "ride" ? "hat" :
      voice === "crash" || voice === "splash" || voice === "china" ? "crash" :
      voice === "rim" ? "snare" :
      voice;
    if (this.samples.play(this.kit, sampleVoice, this.dest, t, v)) return;
    if (voice === "kick") this.kick(t, v);
    else if (voice === "snare" || voice === "clap") this.snare(t, v);
    else if (voice === "rim") this.tom(t, v * 0.8, 420);
    else if (voice === "hat" || voice === "pedalHat") this.hat(t, v, 0.05);
    else if (voice === "openHat") this.hat(t, v, 0.24);
    else if (voice === "ride") this.hat(t, v, 0.4);
    else if (voice === "crash" || voice === "splash" || voice === "china") this.crash(t, v);
    else if (voice === "highTom") this.tom(t, v, 220);
    else if (voice === "tom") this.tom(t, v, 160);
    else if (voice === "floor") this.tom(t, v, 95);
    else if (voice === "cowbell") this.tom(t, v, 680);
  }
}
