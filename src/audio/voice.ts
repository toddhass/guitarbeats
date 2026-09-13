export type VoiceHandler = (cmd: string) => void;

type Rec = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: { resultIndex: number; results: Array<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
};

function makeRec(): Rec | null {
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = false;
  rec.lang = "en-US";
  return rec;
}

let rec: Rec | null = null;
let onCmd: VoiceHandler | null = null;

export function voiceSupported() {
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function parseVoice(text: string): string | null {
  const t = text.toLowerCase().replace(/[.,!?]/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  if (/\b(stop|pause|hold)\b/.test(t)) return "stop";
  if (/\b(start|play|go)\b/.test(t)) return "start";
  if (/\bfill\b/.test(t)) return "fill";
  if (/\bcrash\b/.test(t)) return "crash";
  if (/\bnext song\b|\bset next\b|\bnext in set\b/.test(t)) return "setnext";
  if (/\bnext\b/.test(t)) return "next";
  if (/\brestart\b/.test(t)) return "restart";
  if (/\bhalf\b/.test(t)) return "half";
  if (/\bslow\b/.test(t)) return "slow";
  if (/\bfull\b|\bnormal\b/.test(t)) return "full";
  if (/\bcount[- ]?in\b/.test(t)) return "countin";
  if (/\bloop\b/.test(t)) return "loop";
  if (/\bclick\b/.test(t)) return "click";
  if (/\bconductor\b/.test(t)) return "conductor";
  if (/\blisten\b/.test(t)) return "listen";
  if (/\btap\b/.test(t)) return "tap";
  if (/\bbottleneck\b/.test(t)) return "bottleneck";
  if (/\bladder\b/.test(t)) return "ladder";
  if (/\bmatch kit\b/.test(t)) return "kit";
  return null;
}

export function startVoice(handler: VoiceHandler) {
  stopVoice();
  rec = makeRec();
  if (!rec) return false;
  onCmd = handler;
  rec.onresult = (ev) => {
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      const block = ev.results[i];
      if (!block.isFinal) continue;
      const cmd = parseVoice(block[0].transcript);
      if (cmd && onCmd) onCmd(cmd);
    }
  };
  rec.onerror = () => {};
  try {
    rec.start();
    return true;
  } catch {
    return false;
  }
}

export function stopVoice() {
  try {
    rec?.stop();
  } catch {
    /* */
  }
  rec = null;
  onCmd = null;
}
