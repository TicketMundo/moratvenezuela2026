"use client";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, Images } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { deleteAsset } from "@/lib/delete-asset";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

export function FotosSection({ eventoId }: Props) {
  const { control, register, watch, setValue, getValues } = useFormContext<MoratConfigInput>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "fotos" });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <section id="fotos" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Fotos</h2>
          <p className="text-sm opacity-60 mt-0.5">
            Carrusel con avance automático. Sin fotos cargadas, la sección no se muestra.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ imagen: "", imagenMovil: "", link: "" })}
        >
          <Plus className="h-4 w-4" />
          Foto
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Images className="h-8 w-8" />
          <p className="text-sm">Sin fotos.</p>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => {
          const desktop = watch(`fotos.${idx}.imagen`);
          const mobile = watch(`fotos.${idx}.imagenMovil`);

          return (
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
                  <span className="text-sm font-medium opacity-60">Foto {idx + 1}</span>
                </div>
                <button
                  type="button"
                  aria-label={`Eliminar foto ${idx + 1}`}
                  onClick={() => setDeleteIndex(idx)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Escritorio</label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`fotos.${idx}.imagen`}
                      placeholder="https://..."
                      {...register(`fotos.${idx}.imagen`)}
                      className="flex-1"
                    />
                    <UploadButton
                      eventoId={eventoId}
                      onUploaded={(url) => {
                        const old = getValues(`fotos.${idx}.imagen`);
                        setValue(`fotos.${idx}.imagen`, url, { shouldDirty: true });
                        if (old) deleteAsset(old);
                      }}
                    />
                  </div>
                  <ImagePreview url={desktop} alt={`Foto ${idx + 1} escritorio`} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Móvil (opcional)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`fotos.${idx}.imagenMovil`}
                      placeholder="https://..."
                      {...register(`fotos.${idx}.imagenMovil`)}
                      className="flex-1"
                    />
                    <UploadButton
                      eventoId={eventoId}
                      onUploaded={(url) => {
                        const old = getValues(`fotos.${idx}.imagenMovil`);
                        setValue(`fotos.${idx}.imagenMovil`, url, { shouldDirty: true });
                        if (old) deleteAsset(old);
                      }}
                    />
                  </div>
                  <ImagePreview url={mobile} alt={`Foto ${idx + 1} móvil`} />
                </div>
              </div>

              <Input
                label="Link al hacer clic (opcional)"
                id={`fotos.${idx}.link`}
                placeholder="https://..."
                {...register(`fotos.${idx}.link`)}
              />
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar foto"
        message="¿Seguro que querés eliminar esta foto?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) {
            const desktop = getValues(`fotos.${deleteIndex}.imagen`);
            const mobile = getValues(`fotos.${deleteIndex}.imagenMovil`);
            if (desktop) deleteAsset(desktop);
            if (mobile) deleteAsset(mobile);
            remove(deleteIndex);
          }
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </section>
  );
}
