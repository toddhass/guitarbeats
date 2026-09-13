import { Kit, KIT_URLS, GATE_VOICES } from "./kits";

export class SampleBank {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();
  private dry: GainNode | null = null;
  private snareSend: GainNode | null = null;
  private bus: DynamicsCompressorNode | null = null;
  ready = false;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  attach(dest: AudioNode) {
    if (this.bus) return;
    const ctx = this.ctx;
    const bus = ctx.createDynamicsCompressor();
    bus.threshold.value = -16;
    bus.knee.value = 8;
    bus.ratio.value = 4.5;
    bus.attack.value = 0.004;
    bus.release.value = 0.12;
    const out = ctx.createGain();
    out.gain.value = 1.15;
    bus.connect(out);
    out.connect(dest);

    const dry = ctx.createGain();
    dry.gain.value = 1;
    dry.connect(bus);

    const send = ctx.createGain();
    send.gain.value = 0.55;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 280;
    const delay = ctx.createDelay(0.4);
    delay.delayTime.value = 0.028;
    const verb = ctx.createConvolver();
    verb.buffer = this.plate(0.22);
    const gate = ctx.createGain();
    gate.gain.value = 0.7;
    send.connect(hp);
    hp.connect(delay);
    delay.connect(verb);
    verb.connect(gate);
    gate.connect(bus);

    this.bus = bus;
    this.dry = dry;
    this.snareSend = send;
  }

  private plate(seconds: number) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const env = Math.pow(1 - i / len, 1.6);
        d[i] = (Math.random() * 2 - 1) * env;
      }
    }
    return buf;
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
    this.ready = true;
  }

  loadAll() {
    return Promise.all((Object.keys(KIT_URLS) as Kit[]).map((k) => this.load(k)));
  }

  play(kit: Kit, voice: string, dest: AudioNode, time: number, vel: number) {
    this.attach(dest);
    const buf = this.cache.get(kit + ":" + voice) || this.cache.get("eighty:" + voice);
    if (!buf || !this.dry) return false;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    const peak = Math.max(0.08, Math.min(1.35, vel));
    g.gain.setValueAtTime(peak, time);
    src.connect(g);
    g.connect(this.dry);
    if (this.snareSend && GATE_VOICES.has(voice) && kit !== "dry") {
      const wet = this.ctx.createGain();
      wet.gain.setValueAtTime(0.85 * peak, time);
      wet.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
      g.connect(wet);
      wet.connect(this.snareSend);
    }
    src.start(time);
    return true;
  }
}
