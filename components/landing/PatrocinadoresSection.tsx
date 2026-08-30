import type { ArtSlot, Patrocinador } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";
import { PATROCINADORES_LOGOS_INDIVIDUALES } from "@/lib/feature-flags";
import { ArtImage } from "./ArtSlot";

interface Props {
  arte: ArtSlot;
  patrocinadores: Patrocinador[];
}

/**
 * How many times to repeat the list so the strip fills the viewport.
 *
 * Always even: the keyframe translates -50%, which only loops seamlessly when
 * the second half of the track is identical to the first.
 */
function copiesFor(count: number): number {
  if (count >= 8) return 2;
  if (count >= 4) return 4;
  return 6;
}

/**
 * Sponsors. Today this is a single full-width banner the client composes
 * themselves.
 *
 * The logo strip below is dormant behind PATROCINADORES_LOGOS_INDIVIDUALES —
 * see lib/feature-flags.ts. It puts individual logos on a light band (the
 * artwork is black) and scrolls them on their own, which needs no controls on
 * mobile and works at any logo count.
 */
export function PatrocinadoresSection({ arte, patrocinadores }: Props) {
  const logos = PATROCINADORES_LOGOS_INDIVIDUALES
    ? patrocinadores.filter((p) => isUrl(p.logo))
    : [];

  // The banner always wins when there is one, and with the strip off it is the
  // only thing this section can be. It sits on a light band because the
  // artwork is black on transparency.
  if (isUrl(arte.image)) {
    return (
      <section className="mt-sec mt-bleed">
        <div className="mt-sponsors-banner">
          <ArtImage slot="sponsors" art={arte} label="Patrocinadores" className="mt-img" />
        </div>
      </section>
    );
  }

  // Nothing uploaded — the mockup's dashed marker, which needs the dark ground.
  if (logos.length === 0) {
    return (
      <section className="mt-sec mt-bleed">
        <ArtImage slot="sponsors" art={arte} label="Patrocinadores" className="mt-img" />
      </section>
    );
  }

  const copies = copiesFor(logos.length);

  return (
    <section className="mt-bleed">
      <div className="mt-sponsors">
        <div className="mt-sponsors-track">
          {Array.from({ length: copies }, (_, copy) => (
            // Only the first copy is real content; the rest exist to feed the
            // loop, so they are hidden from assistive tech and from tab order.
            <div className="mt-sponsors-copy" key={copy} aria-hidden={copy > 0 || undefined}>
              {logos.map((patrocinador, i) => {
                const logo = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={patrocinador.logo}
                    alt={copy === 0 ? patrocinador.nombre : ""}
                    loading="lazy"
                  />
                );

                return isUrl(patrocinador.link) ? (
                  <a
                    key={i}
                    className="mt-sponsor"
                    href={patrocinador.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy > 0 ? -1 : undefined}
                  >
                    {logo}
                  </a>
                ) : (
                  <span key={i} className="mt-sponsor">
                    {logo}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
