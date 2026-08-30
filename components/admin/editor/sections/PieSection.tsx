"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

const REDES = [
  { name: "redes.instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { name: "redes.tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { name: "redes.youtube", label: "YouTube", placeholder: "https://youtube.com/@..." },
  { name: "redes.x", label: "X", placeholder: "https://x.com/..." },
  { name: "redes.facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { name: "redes.spotify", label: "Spotify", placeholder: "https://open.spotify.com/..." },
] as const;

export function PieSection({ eventoId }: Props) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<MoratConfigInput>();

  const { fields, append, remove } = useFieldArray({ control, name: "legal" });

  return (
    <section id="pie" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Pie</h2>
        <p className="text-sm opacity-60 mt-0.5">
          Cierre de la página: fecha, botón, redes y enlaces legales.
        </p>
      </div>

      <Card className="flex flex-col gap-4">
        <Input
          label="Línea de fecha"
          id="footerFecha"
          placeholder="Ej: 12 y 13 de Diciembre 2026 · Universidad Simón Bolívar, Caracas"
          {...register("footerFecha")}
        />
        <Input
          label="Texto del botón (opcional)"
          id="ctaFooterLabel"
          placeholder="Si lo dejás vacío usa el de la sección Intro"
          {...register("ctaFooterLabel")}
        />
        <Input
          label="Link del botón (opcional)"
          id="ctaFooterLink"
          placeholder="Si lo dejás vacío usa el de la sección Intro"
          {...register("ctaFooterLink")}
        />
        <Input
          label="Copyright"
          id="copyright"
          placeholder="Ej: © 2026 MORAT EN CARACAS"
          {...register("copyright")}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Redes sociales</h3>
        <p className="text-xs opacity-60 -mt-2">
          Solo se muestran las que tengan link. Sin ninguna, el bloque “Síguenos” desaparece.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REDES.map((red) => (
            <Input
              key={red.name}
              label={red.label}
              id={red.name}
              placeholder={red.placeholder}
              {...register(red.name)}
            />
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Enlaces legales</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ label: "", link: "" })}
          >
            <Plus className="h-4 w-4" />
            Enlace
          </Button>
        </div>

        {fields.length === 0 && <p className="text-sm opacity-50 py-2">Sin enlaces legales.</p>}

        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-end gap-2">
            <Input
              label="Texto"
              id={`legal.${idx}.label`}
              placeholder="Ej: Términos y Condiciones"
              {...register(`legal.${idx}.label`)}
              error={errors.legal?.[idx]?.label?.message}
              className="flex-1"
            />
            <Input
              label="Link"
              id={`legal.${idx}.link`}
              placeholder="https://..."
              {...register(`legal.${idx}.link`)}
              className="flex-1"
            />
            <button
              type="button"
              aria-label={`Eliminar enlace ${idx + 1}`}
              onClick={() => remove(idx)}
              className="h-10 w-10 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </Card>

      <ArtSlotField
        name="arteFooter"
        eventoId={eventoId}
        title="Arte de cierre"
        hint="Sin imagen se usa el degradado de luz por defecto."
        showLink={false}
      />
    </section>
  );
}
