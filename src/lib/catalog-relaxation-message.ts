import type { CatalogFilters, CatalogRelaxation } from "@/lib/filter-products";
import { getCategoryLabel } from "@/sanity/categories";
import { getCollectionLabel } from "@/sanity/collections";

export function getRelaxationMessage(
  relaxation: CatalogRelaxation,
  requested: CatalogFilters,
  fromQuiz = false,
): string {
  if (relaxation === "none") return "";

  const intro = fromQuiz
    ? "Por ahora no hay un producto exacto para tu resultado del test, pero "
    : "No hay productos con esa combinación exacta. ";

  if (relaxation === "coleccion" && requested.categoria) {
    return `${intro}te mostramos ${getCategoryLabel(requested.categoria).toLowerCase()} disponibles en la tienda.`;
  }

  if (relaxation === "categoria" && requested.coleccion) {
    return `${intro}te mostramos productos de «${getCollectionLabel(requested.coleccion)}».`;
  }

  return `${intro}esto es lo que tenemos en el catálogo por ahora.`;
}
