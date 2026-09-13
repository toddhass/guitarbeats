import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";
import "../kit.css";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

function on(pattern: Partial<Pattern>, voices: string[], step: number) {
  return voices.some((v) => hit(pattern[v], step) > 0);
}

const PADS: { id: string; label: string; voices: string[]; style: React.CSSProperties }[] = [
  { id: "hat", label: "Hats", voices: ["hat", "openHat"], style: { left: "2%", top: "28%", width: "16%", height: "22%" } },
  { id: "crash", label: "Crash", voices: ["crash"], style: { left: "16%", top: "2%", width: "20%", height: "20%" } },
  { id: "ride", label: "Ride", voices: ["ride", "cowbell"], style: { left: "68%", top: "4%", width: "24%", height: "20%" } },
  { id: "rack", label: "Toms", voices: ["tom", "highTom"], style: { left: "34%", top: "18%", width: "30%", height: "22%" } },
  { id: "snare", label: "Snare", voices: ["snare", "rim", "clap"], style: { left: "16%", top: "48%", width: "20%", height: "20%" } },
  { id: "floor", label: "Floor", voices: ["floor"], style: { left: "68%", top: "48%", width: "20%", height: "24%" } },
  { id: "kick", label: "Kick", voices: ["kick"], style: { left: "36%", top: "52%", width: "28%", height: "36%" } },
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
      <div className="kit-photo-wrap" role="img" aria-label="Full drum kit front view">
        <svg className="kit-svg" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="400" fill="#e9e9e9" />
          <ellipse cx="318" cy="292" rx="92" ry="86" fill="#1a1a1a" />
          <ellipse cx="318" cy="292" rx="74" ry="68" fill="#f3f3f3" stroke="#bbb" strokeWidth="6" />
          <rect x="88" y="148" width="8" height="170" fill="#c9c9c9" />
          <rect x="548" y="128" width="8" height="190" fill="#c9c9c9" />
          <ellipse cx="118" cy="148" rx="58" ry="14" fill="#d7c07a" stroke="#8a7a3a" />
          <ellipse cx="118" cy="148" rx="46" ry="8" fill="#eee8c8" />
          <ellipse cx="168" cy="78" rx="70" ry="16" fill="#d7c07a" stroke="#8a7a3a" />
          <ellipse cx="168" cy="78" rx="56" ry="9" fill="#eee8c8" />
          <ellipse cx="500" cy="88" rx="78" ry="18" fill="#d7c07a" stroke="#8a7a3a" />
          <ellipse cx="500" cy="88" rx="62" ry="10" fill="#eee8c8" />
          <ellipse cx="278" cy="168" rx="42" ry="28" fill="#c9a36a" stroke="#6b4e2a" strokeWidth="4" />
          <ellipse cx="278" cy="158" rx="36" ry="16" fill="#f4f4f4" />
          <ellipse cx="358" cy="168" rx="46" ry="30" fill="#c9a36a" stroke="#6b4e2a" strokeWidth="4" />
          <ellipse cx="358" cy="158" rx="38" ry="16" fill="#f4f4f4" />
          <ellipse cx="188" cy="248" rx="48" ry="28" fill="#d8d8d8" stroke="#888" strokeWidth="4" />
          <ellipse cx="188" cy="238" rx="40" ry="16" fill="#fafafa" />
          <ellipse cx="458" cy="258" rx="50" ry="36" fill="#c9a36a" stroke="#6b4e2a" strokeWidth="4" />
          <ellipse cx="458" cy="246" rx="42" ry="16" fill="#f4f4f4" />
        </svg>
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
      <p className="hint">Whole kit in frame from the front. Glow marks the hit.</p>
      <div className="strum kit-beats">
        {BEATS.map((b, i) => (
          <span key={i} className={i === now ? "on" : ""}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
