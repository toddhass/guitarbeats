export type Kit = "eighty" | "room" | "dry" | "linn" | "power" | "r8" | "stark";

export const KITS: { id: Kit; label: string }[] = [
  { id: "eighty", label: "80s room" },
  { id: "linn", label: "LinnDrum" },
  { id: "power", label: "Power 909" },
  { id: "dry", label: "Dry Pearl" },
  { id: "stark", label: "TR-505" },
];

const ORA = "https://cdn.jsdelivr.net/gh/oramics/sampled@master";
const AVL = `${ORA}/DRUMS/avl-drumkits-1.1`;
const LM2 = `${ORA}/DM/LM-2/samples`;
const NINE = `${ORA}/DM/TR-909/Detroit/samples`;
const FIVE = `${ORA}/DM/TR-505/samples`;

const pearl = {
  kick: `${AVL}/36-Pearl22Kick-4.wav`,
  snare: `${AVL}/38-PearlSnare-4.wav`,
  hat: `${AVL}/42-SabianRockHatClosed-4.wav`,
  openHat: `${AVL}/46-SabianRockHatSemiOpen-4.wav`,
  pedalHat: `${AVL}/44-SabianRockHatPedal-3.wav`,
  crash: `${AVL}/49-SabianAA16Crash-3.wav`,
  ride: `${AVL}/51-SabianAAX20Ride-3.wav`,
  tom: `${AVL}/45-Pearl12Tom-4.wav`,
  highTom: `${AVL}/47-Pearl13Tom2-3.wav`,
  floor: `${AVL}/41-Pearl16FloorTom-4.wav`,
  rim: `${AVL}/40-PearlSnareEdge-4.wav`,
};

export const KIT_URLS: Record<Kit, Record<string, string>> = {
  eighty: pearl,
  room: pearl,
  dry: {
    ...pearl,
    snare: `${AVL}/38-PearlSnare-2.wav`,
    kick: `${AVL}/36-Pearl22Kick-2.wav`,
  },
  linn: {
    kick: `${LM2}/kick.wav`,
    snare: `${LM2}/snare-m.wav`,
    hat: `${LM2}/hihat-closed.wav`,
    openHat: `${LM2}/hihat-open.wav`,
    crash: `${LM2}/crash.wav`,
    ride: `${LM2}/ride.wav`,
    tom: `${LM2}/tom-m.wav`,
    highTom: `${LM2}/tom-h.wav`,
    floor: `${LM2}/tom-l.wav`,
    clap: `${LM2}/clap.wav`,
    cowbell: `${LM2}/cowb.wav`,
    rim: `${LM2}/stick-m.wav`,
  },
  power: {
    kick: `${NINE}/kick.wav`,
    snare: `${NINE}/snare.wav`,
    hat: `${NINE}/hihat-closed.wav`,
    openHat: `${NINE}/hihat-open-1.wav`,
    crash: `${NINE}/cymbal.wav`,
    tom: `${NINE}/tom-h.wav`,
    clap: `${NINE}/clap-1.wav`,
    rim: `${NINE}/rim.wav`,
  },
  r8: {
    kick: `${NINE}/kick.wav`,
    snare: `${NINE}/snare.wav`,
    hat: `${NINE}/hihat-closed.wav`,
    openHat: `${NINE}/hihat-open-1.wav`,
    crash: `${NINE}/cymbal.wav`,
    tom: `${NINE}/tom-h.wav`,
    clap: `${NINE}/clap-1.wav`,
  },
  stark: {
    kick: `${FIVE}/tr505-kick.wav`,
    snare: `${FIVE}/tr505-snare.wav`,
    hat: `${FIVE}/tr505-hihat-closed.wav`,
    openHat: `${FIVE}/tr505-hihat-open.wav`,
    crash: `${FIVE}/tr505-crash.wav`,
    ride: `${FIVE}/tr505-ride.wav`,
    tom: `${FIVE}/tr505-tom-m.wav`,
    highTom: `${FIVE}/tr505-tom-h.wav`,
    floor: `${FIVE}/tr505-tom-l.wav`,
    cowbell: `${FIVE}/tr505-cowb-h.wav`,
    rim: `${FIVE}/tr505-rim.wav`,
    clap: `${FIVE}/tr505-clap.wav`,
  },
};

export const GATE_VOICES = new Set(["snare", "clap", "rim"]);
