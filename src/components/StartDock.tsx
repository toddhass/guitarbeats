import { useApp } from "../state/store";

export function StartDock() {
  const playing = useApp((s) => s.playing);
  const toggleStart = useApp((s) => s.toggleStart);
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);
  const partName = useApp((s) => s.partName);
  const counting = playing && /^[1-4]$/.test(partName);

  return (
    <div className="dock">
      <p className="dock-meta">
        {counting ? `Count ${partName} — come in on 1` : `${song.title} · ${bpm} BPM`}
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
        {counting ? partName : playing ? "Stop" : "Start"}
      </button>
    </div>
  );
}
