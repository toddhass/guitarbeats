import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

const ROWS: { id: string; label: string; mark: string; cls: string }[] = [
  { id: "crash", label: "Crash", mark: "×", cls: "v-crash" },
  { id: "openHat", label: "Open hat", mark: "o", cls: "v-oh" },
  { id: "hat", label: "Hi-hat", mark: "×", cls: "v-hat" },
  { id: "ride", label: "Ride", mark: "×", cls: "v-ride" },
  { id: "cowbell", label: "Cowbell", mark: "▲", cls: "v-bell" },
  { id: "clap", label: "Clap", mark: "◇", cls: "v-clap" },
  { id: "rim", label: "Rim", mark: "○", cls: "v-rim" },
  { id: "snare", label: "Snare", mark: "●", cls: "v-snare" },
  { id: "highTom", label: "High tom", mark: "●", cls: "v-tom" },
  { id: "tom", label: "Tom", mark: "●", cls: "v-tom" },
  { id: "floor", label: "Floor", mark: "●", cls: "v-floor" },
  { id: "kick", label: "Kick", mark: "●", cls: "v-kick" },
];

const ALWAYS = new Set(["hat", "snare", "kick"]);

function usedRows(pattern: Partial<Pattern>) {
  return ROWS.filter((row) => {
    if (ALWAYS.has(row.id)) return true;
    const track = pattern[row.id];
    if (!track) return false;
    return /[123]/.test(track);
  });
}

export function DrumSheet({
  part,
  step,
  playing,
  feelLabel,
}: {
  part: SongPart | undefined;
  step: number;
  playing: boolean;
  feelLabel: string;
}) {
  const pattern = part?.groove ?? {};
  const rows = usedRows(pattern);
  const now = playing ? step % 16 : -1;

  return (
    <div className="diagram drum-sheet">
      <p className="diagram-name">
        {part?.name ?? "Groove"}
        <small>{feelLabel} · one bar · 16ths</small>
      </p>
      <div className="drum-staff" role="img" aria-label={`${part?.name ?? "Groove"} drum pattern`}>
        <div className="drum-head">
          <span className="drum-lab" />
          {BEATS.map((b, i) => (
            <span key={i} className={`drum-beat${i === now ? " on" : ""}${i % 4 === 0 ? " down" : ""}`}>
              {b}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.id} className="drum-line">
            <span className="drum-lab">{row.label}</span>
            {Array.from({ length: 16 }, (_, i) => {
              const v = hit(pattern[row.id], i);
              const ghost = v > 0 && v < 0.55;
              const on = v > 0;
              return (
                <span
                  key={i}
                  className={`drum-cell${i === now ? " now" : ""}${i % 4 === 0 ? " down" : ""}`}
                >
                  {on ? (
                    <b className={`${row.cls}${ghost ? " ghost" : ""}`}>{row.mark}</b>
                  ) : null}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="fingers-key drum-key" aria-hidden="true">
        <span className="v-hat">× cymbal</span>
        <span className="v-snare">● drum</span>
        <span className="v-kick">kick</span>
        <span className="v-bell">ghost = light</span>
      </p>
      <p className="hint">Read left to right like the guitar strum boxes. The lit column is the beat that is playing.</p>
    </div>
  );
}
