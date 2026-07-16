import type { Product } from "@/sanity/queries";

export type CatalogFilters = {
  categoria?: string;
  coleccion?: string;
  piel?: string;
  cabello?: string;
  q?: string;
};

export type CatalogRelaxation = "none" | "coleccion" | "categoria" | "all";

function matchesSearchQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    product.name,
    product.shortDescription,
    product.category?.name,
    product.category?.slug,
    ...(product.ingredients ?? []),
    ...(product.collections ?? []),
    ...(product.skinNeeds ?? []),
    ...(product.hairNeeds ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function filterCatalogProducts(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  return products.filter((p) => {
    if (filters.categoria && p.category?.slug !== filters.categoria) {
      return false;
    }
    if (
      filters.coleccion &&
      !(p.collections ?? []).includes(filters.coleccion)
    ) {
      return false;
    }
    if (filters.piel && !(p.skinNeeds ?? []).includes(filters.piel)) {
      return false;
    }
    if (filters.cabello && !(p.hairNeeds ?? []).includes(filters.cabello)) {
      return false;
    }
    if (filters.q && !matchesSearchQuery(p, filters.q)) {
      return false;
    }
    return true;
  });
}

/**
 * Si no hay coincidencias exactas, relaja filtros: primero quita colección,
 * luego categoría, y al final muestra todo el catálogo activo.
 * La búsqueda (`q`) siempre se mantiene.
 */
export function filterCatalogProductsRelaxed(
  products: Product[],
  filters: CatalogFilters,
): {
  products: Product[];
  relaxation: CatalogRelaxation;
} {
  const withSearch = {
    q: filters.q,
    piel: filters.piel,
    cabello: filters.cabello,
  };
  const strict = filterCatalogProducts(products, filters);
  if (strict.length > 0) {
    return { products: strict, relaxation: "none" };
  }

  const { categoria, coleccion } = filters;

  if (categoria && coleccion) {
    const byCategory = filterCatalogProducts(products, {
      ...withSearch,
      categoria,
    });
    if (byCategory.length > 0) {
      return { products: byCategory, relaxation: "coleccion" };
    }

    const byCollection = filterCatalogProducts(products, {
      ...withSearch,
      coleccion,
    });
    if (byCollection.length > 0) {
      return { products: byCollection, relaxation: "categoria" };
    }
  }

  if ((categoria || coleccion) && products.length > 0) {
    const searched = filterCatalogProducts(products, withSearch);
    return {
      products: searched,
      relaxation: searched.length > 0 ? "all" : "none",
    };
  }

  return { products: strict, relaxation: "none" };
}

export function countByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, p) => {
    const slug = p.category?.slug;
    if (slug) acc[slug] = (acc[slug] ?? 0) + 1;
    return acc;
  }, {});
}

export function countByCollection(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, p) => {
    for (const slug of p.collections ?? []) {
      acc[slug] = (acc[slug] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function countBySkinNeed(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, product) => {
    for (const slug of product.skinNeeds ?? []) {
      acc[slug] = (acc[slug] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function countByHairNeed(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, product) => {
    for (const slug of product.hairNeeds ?? []) {
      acc[slug] = (acc[slug] ?? 0) + 1;
    }
    return acc;
  }, {});
}
