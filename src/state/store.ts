import { create } from "zustand";
import { Kit, Synth } from "../audio/synth";
import { Sequencer } from "../audio/sequencer";
import { createAudioContext, unlockAudio } from "../audio/unlock";
import { searchAppleMusic, hitToSeed, lookupTempo } from "../api";
import { makeSong, Song, SEEDS, matchSeed, loadUserSeeds, rememberUserSeed } from "../data/songs";
import { Feel, LABELS, STYLES, feelFromGenre } from "../data/grooves";
import { Tab } from "./tab-patch";
import { brainFor } from "../data/brain";

interface Engine {
  ctx: AudioContext;
  synth: Synth;
  seq: Sequencer;
  masterGain: GainNode;
}

let engine: Engine | null = null;
let searchTimer = 0;
let lastToggle = 0;
let lookupGen = 0;

function libraryBase() {
  const extra = loadUserSeeds().filter((u) =>
    !SEEDS.some((s) => s.id === u.id || (s.title.toLowerCase() === u.title.toLowerCase() && s.artist.toLowerCase() === u.artist.toLowerCase()))
  );
  return [...SEEDS, ...extra].map(makeSong);
}
const seedLibrary = libraryBase();
const initialSong = seedLibrary[0];

function bindCtx(ctx: AudioContext) {
  (window as unknown as { __gbCtx?: AudioContext }).__gbCtx = ctx;
}

function getEngine(): Engine {
  if (engine) {
    bindCtx(engine.ctx);
    return engine;
  }
  const ctx = createAudioContext();
  unlockAudio(ctx);
  bindCtx(ctx);
  const masterGain = ctx.createGain();
  masterGain.gain.value = 1;
  masterGain.connect(ctx.destination);
  const synth = new Synth(ctx, masterGain);
  const seq = new Sequencer(synth, ctx);
  seq.setParts(initialSong.parts);
  seq.bpm = initialSong.bpm;
  seq.conductor = true;
  engine = { ctx, synth, seq, masterGain };
  return engine;
}

