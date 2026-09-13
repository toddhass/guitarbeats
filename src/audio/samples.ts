import { Kit, KIT_URLS } from "./kits";

const LEVEL: Record<string, number> = {
  kick: 0.72,
  snare: 0.62,
  clap: 0.55,
  rim: 0.5,
  hat: 0.38,
  openHat: 0.34,
  pedalHat: 0.32,
  ride: 0.3,
  crash: 0.28,
  tom: 0.55,
  highTom: 0.52,
  floor: 0.58,
  cowbell: 0.4,
};

const TAIL: Record<string, number> = {
  kick: 0.38,
  snare: 0.22,
  clap: 0.18,
  rim: 0.12,
  hat: 0.08,
  pedalHat: 0.07,
  openHat: 0.22,
  ride: 0.45,
  crash: 1.1,
  tom: 0.32,
  highTom: 0.28,
  floor: 0.4,
  cowbell: 0.2,
};

export class SampleBank {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();
  private dry: GainNode | null = null;
  ready = false;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  attach(dest: AudioNode) {
    if (this.dry) return;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -22;
    comp.knee.value = 12;
    comp.ratio.value = 2.4;
    comp.attack.value = 0.008;
    comp.release.value = 0.18;
    const out = this.ctx.createGain();
    out.gain.value = 0.9;
    const dry = this.ctx.createGain();
    dry.gain.value = 1;
    dry.connect(comp);
    comp.connect(out);
    out.connect(dest);
    this.dry = dry;
  }

  async load(kit: Kit) {
    const files = KIT_URLS[kit];
    if (!files) return;
    await Promise.all(
      Object.entries(files).map(async ([voice, url]) => {
        const key = kit + ":" + voice;
        if (this.cache.has(key)) return;
        try {
          const res = await fetch(url);
          if (!res.ok) return;
          const raw = await res.arrayBuffer();
          const buf = await this.ctx.decodeAudioData(raw.slice(0));
          this.cache.set(key, buf);
        } catch {
          /* synth fallback */
        }
      })
    );
    this.ready = [...this.cache.keys()].some((k) => k.startsWith(kit + ":"));
  }

  loadAll() {
    const order = Object.keys(KIT_URLS) as Kit[];
    const first = order.includes("eighty") ? (["eighty", ...order.filter((k) => k !== "eighty")] as Kit[]) : order;
    return first.reduce<Promise<void>>(async (prev, kit) => {
      await prev;
      await this.load(kit);
    }, Promise.resolve());
  }

  play(kit: Kit, voice: string, dest: AudioNode, time: number, vel: number) {
    this.attach(dest);
    const buf =
      this.cache.get(kit + ":" + voice) ||
      this.cache.get("eighty:" + voice) ||
      this.cache.get("room:" + voice);
    if (!buf || !this.dry) return false;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    const peak = (LEVEL[voice] ?? 0.5) * Math.max(0.15, Math.min(1.1, vel));
    const tail = TAIL[voice] ?? 0.25;
    const t = Math.max(time, this.ctx.currentTime);
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + tail);
    src.connect(g);
    g.connect(this.dry);
    src.start(t);
    src.stop(t + tail + 0.05);
    return true;
  }
}
