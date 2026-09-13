import { useApp } from "./state/store";
import { useCoach } from "./state/coach";

function run(cmd: string) {
  useCoach.getState().run(cmd);
}

function bindMedia() {
  const ms = navigator.mediaSession;
  if (!ms) return;
  try {
    ms.setActionHandler("play", () => run("start"));
    ms.setActionHandler("pause", () => run("stop"));
    ms.setActionHandler("stop", () => run("stop"));
    ms.setActionHandler("nexttrack", () => run("setnext"));
    ms.setActionHandler("previoustrack", () => run("restart"));
  } catch {
    /* */
  }
}

export function syncMediaSession() {
  const ms = navigator.mediaSession;
  if (!ms) return;
  const { song, playing, bpm } = useApp.getState();
  try {
    ms.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: `${bpm} BPM · GuitarBeats`,
    });
    ms.playbackState = playing ? "playing" : "paused";
  } catch {
    /* */
  }
}

export function bindRemote() {
  bindMedia();
  const applyUrl = () => {
    const cmd = new URLSearchParams(window.location.search).get("cmd");
    if (cmd) {
      run(cmd.toLowerCase());
      const url = new URL(window.location.href);
      url.searchParams.delete("cmd");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  };
  applyUrl();
  window.addEventListener("popstate", applyUrl);
}
