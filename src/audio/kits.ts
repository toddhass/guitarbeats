export type Kit =
  | "dry"
  | "room"
  | "linn"
  | "cr78"
  | "r8"
  | "stark"
  | "techno"
  | "fm"
  | "bongos"
  | "kpr77"
  | "kit3"
  | "cheeba1"
  | "cheeba2";

export const KITS: { id: Kit; label: string }[] = [
  { id: "dry", label: "Dry room" },
  { id: "room", label: "Country room" },
  { id: "linn", label: "Linn" },
  { id: "cr78", label: "CR-78" },
  { id: "r8", label: "R-8" },
  { id: "stark", label: "Stark" },
  { id: "techno", label: "Techno" },
  { id: "fm", label: "4OP-FM" },
  { id: "bongos", label: "Bongos" },
  { id: "kpr77", label: "KPR-77" },
  { id: "kit3", label: "Kit 3" },
  { id: "cheeba1", label: "Cheeba 1" },
  { id: "cheeba2", label: "Cheeba 2" },
];

const TONE = "https://tonejs.github.io/audio/drum-samples";

function tone(folder: string) {
  return {
    kick: `${TONE}/${folder}/kick.mp3`,
    snare: `${TONE}/${folder}/snare.mp3`,
    hat: `${TONE}/${folder}/hihat.mp3`,
    tom: `${TONE}/${folder}/tom1.mp3`,
    highTom: `${TONE}/${folder}/tom2.mp3`,
    floor: `${TONE}/${folder}/tom3.mp3`,
  };
}

export const KIT_URLS: Record<Kit, Record<string, string>> = {
  room: tone("acoustic-kit"),
  dry: tone("Kit8"),
  linn: tone("LINN"),
  cr78: tone("CR78"),
  r8: tone("R8"),
  stark: tone("Stark"),
  techno: tone("Techno"),
  fm: tone("4OP-FM"),
  bongos: tone("Bongos"),
  kpr77: tone("KPR77"),
  kit3: tone("Kit3"),
  cheeba1: tone("TheCheebacabra1"),
  cheeba2: tone("TheCheebacabra2"),
};
