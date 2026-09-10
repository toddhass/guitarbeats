import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/store";
import { chordsFor } from "../data/chords";
import { withCapo } from "../data/capo";
import { STRUMS, StrumId } from "../data/strums";
import { ChordDiagram } from "./ChordDiagram";

const STRUM_KEY = "gb-strum";

export function PracticePanel() {
  const song = useApp((s) => s.song);
  const step = useApp((s) => s.step);
  const playing = useApp((s) => s.playing);
  const loopPart = useApp((s) => s.loopPart);
  const countIn = useApp((s) => s.countIn);
  const speed = useApp((s) => s.speed);
  const setLoopPart = useApp((s) => s.setLoopPart);
  const setCountIn = useApp((s) => s.setCountIn);
  const setSpeed = useApp((s) => s.setSpeed);
  const holdPause = useApp((s) => s.holdPause);
  const holdResume = useApp((s) => s.holdResume);
  const [capo, setCapo] = useState(0);
  const [strumId, setStrumId] = useState<StrumId>("eighths");
  const chords = chordsFor(song.id, song.feel);
  const timed = Math.floor(step / 4) % chords.length;
  const [held, setHeld] = useState<number | null>(null);
  const resumeAfter = useRef(false);
  const active = held ?? timed;
  const strum = STRUMS.find((s) => s.id === strumId) ?? STRUMS[0];

  useEffect(() => {
    const saved = localStorage.getItem(STRUM_KEY) as StrumId | null;
    if (saved && STRUMS.some((s) => s.id === saved)) setStrumId(saved);
  }, []);

  function pickStrum(id: StrumId) {
    setStrumId(id);
    localStorage.setItem(STRUM_KEY, id);
  }

  function toggleChord(i: number) {
    if (held === i) {
      setHeld(null);
      if (resumeAfter.current) {
        resumeAfter.current = false;
        holdResume();
      }
      return;
    }
    if (playing) {
      resumeAfter.current = true;
      holdPause();
    }
    setHeld(i);
  }

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
      <p className="label" style={{ marginTop: "0.85rem" }}>Capo</p>
      <div className="chips">
        {Array.from({ length: 8 }, (_, n) => (
          <button key={n} type="button" className={`chip${capo === n ? " on" : ""}`} onClick={() => setCapo(n)}>
            {n === 0 ? "Open" : String(n)}
          </button>
        ))}
      </div>
      <p className="label" style={{ marginTop: "0.85rem" }}>Strum</p>
      <div className="chips">
        {STRUMS.map((s) => (
          <button key={s.id} type="button" className={`chip${strumId === s.id ? " on" : ""}`} onClick={() => pickStrum(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="label" style={{ marginTop: "0.85rem" }}>Left hand — tap to hold and pause, tap again to go</p>
      <div className="chords">
        {chords.map((c, i) => (
          <button
            key={c + i}
            type="button"
            className={`chord${i === active ? " on" : ""}`}
            onClick={() => toggleChord(i)}
          >
            {withCapo(c, capo)}
          </button>
        ))}
      </div>
      <ChordDiagram chord={chords[active] ?? "G"} capo={capo} step={step} playing={playing} cells={strum.cells} />
    </section>
  );
}
