import type { Feel } from "./grooves";
import type { Kit } from "../audio/kits";
import type { StrumId } from "./strums";
import { chordsFor } from "./chords";

export interface SongBrain {
  capo: number;
  key: string;
  strum: StrumId;
  kit: Kit;
  hard: string;
  hint: string;
  chords: string[];
}

const BRAIN: Record<string, SongBrain> = {
  "wagon-wheel": { capo: 0, key: "A mix via G shapes", strum: "train", kit: "room", hard: "Em", hint: "Train beat. G–D–Em–C the whole way.", chords: ["G", "D", "Em", "C"] },
  "wonderwall": { capo: 2, key: "F#m shapes in Em", strum: "eighths", kit: "stark", hard: "Em", hint: "Capo 2. Em–G–D–C. Keep the eighths even.", chords: ["Em", "G", "D", "C"] },
  "brown-eyed-girl": { capo: 0, key: "G", strum: "island", kit: "r8", hard: "C", hint: "Island lilt on G–C–G–D.", chords: ["G", "C", "G", "D"] },
  "country-roads": { capo: 2, key: "A sounding", strum: "ballad", kit: "dry", hard: "Em", hint: "Capo 2. Slow G–Em–C–D. Do not rush the chorus.", chords: ["G", "Em", "C", "D"] },
  "sweet-home-alabama": { capo: 0, key: "D", strum: "train", kit: "room", hard: "C", hint: "D–C–G shuffle. Lean the backbeat.", chords: ["D", "C", "G", "G"] },
  "wild-horses": { capo: 0, key: "G", strum: "ballad", kit: "dry", hard: "Am", hint: "Half time. Let the ride carry it.", chords: ["G", "Am", "G", "Am"] },
  "dont-fear-the-reaper": { capo: 0, key: "A", strum: "eighths", kit: "stark", hard: "A", hint: "A–G cowbell. Stay on top of 141.", chords: ["A", "G", "A", "G"] },
  "american-soldier": { capo: 0, key: "C", strum: "ballad", kit: "dry", hard: "F", hint: "C–G–Am–F. Loop F until the barre is quiet.", chords: ["C", "G", "Am", "F"] },
};

export function kitForFeel(feel: Feel): Kit {
  if (feel === "country" || feel === "southern") return "room";
  if (feel === "folk" || feel === "ballad") return "dry";
  if (feel === "rock") return "stark";
  if (feel === "pop") return "r8";
  if (feel === "hiphop") return "linn";
  return "room";
}

export function strumForFeel(feel: Feel): StrumId {
  if (feel === "country" || feel === "southern") return "train";
  if (feel === "folk" || feel === "ballad") return "ballad";
  if (feel === "pop") return "island";
  if (feel === "hiphop") return "boom";
  return "eighths";
}

export function intensityForPart(name: string): number {
  const n = (name || "").toLowerCase();
  if (/chorus|hook/.test(n)) return 1.18;
  if (/solo|bridge/.test(n)) return 1.05;
  if (/intro/.test(n)) return 0.78;
  if (/outro/.test(n)) return 0.7;
  if (/pre/.test(n)) return 0.92;
  return 0.86;
}

export function brainFor(id: string, feel: Feel, title?: string): SongBrain {
  if (BRAIN[id]) return BRAIN[id];
  const t = (title || "").toLowerCase();
  for (const [key, b] of Object.entries(BRAIN)) {
    if (t.includes(key.replace(/-/g, " "))) return b;
  }
  const chords = chordsFor(id, feel);
  const hard = chords.find((c) => c === "F" || c === "Bm" || c === "B") || chords[chords.length - 1] || "G";
  return {
    capo: feel === "folk" ? 2 : 0,
    key: chords[0] || "G",
    strum: strumForFeel(feel),
    kit: kitForFeel(feel),
    hard,
    hint: `Play ${chords.join("–")}. Kit and strum matched the feel.`,
    chords,
  };
}

const CHORD_RE = /\b([A-G](?:#|b)?)(m|min|maj7|sus2|sus4|add9|7)?\b/g;

export function parseChart(text: string): string[] {
  const raw = text.replace(/\n+/g, " ");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  CHORD_RE.lastIndex = 0;
  while ((m = CHORD_RE.exec(raw))) {
    const root = m[1];
    const qual = m[2] || "";
    const suffix = qual === "min" ? "m" : qual === "7" ? "7" : qual === "m" ? "m" : "";
    const chord = root + suffix;
    if (out[out.length - 1] === chord) continue;
    out.push(chord);
    if (out.length >= 8) break;
  }
  return out;
}
