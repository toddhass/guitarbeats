export type Stroke = "D" | "U" | "x" | "";

export type StrumId = "eighths" | "train" | "ballad" | "boom" | "island" | "mute";

export const STRUMS: { id: StrumId; label: string; cells: Stroke[] }[] = [
  { id: "eighths", label: "Eighths", cells: ["D", "U", "D", "U", "D", "U", "D", "U"] },
  { id: "train", label: "Train", cells: ["D", "D", "U", "U", "D", "U", "D", "U"] },
  { id: "ballad", label: "Ballad", cells: ["D", "", "D", "U", "", "U", "D", "U"] },
  { id: "boom", label: "Boom-chuck", cells: ["D", "", "D", "", "D", "", "D", ""] },
  { id: "island", label: "Island", cells: ["D", "", "U", "U", "D", "", "U", "U"] },
  { id: "mute", label: "Mute 2+4", cells: ["D", "x", "D", "x", "D", "x", "D", "x"] },
];

export const BEAT_LABELS = ["1", "&", "2", "&", "3", "&", "4", "&"];

export function strokeMark(s: Stroke) {
  if (s === "D") return "\u2193";
  if (s === "U") return "\u2191";
  if (s === "x") return "x";
  return "·";
}
