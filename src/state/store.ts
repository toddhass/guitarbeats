import { create } from "zustand";
import { Synth } from "../audio/synth";
import { Sequencer } from "../audio/sequencer";
import { createAudioContext, unlockAudio } from "../audio/unlock";
import { searchAppleMusic, hitToSeed } from "../api";
import { makeSong, Song, SEEDS } from "../data/songs";
import { Feel, LABELS, STYLES } from "../data/grooves";

interface Engine {
  ctx: AudioContext;
  synth: Synth;
  seq: Sequencer;
  masterGain: GainNode;
}

let engine: Engine | null = null;
let searchTimer = 0;
let lastToggle = 0;

const seedLibrary = SEEDS.map(makeSong);
const initialSong = seedLibrary[0];

function getEngine(): Engine {
  if (engine) return engine;
  const ctx = createAudioContext();
  unlockAudio(ctx);
  const masterGain = ctx.createGain();
  masterGain.gain.value = 1;
  masterGain.connect(ctx.destination);
  const synth = new Synth(ctx, masterGain);
  const seq = new Sequencer(synth, ctx);
  seq.setParts(initialSong.parts);
  seq.bpm = initialSong.bpm;
  engine = { ctx, synth, seq, masterGain };
  return engine;
}

function ensureParts(song: Song) {
  const { seq } = getEngine();
  if (seq.parts !== song.parts) seq.setParts(song.parts);
  return seq;
}

export const useApp = create<{
  tab: "songs" | "track";
  playing: boolean;
  song: Song;
  bpm: number;
  volume: number;
  step: number;
  partName: string;
  library: Song[];
  query: string;
  searching: boolean;
  setTab: (t: "songs" | "track") => void;
  setQuery: (q: string) => void;
  selectSong: (id: string) => void;
  selectFeel: (feel: Feel) => void;
  setBpm: (n: number) => void;
  setVolume: (n: number) => void;
  toggleStart: () => void;
  fill: () => void;
  nextPart: () => void;
  restart: () => void;
  crash: () => void;
}>((set, get) => ({
  tab: "songs",
  playing: false,
  song: initialSong,
  bpm: initialSong.bpm,
  volume: 100,
  step: 0,
  partName: initialSong.parts[0]?.name ?? "Intro",
  library: seedLibrary,
  query: "",
  searching: false,

  setTab: (t) => set({ tab: t }),

  setQuery: (q) => {
    set({ query: q });
    const t = q.trim();
    window.clearTimeout(searchTimer);
    if (t.length < 2) {
      set({ library: seedLibrary, searching: false });
      return;
    }
    const local = SEEDS.filter((s) =>
      (s.title + " " + s.artist).toLowerCase().includes(t.toLowerCase())
    ).map(makeSong);
    set({ library: local.length ? local : seedLibrary, searching: true });
    searchTimer = window.setTimeout(() => {
      void searchAppleMusic(t)
        .then((hits) => {
          if (get().query.trim() !== t) return;
          const base = local.length ? local : [];
          const seen = new Set(base.map((s) => (s.title + "|" + s.artist).toLowerCase()));
          const extra = hits
            .map(hitToSeed)
            .filter((s) => s.title && !seen.has((s.title + "|" + s.artist).toLowerCase()))
            .slice(0, 16)
            .map(makeSong);
          set({ library: extra.length || base.length ? [...base, ...extra] : seedLibrary, searching: false });
        })
        .catch((err) => {
          console.warn("search failed", err);
          set({ searching: false });
        });
    }, 280);
  },

  selectSong: (id) => {
    const song =
      get().library.find((s) => s.id === id) ||
      (SEEDS.find((s) => s.id === id) ? makeSong(SEEDS.find((s) => s.id === id)!) : null);
    if (!song) return;
    const { ctx } = getEngine();
    unlockAudio(ctx);
    const seq = ensureParts(song);
    seq.setParts(song.parts, true);
    seq.bpm = song.bpm;
    set({ song, bpm: song.bpm, partName: song.parts[0]?.name ?? "Intro" });
  },

  selectFeel: (feel) => {
    const cur = get().song;
    const song = makeSong({
      id: cur.id.startsWith("it-") ? cur.id : `custom-${feel}`,
      title: cur.id.startsWith("it-") ? cur.title : LABELS[feel],
      artist: cur.id.startsWith("it-") ? cur.artist : (STYLES.find((s) => s.id === feel)?.label ?? feel),
      bpm: get().bpm,
      feel,
    });
    const { ctx } = getEngine();
    unlockAudio(ctx);
    const seq = getEngine().seq;
    seq.setParts(song.parts, true);
    seq.bpm = get().bpm;
    set({ song, partName: song.parts[0]?.name ?? "Intro" });
  },

  setBpm: (bpm) => {
    getEngine().seq.bpm = bpm;
    set({ bpm });
  },

  setVolume: (v) => {
    const { masterGain, ctx } = getEngine();
    unlockAudio(ctx);
    masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v / 100)), ctx.currentTime, 0.02);
    set({ volume: v });
  },

  toggleStart: () => {
    const now = Date.now();
    if (now - lastToggle < 280) return;
    lastToggle = now;
    const { ctx, seq, synth } = getEngine();
    unlockAudio(ctx);
    if (get().playing) {
      seq.stop();
      set({ playing: false });
      return;
    }
    seq.bpm = get().bpm;
    if (seq.parts !== get().song.parts) seq.setParts(get().song.parts, false);
    if (!seq.parts.length) seq.setParts(get().song.parts, true);
    seq.onNext = (step, part) => set({ step, partName: part.name });
    seq.start();
    try {
      synth.trig("kick", ctx.currentTime + 0.02, 1);
      synth.trig("hat", ctx.currentTime + 0.02, 0.8);
    } catch { /* */ }
    set({ playing: true, partName: seq.currentPart?.name ?? get().song.parts[0]?.name ?? "Intro" });
  },

  fill: () => {
    const { seq, synth, ctx } = getEngine();
    unlockAudio(ctx);
    ensureParts(get().song);
    seq.queueFill();
    try {
      synth.trig("snare", ctx.currentTime, 0.9);
      synth.trig("highTom", ctx.currentTime, 0.7);
    } catch { /* */ }
  },

  nextPart: () => {
    const { seq, ctx } = getEngine();
    unlockAudio(ctx);
    ensureParts(get().song);
    seq.nextPart();
    set({ partName: seq.currentPart?.name ?? "Intro", step: 0 });
  },

  restart: () => {
    const { seq, ctx } = getEngine();
    unlockAudio(ctx);
    ensureParts(get().song);
    seq.restart();
    set({ partName: seq.currentPart?.name ?? "Intro", step: 0 });
  },

  crash: () => {
    const { seq, synth, ctx } = getEngine();
    unlockAudio(ctx);
    try {
      synth.trig("crash", ctx.currentTime, 1);
    } catch { /* */ }
    seq.queueCrash();
  },
}));
