import { P0 } from "./kitP0";
import { P1 } from "./kitP1";
import { P2 } from "./kitP2";
import { P3 } from "./kitP3";

/** Embedded DW pearl kit so Drums never depends on a CDN or missing public file. */
export const KIT_SRC = "data:image/jpeg;base64," + P0 + P1 + P2 + P3;
