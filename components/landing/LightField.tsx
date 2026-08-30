/**
 * Hero backdrop: a rain of light specks plus the converging beams of the
 * stage tunnel.
 *
 * The randomness is a fixed-seed LCG, so server and client produce byte
 * identical markup and hydration stays quiet.
 */

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: string;
  width: number;
}

function buildLines(): Line[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const lines: Line[] = [];

  // Light rain — the call order of rand() must stay as-is to match the mockup.
  for (let i = 0; i < 70; i++) {
    const x = Number((rand() * 100).toFixed(2));
    const y = Number((rand() * 88).toFixed(2));
    const len = Number((2 + rand() * 7).toFixed(2));
    lines.push({
      x1: x,
      y1: y,
      x2: x,
      y2: Number((y + len).toFixed(2)),
      opacity: (0.06 + rand() * 0.22).toFixed(3),
      width: 0.12,
    });
  }

  // Converging tunnel beams
  for (let k = 0; k < 9; k++) {
    lines.push({
      x1: Number((50 + (k - 4) * 3.2).toFixed(2)),
      y1: 0,
      x2: Number((50 + (k - 4) * 12.5).toFixed(2)),
      y2: 100,
      opacity: (0.05 - Math.abs(k - 4) * 0.005).toFixed(3),
      width: 0.35,
    });
  }

  return lines;
}

const LINES = buildLines();

export function LightField() {
  return (
    <svg
      className="mt-lightfield"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {LINES.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#f4f2ec"
          strokeOpacity={l.opacity}
          strokeWidth={l.width}
        />
      ))}
    </svg>
  );
}
