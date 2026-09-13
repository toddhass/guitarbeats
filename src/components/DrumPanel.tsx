import { useApp } from "../state/store";
import { LABELS } from "../data/grooves";
import { DrumSheet } from "./DrumSheet";

export function DrumPanel() {
  const song = useApp((s) => s.song);
  const step = useApp((s) => s.step);
  const playing = useApp((s) => s.playing);
  const partName = useApp((s) => s.partName);
  const selectPart = useApp((s) => s.selectPart);
  const part = song.parts.find((p) => p.name === partName) || song.parts[0];

  return (
    <section className="card practice">
      <p className="kicker">Pattern</p>
      <p className="hint">{LABELS[song.feel]} · {part?.name || "Intro"}</p>
      <div className="chords" style={{ gridTemplateColumns: "1fr 1fr" }}>
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
