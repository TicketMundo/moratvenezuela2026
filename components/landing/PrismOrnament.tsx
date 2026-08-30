/**
 * Side ornament for the video section: a prism that takes white light in and
 * fans it out as the tour's spectrum, with mirrors multiplying the reflection.
 *
 * Ported from the mockup's `prismOrnament(dir)`. `dir = 1` fans to the right,
 * `dir = -1` mirrors it.
 */

const SPECTRUM = ["#6f5bff", "#2fa8ff", "#3ce0e0", "#58e08a", "#ffd447", "#ff8b3d", "#ff4d6d"];

const W = 260;
const H = 560;
const SPREAD = 205;

interface Props {
  dir: 1 | -1;
}

export function PrismOrnament({ dir }: Props) {
  const cx = dir > 0 ? 86 : W - 86;
  const cy = H / 2;
  const sfx = dir > 0 ? "L" : "R";
  const edge = dir > 0 ? 0 : W;
  const far = dir > 0 ? W : 0;
  const x1 = dir > 0 ? "0" : "1";
  const x2 = dir > 0 ? "1" : "0";

  const mirrors = Array.from({ length: 6 }, (_, k) => {
    const yy = 40 + k * 20;
    const w = 150 - k * 16;
    const mx = dir > 0 ? 16 : W - 16 - w;
    return { k, yy, w, mx, delay: `${(k * 0.35).toFixed(2)}s` };
  });

  const rays = SPECTRUM.map((_, i) => {
    const t = (i - (SPECTRUM.length - 1) / 2) / ((SPECTRUM.length - 1) / 2); // -1 .. 1
    const ya = cy + t * SPREAD;
    const yb = cy + t * (SPREAD + 32);
    return {
      i,
      d: `M${cx} ${cy} L${far} ${ya.toFixed(1)} L${far} ${yb.toFixed(1)} Z`,
      delay: `${(i * 0.28).toFixed(2)}s`,
    };
  });

  const prismPoints =
    dir > 0
      ? `${cx} ${cy - 46} ${cx + 52} ${cy + 34} ${cx - 52} ${cy + 34}`
      : `${cx} ${cy - 46} ${cx - 52} ${cy + 34} ${cx + 52} ${cy + 34}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        {/* Incoming white beam: transparent at the edge, solid at the prism */}
        <linearGradient id={`mtBeam${sfx}`} x1={x1} y1="0" x2={x2} y2="0">
          <stop offset="0" stopColor="#f4f2ec" stopOpacity="0" />
          <stop offset="1" stopColor="#f4f2ec" stopOpacity=".7" />
        </linearGradient>

        {/* Each spectrum ray is born at the prism and dissolves toward the video */}
        {SPECTRUM.map((color, g) => (
          <linearGradient key={g} id={`mtRay${sfx}${g}`} x1={x1} y1="0" x2={x2} y2="0">
            <stop offset="0" stopColor={color} stopOpacity=".05" />
            <stop offset=".45" stopColor={color} stopOpacity=".5" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}

        {/* Mirrors: light bars fading inward */}
        <linearGradient id={`mtMirror${sfx}`} x1={x1} y1="0" x2={x2} y2="0">
          <stop offset="0" stopColor="#f4f2ec" stopOpacity=".22" />
          <stop offset="1" stopColor="#f4f2ec" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Multiplying mirrors, top and bottom */}
      {mirrors.map(({ k, yy, w, mx, delay }) => (
        <g key={k}>
          <rect
            className="mt-mirror"
            style={{ animationDelay: delay }}
            x={mx}
            y={yy}
            width={w}
            height={1.4}
            fill={`url(#mtMirror${sfx})`}
          />
          <rect
            className="mt-mirror"
            style={{ animationDelay: delay }}
            x={mx}
            y={H - yy}
            width={w}
            height={1.4}
            fill={`url(#mtMirror${sfx})`}
          />
        </g>
      ))}

      {/* White beam entering from the outer edge */}
      <path
        className="mt-beam"
        d={`M${edge} ${cy - 7} L${cx} ${cy - 3} L${cx} ${cy + 3} L${edge} ${cy + 7} Z`}
        fill={`url(#mtBeam${sfx})`}
      />

      {/* Spectrum fan leaving the prism toward the video */}
      {rays.map(({ i, d, delay }) => (
        <path
          key={i}
          className="mt-ray"
          style={{ animationDelay: delay }}
          d={d}
          fill={`url(#mtRay${sfx}${i})`}
        />
      ))}

      {/* The prism itself */}
      <polygon
        points={prismPoints}
        fill="rgba(244,242,236,.04)"
        stroke="rgba(244,242,236,.45)"
        strokeWidth={1.2}
      />
    </svg>
  );
}
