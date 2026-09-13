import { create } from "zustand";
import { brainFor, parseChart } from "../data/brain";
import {
  tapNow,
  resetTaps,
  resetOnsets,
  startMic,
  stopMic,
  gridError,
  timingFromError,
  pushOnset,
  bpmFromOnsets,
  type Timing,
} from "../audio/listen";
import { startVoice, stopVoice, voiceSupported } from "../audio/voice";
import { ensureEngine, useApp } from "./store";
import type { Kit } from "../audio/kits";
import type { StrumId } from "../data/strums";

const SET_KEY = "gb-setlist";

function loadSet(): string[] {
  try {
    const raw = localStorage.getItem(SET_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export const useCoach = create<{
  timing: Timing;
  listenOn: boolean;
  voiceOn: boolean;
  voiceOk: boolean;
  lastHeard: string;
  setlist: string[];
  sheet: string;
  sheetChords: string[];
  pathOn: boolean;
  pathNote: string;
  setSheet: (s: string) => void;
  applySheet: () => void;
  toggleListen: () => Promise<void>;
  toggleVoice: () => void;
  tap: () => void;
  addSet: (id: string) => void;
  removeSet: (id: string) => void;
  playSetItem: (id: string) => void;
  playNextInSet: () => void;
  startPath: () => void;
  ladder: () => void;
  applyBrainKit: () => void;
  run: (cmd: string) => void;
}>((set, get) => {
  return {
    timing: "idle",
    listenOn: false,
    voiceOn: false,
    voiceOk: true,
    lastHeard: "",
    setlist: typeof window !== "undefined" ? loadSet() : [],
    sheet: "",
    sheetChords: [],
    pathOn: false,
    pathNote: "",

    setSheet: (s) => set({ sheet: s }),

    applySheet: () => {
      const chords = parseChart(get().sheet);
      set({
        sheetChords: chords,
        pathNote: chords.length ? `Chart loaded · ${chords.join(" ")}` : "No chords found",
      });
    },

    toggleListen: async () => {
      if (get().listenOn) {
        await stopMic();
        resetOnsets();
        set({ listenOn: false, timing: "idle" });
        return;
      }
      const { ctx } = ensureEngine();
      const startAt = ctx.currentTime;
      resetOnsets();
      try {
        await startMic(ctx, (t) => {
          const app = useApp.getState();
          const err = gridError(app.bpm, t, startAt);
          const times = pushOnset(t);
          set({ timing: timingFromError(err) });
          if (!app.conductorOn && times.length >= 4) {
            const heard = bpmFromOnsets(times);
            if (heard && Math.abs(heard - app.bpm) >= 3) {
              app.setBpm(heard);
              set({ pathNote: `Listen lock · ${heard} BPM` });
            }
          }
        });
        set({
          listenOn: true,
          pathNote: useApp.getState().conductorOn
            ? "Listening — rush / drag vs the song grid."
            : "Listening — four hits will lock tempo.",
        });
      } catch {
        set({ pathNote: "Mic blocked. Allow the microphone and try Listen again." });
      }
    },

    toggleVoice: () => {
      if (get().voiceOn) {
        stopVoice();
        set({ voiceOn: false });
        return;
      }
      if (!voiceSupported()) {
        set({ voiceOk: false, pathNote: "Voice needs Safari / Chrome speech." });
        return;
      }
      const ok = startVoice((cmd) => {
        set({ lastHeard: cmd });
        get().run(cmd);
      });
      set({ voiceOn: ok, voiceOk: ok, pathNote: ok ? "Voice on — start, stop, fill, next, half." : "Voice failed to start." });
    },

    tap: () => {
      const bpm = tapNow();
      if (!bpm) {
        set({ pathNote: "Tap 3–4 more times" });
        return;
      }
      useApp.getState().setBpm(bpm);
      resetTaps();
      set({ pathNote: `Locked from taps · ${bpm} BPM` });
    },

    addSet: (id) => {
      const next = [...new Set([...get().setlist, id])];
      localStorage.setItem(SET_KEY, JSON.stringify(next));
      set({ setlist: next });
    },
    removeSet: (id) => {
      const next = get().setlist.filter((x) => x !== id);
      localStorage.setItem(SET_KEY, JSON.stringify(next));
      set({ setlist: next });
    },
    playSetItem: (id) => useApp.getState().selectSong(id),
    playNextInSet: () => {
      const list = get().setlist;
      if (!list.length) {
        set({ pathNote: "Add songs with + on Songs." });
        return;
      }
      const cur = useApp.getState().song.id;
      const i = list.indexOf(cur);
      const next = list[(i + 1) % list.length];
      useApp.getState().selectSong(next);
    },

    startPath: () => {
      const app = useApp.getState();
      const b = brainFor(app.song.id, app.song.feel, app.song.title);
      app.setLoopPart(true);
      app.setSpeed(0.5);
      app.setCountIn(true);
      set({
        pathOn: true,
        pathNote: `Bottleneck ${b.hard} at half speed. Three clean loops, then Ladder.`,
      });
    },

    ladder: () => {
      const app = useApp.getState();
      const next = Math.min(1, app.speed === 0.5 ? 0.7 : 1) as 0.5 | 0.7 | 1;
      app.setSpeed(next);
      if (next === 1) app.setLoopPart(false);
      set({
        pathOn: next < 1,
        pathNote: next === 1 ? "Full tempo. Take the chorus." : "Stepped up. Stay on the loop.",
      });
    },

    applyBrainKit: () => {
      const app = useApp.getState();
      const b = brainFor(app.song.id, app.song.feel, app.song.title);
      app.setKit(b.kit as Kit);
      set({ pathNote: `Kit → ${b.kit}` });
    },

    run: (cmd) => {
      const app = useApp.getState();
      if (cmd === "start" && !app.playing) app.toggleStart();
      else if ((cmd === "stop" || cmd === "pause") && app.playing) app.toggleStart();
      else if (cmd === "fill") app.fill();
      else if (cmd === "crash") app.crash();
      else if (cmd === "next") app.nextPart();
      else if (cmd === "restart") app.restart();
      else if (cmd === "half") app.setSpeed(0.5);
      else if (cmd === "slow") app.setSpeed(0.7);
      else if (cmd === "full") app.setSpeed(1);
      else if (cmd === "countin") app.setCountIn(!app.countIn);
      else if (cmd === "loop") app.setLoopPart(!app.loopPart);
      else if (cmd === "click") app.setClickOn(!app.clickOn);
      else if (cmd === "conductor") app.setConductorOn(!app.conductorOn);
      else if (cmd === "listen") void get().toggleListen();
      else if (cmd === "tap") get().tap();
      else if (cmd === "setnext") get().playNextInSet();
      else if (cmd === "bottleneck") get().startPath();
      else if (cmd === "ladder") get().ladder();
      else if (cmd === "kit") get().applyBrainKit();
    },
  };
});

export function suggestedStrum(id: string, feel: Parameters<typeof brainFor>[1], title?: string): StrumId {
  return brainFor(id, feel, title).strum;
}
