import clsx from "clsx";
import { ImageIcon } from "lucide-react";

interface Props {
  url?: string;
  alt?: string;
  /** Tailwind aspect-ratio class, defaults to "aspect-video" */
  aspect?: string;
  className?: string;
}

function isValidHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ImagePreview({
  url,
  alt = "Preview",
  aspect = "aspect-video",
  className,
}: Props) {
  const valid = url ? isValidHttpUrl(url) : false;

  return (
    <div
      className={clsx(
        "rounded-input overflow-hidden border border-line-light dark:border-line-dark",
        "bg-base-light dark:bg-base-dark",
        aspect,
        "max-w-full",
        className
      )}
    >
      {valid ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs">Sin imagen</span>
        </div>
      )}
    </div>
  );
}
