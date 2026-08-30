"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import { isUrl, isYoutube } from "@/lib/morat-render";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

/** Tells the editor which player their URL will land in, before they save. */
function FuenteHint({ url }: { url: string }) {
  if (!isUrl(url)) return null;
  return (
    <span className="text-xs opacity-60">
      {isYoutube(url)
        ? "Detectado: YouTube — se muestra con el reproductor de YouTube."
        : "Detectado: archivo directo — se muestra con el reproductor del navegador."}
    </span>
  );
}

export function VideosSection({ eventoId }: Props) {
  const { register, watch } = useFormContext<MoratConfigInput>();

  const urlDesktop = watch("video.urlDesktop") ?? "";
  const urlMovil = watch("video.urlMovil") ?? "";

  return (
    <section id="videos" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Video</h2>
        <p className="text-sm opacity-60 mt-0.5">
          Un solo video, con una versión horizontal para escritorio y una vertical para móvil.
          Acepta links de YouTube o la URL directa de un archivo subido a DigitalOcean Spaces.
        </p>
      </div>

      <Card>
        <Input
          label="Subtítulo de la sección"
          id="videosSubtitulo"
          placeholder="Ej: El regreso a Venezuela, capítulo a capítulo"
          {...register("videosSubtitulo")}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Input
            label="Video escritorio — horizontal 16:9"
            id="video.urlDesktop"
            placeholder="https://... .mp4  o  https://youtube.com/..."
            {...register("video.urlDesktop")}
          />
          <FuenteHint url={urlDesktop} />
        </div>

        <div className="flex flex-col gap-1">
          <Input
            label="Video móvil — vertical 9:16"
            id="video.urlMovil"
            placeholder="https://... .mp4  o  https://youtube.com/..."
            {...register("video.urlMovil")}
          />
          <FuenteHint url={urlMovil} />
          {!isUrl(urlMovil) && isUrl(urlDesktop) && (
            <span className="text-xs opacity-60">
              Vacío: en móvil se usa el horizontal, en un marco 16:9 para no recortarlo.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 text-xs opacity-60">
          <p>
            Los archivos de video no se suben desde acá — pesan demasiado para este formulario.
            Subilos al bucket de DigitalOcean Spaces y pegá la URL pública.
          </p>
          <p>
            Exportá en <strong>MP4 con video H.264 y audio AAC</strong>, y activá{" "}
            <em>faststart</em>. Los navegadores no reproducen audio PCM (el que traen los
            .mov de edición): el video se ve pero el control de volumen aparece deshabilitado.
            Sin faststart, el navegador tiene que bajar el archivo entero antes de arrancar.
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Textos</h3>
        <Input
          label="Título"
          id="video.titulo"
          placeholder="Ej: El anuncio"
          {...register("video.titulo")}
        />
        <Textarea
          label="Descripción"
          id="video.descripcion"
          rows={3}
          {...register("video.descripcion")}
        />
      </Card>

      <ArtSlotField
        name="artePosterVideo"
        eventoId={eventoId}
        title="Portada del video"
        hint="Se ve antes de darle play. Importa si el video es un archivo propio: sin portada arranca en negro. La versión móvil se usa en el corte vertical. No aplica a YouTube, que trae su propia miniatura."
        showLink={false}
      />

      <ArtSlotField
        name="arteTituloVideos"
        eventoId={eventoId}
        title='Arte del título "Morat en vivo"'
        hint="Sin imagen se usa el título tipográfico de la gira."
        showLink={false}
      />

      <div className="grid grid-cols-1 gap-4">
        <ArtSlotField
          name="arteLateralIzq"
          eventoId={eventoId}
          title="Adorno lateral izquierdo"
          hint="Sin imagen se dibuja el prisma de la gira. Solo se ve en escritorio."
          showLink={false}
          aspect="aspect-[260/560]"
        />
        <ArtSlotField
          name="arteLateralDer"
          eventoId={eventoId}
          title="Adorno lateral derecho"
          hint="Sin imagen se dibuja el prisma de la gira. Solo se ve en escritorio."
          showLink={false}
          aspect="aspect-[260/560]"
        />
      </div>
    </section>
  );
}
