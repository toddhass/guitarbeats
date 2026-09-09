import { useState } from "react";
import { useApp } from "../state/store";
import { chordsFor } from "../data/chords";
import { ChordDiagram } from "./ChordDiagram";

export function PracticePanel() {
  const song = useApp((s) => s.song);
  const step = useApp((s) => s.step);
  const loopPart = useApp((s) => s.loopPart);
  const countIn = useApp((s) => s.countIn);
  const speed = useApp((s) => s.speed);
  const setLoopPart = useApp((s) => s.setLoopPart);
  const setCountIn = useApp((s) => s.setCountIn);
  const setSpeed = useApp((s) => s.setSpeed);
  const chords = chordsFor(song.id, song.feel);
  const timed = Math.floor(step / 4) % chords.length;
  const [held, setHeld] = useState<number | null>(null);
  const active = held ?? timed;

  return (
    <section className="card practice">
      <p className="kicker">Practice</p>
      <div className="chips">
        <button type="button" className={`chip${countIn ? " on" : ""}`} onClick={() => setCountIn(!countIn)}>Count-in</button>
        <button type="button" className={`chip${loopPart ? " on" : ""}`} onClick={() => setLoopPart(!loopPart)}>Loop part</button>
        <button type="button" className={`chip${speed === 0.5 ? " on" : ""}`} onClick={() => setSpeed(0.5)}>Half</button>
        <button type="button" className={`chip${speed === 0.7 ? " on" : ""}`} onClick={() => setSpeed(0.7)}>Slow</button>
        <button type="button" className={`chip${speed === 1 ? " on" : ""}`} onClick={() => setSpeed(1)}>Full</button>
      </div>
      <p className="label" style={{ marginTop: "0.85rem" }}>Left hand — tap a chord to hold the shape</p>
      <div className="chords">
        {chords.map((c, i) => (
          <button
            key={c + i}
            type="button"
            className={`chord${i === active ? " on" : ""}`}
            onClick={() => setHeld(held === i ? null : i)}
          >
            {c}
          </button>
        ))}
      </div>
      <ChordDiagram chord={chords[active] ?? "G"} />
    </section>
  );
}
