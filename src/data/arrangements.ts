import { Feel, SongPart, partsFor } from "./grooves";

export type SectionKind = "intro" | "verse" | "pre" | "chorus" | "bridge" | "solo" | "outro";

export interface ChartSection {
  id: string;
  name: string;
  kind: SectionKind;
  bars: number;
}

export interface Chart {
  bpm?: number;
  feel?: Feel;
  source: "chart" | "template";
  form: ChartSection[];
}

function sec(id: string, name: string, kind: SectionKind, bars: number): ChartSection {
  return { id, name, kind, bars: Math.max(2, Math.round(bars)) };
}

function norm(s: string) {
  return (s || "").toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

const CHARTS: Record<string, Chart> = {
  "wagon-wheel": {
    bpm: 146, feel: "country", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 8),
      sec("v1", "Verse 1", "verse", 8),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 8),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("v3", "Verse 3", "verse", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("solo", "Solo", "solo", 8),
      sec("c4", "Chorus 4", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "wonderwall": {
    bpm: 87, feel: "rock", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 8),
      sec("v1", "Verse 1", "verse", 16),
      sec("pre1", "Pre-chorus", "pre", 8),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 8),
      sec("pre2", "Pre-chorus", "pre", 8),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "brown-eyed-girl": {
    bpm: 129, feel: "pop", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 8),
      sec("v1", "Verse 1", "verse", 8),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 8),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "country-roads": {
    bpm: 82, feel: "folk", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 4),
      sec("v1", "Verse 1", "verse", 16),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 16),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "sweet-home-alabama": {
    bpm: 98, feel: "southern", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 8),
      sec("v1", "Verse 1", "verse", 8),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 8),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("solo", "Solo", "solo", 16),
      sec("v3", "Verse 3", "verse", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "wild-horses": {
    bpm: 76, feel: "ballad", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 8),
      sec("v1", "Verse 1", "verse", 16),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 16),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "dont-fear-the-reaper": {
    bpm: 141, feel: "rock", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 8),
      sec("v1", "Verse 1", "verse", 8),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 8),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("solo", "Cowbell solo", "solo", 16),
      sec("v3", "Verse 3", "verse", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  "american-soldier": {
    bpm: 82, feel: "folk", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 4),
      sec("v1", "Verse 1", "verse", 16),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 16),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ],
  },
  thriller: {
    bpm: 118, feel: "pop", source: "chart",
    form: [
      sec("intro", "Intro", "intro", 16),
      sec("v1", "Verse 1", "verse", 16),
      sec("pre1", "Pre-chorus", "pre", 8),
      sec("c1", "Chorus 1", "chorus", 16),
      sec("v2", "Verse 2", "verse", 16),
      sec("pre2", "Pre-chorus", "pre", 8),
      sec("c2", "Chorus 2", "chorus", 16),
      sec("bridge", "Bridge", "bridge", 16),
      sec("c3", "Chorus 3", "chorus", 16),
      sec("rap", "Vincent Price", "solo", 24),
      sec("c4", "Final chorus", "chorus", 16),
      sec("outro", "Outro", "outro", 8),
    ],
  },
};

type Recipe = { kind: SectionKind; name: string; bars: number };

