let warmed = false;

function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function warmCountVoice() {
  if (!canSpeak() || warmed) return;
  warmed = true;
  try {
    window.speechSynthesis.getVoices();
    const u = new SpeechSynthesisUtterance(".");
    u.volume = 0.01;
    u.rate = 2;
    window.speechSynthesis.speak(u);
    window.speechSynthesis.cancel();
  } catch {
    /* iOS / embedded webview */
  }
}

export function speakCount(word: string, bpm: number) {
  if (!canSpeak() || !word) return;
  try {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.pitch = word === "and" || word === "a" ? 1.05 : 0.9;
    u.volume = word === "and" || word === "a" ? 0.75 : 1;
    const pace = Math.max(40, Math.min(200, bpm)) / 96;
    u.rate = Math.max(0.95, Math.min(1.55, pace));
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function hushCount() {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* */
  }
}
