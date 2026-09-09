export type Feel = "country" | "folk" | "ballad" | "rock" | "pop" | "southern" | "hiphop";
export interface Pattern { [voice: string]: string; }
export interface SongPart { id: string; name: string; bars: number; swing: number; groove: Partial<Pattern>; fill: Partial<Pattern>; }
export const LABELS: Record<Feel, string> = {
  country: "Country train", folk: "Folk two-step", ballad: "Half-time ballad",
  rock: "Rock", pop: "Four-on-the-floor", southern: "Southern shuffle", hiphop: "Hip hop boom-bap",
};
export const STYLES: { id: Feel; label: string }[] = [
  { id: "country", label: "Country" }, { id: "rock", label: "Rock" }, { id: "hiphop", label: "Hip hop" },
  { id: "pop", label: "Pop" }, { id: "folk", label: "Folk" }, { id: "ballad", label: "Ballad" }, { id: "southern", label: "Southern" },
];
export const DEF: Record<Feel, number> = { country: 132, folk: 108, ballad: 72, rock: 116, pop: 120, southern: 100, hiphop: 90 };
const ROCK: Pattern = { kick: "2000001000000000", snare: "0000200000002000", hat: "2121212121212121" };
const FILL: Pattern = { kick: "2000001000001000", snare: "0000100010000000", hat: "2020202000000000", tom: "0000000022000000", floor: "0000000000221100", crash: "0000000000000001" };
const G: Record<Feel, { s: number; i: Pattern; v: Pattern; c: Pattern; o: Pattern }> = {
  rock: { s: 0, i: ROCK, v: ROCK, c: { ...ROCK, crash: "2000000000000000", openHat: "0000000000000010" }, o: ROCK },
  country: { s: 0.22, i: { kick: "2000000020000000", rim: "0000200000002000", hat: "2121212121212121" }, v: { kick: "2000000020000000", snare: "0000200000002000", hat: "2121212121212121" }, c: { kick: "2000001020001000", snare: "0000200000002000", hat: "2121212121212101", crash: "2000000000000000" }, o: { kick: "2000000020000000", snare: "0000200000002000", hat: "2020202020202000" } },
  folk: { s: 0.08, i: { kick: "2000000000000000", hat: "2000100020001000" }, v: { kick: "2000000020000000", rim: "0000200000002000", hat: "2000100020001000" }, c: { kick: "2000000020000000", snare: "0000200000002000", hat: "2000100020001000", crash: "2000000000000000" }, o: { kick: "2000000000000000", ride: "2000200020002000" } },
  ballad: { s: 0, i: { kick: "2000000000000000", ride: "2000200020002000" }, v: { kick: "2000000000000000", snare: "0000000020000000", ride: "2000200020002000" }, c: { kick: "2000000020000000", snare: "0000000020000000", ride: "2020202020202020", crash: "2000000000000000" }, o: { kick: "2000000000000000", ride: "2000000020000000" } },
  pop: { s: 0, i: { kick: "2000200020002000", snare: "0000200000002000", hat: "2020202020202020" }, v: { kick: "2000200020002000", snare: "0000200000002000", hat: "2020202020202000" }, c: { kick: "2010201020102010", snare: "0000200000002000", hat: "2121212121212101", clap: "0000200000002000", crash: "2000000000000000" }, o: { kick: "2000200020002000", ride: "2020202020202020" } },
  southern: { s: 0.16, i: { kick: "2000001020000000", snare: "0000200300002000", hat: "2020202020202020" }, v: { kick: "2000001020000000", snare: "0000200300002003", hat: "2020202020202020" }, c: { kick: "2000101020001010", snare: "0000200000002000", hat: "2020202020202002", crash: "2000000000000000" }, o: { kick: "2000001020000000", snare: "0000200000002000", hat: "2020202020202000" } },
  hiphop: { s: 0.14, i: { kick: "2000000000002000", hat: "2000200020002000" }, v: { kick: "2000000020001000", snare: "0000200000002000", hat: "2020202020202020" }, c: { kick: "2000200020002010", snare: "0000200000002000", hat: "2120212021202101", clap: "0000200000002000", crash: "2000000000000000" }, o: { kick: "2000000000002000", snare: "0000200000002000", hat: "2000200020002000" } },
};
export function partsFor(feel: Feel): SongPart[] {
  const f = G[feel] || G.rock;
  return [
    { id: "intro", name: "Intro", bars: 2, swing: f.s, groove: f.i, fill: FILL },
    { id: "verse", name: "Verse", bars: 2, swing: f.s, groove: f.v, fill: FILL },
    { id: "chorus", name: "Chorus", bars: 2, swing: f.s * 0.85, groove: f.c, fill: FILL },
    { id: "outro", name: "Outro", bars: 2, swing: f.s, groove: f.o, fill: FILL },
  ];
}
export function feelFromGenre(genre: string | undefined, bpm: number | undefined): Feel {
  const g = (genre || "").toLowerCase();
  if (/hip.?hop|rap|trap/.test(g)) return "hiphop";
  if (/country|americana|bluegrass/.test(g)) return "country";
  if (/folk|acoustic|singer/.test(g)) return "folk";
  if (/southern/.test(g)) return "southern";
  if (/ballad|blues|soul|jazz/.test(g)) return "ballad";
  if (/pop|dance|disco|funk/.test(g)) return "pop";
  if (bpm && bpm < 80) return "ballad";
  return "rock";
}
export function hit(track: string | undefined, step: number): number {
  if (!track) return 0;
  const d = track[step % track.length] || "0";
  return d === "2" ? 1 : d === "1" ? 0.72 : d === "3" ? 0.3 : 0;
}
