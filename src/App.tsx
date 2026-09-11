import { useEffect, useState } from "react";
import { useApp } from "./state/store";
import { NowPlaying } from "./components/NowPlaying";
import { Transport } from "./components/Transport";
import { PracticePanel } from "./components/PracticePanel";
import { Library } from "./components/Library";
import { GroovePanel } from "./components/GroovePanel";
import { Splash } from "./components/Splash";
import { bindRemote, syncMediaSession } from "./remote";
import { useWakeLock } from "./hooks/useWakeLock";
import type { Tab } from "./state/tab-patch";

const TABS: { id: Tab; label: string }[] = [
  { id: "songs", label: "Songs" },
  { id: "play", label: "Play" },
  { id: "practice", label: "Practice" },
  { id: "songs", label: "Songs" },
];

export default function App() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const playing = useApp((s) => s.playing);
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);
  const [splash, setSplash] = useState(true);

  useWakeLock(playing);

  useEffect(() => {
    document.body.className = `pane-${tab}`;
  }, [tab]);

  useEffect(() => {
    bindRemote();
  }, []);

  useEffect(() => {
    syncMediaSession();
  }, [playing, song, bpm]);

  function go(id: Tab) {
    setTab(id);
  }

  return (
    <>
      {splash && <Splash onDone={() => setSplash(false)} />}
      <div className={`wrap pane-${tab}`}>
        <header>
          <div className="brand">
            GuitarBeats
            <small>Play along. Stay in the pocket.</small>
          </div>
          <span className={`badge${playing ? " on" : ""}`}>{playing ? "Playing" : "Ready"}</span>
        </header>

        {tab === "play" && (
          <div className="pane pane-play">
            <NowPlaying />
            <Transport mode="play" />
          </div>
        )}

        {tab === "practice" && (
          <div className="pane pane-practice">
            <PracticePanel />
            <GroovePanel />
            <Transport mode="kits" />
          </div>
        )}

        {tab === "songs" && (
          <div className="pane pane-songs">
            <Library />
          </div>
        )}

        <nav className="tabs tabs-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "on" : ""}
              onPointerDown={() => go(t.id)}
              onClick={() => go(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
