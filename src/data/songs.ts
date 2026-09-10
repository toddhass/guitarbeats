import { DEF, Feel, partsFor, SongPart } from "./grooves";
export interface SongSeed { id: string; title: string; artist: string; bpm: number; feel: Feel; }
export interface Song { id: string; title: string; artist: string; bpm: number; feel: Feel; parts: SongPart[]; }
export const SEEDS: SongSeed[] = [
  { id: "wagon-wheel", title: "Wagon Wheel", artist: "Old Crow Medicine Show", bpm: 146, feel: "country" },
  { id: "wonderwall", title: "Wonderwall", artist: "Oasis", bpm: 87, feel: "rock" },
  { id: "brown-eyed-girl", title: "Brown Eyed Girl", artist: "Van Morrison", bpm: 129, feel: "pop" },
  { id: "country-roads", title: "Take Me Home Country Roads", artist: "John Denver", bpm: 82, feel: "folk" },
  { id: "sweet-home-alabama", title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", bpm: 98, feel: "southern" },
  { id: "wild-horses", title: "Wild Horses", artist: "The Rolling Stones", bpm: 76, feel: "ballad" },
  { id: "dont-fear-the-reaper", title: "(Don't Fear) The Reaper", artist: "Blue Öyster Cult", bpm: 141, feel: "rock" },
];

const BELL_Q = "2000200020002000";
const BELL_8 = "2020202020202020";

function wantsCowbell(title: string, id: string) {
  return /reaper/i.test(title) || id === "dont-fear-the-reaper";
}

function withBell(parts: SongPart[], eighthsOnChorus = true): SongPart[] {
  return parts.map((p) => {
    const bell = p.id === "chorus" && eighthsOnChorus ? BELL_8 : BELL_Q;
    return {
      ...p,
      groove: { ...p.groove, cowbell: bell },
      fill: { ...p.fill, cowbell: "2000000020000000" },
    };
  });
}

export function makeSong(seed: { id: string; title: string; artist: string; bpm?: number; feel?: Feel }): Song {
  const feel = seed.feel || "rock";
  let bpm = seed.bpm || DEF[feel];
  if (feel !== "country" && feel !== "pop" && feel !== "hiphop" && bpm > 132) bpm /= 2;
  if (bpm > 185) bpm /= 2;
  bpm = Math.round(Math.min(240, Math.max(40, bpm)));
  if (seed.id === "dont-fear-the-reaper" || /reaper/i.test(seed.title || "")) {
    bpm = Math.round(seed.bpm && seed.bpm > 40 ? Math.min(seed.bpm, 148) : 141);
  }
  let parts = partsFor(feel);
  if (wantsCowbell(seed.title || "", seed.id)) parts = withBell(parts);
  return { id: seed.id, title: seed.title, artist: seed.artist, bpm, feel, parts };
}
