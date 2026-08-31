"use client";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UploadButton } from "@/components/admin/UploadButton";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import { deleteAsset } from "@/lib/delete-asset";
import { isUrl } from "@/lib/morat-render";
import { PATROCINADORES_LOGOS_INDIVIDUALES } from "@/lib/feature-flags";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

/**
 * Logos are black artwork, so previews sit on white here just like they do on
 * the landing's light band. On the admin's dark theme they would otherwise be
 * invisible. `object-contain` keeps wide marks from being cropped.
 */
function LogoPreview({ url }: { url: string }) {
  if (!isUrl(url)) {
    return (
      <div className="h-24 rounded-input border border-dashed border-line-light dark:border-line-dark flex items-center justify-center text-xs opacity-50">
        Sin logo
      </div>
    );
  }
  return (
    <div className="h-24 rounded-input border border-line-light dark:border-line-dark bg-white p-3 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
    </div>
  );
}

/**
 * Sponsors. The section is a single full-width banner.
 *
 * The per-logo editor below is dormant behind PATROCINADORES_LOGOS_INDIVIDUALES
 * (lib/feature-flags.ts) together with its landing counterpart, so flipping one
 * constant brings the whole feature back. Hooks stay unconditional — the flag
 * only gates what renders.
 */
export function PatrocinadoresSection({ eventoId }: Props) {
  const {
    control,
    register,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<MoratConfigInput>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "patrocinadores" });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const logosHabilitados = PATROCINADORES_LOGOS_INDIVIDUALES;
  const bannerUrl = watch("artePatrocinadores.image") ?? "";
  const bannerWins = isUrl(bannerUrl);
  const fondoOscuro = watch("patrocinadoresFondo") === "oscuro";

  return (
    <section id="patrocinadores" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Patrocinadores</h2>
          <p className="text-sm opacity-60 mt-0.5">
            {logosHabilitados
              ? "Los logos desfilan solos sobre una banda clara a todo el ancho, y se frenan al pasar el mouse."
              : "Una sola imagen a todo el ancho del contenedor. Sin imagen se muestra un recuadro punteado de marcador."}
          </p>
        </div>
        {logosHabilitados && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ nombre: "", logo: "", link: "" })}
          >
            <Plus className="h-4 w-4" />
            Logo
          </Button>
        )}
      </div>

      <Card className="flex flex-col gap-3">
        <Select
          label="Fondo de la banda"
          id="patrocinadoresFondo"
          {...register("patrocinadoresFondo")}
        >
          <option value="claro">Claro — para logos negros</option>
          <option value="oscuro">Oscuro — para logos blancos</option>
        </Select>
        <span className="text-xs opacity-60">
          Los logos negros necesitan fondo claro; los blancos, fondo oscuro. Cambialo según
          la versión del banner que subas.
        </span>

        {bannerWins && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Cómo se va a ver</span>
            {/* Hex values mirror --mt-negro and --mt-hueso from app/morat.css,
                which the admin does not load. */}
            <div
              className="rounded-input border border-line-light dark:border-line-dark p-3 flex items-center justify-center"
              style={{ background: fondoOscuro ? "#060607" : "#f4f2ec" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerUrl}
                alt=""
                className="max-h-24 max-w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </Card>

      {logosHabilitados && (
        <>
          {bannerWins && (
            <Card className="border-brand/40">
              <p className="text-sm">
                Hay un <strong>banner compuesto</strong> cargado más abajo. Mientras esté,
                reemplaza a los logos sueltos. Borralo si querés que se vea el desfile.
              </p>
            </Card>
          )}

          {fields.length === 0 && (
            <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
              <Award className="h-8 w-8" />
              <p className="text-sm">Sin logos.</p>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, idx) => {
              const logoUrl = watch(`patrocinadores.${idx}.logo`);
              const pErrors = errors.patrocinadores?.[idx];

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
                      <span className="text-sm font-medium opacity-60">Logo {idx + 1}</span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Eliminar logo ${idx + 1}`}
                      onClick={() => setDeleteIndex(idx)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Input
                    label="Nombre"
                    id={`patrocinadores.${idx}.nombre`}
                    placeholder="Ej: Cusica"
                    {...register(`patrocinadores.${idx}.nombre`)}
                    error={pErrors?.nombre?.message}
                  />

                  <Input
                    label="Link (opcional)"
                    id={`patrocinadores.${idx}.link`}
                    placeholder="https://..."
                    {...register(`patrocinadores.${idx}.link`)}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Logo{" "}
                      <span className="opacity-60 font-normal">
                        — PNG con fondo transparente
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`patrocinadores.${idx}.logo`}
                        placeholder="https://..."
                        {...register(`patrocinadores.${idx}.logo`)}
                        className="flex-1"
                      />
                      <UploadButton
                        eventoId={eventoId}
                        onUploaded={(url) => {
                          const old = getValues(`patrocinadores.${idx}.logo`);
                          setValue(`patrocinadores.${idx}.logo`, url, { shouldDirty: true });
                          if (old) deleteAsset(old);
                        }}
                      />
                    </div>
                    <LogoPreview url={logoUrl ?? ""} />
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <ArtSlotField
        name="artePatrocinadores"
        eventoId={eventoId}
        title={logosHabilitados ? "Banner compuesto (alternativa)" : "Banner de patrocinadores"}
        hint={
          logosHabilitados
            ? "Si cargás una imagen acá, reemplaza al desfile de logos. Dejalo vacío para usar los logos sueltos."
            : "Ocupa todo el ancho, sobre una banda clara para que los logos negros se lean. Subí un PNG con fondo transparente. Cargá también la versión móvil: un banner muy apaisado se vuelve ilegible en teléfono."
        }
      />

      {logosHabilitados && (
        <ConfirmDialog
          open={deleteIndex !== null}
          title="Eliminar logo"
          message="¿Seguro que querés eliminar este patrocinador?"
          confirmLabel="Eliminar"
          danger
          onConfirm={() => {
            if (deleteIndex !== null) {
              const logo = getValues(`patrocinadores.${deleteIndex}.logo`);
              if (logo) deleteAsset(logo);
              remove(deleteIndex);
            }
            setDeleteIndex(null);
          }}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </section>
  );
}
