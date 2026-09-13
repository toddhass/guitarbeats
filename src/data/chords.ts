/** Simple open-position cues for the seed library. */
export const CHORDS: Record<string, string[]> = {
  "wagon-wheel": ["G", "D", "Em", "C"],
  "wonderwall": ["Em", "G", "D", "C"],
  "brown-eyed-girl": ["G", "C", "G", "D"],
  "country-roads": ["G", "Em", "C", "D"],
  "sweet-home-alabama": ["D", "C", "G", "G"],
  "wild-horses": ["G", "Am", "G", "Am"],
  "dont-fear-the-reaper": ["A", "G", "A", "G"],
  "american-soldier": ["C", "G", "Am", "F"],
};

export function chordsFor(id: string, feel: string): string[] {
  if (CHORDS[id]) return CHORDS[id];
  if (feel === "country" || feel === "folk") return ["G", "C", "D", "G"];
  if (feel === "pop") return ["G", "D", "Em", "C"];
  if (feel === "ballad") return ["Am", "F", "C", "G"];
  if (feel === "hiphop") return ["Am", "G", "C", "F"];
  return ["G", "C", "D", "G"];
}
