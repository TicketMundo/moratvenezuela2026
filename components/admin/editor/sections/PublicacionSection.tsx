"use client";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { DateTimeField } from "@/components/admin/editor/DateTimeField";
import type { MoratConfigInput } from "@/lib/schemas";

export function PublicacionSection() {
  const { register, watch } = useFormContext<MoratConfigInput>();
  const publicado = watch("publicado");

  return (
    <section id="publicacion" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Publicación</h2>
        <p className="text-sm opacity-60 mt-0.5">
          Mientras el show no esté publicado, la página muestra solo la cuenta regresiva del
          anuncio. Nada del evento llega al navegador antes de tiempo.
        </p>
      </div>

      <Card className="flex flex-col gap-5">
        <Switch
          id="publicado"
          label="Publicar el show ahora"
          hint="Al activarlo la página se revela de inmediato, sin esperar la fecha."
          {...register("publicado")}
        />

        <DateTimeField
          name="revelacionFecha"
          label="Fecha de revelado automático"
          hint="Se revela sola al llegar esta fecha"
        />

        {publicado && (
          <p className="text-sm text-brand">
            El show ya está publicado: la cuenta regresiva del anuncio no se muestra.
          </p>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Pantalla de espera</h3>

        <Input
          label="Presenta"
          id="anuncioPresenta"
          placeholder="Ej: Cusica presenta"
          {...register("anuncioPresenta")}
        />
        <Input
          label="Título"
          id="anuncioTitulo"
          placeholder="Ej: Algo grande se acerca"
          {...register("anuncioTitulo")}
        />
        <Input
          label="Subtítulo"
          id="anuncioSubtitulo"
          placeholder="Ej: Lunes 31 de agosto · 11:00 AM (Venezuela)"
          {...register("anuncioSubtitulo")}
        />
      </Card>
    </section>
  );
}
