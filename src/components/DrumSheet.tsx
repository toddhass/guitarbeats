import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";
import "../kit.css";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

function on(pattern: Partial<Pattern>, voices: string[], step: number) {
  return voices.some((v) => hit(pattern[v], step) > 0);
}

const PADS: { id: string; label: string; voices: string[]; style: React.CSSProperties }[] = [
  { id: "hat", label: "Hats", voices: ["hat", "openHat"], style: { left: "2%", top: "8%", width: "18%", height: "28%" } },
  { id: "crash", label: "Crash", voices: ["crash"], style: { left: "22%", top: "0%", width: "22%", height: "22%" } },
  { id: "ride", label: "Ride", voices: ["ride", "cowbell"], style: { left: "70%", top: "4%", width: "26%", height: "24%" } },
  { id: "rack", label: "Toms", voices: ["tom", "highTom"], style: { left: "32%", top: "22%", width: "34%", height: "24%" } },
  { id: "snare", label: "Snare", voices: ["snare", "rim", "clap"], style: { left: "12%", top: "42%", width: "22%", height: "22%" } },
  { id: "floor", label: "Floor", voices: ["floor"], style: { left: "68%", top: "42%", width: "24%", height: "32%" } },
  { id: "kick", label: "Kick", voices: ["kick"], style: { left: "36%", top: "48%", width: "28%", height: "42%" } },
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
        <small>{feelLabel} · real kit · glow = hit</small>
      </p>
      <div className="kit-photo-wrap" role="img" aria-label="Drum kit">
        <img
          src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1400&q=80"
          alt="Drum kit"
          className="kit-photo"
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
      <p className="hint">Front kit photo. Pads light when that piece plays.</p>
    </div>
  );
}
