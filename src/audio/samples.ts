import { Kit, KIT_URLS } from "./kits";

export class SampleBank {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();
  ready = false;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  async load(kit: Kit) {
    const files = KIT_URLS[kit];
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
    this.ready = true;
  }

  loadAll() {
    return Promise.all((Object.keys(KIT_URLS) as Kit[]).map((k) => this.load(k)));
  }

  play(kit: Kit, voice: string, dest: AudioNode, time: number, vel: number) {
    const buf = this.cache.get(kit + ":" + voice);
    if (!buf) return false;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(Math.max(0.05, Math.min(1.2, vel)), time);
    src.connect(g);
    g.connect(dest);
    src.start(time);
    return true;
  }
}
