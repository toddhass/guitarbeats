import { shapeFor } from "../data/shapes";
import { withCapo } from "../data/capo";
import { BEAT_LABELS, Stroke, strokeMark } from "../data/strums";

const STR = ["E", "A", "D", "G", "B", "e"];

export function ChordDiagram({
  chord,
  capo,
  step,
  playing,
  cells,
}: {
  chord: string;
  capo: number;
  step: number;
  playing: boolean;
  cells: Stroke[];
}) {
  const s = shapeFor(chord);
  const shown = withCapo(chord, capo);
  const maxFret = Math.max(3, ...s.frets.map((f) => f ?? 0));
  const hit = playing ? Math.floor(step / 2) % 8 : -1;

  return (
    <div className="diagram">
      <p className="diagram-name">
        {shown}
        {capo > 0 && <small>{chord} shape · capo {capo}</small>}
      </p>
      <div className="fretboard" role="img" aria-label={`${shown} chord`}>
        <div className="nut">
          {s.frets.map((f, i) => (
            <span key={i} className="open">{f === null ? "x" : f === 0 ? "o" : ""}</span>
          ))}
        </div>
        {Array.from({ length: maxFret }, (_, fret) => (
          <div key={fret} className="fret-row">
            {s.frets.map((f, i) => {
              const here = f === fret + 1;
              const finger = s.fingers[i];
              return (
                <span key={i} className={`cell${here ? " dot f" + (finger ?? "") : ""}`}>
                  {here ? <b>{finger ?? ""}</b> : null}
                </span>
              );
            })}
          </div>
        ))}
        <div className="nut labels">
          {STR.map((n) => <span key={n} className="open">{n}</span>)}
        </div>
      </div>
      <p className="fingers-key" aria-hidden="true">
        <span className="f1">1 index</span>
        <span className="f2">2 middle</span>
        <span className="f3">3 ring</span>
        <span className="f4">4 pinky</span>
      </p>
      <p className="hint">{s.tip}{capo > 0 ? ` Keep this shape. Sounding pitch is ${shown}.` : ""}</p>
      <p className="label">Right hand</p>
      <div className="strum">
        {cells.map((stroke, i) => (
          <span key={i} className={i === hit ? "on" : ""}>
            {BEAT_LABELS[i]} {strokeMark(stroke)}
          </span>
        ))}
      </div>
    </div>
  );
}
