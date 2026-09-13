import { useApp } from "../state/store";
import { useCoach } from "../state/coach";

export function Library() {
  const library = useApp((s) => s.library);
  const query = useApp((s) => s.query);
  const setQuery = useApp((s) => s.setQuery);
  const song = useApp((s) => s.song);
  const selectSong = useApp((s) => s.selectSong);
  const searching = useApp((s) => s.searching);
  const setlist = useCoach((s) => s.setlist);
  const addSet = useCoach((s) => s.addSet);
  const removeSet = useCoach((s) => s.removeSet);
  const playSetItem = useCoach((s) => s.playSetItem);

  const setSongs = setlist
    .map((id) => library.find((s) => s.id === id) || (song.id === id ? song : null))
    .filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <>
      <div className="card library">
        <p className="kicker">Search</p>
        <input
          type="search"
          placeholder="Song or artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div className="list">
          {searching && <p className="empty">Searching…</p>}
          {!searching && library.length === 0 && <p className="empty">No songs match</p>}
          {library.map((s) => (
            <div key={s.id} className={`row${song.id === s.id ? " active" : ""}`} style={{ display: "flex", gap: "0.4rem" }}>
              <button type="button" className="row" style={{ flex: 1, padding: "0.55rem 0.2rem" }} onClick={() => selectSong(s.id)}>
                <span>
                  <span className="t">{s.title}</span>
                  <span className="a">{s.artist}</span>
                </span>
                <span className="bpm">{s.bpm || ""}</span>
              </button>
              <button type="button" className={`chip${setlist.includes(s.id) ? " on" : ""}`} onClick={() => addSet(s.id)}>+</button>
            </div>
          ))}
        </div>
      </div>
      <div className="card library">
        <p className="kicker">Set list</p>
        {setSongs.length === 0 && <p className="empty">Tap + on a song to add it</p>}
        <div className="list">
          {setSongs.map((s, i) => (
            <button key={s.id} type="button" className={`row${song.id === s.id ? " active" : ""}`} onClick={() => playSetItem(s.id)}>
              <span>
                <span className="t">{i + 1}. {s.title}</span>
                <span className="a">{s.artist} · {s.bpm || "?"} BPM</span>
              </span>
              <span className="bpm" onPointerDown={(e) => { e.stopPropagation(); removeSet(s.id); }}>✕</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
