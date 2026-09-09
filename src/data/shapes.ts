/** Open-position shapes: string 6 (low E) → 1 (high E). null = mute, 0 = open. */
export type Shape = {
  frets: (number | null)[];
  fingers: (number | null)[];
  tip: string;
};

export const SHAPES: Record<string, Shape> = {
  G:  { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3], tip: "Ring on low E3, middle A2, pinky high E3" },
  C:  { frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null], tip: "Index B1, middle D2, ring A3. Mute low E" },
  D:  { frets: [null, null, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2], tip: "Index G2, ring B3, middle high E2. Mute E and A" },
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null], tip: "Middle A2, ring D2. Both E strings open" },
  Am: { frets: [null, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null], tip: "Index B1, middle D2, ring G2. Mute low E" },
  F:  { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], tip: "Barre 1 with index. Hard — skip until the others feel easy" },
};

export function shapeFor(chord: string): Shape {
  return SHAPES[chord] ?? SHAPES.G;
}
