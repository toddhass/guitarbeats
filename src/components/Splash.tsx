import { useEffect, useState } from "react";

const PHOTO =
  "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1600&q=80";

export function Splash({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setOut(true), 2200);
    const done = window.setTimeout(onDone, 2800);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <button type="button" className={`splash${out ? " out" : ""}`} onClick={onDone} aria-label="Enter GuitarBeats">
      <img src={PHOTO} alt="" className="splash-photo" />
      <span className="splash-veil" />
      <span className="splash-ring r1" />
      <span className="splash-ring r2" />
      <span className="splash-ring r3" />
      <span className="splash-copy">
        <b>GuitarBeats</b>
        <small>Tap to play</small>
      </span>
    </button>
  );
}
