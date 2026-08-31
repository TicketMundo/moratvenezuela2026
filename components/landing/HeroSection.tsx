import cusicaLogo from "@/app/assets/images/logo-cusica.png";
import moratLogo from "@/app/assets/images/morat.png";
import type { MoratConfig } from "@/lib/types";
import { isUrl, renderPipes, joinMeta } from "@/lib/morat-render";
import { ArtImage } from "./ArtSlot";
import { ShowCountdown } from "./ShowCountdown";
import { CtaButton } from "./CtaButton";

interface Props {
  config: MoratConfig;
}

/**
 * Header: uploaded artwork when there is one, the tour's typographic hero
 * otherwise. Never both — same either/or the mockup does.
 */
export function HeroSection({ config }: Props) {
  const hasArt = isUrl(config.arteHeader.image);

  if (hasArt) {
    return (
      <section className="mt-sec mt-bleed">
        <ArtImage slot="header" art={config.arteHeader} label="Arte de cabecera" className="mt-img" />
      </section>
    );
  }

  const showBadge = config.benefico.mostrar && !!config.benefico.badge;
  const showCountdown = config.mostrarCountdownShow && !Number.isNaN(Date.parse(config.showFecha));

  return (
    <section className="mt-sec mt-bleed">
      {/* The backdrop is a single soft gradient on .mt-hero::after — the old
          ray fan and SVG light field were removed, see app/morat.css. */}
      <div className="mt-hero">
        <div className="mt-hero-inner">
          {/* Cusica lockup: the mark, with the caption under it. Dimensions come
              from the static import so the logo reserves its space before it
              loads and the hero does not shift. */}
          <div className="mt-presenta">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mt-presenta-logo"
              src={cusicaLogo.src}
              width={cusicaLogo.width}
              height={cusicaLogo.height}
              alt="Cusica"
            />
            {config.presenta && (
              <p className="mt-eyebrow">
                <span className="mt-dot" />
                <span>{config.presenta}</span>
              </p>
            )}
          </div>

          {/* The mark stands in for the wordmark. bandName still carries the
              accessible name and the metadata title. */}
          <h1 className="mt-hero-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={moratLogo.src}
              width={moratLogo.width}
              height={moratLogo.height}
              alt={config.bandName || "Morat"}
              fetchPriority="high"
            />
          </h1>

          <div className="mt-prism-bar mt-prism-bar-wide" />

          {config.tourName && <p className="mt-hero-tour">{renderPipes(config.tourName)}</p>}

          <p className="mt-hero-meta">{joinMeta([config.metaFecha, config.venue, config.ciudad])}</p>

          {showBadge && <p className="mt-benefit-badge">{config.benefico.badge}</p>}

          {showCountdown && <ShowCountdown target={config.showFecha} />}

          <div className="mt-hero-ctas">
            <CtaButton label={config.ctaLabel} link={config.ctaLink} big />
          </div>
        </div>
      </div>
    </section>
  );
}
