import { useApp } from "../state/store";
import { chordsFor } from "../data/chords";

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
  const active = Math.floor(step / 4) % chords.length;

  return (
    <section className="card practice">
      <p className="kicker">Practice</p>
      <p className="hint">Off by default. Turn on what you need. Revert commit to remove this panel.</p>
      <div className="chips">
        <button type="button" className={`chip${countIn ? " on" : ""}`} onClick={() => setCountIn(!countIn)}>Count-in</button>
        <button type="button" className={`chip${loopPart ? " on" : ""}`} onClick={() => setLoopPart(!loopPart)}>Loop part</button>
        <button type="button" className={`chip${speed === 0.5 ? " on" : ""}`} onClick={() => setSpeed(0.5)}>Half</button>
        <button type="button" className={`chip${speed === 0.7 ? " on" : ""}`} onClick={() => setSpeed(0.7)}>Slow</button>
        <button type="button" className={`chip${speed === 1 ? " on" : ""}`} onClick={() => setSpeed(1)}>Full</button>
      </div>
      <p className="label" style={{ marginTop: "0.85rem" }}>Chords</p>
      <div className="chords">
        {chords.map((c, i) => (
          <span key={c + i} className={`chord${i === active ? " on" : ""}`}>{c}</span>
        ))}
      </div>
    </section>
  );
}
