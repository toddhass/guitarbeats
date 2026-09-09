const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

let htmlAudio: HTMLAudioElement | null = null;
let armed = false;

export function createAudioContext(): AudioContext {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) throw new Error("Web Audio is not supported in this browser");
  return new AC();
}

export function unlockAudio(ctx?: AudioContext | null) {
  if (ctx && ctx.state === "suspended") void ctx.resume();
  if (!htmlAudio) {
    htmlAudio = new Audio(SILENT_WAV);
    htmlAudio.loop = true;
    htmlAudio.setAttribute("playsinline", "true");
    htmlAudio.setAttribute("webkit-playsinline", "true");
    htmlAudio.muted = false;
    htmlAudio.volume = 0.001;
  }
  const play = htmlAudio.play();
  if (play && typeof play.catch === "function") play.catch(() => {});
  if (ctx) {
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.04);
    } catch {
      /* older WebKit */
    }
  }
}

export function armUnlock(getCtx: () => AudioContext | null) {
  if (armed) return;
  armed = true;
  const kick = () => unlockAudio(getCtx());
  const opts: AddEventListenerOptions = { capture: true, passive: true };
  window.addEventListener("pointerdown", kick, opts);
  window.addEventListener("touchstart", kick, opts);
  window.addEventListener("keydown", kick, opts);
  window.addEventListener("click", kick, opts);
}
