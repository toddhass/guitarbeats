import { create } from "zustand";
import { Kit, Synth } from "../audio/synth";
import { Sequencer } from "../audio/sequencer";
import { createAudioContext, unlockAudio } from "../audio/unlock";
import { searchAppleMusic, hitToSeed } from "../api";
import { makeSong, Song, SEEDS } from "../data/songs";
import { Feel, LABELS, STYLES } from "../data/grooves";
import { Tab } from "./tab-patch";

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
  seq.setParts(song.parts, true);
  return seq;
}

type Speed = 0.5 | 0.7 | 1;

export const useApp = create<{
  tab: Tab;
  playing: boolean;
  song: Song;
  bpm: number;
  volume: number;
  step: number;
  partName: string;
  library: Song[];
  query: string;
  searching: boolean;
  loopPart: boolean;
  countIn: boolean;
  speed: Speed;
  kit: Kit;
  clickOn: boolean;
  clickLevel: number;
  setTab: (t: Tab) => void;
  setQuery: (q: string) => void;
  selectSong: (id: string) => void;
  selectFeel: (feel: Feel) => void;
  setBpm: (n: number) => void;
  setVolume: (n: number) => void;
  setLoopPart: (v: boolean) => void;
  setCountIn: (v: boolean) => void;
  setSpeed: (v: Speed) => void;
  setKit: (k: Kit) => void;
  setClickOn: (v: boolean) => void;
  setClickLevel: (n: number) => void;
  toggleStart: () => void;
  fill: () => void;
  nextPart: () => void;
  restart: () => void;
  crash: () => void;
}>((set, get) => {
  function applyKitClick() {
    const { synth, seq } = getEngine();
    synth.kit = get().kit;
    seq.clickOn = get().clickOn;
    seq.clickLevel = Math.max(0, Math.min(1, get().clickLevel / 100));
  }

  function beginPlayback(song: Song) {
    const { ctx, seq, synth } = getEngine();
    unlockAudio(ctx);
    applyKitClick();
    seq.stop();
    seq.setParts(song.parts, true);
    seq.loopPart = get().loopPart;
    seq.countInLeft = get().countIn ? 16 : 0;
    const bpm = Math.max(40, Math.round(song.bpm * get().speed));
    seq.bpm = bpm;
    seq.onNext = (step, part) => set({ step, partName: part.name });
    seq.start();
    if (!get().countIn) {
      try {
        synth.trig("kick", ctx.currentTime + 0.02, 1);
        synth.trig("hat", ctx.currentTime + 0.02, 0.8);
      } catch { /* */ }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    set({
      song,
      bpm,
      playing: true,
      step: 0,
      partName: get().countIn ? "Count-in" : (song.parts[0]?.name ?? "Intro"),
      tab: "play",
    });
  }

  return {
    tab: "play",
    playing: false,
    song: initialSong,
    bpm: initialSong.bpm,
    volume: 100,
    step: 0,
    partName: initialSong.parts[0]?.name ?? "Intro",
    library: seedLibrary,
    query: "",
    searching: false,
    loopPart: false,
    countIn: false,
    speed: 1,
    kit: "room",
    clickOn: false,
    clickLevel: 70,

    setTab: (t) => set({ tab: t }),
    setLoopPart: (v) => {
      getEngine().seq.loopPart = v;
      set({ loopPart: v });
    },
    setCountIn: (v) => set({ countIn: v }),
    setSpeed: (v) => {
      const bpm = Math.max(40, Math.round(get().song.bpm * v));
      getEngine().seq.bpm = bpm;
      set({ speed: v, bpm });
    },
    setKit: (k) => {
      getEngine().synth.kit = k;
      set({ kit: k });
    },
    setClickOn: (v) => {
      getEngine().seq.clickOn = v;
      set({ clickOn: v });
    },
    setClickLevel: (n) => {
      getEngine().seq.clickLevel = Math.max(0, Math.min(1, n / 100));
      set({ clickLevel: n });
    },

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
      beginPlayback(song);
    },

    selectFeel: (feel) => {
      const cur = get().song;
      const song = makeSong({
        id: cur.id.startsWith("it-") ? cur.id : `custom-${feel}`,
        title: cur.id.startsWith("it-") ? cur.title : LABELS[feel],
        artist: cur.id.startsWith("it-") ? cur.artist : (STYLES.find((s) => s.id === feel)?.label ?? feel),
        bpm: get().song.bpm,
        feel,
      });
      const { ctx, seq } = getEngine();
      unlockAudio(ctx);
      seq.setParts(song.parts, true);
      seq.bpm = Math.max(40, Math.round(song.bpm * get().speed));
      set({ song, partName: song.parts[0]?.name ?? "Intro" });
    },

    setBpm: (bpm) => {
      getEngine().seq.bpm = bpm;
      set({ bpm, speed: 1 });
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
      const { ctx, seq } = getEngine();
      unlockAudio(ctx);
      if (get().playing) {
        seq.stop();
        set({ playing: false });
        return;
      }
      beginPlayback(get().song);
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
      try { synth.trig("crash", ctx.currentTime, 1); } catch { /* */ }
      seq.queueCrash();
    },
  };
});
