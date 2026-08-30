"use client";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

export function ClaimSection({ eventoId }: Props) {
  const { register } = useFormContext<MoratConfigInput>();

  return (
    <section id="claim" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Claim</h2>
        <p className="text-sm opacity-60 mt-0.5">
          La frase a todo color en el medio de la página.
        </p>
      </div>

      <Card className="flex flex-col gap-4">
        <Input
          label="Antetítulo"
          id="claimKicker"
          placeholder="Ej: 12 y 13 · Dic · 2026 — Universidad Simón Bolívar"
          {...register("claimKicker")}
        />
        <Textarea
          label="Frase"
          id="claimTexto"
          rows={3}
          placeholder="Ej: Hoy por lo que mañana recordaremos"
          {...register("claimTexto")}
        />
      </Card>

      <ArtSlotField
        name="arteClaim"
        eventoId={eventoId}
        title="Arte del claim"
        hint="Si cargás una imagen reemplaza la frase tipográfica."
      />
    </section>
  );
}
