import { useApp } from "../state/store";

export function NowStrip() {
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);
  const playing = useApp((s) => s.playing);
  const partName = useApp((s) => s.partName);
  const setTab = useApp((s) => s.setTab);

  return (
    <button type="button" className="now-strip" onClick={() => setTab("play")}>
      <span>
        <strong>{song.title}</strong>
        <small>{song.artist} · {bpm} BPM</small>
      </span>
      <em>{playing ? partName : "Open Play"}</em>
    </button>
  );
}
