import { DEF, Feel, feelFromGenre, partsFor, SongPart } from "./grooves";
import { chartFor, partsFromChart } from "./arrangements";

export interface SongSeed { id: string; title: string; artist: string; bpm: number; feel: Feel; genre?: string; }
export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  feel: Feel;
  parts: SongPart[];
  genre?: string;
  chartSource?: "chart" | "template";
  songBpm: number;
}

export const SEEDS: SongSeed[] = [
  { id: "wagon-wheel", title: "Wagon Wheel", artist: "Old Crow Medicine Show", bpm: 146, feel: "country" },
  { id: "wonderwall", title: "Wonderwall", artist: "Oasis", bpm: 87, feel: "rock" },
  { id: "brown-eyed-girl", title: "Brown Eyed Girl", artist: "Van Morrison", bpm: 129, feel: "pop" },
  { id: "country-roads", title: "Take Me Home Country Roads", artist: "John Denver", bpm: 82, feel: "folk" },
  { id: "sweet-home-alabama", title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", bpm: 98, feel: "southern" },
  { id: "wild-horses", title: "Wild Horses", artist: "The Rolling Stones", bpm: 76, feel: "ballad" },
  { id: "dont-fear-the-reaper", title: "(Don't Fear) The Reaper", artist: "Blue Öyster Cult", bpm: 141, feel: "rock" },
  { id: "american-soldier", title: "American Soldier", artist: "Toby Keith", bpm: 82, feel: "folk" },
];

const BELL_Q = "2000200020002000";
const BELL_8 = "2020202020202020";
const USER_KEY = "gb-user-seeds";

function wantsCowbell(title: string, id: string) {
  return /reaper/i.test(title) || id === "dont-fear-the-reaper";
}

function withBell(parts: SongPart[], eighthsOnChorus = true): SongPart[] {
  return parts.map((p) => {
    const bell = /chorus|hook/i.test(p.name) && eighthsOnChorus ? BELL_8 : BELL_Q;
    return {
      ...p,
      groove: { ...p.groove, cowbell: bell },
      fill: { ...p.fill, cowbell: "2000000020000000" },
    };
  });
}

export function normName(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function matchSeed(title: string, artist?: string, id?: string): SongSeed | null {
  if (id) {
    const byId = SEEDS.find((s) => s.id === id);
    if (byId) return byId;
  }
  const t = normName(title);
  const a = normName(artist || "");
  if (!t || t.length < 4) return null;
  const exact = SEEDS.find((s) => {
    const st = normName(s.title);
    const sa = normName(s.artist);
    if (st !== t) return false;
    if (!a) return true;
    return sa === a || a.includes(sa) || sa.includes(a);
  });
  if (exact) return exact;
  return SEEDS.find((s) => {
    const st = normName(s.title);
    if (st.length < 6) return false;
    const titleHit = t === st || (t.length >= st.length && t.includes(st)) || (st.length >= t.length && st.includes(t) && t.length >= 8);
    if (!titleHit) return false;
    if (!a) return t === st || t.includes(st);
    const sa = normName(s.artist);
    return sa === a || a.includes(sa) || sa.includes(a);
  }) || null;
}

export function loadUserSeeds(): SongSeed[] {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SongSeed[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s) => s && s.id && s.title);
  } catch {
    return [];
  }
}

export function rememberUserSeed(seed: { id: string; title: string; artist: string; bpm: number; feel: Feel; genre?: string }) {
  if (SEEDS.some((s) => s.id === seed.id)) return;
  const list = loadUserSeeds().filter(
    (s) => s.id !== seed.id && !(normName(s.title) === normName(seed.title) && normName(s.artist) === normName(seed.artist)),
  );
  list.unshift({
    id: seed.id,
    title: seed.title,
    artist: seed.artist,
    bpm: seed.bpm,
    feel: seed.feel,
    genre: seed.genre,
  });
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(list.slice(0, 40)));
  } catch { /* quota */ }
}

export function makeSong(seed: { id: string; title: string; artist: string; bpm?: number; feel?: Feel; genre?: string }): Song {
  const known = matchSeed(seed.title, seed.artist, seed.id);
  const id = seed.id;
  const title = seed.title;
  const artist = seed.artist;
  const trusted = !!(seed.bpm && seed.bpm >= 40) || !!(known?.bpm && known.bpm >= 40);
  let bpm = seed.bpm && seed.bpm >= 40 ? seed.bpm : (known?.bpm || 0);
  const feel = seed.feel || known?.feel || feelFromGenre(seed.genre, bpm) || "rock";
  if (!trusted) bpm = DEF[feel];
  if (!trusted) {
    if (feel !== "country" && feel !== "pop" && feel !== "hiphop" && bpm > 132) bpm /= 2;
    if (bpm > 185) bpm /= 2;
  } else if (bpm > 200) {
    bpm /= 2;
  }
  bpm = Math.round(Math.min(240, Math.max(40, bpm)));
  if (id === "dont-fear-the-reaper" || /reaper/i.test(title || "")) {
    bpm = Math.round(seed.bpm && seed.bpm > 40 ? Math.min(seed.bpm, 148) : 141);
  }
  if (known?.bpm && known.bpm >= 40 && (!seed.bpm || seed.bpm < 40)) bpm = known.bpm;
  const chart = chartFor(known?.id || id, title, artist, feel);
  if (chart.bpm && chart.source === "chart") bpm = chart.bpm;
  let parts = partsFromChart(feel, chart);
  if (!parts.length) parts = partsFor(feel);
  if (wantsCowbell(title || "", known?.id || id)) parts = withBell(parts);
  return {
    id,
    title,
    artist,
    bpm,
    songBpm: bpm,
    feel,
    parts,
    genre: seed.genre,
    chartSource: chart.source,
  };
}
