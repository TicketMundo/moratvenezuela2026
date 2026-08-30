import { Fragment, type ReactNode } from "react";

/**
 * A value only counts as a usable URL when it is absolute or a data URI.
 * Mirrors the mockup's `has()` guard: half-filled fields must not produce
 * broken links or <img src="">.
 */
export function isUrl(value: string | undefined | null): value is string {
  if (!value) return false;
  return value.startsWith("http") || value.startsWith("data:");
}

/**
 * Whether a URL should be played through YouTube's iframe player rather than
 * a native <video>. Anything else — an MP4 on DO Spaces, for instance — is
 * treated as a direct file, so no manual "source type" field is needed.
 */
export function isYoutube(url: string): boolean {
  return /(?:^|\.)youtube\.com\/|(?:^|\.)youtu\.be\//.test(url);
}

/** Normalizes any YouTube URL flavour (watch, youtu.be, shorts) to /embed/. */
export function toEmbed(url: string): string {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]+)/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

/**
 * Renders `Ya Es Mañana |World Tour|` with the piped run wrapped in <b>,
 * which the stylesheet paints with the prism gradient.
 *
 * Returns React nodes rather than an HTML string so the admin can never
 * inject markup through this field.
 */
export function renderPipes(text: string): ReactNode {
  if (!text) return null;
  return text.split(/\|([^|]*)\|/).map((chunk, i) =>
    // Odd indices are the captured groups, i.e. what sat between the pipes.
    i % 2 === 1 ? <b key={i}>{chunk}</b> : <Fragment key={i}>{chunk}</Fragment>
  );
}

/** Joins the hero meta parts with the dimmed slash separator. */
export function joinMeta(parts: Array<string | undefined>): ReactNode {
  const present = parts.filter((p): p is string => !!p && p.trim().length > 0);
  return present.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <i>/</i>}
      {part}
    </Fragment>
  ));
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
