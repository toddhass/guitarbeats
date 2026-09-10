import { useEffect } from "react";

export function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let dead = false;

    const grab = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch {
        /* unsupported or denied */
      }
    };

    void grab();
    const onVis = () => {
      if (!dead && document.visibilityState === "visible") void grab();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      dead = true;
      document.removeEventListener("visibilitychange", onVis);
      void lock?.release();
    };
  }, [on]);
}
