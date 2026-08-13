import type { ProductCategorySlug } from "@/sanity/categories";

export type CategoryVisual = {
  /** `null` cuando no hay foto: la tarjeta usa un fondo de marca. */
  imageUrl: string | null;
  alt: string;
  /** Recorte cuando se usa una imagen compartida de respaldo */
  objectPosition?: string;
};

/**
 * Imágenes por categoría en `public/categories/{slug}.jpg`.
 * Tienen prioridad sobre fotos de productos en Sanity.
 */
export const CATEGORY_STATIC_IMAGES: Partial<
  Record<ProductCategorySlug, string>
> = {
  jabones: "/categories/jabones.jpg",
  shampoos: "/categories/shampoos.jpg",
  velas: "/categories/velas.jpg",
  cremas: "/categories/cremas.jpg",
  aceites: "/categories/aceites.jpg",
};

export function resolveCategoryVisual(
  slug: ProductCategorySlug,
  title: string,
  sanityImage?: { url: string; alt?: string },
): CategoryVisual {
  const staticUrl = CATEGORY_STATIC_IMAGES[slug];
  if (staticUrl) {
    return { imageUrl: staticUrl, alt: title };
  }

  if (sanityImage?.url) {
    return {
      imageUrl: sanityImage.url,
      alt: sanityImage.alt ?? title,
    };
  }

  return { imageUrl: null, alt: title };
}
