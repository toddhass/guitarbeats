import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";
import "../kit.css";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

function on(pattern: Partial<Pattern>, voices: string[], step: number) {
  return voices.some((v) => hit(pattern[v], step) > 0);
}

const PADS: { id: string; label: string; voices: string[]; style: React.CSSProperties }[] = [
  { id: "hat", label: "Hats", voices: ["hat", "openHat"], style: { left: "4%", top: "18%", width: "16%", height: "24%" } },
  { id: "crash", label: "Crash", voices: ["crash"], style: { left: "22%", top: "2%", width: "20%", height: "20%" } },
  { id: "ride", label: "Ride", voices: ["ride", "cowbell"], style: { left: "70%", top: "6%", width: "24%", height: "22%" } },
  { id: "rack", label: "Toms", voices: ["tom", "highTom"], style: { left: "34%", top: "16%", width: "32%", height: "24%" } },
  { id: "snare", label: "Snare", voices: ["snare", "rim", "clap"], style: { left: "16%", top: "42%", width: "20%", height: "22%" } },
  { id: "floor", label: "Floor", voices: ["floor"], style: { left: "68%", top: "44%", width: "22%", height: "28%" } },
  { id: "kick", label: "Kick", voices: ["kick"], style: { left: "36%", top: "46%", width: "28%", height: "38%" } },
];

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
  const now = playing ? step % 16 : -1;

  return (
    <div className="diagram drum-sheet">
      <p className="diagram-name">
        {part?.name ?? "Groove"}
        <small>{feelLabel} · full kit</small>
      </p>
      <div className="kit-photo-wrap" role="img" aria-label="Full drum kit">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pearl_Export_Series.jpg/1280px-Pearl_Export_Series.jpg?v=fullkit"
          alt="Full drum kit"
          className="kit-photo"
          onError={(e) => {
            e.currentTarget.src =
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Drum_kit_overview.JPG/1280px-Drum_kit_overview.JPG";
          }}
        />
        {PADS.map((p) => {
          const lit = now >= 0 && on(pattern, p.voices, now);
          return (
            <span
              key={p.id}
              className={`kit-pad kit-pad-${p.id}${lit ? " hit" : ""}`}
              style={p.style}
              data-label={p.label}
            />
          );
        })}
      </div>
      <div className="strum kit-beats">
        {BEATS.map((b, i) => (
          <span key={i} className={i === now ? "on" : ""}>
            {b}
          </span>
        ))}
      </div>
      <p className="hint">Entire kit in frame. Glow marks the hit.</p>
    </div>
  );
}
