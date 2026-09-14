import { useApp } from "../state/store";
import { NowPlaying } from "../components/NowPlaying";
import { Waveform } from "../components/Waveform";
import { Transport } from "../components/Transport";

export function PlayPage() {
  const playing = useApp((s) => s.playing);
  const song = useApp((s) => s.song);
  const partName = useApp((s) => s.partName);
  const selectPart = useApp((s) => s.selectPart);

  return (
    <div className="page page-play">
      <div className="page-head stage-head">
        <p className="page-kicker">Stage</p>
        <h1>Play</h1>
        <span className={`live-dot${playing ? " on" : ""}`}>{playing ? "Live" : "Armed"}</span>
      </div>
      <NowPlaying />
      <Waveform />
      <section className="card">
        <p className="kicker">Form</p>
        <div className="chips form-map">
          {song.parts.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`chip${p.name === partName ? " on" : ""}`}
              onPointerDown={() => selectPart(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>
      <Transport mode="play" />
    </div>
  );
}
