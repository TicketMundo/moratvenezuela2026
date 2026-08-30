"use client";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { MoratConfigInput } from "@/lib/schemas";

/** Venezuela does not observe DST, so a fixed offset is exact all year. */
const VE_OFFSET = "-04:00";

/** ISO with offset -> the "YYYY-MM-DDTHH:mm" the native picker expects. */
function toInputValue(iso: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  return m ? `${m[1]}T${m[2]}` : "";
}

/** Picker value -> ISO string stamped with the venue's offset. */
function toStoredValue(value: string): string {
  return value ? `${value}:00${VE_OFFSET}` : "";
}

type DateFieldName = "revelacionFecha" | "showFecha";

interface Props {
  name: DateFieldName;
  label: string;
  hint?: string;
}

/**
 * Datetime picker that always reads and writes Venezuela local time, so the
 * countdown means the same thing on the editor's machine and on the server.
 */
export function DateTimeField({ name, label, hint }: Props) {
  const { control } = useFormContext<MoratConfigInput>();

  return (
    <div className="flex flex-col gap-1">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            label={label}
            id={name}
            type="datetime-local"
            value={toInputValue(field.value ?? "")}
            onChange={(e) => field.onChange(toStoredValue(e.target.value))}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <span className="text-xs opacity-60">
        {hint ? `${hint} · ` : ""}Hora de Venezuela (UTC{VE_OFFSET})
      </span>
    </div>
  );
}
