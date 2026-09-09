import { useEffect, useState } from "react";
import { useApp } from "./state/store";
import { NowPlaying } from "./components/NowPlaying";
import { Transport } from "./components/Transport";
import { Library } from "./components/Library";

export default function App() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const [status] = useState("Ready");
  useEffect(() => { document.body.className = `pane-${tab}`; }, [tab]);
  return (
    <div className="wrap">
      <header>
        <div className="brand">GuitarBeats<small>Play along. Stay in the pocket.</small></div>
        <span className="badge">{status}</span>
      </header>
      <div className="player">
        <NowPlaying />
        <Transport />
      </div>
      <Library />
      <nav className="tabs">
        <button type="button" className={tab === "songs" ? "on" : ""} onClick={() => setTab("songs")}>Songs</button>
        <button type="button" className={tab === "track" ? "on" : ""} onClick={() => setTab("songs")}>Groove</button>
      </nav>
      <p className="foot">Software drum machine for guitarists.</p>
    </div>
  );
}
