import { useEffect } from "react";
import { useApp } from "./state/store";
import { NowPlaying } from "./components/NowPlaying";
import { Transport } from "./components/Transport";
import { Library } from "./components/Library";
import { GroovePanel } from "./components/GroovePanel";

export default function App() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const playing = useApp((s) => s.playing);

  useEffect(() => {
    document.body.className = `pane-${tab}`;
  }, [tab]);

  return (
    <div className={`wrap pane-${tab}`}>
      <header>
        <div className="brand">
          GuitarBeats
          <small>Play along. Stay in the pocket.</small>
        </div>
        <span className={`badge${playing ? " on" : ""}`}>{playing ? "Playing" : "Ready"}</span>
      </header>

      <div className="player">
        <NowPlaying />
        <Transport />
      </div>

      <Library />
      <GroovePanel />

      <nav className="tabs">
        <button
          type="button"
          className={tab === "songs" ? "on" : ""}
          onPointerDown={(e) => { e.preventDefault(); setTab("songs"); }}
        >
          Songs
        </button>
        <button
          type="button"
          className={tab === "track" ? "on" : ""}
          onPointerDown={(e) => { e.preventDefault(); setTab("track"); }}
        >
          Groove
        </button>
      </nav>

      <p className="foot">Tap Start, then Fill / Next / Crash — they fire on the tap.</p>
    </div>
  );
}
