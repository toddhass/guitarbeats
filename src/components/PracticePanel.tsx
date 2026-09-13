import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/store";
import { useCoach } from "../state/coach";
import { brainFor } from "../data/brain";
import { withCapo } from "../data/capo";
import { STRUMS, StrumId } from "../data/strums";
import { ChordDiagram } from "./ChordDiagram";
import { Transport } from "./Transport";
import { CoachBar } from "./CoachBar";

const STRUM_KEY = "gb-strum";

export function PracticePanel() {
  const song = useApp((s) => s.song);
  const step = useApp((s) => s.step);
  const playing = useApp((s) => s.playing);
  const loopPart = useApp((s) => s.loopPart);
  const countIn = useApp((s) => s.countIn);
  const speed = useApp((s) => s.speed);
  const partName = useApp((s) => s.partName);
  const setLoopPart = useApp((s) => s.setLoopPart);
  const setCountIn = useApp((s) => s.setCountIn);
  const setSpeed = useApp((s) => s.setSpeed);
  const holdPause = useApp((s) => s.holdPause);
  const holdResume = useApp((s) => s.holdResume);
  const sheet = useCoach((s) => s.sheet);
  const sheetChords = useCoach((s) => s.sheetChords);
  const setSheet = useCoach((s) => s.setSheet);
  const applySheet = useCoach((s) => s.applySheet);
  const startPath = useCoach((s) => s.startPath);
  const ladder = useCoach((s) => s.ladder);
  const pathNote = useCoach((s) => s.pathNote);

  const brain = brainFor(song.id, song.feel, song.title);
  const [capo, setCapo] = useState(brain.capo);
  const [strumId, setStrumId] = useState<StrumId>(brain.strum);
  const chords = sheetChords.length ? sheetChords : brain.chords;
  const timed = Math.floor(step / 4) % Math.max(1, chords.length);
  const [held, setHeld] = useState<number | null>(null);
  const resumeAfter = useRef(false);
  const active = held ?? timed;
  const strum = STRUMS.find((s) => s.id === strumId) ?? STRUMS[0];

  useEffect(() => {
    setCapo(brain.capo);
    setStrumId(brain.strum);
  }, [song.id, brain.capo, brain.strum]);

  useEffect(() => {
    const saved = localStorage.getItem(STRUM_KEY) as StrumId | null;
    if (saved && STRUMS.some((s) => s.id === saved)) setStrumId(saved);
  }, []);

  function pickStrum(id: StrumId) {
    setStrumId(id);
    localStorage.setItem(STRUM_KEY, id);
  }

  function toggleChord(i: number) {
    if (held === i) {
      setHeld(null);
      if (resumeAfter.current) {
        resumeAfter.current = false;
        holdResume();
      }
      return;
    }
    if (playing) {
      resumeAfter.current = true;
      holdPause();
    }
    setHeld(i);
  }

  return (
    <>
      <CoachBar />
      <section className="card practice">
        <p className="kicker">Practice</p>
        <p className="hint">{brain.hint}{partName ? ` · ${partName}` : ""}</p>
        <div className="chips">
          <button type="button" className={`chip${countIn ? " on" : ""}`} onClick={() => setCountIn(!countIn)}>Count-in</button>
          <button type="button" className={`chip${loopPart ? " on" : ""}`} onClick={() => setLoopPart(!loopPart)}>Loop part</button>
          <button type="button" className={`chip${speed === 0.5 ? " on" : ""}`} onClick={() => setSpeed(0.5)}>Half</button>
          <button type="button" className={`chip${speed === 0.7 ? " on" : ""}`} onClick={() => setSpeed(0.7)}>Slow</button>
          <button type="button" className={`chip${speed === 1 ? " on" : ""}`} onClick={() => setSpeed(1)}>Full</button>
          <button type="button" className="chip" onClick={startPath}>Bottleneck {brain.hard}</button>
          <button type="button" className="chip" onClick={ladder}>Ladder</button>
        </div>
        {pathNote ? <p className="hint" style={{ marginTop: "0.6rem" }}>{pathNote}</p> : null}
        <p className="label" style={{ marginTop: "0.85rem" }}>Capo · brain says {brain.capo || "open"}</p>
        <div className="chips">
          {Array.from({ length: 8 }, (_, n) => (
            <button key={n} type="button" className={`chip${capo === n ? " on" : ""}`} onClick={() => setCapo(n)}>
              {n === 0 ? "Open" : String(n)}
            </button>
          ))}
        </div>
        <p className="label" style={{ marginTop: "0.85rem" }}>Strum</p>
        <div className="chips">
          {STRUMS.map((s) => (
            <button key={s.id} type="button" className={`chip${strumId === s.id ? " on" : ""}`} onClick={() => pickStrum(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <p className="label" style={{ marginTop: "0.85rem" }}>Paste a chart or Live Text from a photo</p>
        <textarea
          value={sheet}
          onChange={(e) => setSheet(e.target.value)}
          placeholder="G  D  Em  C"
          rows={2}
          style={{ width: "100%", borderRadius: "0.5rem", background: "#141311", color: "inherit", border: "1px solid rgb(255 255 255 / .22)", padding: "0.6rem", font: "inherit" }}
        />
        <div className="chips" style={{ marginTop: "0.45rem" }}>
          <button type="button" className="chip" onClick={applySheet}>Load chords</button>
        </div>
        <p className="label" style={{ marginTop: "0.85rem" }}>Left hand — tap to hold and pause</p>
        <div className="chords">
          {chords.map((c, i) => (
            <button
              key={c + i}
              type="button"
              className={`chord${i === active ? " on" : ""}`}
              onClick={() => toggleChord(i)}
            >
              {withCapo(c, capo)}
            </button>
          ))}
        </div>
        <ChordDiagram chord={chords[active] ?? "G"} capo={capo} step={step} playing={playing} cells={strum.cells} />
      </section>
      <Transport mode="play" />
    </>
  );
}
