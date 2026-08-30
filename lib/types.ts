/**
 * Domain model for the Morat "Ya Es Mañana World Tour" landing.
 *
 * Every field here is editable from the admin. The landing renders straight
 * from this shape, so adding a field means adding an admin control for it.
 */

/** Ticket availability. Drives which action the ticket card renders. */
export type TicketEstado = "active" | "soon" | "soldout" | "hidden";

/**
 * An image slot with a typographic fallback on the landing.
 * When `image` is empty the section renders its text version instead.
 */
export interface ArtSlot {
  image: string;
  imageMobile: string;
  link: string;
}

/** A ticket type inside a show date. */
export interface Entrada {
  nombre: string;
  nota: string;
  /** Free text so it can hold "REF 50", "Desde REF 50", etc. */
  precio: string;
  estado: TicketEstado;
  link: string;
  destacada: boolean;
}

/** One night of the show, with its own ticket types. */
export interface Funcion {
  heading: string;
  entradas: Entrada[];
}

export interface Integrante {
  nombre: string;
  rol: string;
  imagen: string;
  spotify: string;
}

/**
 * The one featured video. Each URL is either a YouTube link (rendered in an
 * iframe) or a direct file URL such as an MP4 on DO Spaces (rendered in a
 * <video>). The type is detected from the URL, not configured.
 */
export interface VideoDestacado {
  titulo: string;
  descripcion: string;
  /** Horizontal 16:9 cut, shown from 750px up. */
  urlDesktop: string;
  /** Vertical 9:16 cut, shown below 750px. Falls back to urlDesktop. */
  urlMovil: string;
}

export interface FotoItem {
  imagen: string;
  imagenMovil: string;
  link: string;
}

export interface Patrocinador {
  /** Doubles as the image alt text, so it is required. */
  nombre: string;
  logo: string;
  link: string;
}

export interface EnlaceLegal {
  label: string;
  link: string;
}

export interface RedesSociales {
  instagram: string;
  tiktok: string;
  youtube: string;
  x: string;
  facebook: string;
  spotify: string;
}

export interface Benefico {
  mostrar: boolean;
  badge: string;
  kicker: string;
  titulo: string;
  texto: string;
  nota: string;
}

export interface MoratConfig {
  /* ── 1 · Publicación ───────────────────────────────────────────── */
  /** Manual switch. Either this or `revelacionFecha` reveals the show. */
  publicado: boolean;
  /** ISO datetime. Once reached, the show is revealed automatically. */
  revelacionFecha: string;
  anuncioPresenta: string;
  anuncioTitulo: string;
  anuncioSubtitulo: string;

  /* ── 2 · Intro ─────────────────────────────────────────────────── */
  presenta: string;
  bandName: string;
  /** Text wrapped in |pipes| is painted with the prism gradient. */
  tourName: string;
  metaFecha: string;
  venue: string;
  ciudad: string;
  /** ISO datetime of the first night — drives the hero countdown. */
  showFecha: string;
  mostrarCountdownShow: boolean;
  ctaLabel: string;
  ctaLink: string;
  arteHeader: ArtSlot;

  /* ── 3 · Marquee ───────────────────────────────────────────────── */
  canciones: string[];

  /* ── 4 · Concierto benéfico ────────────────────────────────────── */
  benefico: Benefico;

  /* ── 5 · Entradas ──────────────────────────────────────────────── */
  arteTituloEntradas: ArtSlot;
  entradasNota: string;
  funciones: Funcion[];

  /* ── 6 · La Banda ──────────────────────────────────────────────── */
  arteTituloBanda: ArtSlot;
  integrantes: Integrante[];

  /* ── 7 · Claim ─────────────────────────────────────────────────── */
  arteClaim: ArtSlot;
  claimKicker: string;
  claimTexto: string;

  /* ── 8 · Videos ────────────────────────────────────────────────── */
  arteTituloVideos: ArtSlot;
  videosSubtitulo: string;
  video: VideoDestacado;
  /** Cover frame. Matters for self-hosted files, which otherwise show black. */
  artePosterVideo: ArtSlot;
  /** Side ornaments. Empty falls back to the drawn prism. */
  arteLateralIzq: ArtSlot;
  arteLateralDer: ArtSlot;

  /* ── 9 · Fotos ─────────────────────────────────────────────────── */
  fotos: FotoItem[];

  /* ── 10 · Patrocinadores ───────────────────────────────────────── */
  /** A composed banner. When set it replaces the logo strip entirely. */
  artePatrocinadores: ArtSlot;
  /** Individual logos, shown on a light band because the artwork is black. */
  patrocinadores: Patrocinador[];

  /* ── 11 · Pie ──────────────────────────────────────────────────── */
  arteFooter: ArtSlot;
  footerFecha: string;
  /** Falls back to `ctaLabel` / `ctaLink` when empty. */
  ctaFooterLabel: string;
  ctaFooterLink: string;
  redes: RedesSociales;
  legal: EnlaceLegal[];
  copyright: string;
}

export interface BackupItem {
  key: string;
  name: string;
  lastModified: string;
  size: number;
}

