import type { MoratConfig } from "@/lib/types";
import { isUrl, renderPipes, joinMeta } from "@/lib/morat-render";
import { ArtImage } from "./ArtSlot";
import { LightField } from "./LightField";
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
      <div className="mt-hero">
        <LightField />
        <div className="mt-rays" aria-hidden="true" />
        <div className="mt-hero-inner">
          {config.presenta && (
            <p className="mt-eyebrow">
              <span className="mt-dot" />
              <span>{config.presenta}</span>
            </p>
          )}

          {/* data-text drives the overhead-light and light-sweep pseudo-elements */}
          <h1 className="mt-hero-title" data-text={config.bandName}>
            {config.bandName}
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
