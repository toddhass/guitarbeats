import { useEffect, useState } from "react";
import { useApp } from "./state/store";
import { Splash } from "./components/Splash";
import { StartDock } from "./components/StartDock";
import { NowStrip } from "./components/NowStrip";
import { PlayPage } from "./pages/PlayPage";
import { PracticePage } from "./pages/PracticePage";
import { KitPage } from "./pages/KitPage";
import { LibraryPage } from "./pages/LibraryPage";
import { bindRemote, syncMediaSession } from "./remote";
import { useWakeLock } from "./hooks/useWakeLock";
import { PAGES, tabFromHash, writeHash } from "./state/routes";
import type { Tab } from "./state/tab-patch";

export default function App() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const playing = useApp((s) => s.playing);
  const song = useApp((s) => s.song);
  const bpm = useApp((s) => s.bpm);
  const [splash, setSplash] = useState(true);
  const page = PAGES.find((p) => p.id === tab) ?? PAGES[0];

  useWakeLock(playing);

  useEffect(() => {
    const fromUrl = tabFromHash();
    if (fromUrl !== tab) setTab(fromUrl);
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    writeHash(tab);
    document.body.className = `pane-${tab}`;
    document.title = `${page.title} · GuitarBeats`;
  }, [tab, page.title]);

  useEffect(() => {
    bindRemote();
  }, []);

  useEffect(() => {
    syncMediaSession();
  }, [playing, song, bpm]);

  function go(id: Tab) {
    writeHash(id);
    setTab(id);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  return (
    <>
      {splash && <Splash onDone={() => setSplash(false)} />}
      <div className={`wrap page-${tab}`}>
        {tab !== "play" && <NowStrip />}

        {tab === "play" && <PlayPage />}
        {tab === "practice" && <PracticePage />}
        {tab === "drums" && <KitPage />}
        {tab === "songs" && <LibraryPage />}

        <footer className={`chrome${tab === "play" ? " with-start" : ""}`}>
          {tab === "play" && <StartDock />}
          <nav className="tabs tabs-4">
            {PAGES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? "on" : ""}
                onPointerDown={() => go(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}
