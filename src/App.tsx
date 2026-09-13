import { useEffect, useState } from "react";
import { useApp } from "./state/store";
import { NowPlaying } from "./components/NowPlaying";
import { Transport } from "./components/Transport";
import { PracticePanel } from "./components/PracticePanel";
import { DrumPanel } from "./components/DrumPanel";
import { Library } from "./components/Library";
import { GroovePanel } from "./components/GroovePanel";
import { Splash } from "./components/Splash";
import { CoachBar } from "./components/CoachBar";
import { StartDock } from "./components/StartDock";
import { bindRemote, syncMediaSession } from "./remote";
import { useWakeLock } from "./hooks/useWakeLock";
import type { Tab } from "./state/tab-patch";

const TABS: { id: Tab; label: string }[] = [
  { id: "play", label: "Play" },
  { id: "practice", label: "Practice" },
  { id: "drums", label: "Drums" },
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
            <CoachBar compact />
            <Transport mode="play" />
          </div>
        )}

        {tab === "practice" && (
          <div className="pane pane-practice">
            <PracticePanel />
          </div>
        )}

        {tab === "drums" && (
          <div className="pane pane-drums">
            <DrumPanel />
            <GroovePanel />
            <Transport mode="kits" />
          </div>
        )}

        {tab === "songs" && (
          <div className="pane pane-songs">
            <Library />
          </div>
        )}

        <footer className="chrome">
          <StartDock />
          <nav className="tabs tabs-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? "on" : ""}
                onPointerDown={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}
