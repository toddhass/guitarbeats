import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

function on(pattern: Partial<Pattern>, voices: string[], step: number) {
  return voices.some((v) => hit(pattern[v], step) > 0);
}

const PADS: { id: string; label: string; voices: string[]; style: React.CSSProperties }[] = [
  { id: "hat", label: "Hats", voices: ["hat", "openHat"], style: { left: "6%", top: "18%", width: "22%", height: "22%" } },
  { id: "crash", label: "Crash", voices: ["crash"], style: { left: "28%", top: "4%", width: "24%", height: "20%" } },
  { id: "ride", label: "Ride", voices: ["ride", "cowbell"], style: { left: "68%", top: "10%", width: "26%", height: "24%" } },
  { id: "rack", label: "Toms", voices: ["tom", "highTom"], style: { left: "36%", top: "28%", width: "32%", height: "22%" } },
  { id: "snare", label: "Snare", voices: ["snare", "rim", "clap"], style: { left: "16%", top: "46%", width: "26%", height: "22%" } },
  { id: "floor", label: "Floor", voices: ["floor"], style: { left: "62%", top: "48%", width: "24%", height: "24%" } },
  { id: "kick", label: "Kick", voices: ["kick"], style: { left: "34%", top: "58%", width: "30%", height: "32%" } },
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
        <img src="/splash.jpg" alt="Drum kit" className="kit-photo" />
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
      <p className="hint">The photo is the kit. A pad lights when that drum or cymbal plays.</p>
    </div>
  );
}
