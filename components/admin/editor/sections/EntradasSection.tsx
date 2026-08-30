"use client";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, Ticket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

const ESTADOS = [
  { value: "active", label: "A la venta" },
  { value: "soon", label: "Próximamente" },
  { value: "soldout", label: "Agotada" },
  { value: "hidden", label: "Oculta" },
] as const;

const ENTRADA_NUEVA = {
  nombre: "",
  nota: "",
  precio: "",
  estado: "active" as const,
  link: "",
  destacada: false,
};

/** Ticket types of a single night. */
function EntradasDeFuncion({ funcionIndex }: { funcionIndex: number }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<MoratConfigInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `funciones.${funcionIndex}.entradas` as const,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-60">Tipos de entrada</span>
        <Button type="button" variant="secondary" size="sm" onClick={() => append(ENTRADA_NUEVA)}>
          <Plus className="h-4 w-4" />
          Entrada
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm opacity-50 py-4 text-center">
          Esta función todavía no tiene entradas.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const eErrors = errors.funciones?.[funcionIndex]?.entradas?.[idx];

          return (
            <div
              key={field.id}
              className="flex flex-col gap-3 rounded-card border border-line-light dark:border-line-dark p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-60">Entrada {idx + 1}</span>
                <button
                  type="button"
                  aria-label={`Eliminar entrada ${idx + 1}`}
                  onClick={() => remove(idx)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <Input
                label="Nombre"
                id={`funciones.${funcionIndex}.entradas.${idx}.nombre`}
                placeholder="Ej: General"
                {...register(`funciones.${funcionIndex}.entradas.${idx}.nombre`)}
                error={eErrors?.nombre?.message}
              />

              <Input
                label="Precio"
                id={`funciones.${funcionIndex}.entradas.${idx}.precio`}
                placeholder="Ej: REF 50"
                {...register(`funciones.${funcionIndex}.entradas.${idx}.precio`)}
              />

              <Input
                label="Nota (opcional)"
                id={`funciones.${funcionIndex}.entradas.${idx}.nota`}
                placeholder="Ej: Incluye acceso temprano"
                {...register(`funciones.${funcionIndex}.entradas.${idx}.nota`)}
              />

              <Select
                label="Estado"
                id={`funciones.${funcionIndex}.entradas.${idx}.estado`}
                {...register(`funciones.${funcionIndex}.entradas.${idx}.estado`)}
              >
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </Select>

              <Input
                label="Link de compra"
                id={`funciones.${funcionIndex}.entradas.${idx}.link`}
                placeholder="https://..."
                {...register(`funciones.${funcionIndex}.entradas.${idx}.link`)}
              />

              <Switch
                id={`funciones.${funcionIndex}.entradas.${idx}.destacada`}
                label="Destacar esta entrada"
                {...register(`funciones.${funcionIndex}.entradas.${idx}.destacada`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EntradasSection({ eventoId }: Props) {
  const { control, register } = useFormContext<MoratConfigInput>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "funciones" });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <section id="entradas" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Entradas</h2>
          <p className="text-sm opacity-60 mt-0.5">
            Una función por noche. Cada una lleva su encabezado y sus tipos de entrada, con link
            propio por botón.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ heading: "", entradas: [] })}
        >
          <Plus className="h-4 w-4" />
          Función
        </Button>
      </div>

      <Card>
        <Input
          label="Nota sobre las entradas"
          id="entradasNota"
          placeholder="Ej: Mismo show las dos noches — elegí la fecha que prefieras."
          {...register("entradasNota")}
        />
      </Card>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Ticket className="h-8 w-8" />
          <p className="text-sm">Sin funciones cargadas.</p>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => (
          <Card key={field.id} className="flex flex-col gap-4">
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

              <Input
                id={`funciones.${idx}.heading`}
                placeholder="Ej: Día 1 · Sábado 12 de Diciembre"
                aria-label={`Encabezado de la función ${idx + 1}`}
                {...register(`funciones.${idx}.heading`)}
                className="flex-1"
              />

              <button
                type="button"
                aria-label={`Eliminar función ${idx + 1}`}
                onClick={() => setDeleteIndex(idx)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <EntradasDeFuncion funcionIndex={idx} />
          </Card>
        ))}
      </div>

      <ArtSlotField
        name="arteTituloEntradas"
        eventoId={eventoId}
        title='Arte del título "Entradas"'
        hint="Sin imagen se usa el título tipográfico de la gira."
        showLink={false}
      />

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar función"
        message="Se eliminan también todos sus tipos de entrada. ¿Seguro?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) remove(deleteIndex);
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </section>
  );
}
