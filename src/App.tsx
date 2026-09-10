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

const TABS = [
  { id: "play" as const, label: "Play" },
  { id: "practice" as const, label: "Practice" },
  { id: "songs" as const, label: "Songs" },
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

        <div className="pane pane-play">
          <NowPlaying />
          <Transport mode="play" />
        </div>

        <div className="pane pane-practice">
          <PracticePanel />
          <GroovePanel />
          <Transport mode="kits" />
        </div>

        <div className="pane pane-songs">
          <Library />
        </div>

        <nav className="tabs tabs-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "on" : ""}
              onPointerDown={(e) => {
                e.preventDefault();
                setTab(t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
