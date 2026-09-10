import { shapeFor } from "../data/shapes";
import { withCapo } from "../data/capo";

const STR = ["E", "A", "D", "G", "B", "e"];
const STRUM = ["1 \u2193", "& \u2191", "2 \u2193", "& \u2191", "3 \u2193", "& \u2191", "4 \u2193", "& \u2191"];

export function ChordDiagram({
  chord,
  capo,
  step,
  playing,
}: {
  chord: string;
  capo: number;
  step: number;
  playing: boolean;
}) {
  const s = shapeFor(chord);
  const shown = withCapo(chord, capo);
  const maxFret = Math.max(3, ...s.frets.map((f) => f ?? 0));
  const hit = playing ? Math.floor(step / 2) % 8 : -1;

  return (
    <div className="diagram">
      <p className="diagram-name">
        {shown}
        {capo > 0 && <small> {chord} shape \u00b7 capo {capo}</small>}
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
              return (
                <span key={i} className={`cell${here ? " dot" : ""}`}>
                  {here ? <b>{s.fingers[i] ?? ""}</b> : null}
                </span>
              );
            })}
          </div>
        ))}
        <div className="nut labels">
          {STR.map((n) => <span key={n} className="open">{n}</span>)}
        </div>
      </div>
      <p className="hint">{s.tip}{capo > 0 ? ` Keep this shape. Sounding pitch is ${shown}.` : ""}</p>
      <p className="label">Right hand</p>
      <div className="strum">
        {STRUM.map((label, i) => (
          <span key={label} className={i === hit ? "on" : ""}>{label}</span>
        ))}
      </div>
    </div>
  );
}
