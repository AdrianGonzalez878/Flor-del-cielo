/** Colecciones generales — se pueden asignar varias por producto. */
export const PRODUCT_COLLECTIONS = [
  { title: "Toda la familia", value: "familia" },
  { title: "Bebés y niños", value: "bebes-ninos" },
  { title: "Lo más vendido", value: "mas-vendido" },
  { title: "Novedades", value: "novedades" },
  { title: "Rutina diaria", value: "rutina-diaria" },
  { title: "Herbolaria tradicional", value: "herbolaria-tradicional" },
  { title: "Formatos sólidos", value: "solidos" },
] as const;

export type ProductCollectionSlug =
  (typeof PRODUCT_COLLECTIONS)[number]["value"];

const labelBySlug = Object.fromEntries(
  PRODUCT_COLLECTIONS.map((c) => [c.value, c.title]),
) as Record<ProductCollectionSlug, string>;

export function getCollectionLabel(slug: string): string {
  return labelBySlug[slug as ProductCollectionSlug] ?? slug;
}
