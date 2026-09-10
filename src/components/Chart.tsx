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
    <section className="card chart">
      <p className="kicker">Chart</p>
      <p className="hint">GuitarBeats lead sheet — original chart, not a licensed official tab.</p>
      <div className="measures">
        {chords.map((c, i) => (
          <div key={c + i} className={`measure${playing && i === bar ? " on" : ""}`}>
            <span className="bar-num">{i + 1}</span>
            <strong>{c}</strong>
            <span className="slash">/ / / /</span>
          </div>
        ))}
      </div>
    </section>
  );
}
