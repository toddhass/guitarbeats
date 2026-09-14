import { Kit, KIT_URLS } from "./kits";

const LEVEL: Record<string, number> = {
  kick: 0.72, snare: 0.62, clap: 0.55, rim: 0.5, hat: 0.38,
  openHat: 0.34, pedalHat: 0.32, ride: 0.3, crash: 0.28,
  tom: 0.55, highTom: 0.52, floor: 0.58, cowbell: 0.4,
};

const TAIL: Record<string, number> = {
  kick: 0.38, snare: 0.22, clap: 0.18, rim: 0.12, hat: 0.08,
  pedalHat: 0.07, openHat: 0.22, ride: 0.45, crash: 0.9,
  tom: 0.32, highTom: 0.28, floor: 0.4, cowbell: 0.2,
};

const CORE = ["kick", "snare", "hat"];

export class SampleBank {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();
  private loading = new Set<string>();
  private dry: GainNode | null = null;
  ready = false;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  attach(dest: AudioNode) {
    if (this.dry) return;
    const out = this.ctx.createGain();
    out.gain.value = 0.9;
    out.connect(dest);
    this.dry = out;
  }

  private async fetchVoice(kit: Kit, voice: string, url: string) {
    const key = kit + ":" + voice;
    if (this.cache.has(key) || this.loading.has(key)) return;
    this.loading.add(key);
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const raw = await res.arrayBuffer();
      if (raw.byteLength > 400000 && (voice === "crash" || voice === "ride")) return;
      const buf = await this.ctx.decodeAudioData(raw.slice(0));
      this.cache.set(key, buf);
    } catch {
      /* synth fallback */
    } finally {
      this.loading.delete(key);
    }
  }

  async load(kit: Kit) {
    const files = KIT_URLS[kit];
    if (!files) return;
    const core = CORE.filter((v) => files[v]);
    await Promise.all(core.map((v) => this.fetchVoice(kit, v, files[v])));
    this.ready = core.some((v) => this.cache.has(kit + ":" + v));
    const rest = Object.keys(files).filter((v) => !CORE.includes(v) && v !== "crash" && v !== "ride");
    void Promise.all(rest.map((v) => this.fetchVoice(kit, v, files[v])));
  }

  play(kit: Kit, voice: string, dest: AudioNode, time: number, vel: number) {
    this.attach(dest);
    const buf = this.cache.get(kit + ":" + voice) || this.cache.get("eighty:" + voice);
    if (!buf || !this.dry) return false;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    const peak = (LEVEL[voice] ?? 0.5) * Math.max(0.15, Math.min(1.1, vel));
    const tail = TAIL[voice] ?? 0.25;
    const t = Math.max(time, this.ctx.currentTime);
    g.gain.setValueAtTime(peak, t);
    try {
      g.gain.exponentialRampToValueAtTime(0.0001, t + tail);
    } catch {
      g.gain.linearRampToValueAtTime(0.0001, t + tail);
    }
    src.connect(g);
    g.connect(this.dry);
    src.onended = () => {
      try { src.disconnect(); g.disconnect(); } catch { /* */ }
    };
    src.start(t);
    src.stop(t + tail + 0.04);
    return true;
  }
}
