import type { ArtSlot, VideoDestacado } from "@/lib/types";
import { isUrl, isYoutube, toEmbed } from "@/lib/morat-render";
import { SectionTitle } from "./ArtSlot";
import { PrismOrnament } from "./PrismOrnament";

interface Props {
  arte: ArtSlot;
  subtitulo: string;
  video: VideoDestacado;
  poster: ArtSlot;
  arteIzq: ArtSlot;
  arteDer: ArtSlot;
}

/** Left/right decoration: uploaded art if present, the drawn prism otherwise. */
function Side({ art, dir }: { art: ArtSlot; dir: 1 | -1 }) {
  return (
    <div className={`mt-side ${dir > 0 ? "mt-side-left" : "mt-side-right"}`} aria-hidden="true">
      {isUrl(art.image) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={art.image} alt="" />
      ) : (
        <PrismOrnament dir={dir} />
      )}
    </div>
  );
}

/**
 * YouTube links play through the iframe player; anything else — an MP4 on DO
 * Spaces, say — plays natively. The source type comes from the URL, so the
 * admin never has to declare it.
 *
 * `preload="none"` and `loading="lazy"` are what let both the desktop and the
 * mobile cut sit in the DOM at once without either costing bandwidth.
 */
function Player({
  url,
  poster,
  titulo,
}: {
  url: string;
  poster: string;
  titulo: string;
}) {
  if (isYoutube(url)) {
    return (
      <div className="mt-feature-frame">
        <iframe
          src={toEmbed(url)}
          title={titulo || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="mt-feature-frame">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={url}
        poster={isUrl(poster) ? poster : undefined}
        controls
        playsInline
        preload="none"
      />
    </div>
  );
}

export function VideosSection({ arte, subtitulo, video, poster, arteIzq, arteDer }: Props) {
  const tieneDesktop = isUrl(video.urlDesktop);
  const tieneVertical = isUrl(video.urlMovil);
  const hayVideo = tieneDesktop || tieneVertical;

  // Without a vertical cut the horizontal one plays on phones too, and the
  // frame switches to 16:9 so it is letterboxed rather than cropped.
  const urlMovil = tieneVertical ? video.urlMovil : video.urlDesktop;
  const urlDesktop = tieneDesktop ? video.urlDesktop : video.urlMovil;

  return (
    <section className="mt-sec mt-video-sec">
      <SectionTitle slot="videosTitle" art={arte} text="Morat en vivo" />
      {subtitulo && <p className="mt-videos-sub">{subtitulo}</p>}

      <div className="mt-video-stage">
        <Side art={arteIzq} dir={1} />
        <Side art={arteDer} dir={-1} />

        <div className="mt-carousel">
          {!hayVideo ? (
            <div className="mt-car-empty">
              VIDEOS
              <br />
              PRÓXIMAMENTE
            </div>
          ) : (
            // column-reverse in CSS: the player paints above the text block
            <div className="mt-car-stage">
              <div className="mt-car-info">
                {video.titulo && <h4 className="mt-car-eptitle">{video.titulo}</h4>}
                {video.descripcion && <p className="mt-car-epdesc">{video.descripcion}</p>}
              </div>

              <div className="mt-feature mt-feature-desktop">
                <Player url={urlDesktop} poster={poster.image} titulo={video.titulo} />
              </div>

              <div
                className={`mt-feature mt-feature-movil${tieneVertical ? "" : " mt-feature-16x9"}`}
              >
                <Player
                  url={urlMovil}
                  poster={poster.imageMobile || poster.image}
                  titulo={video.titulo}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
