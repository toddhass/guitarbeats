import { useApp } from "../state/store";
import { LABELS } from "../data/grooves";
import { DrumSheet } from "./DrumSheet";

export function DrumPanel() {
  const song = useApp((s) => s.song);
  const step = useApp((s) => s.step);
  const playing = useApp((s) => s.playing);
  const partName = useApp((s) => s.partName);
  const loopPart = useApp((s) => s.loopPart);
  const countIn = useApp((s) => s.countIn);
  const speed = useApp((s) => s.speed);
  const setLoopPart = useApp((s) => s.setLoopPart);
  const setCountIn = useApp((s) => s.setCountIn);
  const setSpeed = useApp((s) => s.setSpeed);
  const selectPart = useApp((s) => s.selectPart);
  const part = song.parts.find((p) => p.name === partName) ?? song.parts[0];

  return (
    <section className="card practice">
      <p className="kicker">Drums</p>
      <p className="hint">Same pocket as Play. Notes are the kit pattern for this part.</p>
      <div className="chips">
        <button type="button" className={`chip${countIn ? " on" : ""}`} onClick={() => setCountIn(!countIn)}>Count-in</button>
        <button type="button" className={`chip${loopPart ? " on" : ""}`} onClick={() => setLoopPart(!loopPart)}>Loop part</button>
        <button type="button" className={`chip${speed === 0.5 ? " on" : ""}`} onClick={() => setSpeed(0.5)}>Half</button>
        <button type="button" className={`chip${speed === 0.7 ? " on" : ""}`} onClick={() => setSpeed(0.7)}>Slow</button>
        <button type="button" className={`chip${speed === 1 ? " on" : ""}`} onClick={() => setSpeed(1)}>Full</button>
      </div>
      <p className="label" style={{ marginTop: "0.85rem" }}>Part — tap like a chord</p>
      <div className="chords">
        {song.parts.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`chord${p.name === part?.name ? " on" : ""}`}
            onClick={() => selectPart(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <DrumSheet part={part} step={step} playing={playing} feelLabel={LABELS[song.feel] ?? song.feel} />
    </section>
  );
}
