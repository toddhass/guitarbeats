export type DrumVoice = "kick" | "snare" | "clap" | "rim" | "hat" | "openHat" | "pedalHat" | "ride" | "crash" | "splash" | "china" | "highTom" | "tom" | "floor" | "cowbell";

export class Synth {
  ctx: AudioContext;
  dest: AudioNode;
  noise: AudioBuffer;
  constructor(ctx: AudioContext, dest: AudioNode) {
    this.ctx = ctx;
    this.dest = dest;
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
  kick(t: number, v: number) {
    const o = this.ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.1);
    const g = this.env(t, 1.4 * v, 0.36);
    o.connect(g); g.connect(this.dest);
    o.start(t); o.stop(t + 0.4);
  }
  snare(t: number, v: number) {
    const n = this.ns(t, 0.22);
    const bp = this.ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800;
    const g = this.env(t, 0.85 * v, 0.16);
    n.connect(bp); bp.connect(g); g.connect(this.dest);
    const o = this.ctx.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(196, t);
    const tg = this.env(t, 0.38 * v, 0.1);
    o.connect(tg); tg.connect(this.dest); o.start(t); o.stop(t + 0.18);
  }
  hat(t: number, v: number, dec: number) {
    const n = this.ns(t, dec + 0.04);
    const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6800;
    const g = this.env(t, (dec > 0.1 ? 0.26 : 0.22) * v, dec);
    n.connect(hp); hp.connect(g); g.connect(this.dest);
  }
  crash(t: number, v: number) {
    const n = this.ns(t, 0.9);
    const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 5000;
    const g = this.env(t, 0.45 * v, 0.8);
    n.connect(hp); hp.connect(g); g.connect(this.dest);
  }
  tom(t: number, v: number, f: number) {
    const o = this.ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.18);
    const g = this.env(t, 0.7 * v, 0.2);
    o.connect(g); g.connect(this.dest); o.start(t); o.stop(t + 0.25);
  }
  trig(voice: DrumVoice, t: number, v: number) {
    v = Math.max(0.05, Math.min(1.4, v));
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
