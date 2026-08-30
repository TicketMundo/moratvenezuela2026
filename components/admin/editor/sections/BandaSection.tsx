"use client";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import { deleteAsset } from "@/lib/delete-asset";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

export function BandaSection({ eventoId }: Props) {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<MoratConfigInput>();

  const { fields, append, remove } = useFieldArray({ control, name: "integrantes" });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <section id="banda" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">La Banda</h2>
          <p className="text-sm opacity-60 mt-0.5">
            Las fotos se muestran en blanco y negro y toman color al pasar el mouse.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ nombre: "", rol: "", imagen: "", spotify: "" })}
        >
          <Plus className="h-4 w-4" />
          Integrante
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Users className="h-8 w-8" />
          <p className="text-sm">Sin integrantes.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const imagen = watch(`integrantes.${idx}.imagen`);
          const iErrors = errors.integrantes?.[idx];

          return (
            <Card key={field.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-60">Integrante {idx + 1}</span>
                <button
                  type="button"
                  aria-label={`Eliminar integrante ${idx + 1}`}
                  onClick={() => setDeleteIndex(idx)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <Input
                label="Nombre"
                id={`integrantes.${idx}.nombre`}
                placeholder="Ej: Juan Pablo Isaza"
                {...register(`integrantes.${idx}.nombre`)}
                error={iErrors?.nombre?.message}
              />

              <Input
                label="Rol"
                id={`integrantes.${idx}.rol`}
                placeholder="Ej: Voz y guitarra"
                {...register(`integrantes.${idx}.rol`)}
              />

              <Input
                label="Link de Spotify (opcional)"
                id={`integrantes.${idx}.spotify`}
                placeholder="https://open.spotify.com/..."
                {...register(`integrantes.${idx}.spotify`)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Foto</label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`integrantes.${idx}.imagen`}
                    placeholder="https://..."
                    {...register(`integrantes.${idx}.imagen`)}
                    className="flex-1"
                  />
                  <UploadButton
                    eventoId={eventoId}
                    onUploaded={(url) => {
                      const old = getValues(`integrantes.${idx}.imagen`);
                      setValue(`integrantes.${idx}.imagen`, url, { shouldDirty: true });
                      if (old) deleteAsset(old);
                    }}
                  />
                </div>
                <ImagePreview
                  url={imagen}
                  alt={`Foto integrante ${idx + 1}`}
                  aspect="aspect-square"
                  className="max-w-[140px]"
                />
              </div>
            </Card>
          );
        })}
      </div>

      <ArtSlotField
        name="arteTituloBanda"
        eventoId={eventoId}
        title='Arte del título "La Banda"'
        hint="Sin imagen se usa el título tipográfico de la gira."
        showLink={false}
      />

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar integrante"
        message="¿Seguro que querés eliminar este integrante?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) {
            const imagen = getValues(`integrantes.${deleteIndex}.imagen`);
            if (imagen) deleteAsset(imagen);
            remove(deleteIndex);
          }
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </section>
  );
}
