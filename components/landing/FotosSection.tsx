"use client";
import { useEffect, useState } from "react";
import type { FotoItem } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";

interface Props {
  fotos: FotoItem[];
}

const AUTOPLAY_MS = 5000;

export function FotosSection({ fotos }: Props) {
  const items = fotos.filter((f) => isUrl(f.imagen));
  const total = items.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [total, paused]);

  if (total === 0) {
    return (
      <section className="mt-sec">
        <div className="mt-photos">
          <div className="mt-ph-empty">FOTOS · PRÓXIMAMENTE</div>
        </div>
      </section>
    );
  }

  const go = (i: number) => setIdx(((i % total) + total) % total);
  const hasNav = total > 1;

  return (
    <section className="mt-sec">
      <div className="mt-photos">
        {hasNav && (
          <button
            type="button"
            className="mt-ph-arrow mt-ph-prev"
            aria-label="Anterior"
            onClick={() => go(idx - 1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            ‹
          </button>
        )}

        <div className="mt-ph-viewport">
          <div className="mt-ph-track" style={{ transform: `translateX(${-idx * 100}%)` }}>
            {items.map((foto, i) => {
              const picture = isUrl(foto.imagenMovil) ? (
                <picture>
                  <source media="(max-width:749px)" srcSet={foto.imagenMovil} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.imagen} alt="" />
                </picture>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto.imagen} alt="" />
              );

              return (
                <div className="mt-ph-slide" key={i}>
                  {isUrl(foto.link) ? (
                    <a href={foto.link} target="_blank" rel="noopener noreferrer">
                      {picture}
                    </a>
                  ) : (
                    picture
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {hasNav && (
          <button
            type="button"
            className="mt-ph-arrow mt-ph-next"
            aria-label="Siguiente"
            onClick={() => go(idx + 1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            ›
          </button>
        )}

        {hasNav && (
          <div className="mt-ph-dots">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`mt-ph-dot${i === idx ? " is-active" : ""}`}
                aria-label={`Ir a la foto ${i + 1}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
