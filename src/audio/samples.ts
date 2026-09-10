import { Kit } from "./synth";

const TONE = "https://tonejs.github.io/audio/drum-samples";

const MAP: Record<Kit, Record<string, string>> = {
  room: {
    kick: `${TONE}/acoustic-kit/kick.mp3`,
    snare: `${TONE}/acoustic-kit/snare.mp3`,
    hat: `${TONE}/acoustic-kit/hihat.mp3`,
    tom: `${TONE}/acoustic-kit/tom1.mp3`,
    highTom: `${TONE}/acoustic-kit/tom2.mp3`,
    floor: `${TONE}/acoustic-kit/tom3.mp3`,
  },
  dry: {
    kick: `${TONE}/electro/kick.mp3`,
    snare: `${TONE}/electro/snare.mp3`,
    hat: `${TONE}/electro/hihat.mp3`,
  },
};

export class SampleBank {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();
  ready = false;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  async load(kit: Kit) {
    const files = MAP[kit];
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
          /* stay on synth */
        }
      })
    );
    this.ready = true;
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
