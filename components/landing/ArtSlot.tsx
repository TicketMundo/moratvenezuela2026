import type { ArtSlot } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";

interface ArtImageProps {
  /** Kept as a `data-slot` attribute — the empty-state placeholder is CSS-driven off it. */
  slot: string;
  art: ArtSlot;
  /** Shown inside the dashed placeholder when no image was uploaded. */
  label: string;
  className?: string;
  /** Footer art is decorative and never links out. */
  linkable?: boolean;
}

/**
 * An uploadable image with an optional mobile variant and link.
 * With no image it renders the dashed placeholder from the mockup.
 */
export function ArtImage({ slot, art, label, className, linkable = true }: ArtImageProps) {
  if (!isUrl(art.image)) {
    return <div className={`${className ?? ""} mt-empty`.trim()} data-slot={slot} data-label={label} />;
  }

  const picture = isUrl(art.imageMobile) ? (
    <picture>
      <source media="(max-width:749px)" srcSet={art.imageMobile} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art.image} alt={label} />
    </picture>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={art.image} alt={label} />
  );

  if (linkable && isUrl(art.link)) {
    return (
      <a className={className} data-slot={slot} href={art.link} target="_blank" rel="noopener noreferrer">
        {picture}
      </a>
    );
  }

  return (
    <div className={className} data-slot={slot}>
      {picture}
    </div>
  );
}

interface SectionTitleProps {
  slot: string;
  art: ArtSlot;
  /** Typographic fallback when no title artwork was uploaded. */
  text: string;
}

/** Section heading: uploaded artwork if present, tour typography otherwise. */
export function SectionTitle({ slot, art, text }: SectionTitleProps) {
  if (isUrl(art.image)) {
    return (
      <div className="mt-title-img" data-slot={slot}>
        {isUrl(art.imageMobile) ? (
          <picture>
            <source media="(max-width:749px)" srcSet={art.imageMobile} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.image} alt={text} />
          </picture>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={art.image} alt={text} />
        )}
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="mt-title-img" data-slot={slot}>
      {/* data-text feeds the ::before light-sweep pseudo-element */}
      <h3 className="mt-title-text" data-text={text}>
        {text}
      </h3>
    </div>
  );
}
