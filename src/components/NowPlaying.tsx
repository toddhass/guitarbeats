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

  return (
    <section className="card now">
      <p className="kicker">Now</p>
      <h2>{song.title}</h2>
      <p className="who">{song.artist}</p>
      <dl className="meta">
        <div><dt>Part</dt><dd>{partName || "Intro"}</dd></div>
        <div><dt>Bar</dt><dd>{barInPart || 1}/{barsInPart || 1}</dd></div>
        <div><dt>Tempo</dt><dd>{bpm}{conductorOn ? "" : ""}</dd></div>
      </dl>
      <p className="conductor-meta">
        {LABELS[song.feel]}
        {nextName ? ` · next ${nextName}` : ""}
      </p>
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
