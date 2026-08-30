import { z } from "zod";

/**
 * Every field defaults to an empty value so a partial or legacy config.json
 * still parses. The admin form relies on these defaults to hydrate new
 * sections without the user having to fill them first.
 */

export const artSlotSchema = z.object({
  image: z.string().default(""),
  imageMobile: z.string().default(""),
  link: z.string().default(""),
});

export const ticketEstadoSchema = z
  .enum(["active", "soon", "soldout", "hidden"])
  .default("active");

export const entradaSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  nota: z.string().default(""),
  precio: z.string().default(""),
  estado: ticketEstadoSchema,
  link: z.string().default(""),
  destacada: z.boolean().default(false),
});

export const funcionSchema = z.object({
  heading: z.string().default(""),
  entradas: z.array(entradaSchema).default([]),
});

export const integranteSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  rol: z.string().default(""),
  imagen: z.string().default(""),
  spotify: z.string().default(""),
});

export const videoItemSchema = z.object({
  titulo: z.string().default(""),
  descripcion: z.string().default(""),
  url: z.string().default(""),
});

export const fotoItemSchema = z.object({
  imagen: z.string().default(""),
  imagenMovil: z.string().default(""),
  link: z.string().default(""),
});

export const patrocinadorSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  logo: z.string().default(""),
  link: z.string().default(""),
});

export const enlaceLegalSchema = z.object({
  label: z.string().min(1, "Requerido"),
  link: z.string().default(""),
});

export const redesSocialesSchema = z.object({
  instagram: z.string().default(""),
  tiktok: z.string().default(""),
  youtube: z.string().default(""),
  x: z.string().default(""),
  facebook: z.string().default(""),
  spotify: z.string().default(""),
});

export const beneficoSchema = z.object({
  mostrar: z.boolean().default(true),
  badge: z.string().default(""),
  kicker: z.string().default(""),
  titulo: z.string().default(""),
  texto: z.string().default(""),
  nota: z.string().default(""),
});

export const moratConfigSchema = z.object({
  /* 1 · Publicación */
  publicado: z.boolean().default(false),
  revelacionFecha: z.string().default(""),
  anuncioPresenta: z.string().default(""),
  anuncioTitulo: z.string().default(""),
  anuncioSubtitulo: z.string().default(""),

  /* 2 · Intro */
  presenta: z.string().default(""),
  bandName: z.string().default(""),
  tourName: z.string().default(""),
  metaFecha: z.string().default(""),
  venue: z.string().default(""),
  ciudad: z.string().default(""),
  showFecha: z.string().default(""),
  mostrarCountdownShow: z.boolean().default(true),
  ctaLabel: z.string().default(""),
  ctaLink: z.string().default(""),
  arteHeader: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),

  /* 3 · Marquee */
  canciones: z.array(z.string()).default([]),

  /* 4 · Benéfico */
  benefico: beneficoSchema.default({
    mostrar: true,
    badge: "",
    kicker: "",
    titulo: "",
    texto: "",
    nota: "",
  }),

  /* 5 · Entradas */
  arteTituloEntradas: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  entradasNota: z.string().default(""),
  funciones: z.array(funcionSchema).default([]),

  /* 6 · La Banda */
  arteTituloBanda: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  integrantes: z.array(integranteSchema).default([]),

  /* 7 · Claim */
  arteClaim: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  claimKicker: z.string().default(""),
  claimTexto: z.string().default(""),

  /* 8 · Videos */
  arteTituloVideos: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  videosSubtitulo: z.string().default(""),
  videos: z.array(videoItemSchema).default([]),
  arteLateralIzq: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  arteLateralDer: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),

  /* 9 · Fotos */
  fotos: z.array(fotoItemSchema).default([]),

  /* 10 · Patrocinadores */
  artePatrocinadores: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  patrocinadores: z.array(patrocinadorSchema).default([]),

  /* 11 · Pie */
  arteFooter: artSlotSchema.default({ image: "", imageMobile: "", link: "" }),
  footerFecha: z.string().default(""),
  ctaFooterLabel: z.string().default(""),
  ctaFooterLink: z.string().default(""),
  redes: redesSocialesSchema.default({
    instagram: "",
    tiktok: "",
    youtube: "",
    x: "",
    facebook: "",
    spotify: "",
  }),
  legal: z.array(enlaceLegalSchema).default([]),
  copyright: z.string().default(""),
});

export const loginSchema = z.object({
  user: z.string().trim().min(3, "Mínimo 3 caracteres"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type MoratConfigInput = z.infer<typeof moratConfigSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
