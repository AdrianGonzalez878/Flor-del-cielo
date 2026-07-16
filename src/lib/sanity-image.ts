const SANITY_CDN_HOST = "cdn.sanity.io";

/** Comprueba si una URL pública corresponde a un asset de Sanity. */
export function isSanityImageUrl(url?: string): boolean {
  if (!url) return false;

  try {
    return new URL(url).hostname === SANITY_CDN_HOST;
  } catch {
    return false;
  }
}

/**
 * Solicita una variante optimizada directamente al CDN de Sanity.
 * El CDN mantiene el asset original y entrega una versión adaptada para la UI.
 */
export function getSanityImageUrl(
  url: string,
  width: number,
  quality = 82,
): string {
  if (!isSanityImageUrl(url)) return url;

  const imageUrl = new URL(url);
  imageUrl.searchParams.set("w", String(width));
  imageUrl.searchParams.set("q", String(quality));
  imageUrl.searchParams.set("auto", "format");
  imageUrl.searchParams.set("fit", "max");
  return imageUrl.toString();
}
