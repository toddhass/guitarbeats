import { useApp } from "./store";

/** Pause without resetting the song. Resume from the same step. */
export function pauseClock() {
  useApp.getState().holdPause();
}

export function resumeClock() {
  useApp.getState().holdResume();
}
