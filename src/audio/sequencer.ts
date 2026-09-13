import { Synth, DrumVoice } from "./synth";
import { hit, Pattern, SongPart } from "../data/grooves";
import { intensityForPart } from "../data/brain";
import { hushCount, speakCount, warmCountVoice } from "./countVoice";

const COUNT_WORDS = ["one", "two", "three", "four"] as const;

export class Sequencer {
  private synth: Synth;
  private ctx: AudioContext;
  private timer: number | null = null;
  private nextStepTime = 0;
  step = 0;
  barsPlayed = 0;
  bpm = 120;
  playing = false;
  parts: SongPart[] = [];
  partIndex = 0;
  filling = false;
  private fillLeft = 0;
  crashQueued = false;
  loopPart = false;
  countInLeft = 0;
  clickOn = false;
  clickLevel = 0.7;
  conductor = true;
  intensity = 1;
  onNext?: (step: number, part: SongPart, meta: { bar: number; bars: number; nextName: string }) => void;

  constructor(synth: Synth, ctx: AudioContext) {
    this.synth = synth;
    this.ctx = ctx;
  }

  setParts(parts: SongPart[], reset = true) {
    this.parts = parts ?? [];
    if (reset) {
      this.partIndex = 0;
      this.barsPlayed = 0;
      this.step = 0;
    }
    if (this.partIndex >= this.parts.length) this.partIndex = 0;
    this.intensity = intensityForPart(this.currentPart?.name ?? "");
  }

  get currentPart() {
    return this.parts[this.partIndex];
  }

  private stepDuration() {
    return 60 / Math.max(40, this.bpm) / 4;
  }

  private click(time: number, downbeat: boolean) {
    this.synth.stick(time, this.clickLevel, downbeat);
  }

  private speakCountStep(step: number) {
    if (step === 0) speakCount("a", this.bpm);
    if (step % 4 === 0) speakCount(COUNT_WORDS[Math.floor(step / 4)] || "one", this.bpm);
    else if (step % 4 === 2) speakCount("and", this.bpm);
    else if (step % 4 === 3 && step < 12) speakCount("a", this.bpm);
  }

  private scheduleStep(i: number, time: number, part: SongPart, useFill: boolean) {
    const pattern: Partial<Pattern> = useFill && part.fill ? part.fill : part.groove;
    const accent = (i === 0 ? 1.28 : i % 4 === 0 ? 1.08 : 1) * this.intensity;
    for (const voice of Object.keys(pattern)) {
      const v = hit(pattern[voice], i);
      if (v > 0) this.synth.trig(voice as DrumVoice, time, v * accent);
    }
    if (this.clickOn && i % 4 === 0) this.click(time, i === 0);
    if (this.crashQueued) {
      this.synth.trig("crash", time, 1);
      this.crashQueued = false;
    }
  }

  private emit(part: SongPart) {
    const bars = Math.max(1, part.bars || 1);
    const next = this.parts[(this.partIndex + 1) % Math.max(1, this.parts.length)];
    this.onNext?.(this.step, part, {
      bar: this.barsPlayed + 1,
      bars,
      nextName: next?.name ?? "",
    });
  }

  private advance() {
    const time = this.nextStepTime + (this.step % 2 === 1 && this.currentPart ? this.currentPart.swing * this.stepDuration() : 0);

    if (this.countInLeft > 0) {
      const beat = Math.floor(this.step / 4) + 1;
      if (this.step % 4 === 0) this.synth.stick(time, 1, this.step === 0);
      this.speakCountStep(this.step);
      this.emit({ id: "count", name: String(beat), bars: 1, swing: 0, groove: {}, fill: {} });
      this.countInLeft--;
      this.nextStepTime += this.stepDuration();
      this.step++;
      if (this.step >= 16) this.step = 0;
      return;
    }

    const part = this.currentPart;
    if (!part) {
      this.nextStepTime += this.stepDuration();
      return;
    }

    this.intensity = intensityForPart(part.name);
    const bars = Math.max(1, part.bars || 1);
    const lastBar = this.barsPlayed >= bars - 1;
    if (this.conductor && lastBar && this.step === 8 && !this.loopPart) {
      this.filling = true;
      this.fillLeft = 8;
    }

    this.scheduleStep(this.step, time, part, this.filling);
    this.emit(part);
    if (this.filling) {
      this.fillLeft--;
      if (this.fillLeft <= 0) this.filling = false;
    }
    this.nextStepTime += this.stepDuration();
    this.step++;
    if (this.step >= 16) {
      this.step = 0;
      this.barsPlayed++;
      if (this.barsPlayed >= bars) {
        this.barsPlayed = 0;
        if (!this.loopPart && this.parts.length) {
          const prev = this.partIndex;
          this.partIndex = (this.partIndex + 1) % this.parts.length;
          const nxt = this.currentPart;
          if (this.conductor && nxt && /chorus|hook/i.test(nxt.name) && prev !== this.partIndex) {
            this.crashQueued = true;
          }
        }
      }
    }
  }

  private tick = () => {
    while (this.playing && this.nextStepTime < this.ctx.currentTime + 0.12) this.advance();
    if (this.playing) this.timer = window.setTimeout(this.tick, 25);
  };

  armCountIn() {
    warmCountVoice();
    hushCount();
    this.countInLeft = 16;
    this.step = 0;
    this.barsPlayed = 0;
    this.filling = false;
  }

  start() {
    if (this.playing) return;
    warmCountVoice();
    this.playing = true;
    this.nextStepTime = this.ctx.currentTime + 0.04;
    this.tick();
  }

  stop() {
    this.playing = false;
    this.filling = false;
    hushCount();
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  restart() {
    this.partIndex = 0;
    this.filling = false;
    this.intensity = intensityForPart(this.currentPart?.name ?? "");
    this.armCountIn();
  }

  nextPart() {
    if (!this.parts.length) return;
    this.partIndex = (this.partIndex + 1) % this.parts.length;
    this.filling = false;
    this.intensity = intensityForPart(this.currentPart?.name ?? "");
    this.armCountIn();
  }

  queueFill() {
    this.filling = true;
    this.fillLeft = 8;
  }

  queueCrash() {
    this.crashQueued = true;
  }
}
