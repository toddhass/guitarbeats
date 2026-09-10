import { useEffect } from "react";
import { useApp } from "./state/store";
import { NowPlaying } from "./components/NowPlaying";
import { Transport } from "./components/Transport";
import { PracticePanel } from "./components/PracticePanel";
import { Library } from "./components/Library";
import { GroovePanel } from "./components/GroovePanel";
import { bindRemote, syncMediaSession } from "./remote";

export default function App() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const playing = useApp((s) => s.playing);
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);

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
        <PracticePanel />
      </div>

      <Library />
      <GroovePanel />

      <nav className="tabs">
        <button type="button" className={tab === "songs" ? "on" : ""} onPointerDown={(e) => { e.preventDefault(); setTab("songs"); }}>Songs</button>
        <button type="button" className={tab === "track" ? "on" : ""} onPointerDown={(e) => { e.preventDefault(); setTab("track"); }}>Groove</button>
      </nav>

      <p className="foot">AirPods play/pause works after Start. Siri Shortcuts can open ?cmd=start or ?cmd=stop.</p>
    </div>
  );
}