export interface SessionUser {
  user: string;
  nombre: string;
}

const EMPTY_ART: ArtSlot = { image: "", imageMobile: "", link: "" };

/**
 * Seeded with the content the client delivered in the mockup, so a brand new
 * event renders the real page instead of an empty shell.
 */
const TICKETERA = "https://moratenvenezuela.ticketmundo.com";

export const DEFAULT_MORAT_CONFIG: MoratConfig = {
  // Starts behind the gate on purpose: publishing is an explicit decision.
  publicado: false,
  revelacionFecha: "2026-08-31T11:00:00-04:00",
  anuncioPresenta: "Cusica presenta",
  anuncioTitulo: "Algo grande se acerca",
  anuncioSubtitulo: "Lunes 31 de agosto · 11:00 AM (Venezuela)",

  presenta: "Cusica presenta",
  bandName: "MORAT",
  tourName: "Ya Es Mañana |World Tour|",
  metaFecha: "Sábado 12 y Domingo 13 · Diciembre · 2026",
  venue: "Universidad Simón Bolívar",
  ciudad: "Caracas, Venezuela",
  showFecha: "2026-12-12T19:00:00-04:00",
  mostrarCountdownShow: true,
  ctaLabel: "Canjea tus entradas aquí",
  ctaLink: "https://app.cusica.com/canje",
  arteHeader: { ...EMPTY_ART },

  canciones: [
    "Cómo Te Atreves",
    "Besos en Guerra",
    "No Se Va",
    "Amor Con Hielo",
    "Cuando Nadie Ve",
    "506",
    "Enamórate de Alguien Más",
    "Aprender a Quererte",
    "A Dónde Vamos",
    "Faltas Tú",
  ],

  benefico: {
    mostrar: true,
    badge: "Concierto benéfico",
    kicker: "Por las víctimas del terremoto del 24 de julio",
    titulo: "Dos noches para volver a empezar",
    texto:
      "Morat abrió esta gira dedicando sus primeras noches a las zonas afectadas por el terremoto del 24 de julio. En Caracas seguimos esa misma ruta: cada entrada de estas dos noches aporta directamente a las familias que lo perdieron todo.",
    nota:
      "Los fondos se canalizan a través de organizaciones aliadas y el reporte de lo recaudado se publica al cierre del evento.",
  },

  arteTituloEntradas: { ...EMPTY_ART },
  entradasNota: "Mismo show las dos noches — elige la fecha que prefieras.",
  funciones: [
    {
      heading: "Día 1 · Sábado 12 de Diciembre",
      entradas: [
        { nombre: "General", nota: "", precio: "REF 50", estado: "active", link: TICKETERA, destacada: false },
        { nombre: "VIP", nota: "", precio: "REF 100", estado: "active", link: TICKETERA, destacada: false },
      ],
    },
    {
      heading: "Día 2 · Domingo 13 de Diciembre",
      entradas: [
        { nombre: "General", nota: "", precio: "REF 50", estado: "active", link: TICKETERA, destacada: false },
        { nombre: "VIP", nota: "", precio: "REF 100", estado: "active", link: TICKETERA, destacada: false },
      ],
    },
  ],

  arteTituloBanda: { ...EMPTY_ART },
  integrantes: [
    { nombre: "Juan Pablo Isaza", rol: "Voz y guitarra", imagen: "", spotify: "" },
    { nombre: "Juan Pablo Villamil", rol: "Voz y banjo", imagen: "", spotify: "" },
    { nombre: "Simón Vargas", rol: "Bajo y coros", imagen: "", spotify: "" },
    { nombre: "Martín Vargas", rol: "Batería y coros", imagen: "", spotify: "" },
  ],

  arteClaim: { ...EMPTY_ART },
  claimKicker: "12 y 13 · Dic · 2026 — Universidad Simón Bolívar",
  claimTexto: "Hoy por lo que mañana recordaremos",

  arteTituloVideos: { ...EMPTY_ART },
  videosSubtitulo: "El regreso a Venezuela, capítulo a capítulo",
  video: { titulo: "", descripcion: "", urlDesktop: "", urlMovil: "" },
  artePosterVideo: { ...EMPTY_ART },
  arteLateralIzq: { ...EMPTY_ART },
  arteLateralDer: { ...EMPTY_ART },

  fotos: [],

  artePatrocinadores: { ...EMPTY_ART },
  patrocinadores: [],

  arteFooter: { ...EMPTY_ART },
  footerFecha: "12 y 13 de Diciembre 2026 · Universidad Simón Bolívar, Caracas",
  ctaFooterLabel: "",
  ctaFooterLink: "",
  redes: {
    instagram: "https://www.instagram.com/morat/",
    tiktok: "",
    youtube: "",
    x: "https://x.com/MoratBanda",
    facebook: "",
    spotify: "",
  },
  legal: [
    { label: "Política de Privacidad", link: "" },
    { label: "Términos y Condiciones", link: "" },
    { label: "Contáctanos", link: "" },
  ],
  copyright: "© 2026 MORAT EN CARACAS",
};
