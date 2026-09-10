const NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

function rootIndex(name: string) {
  const m = name.match(/^([A-G](?:#|b)?)/);
  if (!m) return 0;
  const n = m[1].replace("Bb", "A#").replace("Db", "C#").replace("Gb", "F#");
  const i = NOTES.indexOf(n === "A#" ? "Bb" : n);
  if (i >= 0) return i;
  return NOTES.indexOf(m[1]) >= 0 ? NOTES.indexOf(m[1]) : 7;
}

export function withCapo(chord: string, capo: number) {
  if (!capo) return chord;
  const root = chord.match(/^([A-G](?:#|b)?)/)?.[1] ?? "G";
  const rest = chord.slice(root.length);
  const i = NOTES.findIndex((n) => n === root || (root === "Bb" && n === "Bb") || (root === "A#" && n === "Bb"));
  const idx = i >= 0 ? i : rootIndex(root);
  return NOTES[(idx + capo) % 12] + rest;
}