function recipeFor(feel: Feel): Recipe[] {
  if (feel === "ballad" || feel === "folk") {
    return [
      { kind: "intro", name: "Intro", bars: 4 },
      { kind: "verse", name: "Verse 1", bars: 16 },
      { kind: "chorus", name: "Chorus 1", bars: 8 },
      { kind: "verse", name: "Verse 2", bars: 16 },
      { kind: "chorus", name: "Chorus 2", bars: 8 },
      { kind: "bridge", name: "Bridge", bars: 8 },
      { kind: "chorus", name: "Chorus 3", bars: 8 },
      { kind: "chorus", name: "Final chorus", bars: 8 },
      { kind: "outro", name: "Outro", bars: 8 },
    ];
  }
  if (feel === "hiphop") {
    return [
      { kind: "intro", name: "Intro", bars: 8 },
      { kind: "verse", name: "Verse 1", bars: 16 },
      { kind: "chorus", name: "Hook 1", bars: 8 },
      { kind: "verse", name: "Verse 2", bars: 16 },
      { kind: "chorus", name: "Hook 2", bars: 8 },
      { kind: "verse", name: "Verse 3", bars: 16 },
      { kind: "chorus", name: "Hook 3", bars: 8 },
      { kind: "bridge", name: "Bridge", bars: 8 },
      { kind: "chorus", name: "Final hook", bars: 8 },
      { kind: "outro", name: "Outro", bars: 8 },
    ];
  }
  if (feel === "pop") {
    return [
      { kind: "intro", name: "Intro", bars: 8 },
      { kind: "verse", name: "Verse 1", bars: 16 },
      { kind: "pre", name: "Pre-chorus", bars: 8 },
      { kind: "chorus", name: "Chorus 1", bars: 8 },
      { kind: "verse", name: "Verse 2", bars: 16 },
      { kind: "pre", name: "Pre-chorus", bars: 8 },
      { kind: "chorus", name: "Chorus 2", bars: 8 },
      { kind: "bridge", name: "Bridge", bars: 8 },
      { kind: "chorus", name: "Chorus 3", bars: 8 },
      { kind: "chorus", name: "Final chorus", bars: 8 },
      { kind: "outro", name: "Outro", bars: 8 },
    ];
  }
  if (feel === "country" || feel === "southern") {
    return [
      { kind: "intro", name: "Intro", bars: 8 },
      { kind: "verse", name: "Verse 1", bars: 8 },
      { kind: "chorus", name: "Chorus 1", bars: 8 },
      { kind: "verse", name: "Verse 2", bars: 8 },
      { kind: "chorus", name: "Chorus 2", bars: 8 },
      { kind: "verse", name: "Verse 3", bars: 8 },
      { kind: "chorus", name: "Chorus 3", bars: 8 },
      { kind: "solo", name: "Solo", bars: 8 },
      { kind: "chorus", name: "Chorus 4", bars: 8 },
      { kind: "outro", name: "Outro", bars: 8 },
    ];
  }
  return [
    { kind: "intro", name: "Intro", bars: 8 },
    { kind: "verse", name: "Verse 1", bars: 8 },
    { kind: "chorus", name: "Chorus 1", bars: 8 },
    { kind: "verse", name: "Verse 2", bars: 8 },
    { kind: "chorus", name: "Chorus 2", bars: 8 },
    { kind: "solo", name: "Solo", bars: 16 },
    { kind: "verse", name: "Verse 3", bars: 8 },
    { kind: "chorus", name: "Chorus 3", bars: 8 },
    { kind: "chorus", name: "Final chorus", bars: 8 },
    { kind: "outro", name: "Outro", bars: 8 },
  ];
}

function targetBars(bpm: number, ms?: number) {
  const minutes = ms && ms > 25000 ? ms / 60000 : 3.9;
  const bars = Math.round((Math.max(50, bpm) * minutes) / 4);
  return Math.max(48, Math.min(240, bars));
}

function formFromDuration(feel: Feel, bpm: number, ms?: number): ChartSection[] {
  const want = targetBars(bpm, ms);
  const recipe = recipeFor(feel);
  const raw = recipe.reduce((n, r) => n + r.bars, 0);
  const scale = want / Math.max(1, raw);
  const form = recipe.map((r, i) => {
    let bars = Math.round(r.bars * scale);
    if (r.kind === "intro") bars = Math.max(4, Math.min(16, bars));
    else if (r.kind === "outro") bars = Math.max(4, bars);
    else bars = Math.max(4, Math.round(bars / 4) * 4);
    return sec(`${r.kind}${i}`, r.name, r.kind, bars);
  });
  let sum = form.reduce((n, s) => n + s.bars, 0);
  const last = form[form.length - 1];
  if (last) last.bars = Math.max(4, last.bars + (want - sum));
  return form;
}

export function chartFor(id: string, title?: string, artist?: string, feel?: Feel, bpm?: number, ms?: number): Chart {
  if (CHARTS[id]) return CHARTS[id];
  const t = norm(title || "");
  const a = norm(artist || "");
  for (const [key, chart] of Object.entries(CHARTS)) {
    const words = key.replace(/-/g, " ");
    if (t === words || t.includes(words) || (words.length > 4 && words.includes(t))) return chart;
  }
  void a;
  const usedFeel = feel || "rock";
  const usedBpm = bpm && bpm >= 40 ? bpm : 118;
  return {
    source: "template",
    feel: usedFeel,
    bpm: usedBpm,
    form: formFromDuration(usedFeel, usedBpm, ms),
  };
}

export function partsFromChart(feel: Feel, chart: Chart): SongPart[] {
  const base = partsFor(feel);
  const by = Object.fromEntries(base.map((p) => [p.id, p]));
  const bank: Record<SectionKind, SongPart> = {
    intro: by.intro,
    verse: by.verse,
    pre: by.verse,
    chorus: by.chorus,
    bridge: by.chorus,
    solo: by.verse,
    outro: by.outro,
  };
  return chart.form.map((s) => {
    const src = bank[s.kind] || by.verse;
    return { ...src, id: s.id, name: s.name, bars: Math.max(1, s.bars) };
  });
}

export function nextSectionName(parts: SongPart[], index: number) {
  if (!parts.length) return "";
  return parts[(index + 1) % parts.length]?.name ?? "";
}
