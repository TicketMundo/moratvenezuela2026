/** Inline SVG icons ported from the mockup. No external icon dependency. */

const SPOTIFY_PATH =
  "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3c-.2.36-.66.48-1.02.26-2.8-1.7-6.32-2.1-10.46-1.16-.42.1-.82-.16-.92-.56-.1-.42.16-.82.56-.92 4.54-1.04 8.42-.58 11.56 1.34.38.22.5.68.28 1.04zm1.46-3.26c-.28.44-.86.58-1.3.3-3.2-1.96-8.08-2.54-11.86-1.38-.5.14-1.02-.14-1.16-.62-.14-.5.14-1.02.62-1.16 4.32-1.3 9.7-.66 13.38 1.6.44.26.58.86.32 1.26zm.12-3.4C15.24 8.32 8.82 8.1 5.12 9.24c-.6.18-1.22-.16-1.4-.74-.18-.6.16-1.22.74-1.4 4.26-1.3 11.34-1.04 15.74 1.56.54.32.72 1.02.4 1.56-.3.54-1 .72-1.54.4z";

/** Solid white mark used on the green pill next to each band member. */
export function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={SPOTIFY_PATH} />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2 1.5 3.6 3.5 3.9v2.5c-1.3 0-2.5-.4-3.5-1.1v6.1c0 3.1-2.5 5.6-5.6 5.6S5.3 17.5 5.3 14.4 7.8 8.8 10.9 8.8c.3 0 .6 0 .9.1v2.6c-.3-.1-.6-.2-.9-.2-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V3h2.7z" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 7.5c-.3-1-1-1.8-2-2C19 5 12 5 12 5s-7 0-9 .5c-1 .3-1.8 1-2 2C.5 9.4.5 12 .5 12s0 2.6.5 4.5c.3 1 1 1.8 2 2C5 19 12 19 12 19s7 0 9-.5c1-.3 1.8-1 2-2 .5-1.9.5-4.5.5-4.5s0-2.6-.5-4.5zM9.7 15.4V8.6l6 3.4-6 3.4z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 3h3l-6.6 7.6L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8.1L2.5 3h6.1l4.3 5.6L17.5 3zm-1 16.2h1.7L7.6 4.7H5.8l11.7 14.5z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
    </svg>
  );
}

function IconSpotify() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={SPOTIFY_PATH} />
    </svg>
  );
}

export type RedKey = "instagram" | "tiktok" | "youtube" | "x" | "facebook" | "spotify";

/** Render order matches the mockup's footer. */
export const RED_ICONS: Array<{ key: RedKey; label: string; Icon: () => JSX.Element }> = [
  { key: "instagram", label: "Instagram", Icon: IconInstagram },
  { key: "tiktok", label: "TikTok", Icon: IconTiktok },
  { key: "youtube", label: "YouTube", Icon: IconYoutube },
  { key: "x", label: "X", Icon: IconX },
  { key: "facebook", label: "Facebook", Icon: IconFacebook },
  { key: "spotify", label: "Spotify", Icon: IconSpotify },
];
