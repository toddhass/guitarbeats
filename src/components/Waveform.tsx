import { useEffect, useRef } from "react";
import { useApp, ensureEngine } from "../state/store";
import "./wave.css";

let tap: AnalyserNode | null = null;

function analyser() {
  const { ctx, masterGain } = ensureEngine();
  if (tap && tap.context === ctx) return tap;
  const a = ctx.createAnalyser();
  a.fftSize = 256;
  a.smoothingTimeConstant = 0.55;
  masterGain.connect(a);
  tap = a;
  return a;
}

export function Waveform() {
  const playing = useApp((s) => s.playing);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2 = canvas.getContext("2d");
    if (!ctx2) return;

    const drawIdle = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx2.clearRect(0, 0, w, h);
      ctx2.strokeStyle = "rgba(243,238,228,.28)";
      ctx2.lineWidth = 1.5;
      ctx2.beginPath();
      ctx2.moveTo(0, h / 2);
      ctx2.lineTo(w, h / 2);
      ctx2.stroke();
    };

    if (!playing) {
      drawIdle();
      return;
    }

    const node = analyser();
    const data = new Uint8Array(node.fftSize);

    const frame = () => {
      node.getByteTimeDomainData(data);
      const w = canvas.width;
      const h = canvas.height;
      ctx2.clearRect(0, 0, w, h);
      ctx2.strokeStyle = "#f3eee4";
      ctx2.lineWidth = 2;
      ctx2.beginPath();
      const step = data.length / w;
      for (let x = 0; x < w; x++) {
        const v = data[Math.floor(x * step)] / 128 - 1;
        const y = h / 2 + v * (h * 0.42);
        if (x === 0) ctx2.moveTo(x, y);
        else ctx2.lineTo(x, y);
      }
      ctx2.stroke();
      rafRef.current = window.requestAnimationFrame(frame);
    };

    rafRef.current = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <section className="card wave-card">
      <p className="kicker">Waveform</p>
      <canvas ref={canvasRef} className="wave" width={640} height={120} aria-hidden />
    </section>
  );
}
