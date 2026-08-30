"use client";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import type { MoratConfigInput } from "@/lib/schemas";

export function BeneficoSection() {
  const { register } = useFormContext<MoratConfigInput>();

  return (
    <section id="benefico" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Concierto benéfico</h2>
        <p className="text-sm opacity-60 mt-0.5">
          El distintivo también aparece en la cabecera, sobre el contador.
        </p>
      </div>

      <Card className="flex flex-col gap-5">
        <Switch
          id="benefico.mostrar"
          label="Mostrar la sección"
          {...register("benefico.mostrar")}
        />

        <Input
          label="Distintivo"
          id="benefico.badge"
          placeholder="Ej: Concierto benéfico"
          {...register("benefico.badge")}
        />
        <Input
          label="Antetítulo"
          id="benefico.kicker"
          placeholder="Ej: Por las víctimas del terremoto del 24 de julio"
          {...register("benefico.kicker")}
        />
        <Input
          label="Título"
          id="benefico.titulo"
          placeholder="Ej: Dos noches para volver a empezar"
          {...register("benefico.titulo")}
        />
        <Textarea
          label="Texto"
          id="benefico.texto"
          rows={5}
          placeholder="Explicá a dónde va lo recaudado."
          {...register("benefico.texto")}
        />
        <Textarea
          label="Nota al pie"
          id="benefico.nota"
          rows={3}
          placeholder="Ej: Los fondos se canalizan a través de organizaciones aliadas."
          {...register("benefico.nota")}
        />
      </Card>
    </section>
  );
}
