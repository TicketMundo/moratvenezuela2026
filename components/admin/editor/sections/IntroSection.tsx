"use client";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { DateTimeField } from "@/components/admin/editor/DateTimeField";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

export function IntroSection({ eventoId }: Props) {
  const { register } = useFormContext<MoratConfigInput>();

  return (
    <section id="intro" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Intro</h2>
        <p className="text-sm opacity-60 mt-0.5">
          Los cuatro textos de la cabecera, el contador del show y el botón principal.
        </p>
      </div>

      <Card className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Textos</h3>

        <Input
          label="1 · Presenta"
          id="presenta"
          placeholder="Ej: Cusica presenta"
          {...register("presenta")}
        />
        <Input
          label="2 · Nombre del artista"
          id="bandName"
          placeholder="Ej: MORAT"
          {...register("bandName")}
        />
        <div className="flex flex-col gap-1">
          <Input
            label="3 · Nombre de la gira"
            id="tourName"
            placeholder="Ej: Ya Es Mañana |World Tour|"
            {...register("tourName")}
          />
          <span className="text-xs opacity-60">
            Lo que escribas entre barras se pinta con el degradado del prisma. Ej:{" "}
            <code>Ya Es Mañana |World Tour|</code>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">4 · Línea de fecha y lugar</span>
          <span className="text-xs opacity-60 mb-1">
            Los tres campos se muestran en una sola línea separados por barras.
          </span>
          <Input
            id="metaFecha"
            placeholder="Ej: Sábado 12 y Domingo 13 · Diciembre · 2026"
            {...register("metaFecha")}
          />
          <Input id="venue" placeholder="Ej: Universidad Simón Bolívar" {...register("venue")} />
          <Input id="ciudad" placeholder="Ej: Caracas, Venezuela" {...register("ciudad")} />
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h3 className="text-sm font-semibold">Cuenta regresiva del show</h3>
        <Switch
          id="mostrarCountdownShow"
          label="Mostrar contador en la cabecera"
          {...register("mostrarCountdownShow")}
        />
        <DateTimeField
          name="showFecha"
          label="Fecha y hora de la primera función"
          hint="Hacia acá cuenta el contador"
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Botón principal</h3>
        <Input
          label="Texto del botón"
          id="ctaLabel"
          placeholder="Ej: Canjea tus entradas aquí"
          {...register("ctaLabel")}
        />
        <Input
          label="Link del botón"
          id="ctaLink"
          placeholder="https://..."
          {...register("ctaLink")}
        />
        <p className="text-xs opacity-60">
          Sin link, el botón se ve igual pero no navega. Sirve para publicar antes de tener la
          URL de la ticketera.
        </p>
      </Card>

      <ArtSlotField
        name="arteHeader"
        eventoId={eventoId}
        title="Arte de cabecera"
        hint="Si cargás una imagen reemplaza toda la cabecera tipográfica."
      />
    </section>
  );
}
