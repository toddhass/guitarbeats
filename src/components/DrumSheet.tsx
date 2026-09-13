import { useState } from "react";
import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";
import { KIT_SRC } from "../assets/kitPhoto";
import "../kit.css";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

function on(pattern: Partial<Pattern>, voices: string[], step: number) {
  return voices.some((v) => hit(pattern[v], step) > 0);
}

const PADS: { id: string; label: string; voices: string[]; style: React.CSSProperties }[] = [
  { id: "hat", label: "Hats", voices: ["hat", "openHat"], style: { left: "1%", top: "36%", width: "20%", height: "18%" } },
  { id: "crash", label: "Crash", voices: ["crash"], style: { left: "16%", top: "6%", width: "24%", height: "20%" } },
  { id: "ride", label: "Ride", voices: ["ride", "cowbell"], style: { left: "52%", top: "6%", width: "24%", height: "20%" } },
  { id: "crash2", label: "Crash R", voices: ["crash"], style: { left: "70%", top: "28%", width: "26%", height: "20%" } },
  { id: "rack", label: "Toms", voices: ["tom", "highTom"], style: { left: "32%", top: "28%", width: "32%", height: "22%" } },
  { id: "snare", label: "Snare", voices: ["snare", "rim", "clap"], style: { left: "20%", top: "50%", width: "24%", height: "20%" } },
  { id: "floor", label: "Floor", voices: ["floor"], style: { left: "54%", top: "50%", width: "26%", height: "28%" } },
  { id: "kick", label: "Kick", voices: ["kick"], style: { left: "36%", top: "52%", width: "24%", height: "34%" } },
];

function KitFallback() {
  return (
    <svg className="kit-svg" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="400" fill="#f3f3f3" />
      <text x="320" y="210" textAnchor="middle" fill="#888" fontSize="16">
        Add public/kit.jpg — the white DW photo
      </text>
    </svg>
  );
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
  const now = playing ? step % 16 : -1;
  const [ok, setOk] = useState(true);

  return (
    <div className="diagram drum-sheet">
      <p className="diagram-name">
        {part?.name ?? "Groove"}
        <small>{feelLabel} · full kit</small>
      </p>
      <div className="kit-photo-wrap" role="img" aria-label="Full drum kit">
        {ok ? (
          <img
            src={KIT_SRC}
            alt="Full drum kit"
            className="kit-photo"
            onError={() => setOk(false)}
          />
        ) : (
          <KitFallback />
        )}
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
      <p className="hint">Drop the DW photo in the repo as public/kit.jpg</p>
    </div>
  );
}
