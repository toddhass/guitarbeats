import { useApp } from "../state/store";
import { LABELS } from "../data/grooves";
import "./conductor.css";

export function NowPlaying() {
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);
  const step = useApp((s) => s.step);
  const partName = useApp((s) => s.partName);
  const playing = useApp((s) => s.playing);
  const conductorOn = useApp((s) => s.conductorOn);
  const barInPart = useApp((s) => s.barInPart);
  const barsInPart = useApp((s) => s.barsInPart);
  const nextName = useApp((s) => s.nextName);
  const setConductorOn = useApp((s) => s.setConductorOn);

  return (
    <section className="card now">
      <p className="kicker">Now playing</p>
      <h2>{song.title}</h2>
      <p className="who">{song.artist}</p>
      <dl className="meta">
        <div><dt>Groove</dt><dd>{LABELS[song.feel]}</dd></div>
        <div><dt>Part</dt><dd>{partName || "Intro"}</dd></div>
        <div><dt>Tempo</dt><dd>{bpm}{conductorOn ? " lock" : ""}</dd></div>
      </dl>
      <div className="conductor">
        <button
          type="button"
          className={`chip${conductorOn ? " on" : ""}`}
          onPointerDown={() => setConductorOn(!conductorOn)}
        >
          {conductorOn ? "Conductor on" : "Conductor off"}
        </button>
        <span className="conductor-meta">
          {conductorOn
            ? `${song.chartSource === "chart" ? "Song form" : "Form template"} · bar ${barInPart || 1}/${barsInPart || 1}${nextName ? ` · next ${nextName}` : ""}`
            : "Free groove — tempo and form are yours"}
        </span>
      </div>
      <div className="steps">
        <div className="beat">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className={`step${playing && i === step ? " on" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
