import { useEffect, useState } from "react";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#ef4444"];
const PIECES = 48;
const DURATION_MS = 4000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Random values are generated once (state initializer), not on every render.
const createPieces = () =>
  Array.from({ length: PIECES }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.6,
    drift: (Math.random() - 0.5) * 240,
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
    color: COLORS[index % COLORS.length],
  }));

/** Mount it to celebrate; it removes itself after a few seconds. */
export default function Confetti({ onDone }) {
  const [pieces] = useState(createPieces);
  const skip = prefersReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), skip ? 0 : DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone, skip]);

  if (skip) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece absolute top-0 block rounded-[2px]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.6,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            "--drift": `${piece.drift}px`,
            "--rotate": `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
