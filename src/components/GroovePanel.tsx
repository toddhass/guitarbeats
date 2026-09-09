import { useApp } from "../state/store";
import { STYLES } from "../data/grooves";

export function GroovePanel() {
  const song = useApp((s) => s.song);
  const selectFeel = useApp((s) => s.selectFeel);
  const bpm = useApp((s) => s.bpm);
  const setBpm = useApp((s) => s.setBpm);

  return (
    <div className="card rail rail-groove">
      <p className="kicker">Groove</p>
      <p className="hint">Pick a feel. Tempo stays on the sliders above.</p>
      <div className="chips">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip${song.feel === s.id ? " on" : ""}`}
            onPointerDown={() => selectFeel(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="sliders" style={{ marginTop: "1rem" }}>
        <label className="sl">
          Tempo
          <input type="range" min={40} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
          <span>{bpm}</span>
        </label>
      </div>
    </div>
  );
}
