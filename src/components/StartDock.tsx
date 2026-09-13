import { useApp } from "../state/store";

export function StartDock() {
  const playing = useApp((s) => s.playing);
  const toggleStart = useApp((s) => s.toggleStart);
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);

  return (
    <div className="dock">
      <p className="dock-meta">
        {song.title} · {bpm} BPM
      </p>
      <button
        className={`start${playing ? " stop" : ""}`}
        type="button"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          e.preventDefault();
          toggleStart();
        }}
      >
        {playing ? "Stop" : "Start"}
      </button>
    </div>
  );
}
