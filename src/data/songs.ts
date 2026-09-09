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
];
export function makeSong(seed: { id: string; title: string; artist: string; bpm?: number; feel?: Feel }): Song {
  const feel = seed.feel || "rock";
  let bpm = seed.bpm || DEF[feel];
  if (feel !== "country" && feel !== "pop" && feel !== "hiphop" && bpm > 132) bpm /= 2;
  if (bpm > 185) bpm /= 2;
  bpm = Math.round(Math.min(240, Math.max(40, bpm)));
  return { id: seed.id, title: seed.title, artist: seed.artist, bpm, feel, parts: partsFor(feel) };
}
