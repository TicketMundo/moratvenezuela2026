import type { ArtSlot, Integrante } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";
import { SectionTitle } from "./ArtSlot";
import { SpotifyMark } from "./icons";

interface Props {
  arte: ArtSlot;
  integrantes: Integrante[];
}

export function BandaSection({ arte, integrantes }: Props) {
  const visibles = integrantes.filter((i) => i.nombre || isUrl(i.imagen));

  return (
    <section className="mt-sec">
      <SectionTitle slot="artistsTitle" art={arte} text="La Banda" />

      <div className="mt-artists">
        {visibles.length === 0 ? (
          <div
            className="mt-empty"
            data-slot="artistsEmpty"
            data-label="Agrega integrantes desde el admin"
            style={{ gridColumn: "1/-1" }}
          />
        ) : (
          visibles.map((integrante, i) => (
            <div className="mt-artist" key={i}>
              <div className="mt-artist-figure">
                {isUrl(integrante.imagen) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="mt-artist-img" src={integrante.imagen} alt={integrante.nombre} />
                ) : (
                  <div className="mt-artist-ph">Foto</div>
                )}
              </div>
              {integrante.nombre && <p className="mt-artist-name">{integrante.nombre}</p>}
              {integrante.rol && <p className="mt-artist-role">{integrante.rol}</p>}
              <div className="mt-artist-btns">
                {isUrl(integrante.spotify) && (
                  <a
                    className="mt-artist-btn mt-spotify"
                    href={integrante.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Spotify de ${integrante.nombre}`}
                  >
                    <SpotifyMark />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
