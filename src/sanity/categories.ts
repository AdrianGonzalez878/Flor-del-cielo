/** Categorías disponibles al capturar un producto (sin documentos separados). */
export const PRODUCT_CATEGORIES = [
  { title: "Jabones", value: "jabones" },
  { title: "Shampoos", value: "shampoos" },
  { title: "Velas", value: "velas" },
  { title: "Cremas", value: "cremas" },
  { title: "Aceites", value: "aceites" },
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["value"];

const labelBySlug = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.value, c.title]),
) as Record<ProductCategorySlug, string>;

export function getCategoryLabel(slug: string): string {
  return labelBySlug[slug as ProductCategorySlug] ?? slug;
}
