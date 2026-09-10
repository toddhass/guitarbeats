import { useApp } from "../state/store";
import { STYLES } from "../data/grooves";

export function Transport() {
  const playing = useApp((s) => s.playing);
  const toggleStart = useApp((s) => s.toggleStart);
  const fill = useApp((s) => s.fill);
  const nextPart = useApp((s) => s.nextPart);
  const restart = useApp((s) => s.restart);
  const crash = useApp((s) => s.crash);
  const song = useApp((s) => s.song);
  const selectFeel = useApp((s) => s.selectFeel);
  const bpm = useApp((s) => s.bpm);
  const setBpm = useApp((s) => s.setBpm);
  const volume = useApp((s) => s.volume);
  const setVolume = useApp((s) => s.setVolume);
  const kit = useApp((s) => s.kit);
  const setKit = useApp((s) => s.setKit);
  const clickOn = useApp((s) => s.clickOn);
  const setClickOn = useApp((s) => s.setClickOn);
  const clickLevel = useApp((s) => s.clickLevel);
  const setClickLevel = useApp((s) => s.setClickLevel);

  function press(fn: () => void) {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        fn();
      },
      onClick: () => fn(),
    };
  }

  return (
    <>
      <button className={`start${playing ? " stop" : ""}`} type="button" {...press(toggleStart)}>
        {playing ? "Stop" : "Start"}
      </button>
      <div className="grid">
        <button className="pedal fill" type="button" {...press(fill)}>Fill</button>
        <button className="pedal next" type="button" {...press(nextPart)}>Next part</button>
        <button className="pedal restart" type="button" {...press(restart)}>Restart</button>
        <button className="pedal crash" type="button" {...press(crash)}>Crash</button>
      </div>
      <section className="card transport-groove">
        <p className="label">Groove</p>
        <div className="chips">
          {STYLES.map((s) => (
            <button key={s.id} type="button" className={`chip${song.feel === s.id ? " on" : ""}`} {...press(() => selectFeel(s.id))}>{s.label}</button>
          ))}
        </div>
        <p className="label" style={{ marginTop: "0.85rem" }}>Kit</p>
        <div className="chips">
          <button type="button" className={`chip${kit === "dry" ? " on" : ""}`} {...press(() => setKit("dry"))}>Dry room</button>
          <button type="button" className={`chip${kit === "room" ? " on" : ""}`} {...press(() => setKit("room"))}>Country room</button>
          <button type="button" className={`chip${clickOn ? " on" : ""}`} {...press(() => setClickOn(!clickOn))}>Click</button>
        </div>
        <div className="sliders" style={{ marginTop: "1rem" }}>
          <label className="sl">
            Tempo
            <input type="range" min={40} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
            <span>{bpm}</span>
          </label>
          <label className="sl">
            Volume
            <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            <span>{volume}</span>
          </label>
          <label className="sl">
            Click
            <input type="range" min={0} max={100} value={clickLevel} onChange={(e) => setClickLevel(Number(e.target.value))} />
            <span>{clickLevel}</span>
          </label>
        </div>
      </section>
    </>
  );
}
