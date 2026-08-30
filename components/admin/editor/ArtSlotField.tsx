"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { deleteAsset } from "@/lib/delete-asset";
import type { MoratConfigInput } from "@/lib/schemas";

/** Every image slot in the config. Keeps the field paths type-checked. */
export type ArtSlotName =
  | "arteHeader"
  | "arteTituloEntradas"
  | "arteTituloBanda"
  | "arteClaim"
  | "arteTituloVideos"
  | "artePosterVideo"
  | "arteLateralIzq"
  | "arteLateralDer"
  | "artePatrocinadores"
  | "arteFooter";

interface Props {
  name: ArtSlotName;
  eventoId: string;
  title: string;
  /** Explains what the landing falls back to when this slot is empty. */
  hint?: string;
  /** Slots that are purely decorative never get a link field. */
  showLink?: boolean;
  aspect?: string;
}

export function ArtSlotField({
  name,
  eventoId,
  title,
  hint,
  showLink = true,
  aspect = "aspect-video",
}: Props) {
  const { register, watch, setValue, getValues } = useFormContext<MoratConfigInput>();

  const desktop = watch(`${name}.image`);
  const mobile = watch(`${name}.imageMobile`);

  /** Uploading a replacement removes the previous file from storage. */
  function replace(field: `${ArtSlotName}.image` | `${ArtSlotName}.imageMobile`, url: string) {
    const old = getValues(field);
    setValue(field, url, { shouldDirty: true });
    if (old) deleteAsset(old);
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line-light dark:border-line-dark p-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {hint && <p className="text-xs opacity-60 mt-0.5">{hint}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Escritorio</label>
          <div className="flex items-center gap-2">
            <Input
              id={`${name}.image`}
              placeholder="https://..."
              {...register(`${name}.image`)}
              className="flex-1"
            />
            <UploadButton
              eventoId={eventoId}
              onUploaded={(url) => replace(`${name}.image`, url)}
            />
          </div>
          <ImagePreview url={desktop} alt={`${title} escritorio`} aspect={aspect} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Móvil (opcional)</label>
          <div className="flex items-center gap-2">
            <Input
              id={`${name}.imageMobile`}
              placeholder="https://..."
              {...register(`${name}.imageMobile`)}
              className="flex-1"
            />
            <UploadButton
              eventoId={eventoId}
              onUploaded={(url) => replace(`${name}.imageMobile`, url)}
            />
          </div>
          <ImagePreview url={mobile} alt={`${title} móvil`} aspect={aspect} />
        </div>
      </div>

      {showLink && (
        <Input
          label="Link al hacer clic (opcional)"
          id={`${name}.link`}
          placeholder="https://..."
          {...register(`${name}.link`)}
        />
      )}
    </div>
  );
}
