import { Fragment } from "react";
import type { MoratConfig } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";
import { ArtImage } from "./ArtSlot";
import { CtaButton } from "./CtaButton";
import { RED_ICONS } from "./icons";

interface Props {
  config: MoratConfig;
}

export function PieSection({ config }: Props) {
  // The footer CTA falls back to the hero one so it only needs filling when
  // it should point somewhere else.
  const ctaLabel = config.ctaFooterLabel || config.ctaLabel;
  const ctaLink = config.ctaFooterLink || config.ctaLink;

  const redes = RED_ICONS.filter(({ key }) => isUrl(config.redes[key]));
  const legal = config.legal.filter((l) => !!l.label);

  return (
    <section className="mt-sec mt-foot mt-bleed">
      <div className="mt-footer">
        <ArtImage slot="footerArt" art={config.arteFooter} label="" className="mt-img" linkable={false} />

        <div className="mt-footer-overlay">
          {config.footerFecha && <p className="mt-foot-cta-date">{config.footerFecha}</p>}

          <CtaButton label={ctaLabel} link={ctaLink} big />

          {redes.length > 0 && (
            <>
              <p className="mt-foot-follow">SÍGUENOS</p>
              <div className="mt-social">
                {redes.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    className="mt-soc"
                    href={config.redes[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </>
          )}

          {legal.length > 0 && (
            <div className="mt-legal">
              {legal.map((item, i) => (
                <Fragment key={i}>
                  {i > 0 && <i className="mt-legal-sep">·</i>}
                  {isUrl(item.link) ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </Fragment>
              ))}
            </div>
          )}

          {config.copyright && <p className="mt-copy">{config.copyright}</p>}
        </div>
      </div>
    </section>
  );
}
