import { useApp } from "../state/store";
import { useCoach } from "../state/coach";
import { brainFor } from "../data/brain";
import { voiceSupported } from "../audio/voice";

export function CoachBar() {
  const song = useApp((s) => s.song);
  const kit = useApp((s) => s.kit);
  const setKit = useApp((s) => s.setKit);
  const timing = useCoach((s) => s.timing);
  const listenOn = useCoach((s) => s.listenOn);
  const voiceOn = useCoach((s) => s.voiceOn);
  const lastHeard = useCoach((s) => s.lastHeard);
  const pathNote = useCoach((s) => s.pathNote);
  const toggleListen = useCoach((s) => s.toggleListen);
  const toggleVoice = useCoach((s) => s.toggleVoice);
  const tap = useCoach((s) => s.tap);
  const startPath = useCoach((s) => s.startPath);
  const ladder = useCoach((s) => s.ladder);
  const playNextInSet = useCoach((s) => s.playNextInSet);
  const brain = brainFor(song.id, song.feel, song.title);

  const meter =
    timing === "locked" ? "Locked" : timing === "early" ? "Rushing" : timing === "late" ? "Dragging" : "Idle";

  return (
    <section className="card coach">
      <p className="kicker">Coach</p>
      <p className="hint">{brain.hint}</p>
      <div className="chips">
        <button type="button" className={`chip${listenOn ? " on" : ""}`} onPointerDown={() => void toggleListen()}>Listen</button>
        <button type="button" className="chip" onPointerDown={tap}>Tap tempo</button>
        <button type="button" className={`chip${voiceOn ? " on" : ""}`} onPointerDown={toggleVoice}>
          {voiceSupported() ? "Voice" : "No voice"}
        </button>
        <button type="button" className="chip" onPointerDown={startPath}>Bottleneck</button>
        <button type="button" className="chip" onPointerDown={ladder}>Ladder</button>
        <button type="button" className="chip" onPointerDown={playNextInSet}>Next in set</button>
        <button type="button" className={`chip${kit === brain.kit ? " on" : ""}`} onPointerDown={() => setKit(brain.kit)}>
          Match kit
        </button>
      </div>
      <p className={`conductor-meta timing-${timing}`} style={{ marginTop: "0.65rem" }}>
        Timing {meter}
        {lastHeard ? ` · heard “${lastHeard}”` : ""}
        {pathNote ? ` · ${pathNote}` : ""}
      </p>
    </section>
  );
}
