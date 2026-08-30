"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

export function VideosSection({ eventoId }: Props) {
  const { control, register } = useFormContext<MoratConfigInput>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "videos" });

  return (
    <section id="videos" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Videos</h2>
          <p className="text-sm opacity-60 mt-0.5">
            Carrusel vertical 9:16. Acepta links de YouTube normales, Shorts o youtu.be.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ titulo: "", descripcion: "", url: "" })}
        >
          <Plus className="h-4 w-4" />
          Video
        </Button>
      </div>

      <Card>
        <Input
          label="Subtítulo de la sección"
          id="videosSubtitulo"
          placeholder="Ej: El regreso a Venezuela, capítulo a capítulo"
          {...register("videosSubtitulo")}
        />
      </Card>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Video className="h-8 w-8" />
          <p className="text-sm">Sin videos — la sección muestra “Próximamente”.</p>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => (
          <Card key={field.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    aria-label="Mover arriba"
                    disabled={idx === 0}
                    onClick={() => move(idx, idx - 1)}
                    className="h-5 w-5 inline-flex items-center justify-center rounded hover:bg-base-light dark:hover:bg-base-dark disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Mover abajo"
                    disabled={idx === fields.length - 1}
                    onClick={() => move(idx, idx + 1)}
                    className="h-5 w-5 inline-flex items-center justify-center rounded hover:bg-base-light dark:hover:bg-base-dark disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-sm font-medium opacity-60">Video {idx + 1}</span>
              </div>
              <button
                type="button"
                aria-label={`Eliminar video ${idx + 1}`}
                onClick={() => remove(idx)}
                className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <Input
              label="Título"
              id={`videos.${idx}.titulo`}
              placeholder="Ej: El anuncio"
              {...register(`videos.${idx}.titulo`)}
            />
            <Textarea
              label="Descripción"
              id={`videos.${idx}.descripcion`}
              rows={2}
              {...register(`videos.${idx}.descripcion`)}
            />
            <Input
              label="Link de YouTube"
              id={`videos.${idx}.url`}
              placeholder="https://www.youtube.com/shorts/..."
              {...register(`videos.${idx}.url`)}
            />
          </Card>
        ))}
      </div>

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
          hint="Sin imagen se dibuja el prisma de la gira."
          showLink={false}
          aspect="aspect-[260/560]"
        />
        <ArtSlotField
          name="arteLateralDer"
          eventoId={eventoId}
          title="Adorno lateral derecho"
          hint="Sin imagen se dibuja el prisma de la gira."
          showLink={false}
          aspect="aspect-[260/560]"
        />
      </div>
    </section>
  );
}
