/**
 * Fuente única de verdad de marca — Flor del Cielo
 *
 * Usar en:
 * - Resend / React Email (colores inline, asunto, remitente)
 * - Sanity Studio (theme.customizations)
 * - Mercado Pago (logo, colores donde la API lo permita)
 *
 * Mantener sincronizado con `src/app/globals.css` (variables CSS / Tailwind).
 */

export const brand = {
  name: "Flor del Cielo",
  legalName: "Flor del Cielo",
  tagline: "Cosmética artesanal",
  description:
    "Cosmética natural inspirada en la herbolaria tradicional y elaborada a mano en Oaxaca: jabones, shampoos, cremas, sérums, pomadas y cuidado dermosuave.",
  /** Texto oficial de marca (lista de productos, julio 2026). */
  essence:
    "Cosmética natural inspirada en la herbolaria tradicional, donde los saberes ancestrales cobran vida en manos artesanas oaxaqueñas para crear un cuidado consciente, ecosustentable y en armonía con la piel, la comunidad y la naturaleza.",
  city: "Oaxaca, México",

  /** URL pública del sitio (Vercel). Sobrescribir con NEXT_PUBLIC_SITE_URL en producción. */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    email:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "flordelcielooax@gmail.com",
    phone: "9513194133",
    phoneDisplay: "951 319 4133",
    /** Número internacional para WhatsApp (México +52) */
    whatsapp: "529513194133",
    instagram: "flordelcielo.artesanal",
    instagramUrl: "https://instagram.com/flordelcielo.artesanal",
    /** Nombre visible en emails transaccionales (Resend) */
    fromName: "Flor del Cielo",
  },

  /**
   * Paleta extraída del logo oficial (#F0F0D8, #483018, #C0A860, …)
   * Claves en camelCase para TypeScript; hex en mayúsculas para emails/CMS.
   */
  colors: {
    cream: "#F0F0D8",
    creamLight: "#FAF9F2",
    brown: "#483018",
    brownDark: "#301800",
    brownMuted: "#6B5A48",
    gold: "#C0A860",
    goldLight: "#D8C090",
    goldMid: "#C09060",
    goldDark: "#A08848",
    white: "#FFFFFF",
  },

  fonts: {
    /** next/font — variables en layout.tsx */
    sans: "Nunito, system-ui, sans-serif",
    serif: "Playfair Display, Georgia, serif",
    /** Acento tipográfico (eyebrows, firmas) — no usar en UI/cuerpo */
    script: "Great Vibes, cursive",
  },

  assets: {
    logoPath: "/logo.png",
  },
} as const;

/** URL absoluta del logo (Mercado Pago, emails HTML, Open Graph) */
export function getBrandLogoUrl(siteUrl: string = brand.siteUrl): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${brand.assets.logoPath}`;
}

/** Enlace a WhatsApp con mensaje opcional prellenado */
export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${brand.contact.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export type Brand = typeof brand;
export type BrandColor = keyof typeof brand.colors;

/** Mapa listo para estilos inline en HTML (emails Resend) */
export function getBrandInlineStyles() {
  const c = brand.colors;
  return {
    page: {
      backgroundColor: c.cream,
      color: c.brown,
      fontFamily: brand.fonts.sans,
    },
    heading: {
      color: c.brown,
      fontFamily: brand.fonts.serif,
    },
    button: {
      backgroundColor: c.brown,
      color: c.creamLight,
      borderRadius: "9999px",
    },
    muted: {
      color: c.brownMuted,
    },
    accent: {
      color: c.goldDark,
    },
    border: {
      borderColor: c.gold,
    },
  } as const;
}

/** Variables CSS equivalentes a `globals.css` (inyectar en <style> de emails si hace falta) */
export function getBrandCssVariables(): Record<string, string> {
  const c = brand.colors;
  return {
    "--background": c.cream,
    "--foreground": c.brown,
    "--brand-cream": c.cream,
    "--brand-cream-light": c.creamLight,
    "--brand-brown": c.brown,
    "--brand-brown-dark": c.brownDark,
    "--brand-brown-muted": c.brownMuted,
    "--brand-gold": c.gold,
    "--brand-gold-light": c.goldLight,
    "--brand-gold-mid": c.goldMid,
    "--brand-gold-dark": c.goldDark,
  };
}

/**
 * Config sugerida para Resend (from + reply-to).
 * Ejemplo: `from: formatResendFrom()` en API routes de confirmación de pedido.
 */
export function formatResendFrom() {
  return `${brand.contact.fromName} <${brand.contact.email}>`;
}

/**
 * Tema base para personalizar Sanity Studio (`sanity.config.ts`).
 * @see https://www.sanity.io/docs/studio/theming
 */
export const sanityStudioTheme = {
  brand: {
    title: brand.name,
    subtitle: brand.tagline,
  },
  color: {
    base: {
      fg: brand.colors.brown,
      bg: brand.colors.creamLight,
      border: brand.colors.gold,
      focus: brand.colors.gold,
      shadow: brand.colors.brown,
    },
    button: {
      default: {
        bg: brand.colors.brown,
        fg: brand.colors.creamLight,
      },
      primary: {
        bg: brand.colors.brown,
        fg: brand.colors.creamLight,
      },
    },
  },
} as const;

/**
 * Metadatos de marca para checkout / preferencias de Mercado Pago.
 * MP permite logo y colores limitados según el producto (Checkout Pro, Bricks).
 */
export const mercadoPagoBranding = {
  /** URL absoluta del logo (requerida por MP en preferencias) */
  getLogoUrl: getBrandLogoUrl,
  /** Colores de referencia para UI propia antes/después del redirect a MP */
  colors: {
    primary: brand.colors.brown,
    primaryHover: brand.colors.brownDark,
    accent: brand.colors.gold,
    background: brand.colors.cream,
    text: brand.colors.brown,
    textMuted: brand.colors.brownMuted,
  },
} as const;
