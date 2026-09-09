import { Synth, DrumVoice } from "./synth";
import { hit, Pattern, SongPart } from "../data/grooves";

export class Sequencer {
  private synth: Synth;
  private ctx: AudioContext;
  private timer: number | null = null;
  private nextStepTime = 0;
  private step = 0;
  private barsPlayed = 0;
  bpm = 120;
  playing = false;
  parts: SongPart[] = [];
  partIndex = 0;
  fillQueued = false;
  crashQueued = false;
  onNext?: (step: number, part: SongPart) => void;
  constructor(synth: Synth, ctx: AudioContext) { this.synth = synth; this.ctx = ctx; }
  setParts(parts: SongPart[]) { this.parts = parts; this.partIndex = 0; this.barsPlayed = 0; }
  get currentPart() { return this.parts[this.partIndex]; }
  private stepDuration() { return 60 / this.bpm / 4; }
  private scheduleStep(i: number, time: number, part: SongPart, useFill: boolean) {
    const pattern: Partial<Pattern> = useFill ? part.fill : part.groove;
    for (const voice of Object.keys(pattern)) {
      const v = hit(pattern[voice], i);
      if (v > 0) this.synth.trig(voice as DrumVoice, time, v);
    }
    if (this.crashQueued && i === 0) { this.synth.trig("crash", time, 1); this.crashQueued = false; }
  }
  private advance() {
    const part = this.currentPart; if (!part) return;
    const swing = this.step % 2 === 1 ? part.swing * this.stepDuration() : 0;
    const time = this.nextStepTime + swing;
    const useFill = this.fillQueued && this.step >= 12 && this.barsPlayed >= part.bars - 1;
    this.scheduleStep(this.step, time, part, useFill);
    this.onNext?.(this.step, part);
    this.nextStepTime += this.stepDuration();
    this.step++;
    if (this.step >= 16) {
      this.step = 0; this.barsPlayed++;
      if (this.barsPlayed >= part.bars) { this.barsPlayed = 0; this.fillQueued = false; this.partIndex = (this.partIndex + 1) % this.parts.length; }
    }
  }
  private tick = () => {
    while (this.nextStepTime < this.ctx.currentTime + 0.12) this.advance();
    this.timer = window.setTimeout(this.tick, 25);
  };
  start() { if (this.playing) return; this.playing = true; this.step = 0; this.barsPlayed = 0; this.nextStepTime = this.ctx.currentTime + 0.05; this.tick(); }
  stop() { this.playing = false; if (this.timer != null) { clearTimeout(this.timer); this.timer = null; } }
  restart() { this.step = 0; this.barsPlayed = 0; this.partIndex = 0; }
  nextPart() { this.partIndex = (this.partIndex + 1) % Math.max(1, this.parts.length); this.step = 0; this.barsPlayed = 0; }
  queueFill() { this.fillQueued = true; }
  queueCrash() { this.crashQueued = true; }
}
