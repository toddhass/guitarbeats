import { useApp } from "../state/store";
import { NowPlaying } from "../components/NowPlaying";
import { Transport } from "../components/Transport";

export function PlayPage() {
  const playing = useApp((s) => s.playing);
  return (
    <div className="page page-play">
      <div className="page-head stage-head">
        <p className="page-kicker">Stage</p>
        <h1>Play</h1>
        <span className={`live-dot${playing ? " on" : ""}`}>{playing ? "Live" : "Armed"}</span>
      </div>
      <NowPlaying />
      <Transport mode="play" />
    </div>
  );
}
