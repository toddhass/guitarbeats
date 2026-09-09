import { Synth, DrumVoice } from "./synth";
import { hit, Pattern, SongPart } from "../data/grooves";

export class Sequencer {
  private synth: Synth;
  private ctx: AudioContext;
  private timer: number | null = null;
  private nextStepTime = 0;
  step = 0;
  private barsPlayed = 0;
  bpm = 120;
  playing = false;
  parts: SongPart[] = [];
  partIndex = 0;
  filling = false;
  private fillLeft = 0;
  crashQueued = false;
  onNext?: (step: number, part: SongPart) => void;

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
  }

  get currentPart() {
    return this.parts[this.partIndex];
  }

  private stepDuration() {
    return 60 / Math.max(40, this.bpm) / 4;
  }

  private scheduleStep(i: number, time: number, part: SongPart, useFill: boolean) {
    const pattern: Partial<Pattern> = useFill && part.fill ? part.fill : part.groove;
    for (const voice of Object.keys(pattern)) {
      const v = hit(pattern[voice], i);
      if (v > 0) this.synth.trig(voice as DrumVoice, time, v);
    }
    if (this.crashQueued) {
      this.synth.trig("crash", time, 1);
      this.crashQueued = false;
    }
  }

  private advance() {
    const part = this.currentPart;
    if (!part) {
      this.nextStepTime += this.stepDuration();
      return;
    }
    const swing = this.step % 2 === 1 ? part.swing * this.stepDuration() : 0;
    const time = this.nextStepTime + swing;
    const useFill = this.filling;
    this.scheduleStep(this.step, time, part, useFill);
    this.onNext?.(this.step, part);

    if (this.filling) {
      this.fillLeft--;
      if (this.fillLeft <= 0) this.filling = false;
    }

    this.nextStepTime += this.stepDuration();
    this.step++;
    if (this.step >= 16) {
      this.step = 0;
      this.barsPlayed++;
      if (this.barsPlayed >= Math.max(1, part.bars)) {
        this.barsPlayed = 0;
        if (this.parts.length) this.partIndex = (this.partIndex + 1) % this.parts.length;
      }
    }
  }

  private tick = () => {
    while (this.playing && this.nextStepTime < this.ctx.currentTime + 0.12) this.advance();
    if (this.playing) this.timer = window.setTimeout(this.tick, 25);
  };

  start() {
    if (this.playing) return;
    this.playing = true;
    this.nextStepTime = this.ctx.currentTime + 0.04;
    this.tick();
  }

  stop() {
    this.playing = false;
    this.filling = false;
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  restart() {
    this.step = 0;
    this.barsPlayed = 0;
    this.partIndex = 0;
    this.filling = false;
  }

  nextPart() {
    if (!this.parts.length) return;
    this.partIndex = (this.partIndex + 1) % this.parts.length;
    this.step = 0;
    this.barsPlayed = 0;
    this.filling = false;
  }

  queueFill() {
    this.filling = true;
    this.fillLeft = 8;
  }

  queueCrash() {
    this.crashQueued = true;
  }
}
