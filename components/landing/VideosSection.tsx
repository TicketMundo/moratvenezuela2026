"use client";
import { useState } from "react";
import type { ArtSlot, VideoItem } from "@/lib/types";
import { isUrl, toEmbed } from "@/lib/morat-render";
import { SectionTitle } from "./ArtSlot";
import { PrismOrnament } from "./PrismOrnament";

interface Props {
  arte: ArtSlot;
  subtitulo: string;
  videos: VideoItem[];
  arteIzq: ArtSlot;
  arteDer: ArtSlot;
}

/** Left/right decoration: uploaded art if present, the drawn prism otherwise. */
function Side({
  art,
  dir,
  onClick,
  title,
}: {
  art: ArtSlot;
  dir: 1 | -1;
  onClick?: () => void;
  title?: string;
}) {
  const position = dir > 0 ? "mt-side-left" : "mt-side-right";
  const className = `mt-side ${position}${onClick ? " mt-clickable" : ""}`;
  const content = isUrl(art.image) ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={art.image} alt="" />
  ) : (
    <PrismOrnament dir={dir} />
  );

  if (!onClick) {
    return (
      <div className={className} aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <div className={className} title={title} role="button" tabIndex={-1} onClick={onClick}>
      {content}
    </div>
  );
}

export function VideosSection({ arte, subtitulo, videos, arteIzq, arteDer }: Props) {
  const items = videos.filter((v) => !!v.url);
  const total = items.length;
  const [idx, setIdx] = useState(0);

  const go = (i: number) => setIdx(((i % total) + total) % total);
  const hasNav = total > 1;

  return (
    <section className="mt-sec mt-video-sec">
      <SectionTitle slot="videosTitle" art={arte} text="Morat en vivo" />
      {subtitulo && <p className="mt-videos-sub">{subtitulo}</p>}

      <div className={`mt-video-stage${hasNav ? " mt-has-nav" : ""}`}>
        <Side
          art={arteIzq}
          dir={1}
          onClick={hasNav ? () => go(idx - 1) : undefined}
          title="Video anterior"
        />
        <Side
          art={arteDer}
          dir={-1}
          onClick={hasNav ? () => go(idx + 1) : undefined}
          title="Video siguiente"
        />
        {hasNav && (
          <>
            <span className="mt-side-chev mt-side-chev-left" aria-hidden="true">
              ‹
            </span>
            <span className="mt-side-chev mt-side-chev-right" aria-hidden="true">
              ›
            </span>
          </>
        )}

        {total === 0 ? (
          <div className="mt-carousel">
            <div className="mt-car-empty">
              VIDEOS
              <br />
              PRÓXIMAMENTE
            </div>
          </div>
        ) : (
          <div className="mt-carousel">
            {/* column-reverse in CSS: the viewport paints above the info block */}
            <div className="mt-car-stage">
              <div className="mt-car-info">
                <p className="mt-car-counter">
                  Video {idx + 1} de {total}
                </p>
                <h4 className="mt-car-eptitle">{items[idx].titulo}</h4>
                <p className="mt-car-epdesc">{items[idx].descripcion}</p>

                {hasNav && (
                  <>
                    <div className="mt-car-nav">
                      <button
                        type="button"
                        className="mt-car-arrow mt-car-prev"
                        aria-label="Anterior"
                        onClick={() => go(idx - 1)}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="mt-car-arrow mt-car-next"
                        aria-label="Siguiente"
                        onClick={() => go(idx + 1)}
                      >
                        ›
                      </button>
                    </div>
                    <div className="mt-car-dots">
                      {items.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`mt-car-dot${i === idx ? " is-active" : ""}`}
                          aria-label={`Ir al video ${i + 1}`}
                          onClick={() => go(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-car-viewport">
                <div
                  className="mt-car-track"
                  style={{ transform: `translateX(${-idx * 100}%)` }}
                >
                  {items.map((video, i) => (
                    <div className="mt-car-slide" key={i}>
                      <div className="mt-car-slide-inner">
                        <iframe
                          src={toEmbed(video.url)}
                          title={video.titulo || `Video ${i + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
