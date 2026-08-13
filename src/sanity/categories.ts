/**
 * Líneas de producto de la lista oficial (julio 2026).
 * Los slugs `jabones`, `shampoos`, `cremas`, `velas` y `aceites` ya existen en
 * Sanity, así que no deben renombrarse.
 */

/** Grupos para menús y footer; evitan listar 14 categorías planas. */
export const CATEGORY_GROUPS = [
  { title: "Piel y cuerpo", value: "cuerpo" },
  { title: "Cabello", value: "cabello" },
  { title: "Rostro", value: "rostro" },
  { title: "Bienestar y masaje", value: "bienestar" },
  { title: "Higiene natural", value: "higiene" },
  { title: "Bebés y familia", value: "bebes" },
] as const;

export type CategoryGroupSlug = (typeof CATEGORY_GROUPS)[number]["value"];

/** Qué necesidades aplican al capturar y filtrar productos de la línea. */
export type CategoryNeedType = "skin" | "hair" | "none";

type ProductCategoryDef = {
  title: string;
  value: string;
  group: CategoryGroupSlug;
  needs: CategoryNeedType;
  /** Texto corto para las tarjetas de categoría. */
  description: string;
  /** Presentación de referencia de la línea (lista julio 2026). */
  presentation?: string;
};

export const PRODUCT_CATEGORIES = [
  {
    title: "Jabones",
    value: "jabones",
    group: "cuerpo",
    needs: "skin",
    description: "Saponificación artesanal con achiote, cacao y grana.",
    presentation: "Barra de 100 g",
  },
  {
    title: "Cremas corporales",
    value: "cremas",
    group: "cuerpo",
    needs: "skin",
    description: "Fórmulas botánicas para nutrir el cuerpo.",
    presentation: "Botella de 230 g",
  },
  {
    title: "Mantequillas corporales",
    value: "mantequillas",
    group: "cuerpo",
    needs: "skin",
    description: "Karité, cacao y mango para piel muy seca.",
    presentation: "60 g",
  },
  {
    title: "Shampoo líquido",
    value: "shampoos",
    group: "cabello",
    needs: "hair",
    description: "Herbolaria y tensioactivos suaves.",
    presentation: "250 ml",
  },
  {
    title: "Shampoo sólido",
    value: "shampoo-solido",
    group: "cabello",
    needs: "hair",
    description: "Barra concentrada, sin envase plástico.",
    presentation: "Barra de 80 g",
  },
  {
    title: "Acondicionadores y tónicos",
    value: "acondicionadores",
    group: "cabello",
    needs: "hair",
    description: "Suavidad, brillo y lociones capilares.",
  },
  {
    title: "Línea facial",
    value: "facial",
    group: "rostro",
    needs: "skin",
    description: "Limpieza y cremas para cada tipo de piel.",
  },
  {
    title: "Contorno y sérums",
    value: "serums",
    group: "rostro",
    needs: "skin",
    description: "Activos concentrados y cuidado del contorno.",
    presentation: "30 ml / 30 g",
  },
  {
    title: "Pomadas y masaje",
    value: "pomadas",
    group: "bienestar",
    needs: "skin",
    description: "Árnica, caléndula y CBD para masaje.",
  },
  {
    title: "Aceites botánicos",
    value: "aceites",
    group: "bienestar",
    needs: "skin",
    description: "Aceites vegetales para masaje y limpieza.",
  },
  {
    title: "Velas",
    value: "velas",
    group: "bienestar",
    needs: "none",
    description: "Velas de masaje con ceras vegetales.",
  },
  {
    title: "Ritual y bienestar",
    value: "ritual",
    group: "bienestar",
    needs: "none",
    description: "Bombas, hidrolatos y sales para el baño.",
  },
  {
    title: "Higiene natural",
    value: "higiene",
    group: "higiene",
    needs: "none",
    description: "Desodorantes y cuidado bucal natural.",
  },
  {
    title: "Bebés y dermosuave",
    value: "bebes",
    group: "bebes",
    needs: "skin",
    description: "Cuidado suave para piel delicada e infantil.",
  },
] as const satisfies readonly ProductCategoryDef[];

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["value"];
export type ProductCategory = ProductCategoryDef & {
  value: ProductCategorySlug;
};

const categoryBySlug = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.value, c]),
) as Record<ProductCategorySlug, ProductCategory>;

export function getCategory(slug?: string): ProductCategory | undefined {
  return slug ? categoryBySlug[slug as ProductCategorySlug] : undefined;
}

export function getCategoryLabel(slug: string): string {
  return getCategory(slug)?.title ?? slug;
}

export function getCategoryNeedType(slug?: string): CategoryNeedType {
  return getCategory(slug)?.needs ?? "none";
}

/** Opciones simples para listas de Sanity (sin metadatos extra). */
export function getCategoryOptions(): { title: string; value: string }[] {
  return PRODUCT_CATEGORIES.map((c) => ({ title: c.title, value: c.value }));
}

/** Categorías agrupadas y en el orden de `CATEGORY_GROUPS`. */
export function getCategoriesByGroup(): {
  title: string;
  value: CategoryGroupSlug;
  categories: ProductCategory[];
}[] {
  return CATEGORY_GROUPS.map((group) => ({
    ...group,
    categories: PRODUCT_CATEGORIES.filter((c) => c.group === group.value),
  })).filter((group) => group.categories.length > 0);
}
