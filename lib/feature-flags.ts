/**
 * Build-time switches for capabilities that are wired but not in use.
 *
 * Nothing here is read from the environment on purpose: these are editorial
 * decisions about the page, not deployment config, so they belong in the diff.
 */

/**
 * Sponsors as a strip of individual logos on a light band, instead of one
 * full-width banner image.
 *
 * Off: the section is the single `artePatrocinadores` banner, and the admin
 * hides the per-logo editor.
 *
 * Flipping this to `true` restores the whole feature in one move — the type,
 * the zod field, the marquee markup, the `.mt-sponsors*` styles and the admin
 * editor are all still in place. Saved `patrocinadores` data survives while it
 * is off, because the schema field is untouched.
 */
// Annotated `boolean` rather than the literal `false` so TypeScript keeps
// type-checking both branches instead of narrowing the dormant one away.
export const PATROCINADORES_LOGOS_INDIVIDUALES: boolean = false;
