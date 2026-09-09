import { useApp } from "../state/store";
export function Library() {
  const library = useApp((s) => s.library);
  const query = useApp((s) => s.query);
  const setQuery = useApp((s) => s.setQuery);
  const song = useApp((s) => s.song);
  const selectSong = useApp((s) => s.selectSong);
  return (
    <div className="card library">
      <p className="kicker">Library</p>
      <input type="search" placeholder="Search a song" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="list">
        {library.length === 0 && <p className="empty">No songs match</p>}
        {library.map((s) => (
          <button key={s.id} type="button" className={`row${song.id === s.id ? " active" : ""}`} onClick={() => selectSong(s.id)}>
            <span><span className="t">{s.title}</span><span className="a">{s.artist}</span></span>
            <span className="bpm">{s.bpm || ""}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
