let warmed = false;

function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function warmCountVoice() {
  if (!canSpeak() || warmed) return;
  warmed = true;
  try {
    window.speechSynthesis.getVoices();
  } catch {
    /* */
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

/** One phrase, timed to four beats, so speech does not queue past the downbeat. */
export function speakCountPhrase(bpm: number) {
  if (!canSpeak()) return;
  hushCount();
  try {
    const seconds = (60 / Math.max(40, bpm)) * 4;
    const u = new SpeechSynthesisUtterance("a one and a two and a three and four");
    u.lang = "en-US";
    u.pitch = 0.92;
    u.volume = 1;
    u.rate = Math.max(0.85, Math.min(1.65, 2.05 / seconds));
    window.speechSynthesis.speak(u);
  } catch {
    /* */
  }
}
