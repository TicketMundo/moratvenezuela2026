import type { Metadata } from "next";
import { cache } from "react";
import "./morat.css";

import { europa } from "./fonts";
import { readJson, configKey } from "@/lib/s3-client";
import { moratConfigSchema } from "@/lib/schemas";
import { DEFAULT_MORAT_CONFIG, type MoratConfig } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";

import { AnuncioCountdown } from "@/components/landing/AnuncioCountdown";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { BeneficoSection } from "@/components/landing/BeneficoSection";
import { EntradasSection } from "@/components/landing/EntradasSection";
import { BandaSection } from "@/components/landing/BandaSection";
import { ClaimSection } from "@/components/landing/ClaimSection";
import { VideosSection } from "@/components/landing/VideosSection";
import { FotosSection } from "@/components/landing/FotosSection";
import { PatrocinadoresSection } from "@/components/landing/PatrocinadoresSection";
import { PieSection } from "@/components/landing/PieSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const loadConfig = cache(async (): Promise<MoratConfig> => {
  const id = process.env.DEFAULT_EVENTO_ID || "MORAT";
  try {
    const raw = await readJson<unknown>(configKey(id));
    if (!raw) return DEFAULT_MORAT_CONFIG;
    const parsed = moratConfigSchema.safeParse(raw);
    return parsed.success ? (parsed.data as MoratConfig) : DEFAULT_MORAT_CONFIG;
  } catch {
    return DEFAULT_MORAT_CONFIG;
  }
});

/** Strips the |prism| markers so the tour name reads plainly in metadata. */
function plainTour(tourName: string): string {
  return tourName.replace(/\|/g, "").trim();
}

/**
 * The show is revealed by either trigger: the manual publish switch, or the
 * reveal date passing. Evaluated per request — the route is force-dynamic.
 */
function isRevealed(config: MoratConfig): boolean {
  if (config.publicado) return true;
  const at = Date.parse(config.revelacionFecha);
  return !Number.isNaN(at) && Date.now() >= at;
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const revealed = isRevealed(config);

  if (!revealed) {
    // Nothing about the show before the announcement.
    const title = config.anuncioTitulo || "Próximamente";
    return {
      title,
      description: config.anuncioSubtitulo || undefined,
      robots: { index: false, follow: false },
    };
  }

  const tour = plainTour(config.tourName);
  const title = [config.bandName, tour].filter(Boolean).join(" · ") || "Ticketmundo";
  const description =
    config.benefico.texto ||
    [config.metaFecha, config.venue, config.ciudad].filter(Boolean).join(" · ") ||
    undefined;
  const image = isUrl(config.arteHeader.image) ? config.arteHeader.image : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

// Applied before first paint so the page never flashes the admin's light theme.
const THEME_SCRIPT = `document.documentElement.classList.add("mt-dark")`;

export default async function HomePage() {
  const config = await loadConfig();
  const revealed = isRevealed(config);

  const jsonLd = revealed
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: [config.bandName, plainTour(config.tourName)].filter(Boolean).join(" · "),
        description: config.benefico.texto || undefined,
        image: isUrl(config.arteHeader.image) ? config.arteHeader.image : undefined,
        ...(Number.isNaN(Date.parse(config.showFecha))
          ? {}
          : { startDate: new Date(config.showFecha).toISOString() }),
        location: {
          "@type": "Place",
          name: config.venue,
          address: { "@type": "PostalAddress", addressLocality: config.ciudad },
        },
        organizer: {
          "@type": "Organization",
          name: "Ticketmundo",
          url: "https://ticketmundo.com.ve",
        },
      }
    : null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* europa.variable exposes --font-europa to the stylesheet below this node */}
      <div className={`mt-page ${europa.variable}`}>
        {!revealed ? (
          <AnuncioCountdown
            presenta={config.anuncioPresenta}
            titulo={config.anuncioTitulo}
            subtitulo={config.anuncioSubtitulo}
            target={config.revelacionFecha}
          />
        ) : (
          <div className="mt-festival">
            <HeroSection config={config} />
            <MarqueeSection canciones={config.canciones} />
            <BeneficoSection benefico={config.benefico} />
            <EntradasSection
              arte={config.arteTituloEntradas}
              nota={config.entradasNota}
              funciones={config.funciones}
              cola={config.cola}
            />
            <BandaSection arte={config.arteTituloBanda} integrantes={config.integrantes} />
            <ClaimSection
              arte={config.arteClaim}
              kicker={config.claimKicker}
              texto={config.claimTexto}
            />
            <VideosSection
              arte={config.arteTituloVideos}
              subtitulo={config.videosSubtitulo}
              video={config.video}
              poster={config.artePosterVideo}
              arteIzq={config.arteLateralIzq}
              arteDer={config.arteLateralDer}
            />
            <FotosSection fotos={config.fotos} />
            <PatrocinadoresSection
              arte={config.artePatrocinadores}
              patrocinadores={config.patrocinadores}
              fondo={config.patrocinadoresFondo}
            />
            <PieSection config={config} />
          </div>
        )}
      </div>
    </>
  );
}
