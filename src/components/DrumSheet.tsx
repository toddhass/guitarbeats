import { hit } from "../data/grooves";
import type { Pattern, SongPart } from "../data/grooves";

const BEATS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];

function on(pattern: Partial<Pattern>, voices: string[], step: number) {
  return voices.some((v) => hit(pattern[v], step) > 0);
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
  const hat = now >= 0 && on(pattern, ["hat", "openHat"], now);
  const crash = now >= 0 && on(pattern, ["crash"], now);
  const ride = now >= 0 && on(pattern, ["ride", "cowbell"], now);
  const snare = now >= 0 && on(pattern, ["snare", "rim", "clap"], now);
  const rack = now >= 0 && on(pattern, ["tom", "highTom"], now);
  const floor = now >= 0 && on(pattern, ["floor"], now);
  const kick = now >= 0 && on(pattern, ["kick"], now);
  const pedal = hat && now % 2 === 0;

  return (
    <div className="diagram drum-sheet">
      <p className="diagram-name">
        {part?.name ?? "Groove"}
        <small>{feelLabel} · pieces flash on the hit</small>
      </p>
      <div className="kit-stage" role="img" aria-label="Drum kit notation">
        <svg viewBox="0 0 360 240" className="kit-svg">
          <g className="staff" stroke="#1a1a1a" strokeWidth="2.2" fill="none">
            <line x1="8" y1="52" x2="352" y2="52" />
            <line x1="8" y1="84" x2="352" y2="84" />
            <line x1="8" y1="116" x2="352" y2="116" />
            <line x1="8" y1="148" x2="352" y2="148" />
            <line x1="8" y1="180" x2="352" y2="180" />
          </g>

          <g className={`piece hat${hat ? " hit" : ""}`}>
            <line x1="62" y1="58" x2="62" y2="188" stroke="#3b82f6" strokeWidth="3" />
            <polygon points="52,188 72,188 78,208 46,208" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
            <ellipse cx="62" cy="52" rx="28" ry="16" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M48 44 L76 60 M76 44 L48 60" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          </g>

          <g className={`piece pedal${pedal || kick ? " hit" : ""}`}>
            <path d="M48 214 L62 188 L76 214" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <path d="M40 208 L84 218" stroke="#111" strokeWidth="6" strokeLinecap="round" />
          </g>

          <g className={`piece crash${crash ? " hit" : ""}`}>
            <line x1="168" y1="40" x2="168" y2="92" stroke="#3b82f6" strokeWidth="3" />
            <ellipse cx="168" cy="34" rx="36" ry="18" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M150 26 L186 42 M186 26 L150 42" stroke="#111" strokeWidth="5.5" strokeLinecap="round" />
          </g>

          <g className={`piece ride${ride ? " hit" : ""}`}>
            <line x1="292" y1="58" x2="292" y2="188" stroke="#3b82f6" strokeWidth="3" />
            <polygon points="282,188 302,188 308,208 276,208" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
            <ellipse cx="300" cy="58" rx="34" ry="20" transform="rotate(-18 300 58)" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M284 48 L316 68 M318 50 L282 66" stroke="#111" strokeWidth="5.5" strokeLinecap="round" />
          </g>

          <g className={`piece kick${kick ? " hit" : ""}`}>
            <ellipse cx="168" cy="168" rx="52" ry="48" fill="#60a5fa" stroke="#2563eb" strokeWidth="2.6" />
            <ellipse cx="168" cy="168" rx="16" ry="12" fill="#0f172a" />
            <rect x="160" y="200" width="16" height="18" rx="3" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
          </g>

          <g className={`piece snare${snare ? " hit" : ""}`}>
            <ellipse cx="112" cy="128" rx="28" ry="16" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M84 128 v18 a28 12 0 0 0 56 0 v-18" fill="#3b82f6" stroke="#2563eb" strokeWidth="2.2" />
            <ellipse cx="112" cy="128" rx="14" ry="9" fill="#0f172a" />
          </g>

          <g className={`piece rack${rack ? " hit" : ""}`}>
            <ellipse cx="168" cy="96" rx="24" ry="14" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M144 96 v16 a24 11 0 0 0 48 0 v-16" fill="#3b82f6" stroke="#2563eb" strokeWidth="2.2" />
            <ellipse cx="168" cy="96" rx="12" ry="8" fill="#0f172a" />
            <ellipse cx="214" cy="108" rx="22" ry="13" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M192 108 v15 a22 10 0 0 0 44 0 v-15" fill="#3b82f6" stroke="#2563eb" strokeWidth="2.2" />
            <ellipse cx="214" cy="108" rx="11" ry="7" fill="#0f172a" />
          </g>

          <g className={`piece floor${floor ? " hit" : ""}`}>
            <line x1="246" y1="168" x2="238" y2="210" stroke="#3b82f6" strokeWidth="3" />
            <line x1="268" y1="168" x2="276" y2="210" stroke="#3b82f6" strokeWidth="3" />
            <ellipse cx="256" cy="148" rx="26" ry="15" fill="#93c5fd" stroke="#2563eb" strokeWidth="2.4" />
            <path d="M230 148 v22 a26 12 0 0 0 52 0 v-22" fill="#3b82f6" stroke="#2563eb" strokeWidth="2.2" />
            <ellipse cx="256" cy="148" rx="13" ry="8" fill="#0f172a" />
          </g>
        </svg>
      </div>
      <div className="strum kit-beats">
        {BEATS.map((b, i) => (
          <span key={i} className={i === now ? "on" : ""}>
            {b}
          </span>
        ))}
      </div>
      <p className="hint">X is a cymbal. Black oval is a drum. The piece jumps when that voice plays.</p>
    </div>
  );
}
