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
  return { id, name, kind, bars };
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
};

function templateFor(feel: Feel): ChartSection[] {
  if (feel === "ballad" || feel === "folk") {
    return [
      sec("intro", "Intro", "intro", 4),
      sec("v1", "Verse 1", "verse", 16),
      sec("c1", "Chorus 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 16),
      sec("c2", "Chorus 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Chorus 3", "chorus", 8),
      sec("outro", "Outro", "outro", 8),
    ];
  }
  if (feel === "hiphop") {
    return [
      sec("intro", "Intro", "intro", 4),
      sec("v1", "Verse 1", "verse", 16),
      sec("c1", "Hook 1", "chorus", 8),
      sec("v2", "Verse 2", "verse", 16),
      sec("c2", "Hook 2", "chorus", 8),
      sec("bridge", "Bridge", "bridge", 8),
      sec("c3", "Hook 3", "chorus", 8),
      sec("outro", "Outro", "outro", 4),
    ];
  }
  return [
    sec("intro", "Intro", "intro", 8),
    sec("v1", "Verse 1", "verse", 8),
    sec("c1", "Chorus 1", "chorus", 8),
    sec("v2", "Verse 2", "verse", 8),
    sec("c2", "Chorus 2", "chorus", 8),
    sec("bridge", "Bridge", "bridge", 8),
    sec("c3", "Chorus 3", "chorus", 8),
    sec("outro", "Outro", "outro", 8),
  ];
}

export function chartFor(id: string, title?: string, artist?: string, feel?: Feel): Chart {
  if (CHARTS[id]) return CHARTS[id];
  const t = (title || "").toLowerCase();
  for (const [key, chart] of Object.entries(CHARTS)) {
    const words = key.replace(/-/g, " ");
    if (t.includes(words) || words.includes(t)) return chart;
  }
  return { source: "template", feel, form: templateFor(feel || "rock") };
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
