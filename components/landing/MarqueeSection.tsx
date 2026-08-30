import { Fragment } from "react";

interface Props {
  canciones: string[];
}

/**
 * Infinite song ticker. The sequence is rendered twice and the track is
 * translated -50%, so the loop has no visible seam. Pure CSS — no JS.
 */
export function MarqueeSection({ canciones }: Props) {
  const items = canciones.filter((c) => c.trim().length > 0);
  if (items.length === 0) return null;

  const sequence = (copy: number) =>
    items.map((song, i) => (
      <Fragment key={`${copy}-${i}`}>
        <span>{song}</span>
        <b>/</b>
      </Fragment>
    ));

  return (
    <section className="mt-bleed">
      <div className="mt-marquee" aria-hidden="true">
        <div className="mt-marquee-track">
          {sequence(0)}
          {sequence(1)}
        </div>
      </div>
    </section>
  );
}
