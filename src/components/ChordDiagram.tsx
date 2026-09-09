import { shapeFor } from "../data/shapes";

const STR = ["E", "A", "D", "G", "B", "e"];

export function ChordDiagram({ chord }: { chord: string }) {
  const s = shapeFor(chord);
  const maxFret = Math.max(3, ...s.frets.map((f) => f ?? 0));

  return (
    <div className="diagram">
      <p className="diagram-name">{chord}</p>
      <div className="fretboard" role="img" aria-label={`${chord} chord`}>
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
                  {here ? s.fingers[i] ?? "" : ""}
                </span>
              );
            })}
          </div>
        ))}
        <div className="nut labels">
          {STR.map((n) => <span key={n} className="open">{n}</span>)}
        </div>
      </div>
      <p className="hint">{s.tip}</p>
      <p className="hint">Right hand: down on 1 and 3, up on the ands. Follow the hat.</p>
    </div>
  );
}
