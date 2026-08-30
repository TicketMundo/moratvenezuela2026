import localFont from "next/font/local";

/**
 * Europa Grotesk Nr. 2 SH Bold — the event's brand face.
 *
 * Three properties of this file drive how it is wired:
 *
 * 1. `weight` is declared as the full 100–900 range on purpose. The file's
 *    OS/2 table says usWeightClass 400, so asking for `font-weight: 900`
 *    against a narrower declaration would make the browser synthesize a fake
 *    bold on top of an already-bold face and smear it. Claiming the range maps
 *    every requested weight onto this one file with no synthesis.
 *
 * 2. It has no width axis, so the mockup's `font-stretch: 112%–125%` on
 *    headings has no effect. Headings render at the face's natural width,
 *    which is narrower than the original Archivo-based comp.
 *
 * 3. It is missing U+00B7 (·), U+00A9 (©) and U+00BA (º). Every place the copy
 *    uses those is set in IBM Plex Mono, which is why --mt-mono stays on Plex.
 *    Do not point the mono stack at this font without a fuller cut, or the
 *    middot will jump to a fallback face mid-line.
 */
export const europa = localFont({
  src: "./assets/EuropaGroNr2SHOP-Bol 2.otf",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-europa",
  fallback: ["Archivo", "Helvetica Neue", "Arial", "sans-serif"],
});
