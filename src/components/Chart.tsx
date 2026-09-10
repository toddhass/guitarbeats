import { chordsFor } from "../data/chords";
import { withCapo } from "../data/capo";
import { useApp } from "../state/store";

export function Chart({ capo }: { capo: number }) {
  const song = useApp((s) => s.song);
  const step = useApp((s) => s.step);
  const playing = useApp((s) => s.playing);
  const chords = chordsFor(song.id, song.feel).map((c) => withCapo(c, capo));
  const bar = Math.floor(step / 4) % chords.length;

  return (
    <div className="chart-block" style={{ marginTop: "1rem" }}>
      <p className="label">Chart</p>
      <p className="hint">Our lead sheet. Not a licensed official transcription.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
        {chords.map((c, i) => (
          <div
            key={c + i}
            style={{
              padding: "0.65rem 0.7rem",
              borderRadius: "0.5rem",
              background: playing && i === bar ? "var(--primary)" : "var(--secondary)",
              color: playing && i === bar ? "var(--primary-fg)" : "inherit",
            }}
          >
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Bar {i + 1}</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{c}</div>
            <div style={{ letterSpacing: "0.2em", fontSize: "0.85rem" }}>/ / / /</div>
          </div>
        ))}
      </div>
    </div>
  );
}
