import { useApp } from "../state/store";

export function StartDock() {
  const playing = useApp((s) => s.playing);
  const toggleStart = useApp((s) => s.toggleStart);
  const partName = useApp((s) => s.partName);
  const counting = playing && /^[1-4]$/.test(partName);

  return (
    <button
      className={`start${playing ? " stop" : ""}`}
      type="button"
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        toggleStart();
      }}
    >
      {counting ? `Count ${partName}` : playing ? "Stop" : "Start"}
    </button>
  );
}
