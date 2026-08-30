"use client";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, Music } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { MoratConfigInput } from "@/lib/schemas";

/**
 * Manages a string[] with useWatch + setValue rather than useFieldArray,
 * which only handles object arrays. Same pattern the rest of the editor uses
 * for plain lists.
 */
export function MarqueeSection() {
  const { control, setValue, register } = useFormContext<MoratConfigInput>();
  const canciones: string[] = useWatch({ control, name: "canciones" }) ?? [];

  const [nueva, setNueva] = useState("");

  function add() {
    const trimmed = nueva.trim();
    if (!trimmed) return;
    setValue("canciones", [...canciones, trimmed], { shouldDirty: true });
    setNueva("");
  }

  function remove(idx: number) {
    setValue(
      "canciones",
      canciones.filter((_, i) => i !== idx),
      { shouldDirty: true }
    );
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= canciones.length) return;
    const next = [...canciones];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setValue("canciones", next, { shouldDirty: true });
  }

  return (
    <section id="marquee" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Marquee</h2>
        <p className="text-sm opacity-60 mt-0.5">
          Cinta de canciones que corre bajo la cabecera. Sin canciones no se muestra.
        </p>
      </div>

      <Card>
        <div className="flex gap-2">
          <Input
            id="nueva-cancion"
            placeholder="Ej: Cómo Te Atreves"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className="flex-1"
            aria-label="Nueva canción"
          />
          <Button type="button" variant="secondary" size="sm" onClick={add}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </Card>

      {canciones.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 opacity-40">
          <Music className="h-7 w-7" />
          <p className="text-sm">Sin canciones.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {canciones.map((cancion, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-3 rounded-card border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark"
          >
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
                disabled={idx === canciones.length - 1}
                onClick={() => move(idx, idx + 1)}
                className="h-5 w-5 inline-flex items-center justify-center rounded hover:bg-base-light dark:hover:bg-base-dark disabled:opacity-30 transition-colors"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <Input
              id={`canciones-${idx}`}
              {...register(`canciones.${idx}`)}
              defaultValue={cancion}
              className="flex-1"
              placeholder="Canción..."
              aria-label={`Canción ${idx + 1}`}
            />

            <button
              type="button"
              aria-label={`Eliminar canción ${idx + 1}`}
              onClick={() => remove(idx)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
