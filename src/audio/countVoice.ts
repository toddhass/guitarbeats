let warmed = false;
let picked: SpeechSynthesisVoice | null = null;

function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (picked) return picked;
  if (!canSpeak()) return null;
  const voices = window.speechSynthesis.getVoices();
  const score = (v: SpeechSynthesisVoice) => {
    const n = `${v.name} ${v.lang}`.toLowerCase();
    if (!/en/.test(n)) return 0;
    if (/samantha|karen|moira|serena|ava|nicky|enhanced|premium|natural/.test(n)) return 5;
    if (/google us|siri|daniel|alex|fred|tom/.test(n)) return 4;
    if (/en-us/.test(n)) return 3;
    if (/en-gb|en-au|en-ie/.test(n)) return 2;
    return 1;
  };
  picked = voices.slice().sort((a, b) => score(b) - score(a))[0] || null;
  return picked;
}

export function warmCountVoice() {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      picked = null;
      pickVoice();
    };
    pickVoice();
    if (!warmed) {
      warmed = true;
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0.01;
      u.rate = 2;
      window.speechSynthesis.speak(u);
      window.speechSynthesis.cancel();
    }
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

export function speakCountWord(word: string, bpm: number) {
  if (!canSpeak() || !word) return;
  try {
    const u = new SpeechSynthesisUtterance(word);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-US";
    const off = word === "and" || word === "a";
    u.pitch = off ? 1.02 : 0.86;
    u.volume = off ? 0.82 : 1;
    const beat = 60 / Math.max(50, Math.min(180, bpm));
    u.rate = Math.max(0.92, Math.min(1.45, 0.55 / beat));
    window.speechSynthesis.speak(u);
  } catch {
    /* */
  }
}