export function ensureEngine(): Engine {
  return getEngine();
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
  conductorOn: boolean;
  barInPart: number;
  barsInPart: number;
  nextName: string;
  setTab: (t: Tab) => void;
  setQuery: (q: string) => void;
  selectSong: (id: string) => void;
  selectFeel: (feel: Feel) => void;
  selectPart: (id: string) => void;
  setBpm: (n: number) => void;
  setVolume: (n: number) => void;
  setLoopPart: (v: boolean) => void;
  setCountIn: (v: boolean) => void;
  setSpeed: (v: Speed) => void;
  setKit: (k: Kit) => void;
  setClickOn: (v: boolean) => void;
  setClickLevel: (n: number) => void;
  setConductorOn: (v: boolean) => void;
  toggleStart: () => void;
  fill: () => void;
  nextPart: () => void;
  restart: () => void;
  crash: () => void;
  holdPause: () => void;
  holdResume: () => void;
}>((set, get) => {
  function applyKitClick() {
    const { synth, seq } = getEngine();
    synth.kit = get().kit;
    seq.clickOn = get().clickOn;
    seq.clickLevel = Math.max(0, Math.min(1, get().clickLevel / 100));
    seq.conductor = get().conductorOn;
    seq.wantCount = get().countIn;
  }

  function bindClock() {
    const { seq } = getEngine();
    seq.onNext = (step, part, meta) =>
      set({
        step,
        partName: part.name,
        barInPart: meta.bar,
        barsInPart: meta.bars,
        nextName: meta.nextName,
      });
  }

  function beginPlayback(song: Song) {
    const { ctx, seq, synth } = getEngine();
    unlockAudio(ctx);
    applyKitClick();
    seq.stop();
    seq.setParts(song.parts, true);
    seq.loopPart = get().loopPart;
    const count = get().conductorOn && get().countIn;
    if (count) seq.armCountIn();
    else seq.countInLeft = 0;
    const sourceBpm = get().conductorOn ? song.songBpm || song.bpm : song.bpm;
    const bpm = Math.max(40, Math.round(sourceBpm * get().speed));
    seq.bpm = bpm;
    bindClock();
    seq.start();
    if (!(get().conductorOn && get().countIn)) {
      try {
        synth.trig("kick", ctx.currentTime + 0.02, 1);
        synth.trig("hat", ctx.currentTime + 0.02, 0.8);
      } catch { /* */ }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    const tab = get().tab;
    set({
      song,
      bpm,
      playing: true,
      step: 0,
      partName: (get().conductorOn && get().countIn) ? "1" : (song.parts[0]?.name ?? "Intro"),
      barInPart: 1,
      barsInPart: song.parts[0]?.bars ?? 1,
      nextName: song.parts[1]?.name ?? "",
      tab: tab === "songs" ? "play" : tab,
    });
  }

  async function resolveSong(song: Song): Promise<Song> {
    const seeded = matchSeed(song.title, song.artist, song.id);
    if (seeded) return makeSong({ ...seeded, genre: song.genre });
    const gen = ++lookupGen;
    const bpm = await lookupTempo(song.title, song.artist);
    if (gen !== lookupGen) return song;
    if (!bpm) return song;
    const feel = feelFromGenre(song.genre, bpm);
    return makeSong({ id: song.id, title: song.title, artist: song.artist, bpm, feel, genre: song.genre });
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
    countIn: true,
    speed: 1,
    kit: "room",
    clickOn: false,
    clickLevel: 70,
    conductorOn: true,
    barInPart: 1,
    barsInPart: initialSong.parts[0]?.bars ?? 8,
    nextName: initialSong.parts[1]?.name ?? "",

    setTab: (t) => set({ tab: t }),
    setLoopPart: (v) => {
      getEngine().seq.loopPart = v;
      set({ loopPart: v });
    },
    setCountIn: (v) => {
      getEngine().seq.wantCount = v;
      set({ countIn: v });
    },
    setSpeed: (v) => {
      const base = get().conductorOn ? (get().song.songBpm || get().song.bpm) : get().song.bpm;
      const bpm = Math.max(40, Math.round(base * v));
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
    setConductorOn: (v) => {
      getEngine().seq.conductor = v;
      const song = get().song;
      if (v) {
        const bpm = Math.max(40, Math.round((song.songBpm || song.bpm) * get().speed));
        getEngine().seq.bpm = bpm;
        set({ conductorOn: true, bpm });
      } else {
        set({ conductorOn: false });
      }
    },

    setQuery: (q) => {
      set({ query: q });
      const t = q.trim();
      window.clearTimeout(searchTimer);
      if (t.length < 2) {
        set({ library: libraryBase(), searching: false });
        return;
      }
      const needle = t.toLowerCase();
      const local = libraryBase().filter((s) =>
        (s.title + " " + s.artist).toLowerCase().includes(needle)
      );
      set({ library: local, searching: true });
      searchTimer = window.setTimeout(() => {
        void searchAppleMusic(t)
          .then(async (hits) => {
            if (get().query.trim() !== t) return;
            const seen = new Set(local.map((s) => (s.title + "|" + s.artist).toLowerCase()));
            const extra = hits
              .map(hitToSeed)
              .filter((s) => s.title && !seen.has((s.title + "|" + s.artist).toLowerCase()))
              .slice(0, 16)
              .map(makeSong);
            const merged = [...local, ...extra];
            set({ library: merged, searching: false });
            const patched = await Promise.all(
              merged.map(async (s) => {
                if (!s.id.startsWith("it-")) return s;
                const bpm = await lookupTempo(s.title, s.artist);
                if (!bpm) return s;
                return makeSong({ ...s, bpm, feel: feelFromGenre(s.genre, bpm) });
              })
            );
            if (get().query.trim() !== t) return;
            set({ library: patched });
          })
          .catch((err) => {
            console.warn("search failed", err);
            set({ library: local, searching: false });
          });
      }, 280);
    },

    selectSong: (id) => {
      const song =
        get().library.find((s) => s.id === id) ||
        (SEEDS.find((s) => s.id === id) ? makeSong(SEEDS.find((s) => s.id === id)!) : null);
      if (!song) return;
      void resolveSong(song).then((ready) => {
        rememberUserSeed({
          id: ready.id,
          title: ready.title,
          artist: ready.artist,
          bpm: ready.songBpm || ready.bpm,
          feel: ready.feel,
          genre: ready.genre,
        });
        const list = get().library.map((s) => (s.id === ready.id || s.id === song.id ? ready : s));
        if (!list.some((s) => s.id === ready.id)) list.unshift(ready);
        const brain = brainFor(ready.id, ready.feel, ready.title);
        getEngine().synth.kit = brain.kit;
        set({ library: list, tab: "play", conductorOn: true, kit: brain.kit });
        getEngine().seq.conductor = true;
        beginPlayback(ready);
      });
    },

    selectFeel: (feel) => {
      const cur = get().song;
      const song = makeSong({
        id: cur.id.startsWith("it-") ? cur.id : `custom-${feel}`,
        title: cur.id.startsWith("it-") ? cur.title : LABELS[feel],
        artist: cur.id.startsWith("it-") ? cur.artist : (STYLES.find((s) => s.id === feel)?.label ?? feel),
        bpm: get().song.songBpm || get().song.bpm,
        feel,
        genre: cur.genre,
      });
      const { ctx, seq } = getEngine();
      unlockAudio(ctx);
      seq.setParts(song.parts, true);
      const bpm = Math.max(40, Math.round(get().bpm));
      seq.bpm = bpm;
      set({
        song: { ...song, bpm, songBpm: song.songBpm || bpm },
        partName: song.parts[0]?.name ?? "Intro",
        bpm,
        barsInPart: song.parts[0]?.bars ?? 1,
        nextName: song.parts[1]?.name ?? "",
      });
    },

    selectPart: (id) => {
      const song = get().song;
      const i = song.parts.findIndex((p) => p.id === id);
      if (i < 0) return;
      const { seq, ctx } = getEngine();
      unlockAudio(ctx);
      ensureParts(song);
      seq.partIndex = i;
      if (get().playing) seq.armCountIn();
      else {
        seq.step = 0;
        seq.barsPlayed = 0;
      }
      set({
        partName: song.parts[i].name,
        step: 0,
        barInPart: 1,
        barsInPart: song.parts[i].bars,
        nextName: song.parts[(i + 1) % song.parts.length]?.name ?? "",
      });
    },

    setBpm: (bpm) => {
      getEngine().seq.bpm = bpm;
      const song = get().song;
      set({ bpm, speed: 1, song: { ...song, bpm, songBpm: bpm } });
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
      set({
        partName: "1",
        step: 0,
        barInPart: 1,
        barsInPart: seq.currentPart?.bars ?? 1,
      });
    },

    restart: () => {
      const { seq, ctx } = getEngine();
      unlockAudio(ctx);
      ensureParts(get().song);
      seq.restart();
      set({
        partName: "1",
        step: 0,
        barInPart: 1,
        barsInPart: seq.currentPart?.bars ?? 1,
      });
      if (!get().playing) beginPlayback(get().song);
    },

    crash: () => {
      const { seq, synth, ctx } = getEngine();
      unlockAudio(ctx);
      try { synth.trig("crash", ctx.currentTime, 1); } catch { /* */ }
      seq.queueCrash();
    },

    holdPause: () => {
      const { seq, ctx } = getEngine();
      unlockAudio(ctx);
      seq.stop();
      set({ playing: false });
    },

    holdResume: () => {
      const { seq, ctx } = getEngine();
      unlockAudio(ctx);
      applyKitClick();
      bindClock();
      if (!seq.playing) seq.start();
      set({ playing: true });
    },
  };
});
