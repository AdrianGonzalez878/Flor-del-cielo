import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import {
  CategoryFilters,
  CollectionSidebar,
  NeedFilters,
  getCatalogPageTitle,
} from "@/components/products/CatalogFilters";
import { ProductCard } from "@/components/products/ProductCard";
import {
  countByCategory,
  countByCollection,
  countByHairNeed,
  countBySkinNeed,
  filterCatalogProducts,
  filterCatalogProductsRelaxed,
} from "@/lib/filter-products";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { getRelaxationMessage } from "@/lib/catalog-relaxation-message";
import { getCategory } from "@/sanity/categories";
import { getAllProducts } from "@/sanity/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    categoria?: string;
    coleccion?: string;
    piel?: string;
    cabello?: string;
    q?: string;
    from?: string;
    pagina?: string;
  }>;
};

export default async function ProductosPage({ searchParams }: PageProps) {
  const { categoria, coleccion, piel, cabello, q, from, pagina } =
    await searchParams;
  const allProducts = await getAllProducts();
  const activeProducts = allProducts.filter((p) => p.isActive);

  const categoryCounts = countByCategory(activeProducts);
  const collectionCounts = countByCollection(activeProducts);
  /** Las necesidades se cuentan dentro de la línea y colección elegidas. */
  const needScope = filterCatalogProducts(activeProducts, {
    categoria,
    coleccion,
    q,
  });
  const skinNeedCounts = countBySkinNeed(needScope);
  const hairNeedCounts = countByHairNeed(needScope);

  const { products, relaxation } = filterCatalogProductsRelaxed(activeProducts, {
    categoria,
    coleccion,
    piel,
    cabello,
    q,
  });

  const relaxationMessage = getRelaxationMessage(
    relaxation,
    { categoria, coleccion, piel, cabello },
    from === "quiz",
  );

  const activeCategoryInfo = getCategory(categoria);
  const categoryDescription = activeCategoryInfo?.description;
  const categoryPresentation = activeCategoryInfo?.presentation;

  const searchQuery = q?.trim();
  const pageTitle = searchQuery
    ? `Resultados para “${searchQuery}”`
    : getCatalogPageTitle(categoria, coleccion, piel, cabello);
  const hasActiveFilters = Boolean(
    categoria || coleccion || piel || cabello || searchQuery,
  );
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const requestedPage = Number(pagina);
  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const pageProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const paginationFilters = {
    categoria,
    coleccion,
    piel,
    cabello,
    q,
    from,
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
          <Reveal className="max-w-2xl text-center sm:text-left">
            <p className="font-script text-2xl text-brand-gold-dark">
              Catálogo
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-brand-brown sm:mt-2 sm:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-brand-brown-muted sm:mt-3 sm:text-base">
              {searchQuery
                ? "Productos que coinciden con tu búsqueda."
                : (categoryDescription ??
                  "Explora por colección, tipo de producto o necesidad.")}
            </p>
            {!searchQuery && categoryPresentation && (
              <p className="mt-1 text-sm text-brand-gold-dark">
                Presentación de la línea: {categoryPresentation}
              </p>
            )}
          </Reveal>

          <div className="mt-7 rounded-2xl border border-brand-gold/20 bg-brand-cream-light/60 p-4 sm:mt-10 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 lg:flex lg:gap-12">
            <CollectionSidebar
              activeCategory={categoria}
              activeCollection={coleccion}
              activeSkinNeed={piel}
              activeHairNeed={cabello}
              activeQuery={q}
              collectionCounts={collectionCounts}
            />

            <div className="mt-5 min-w-0 flex-1 sm:mt-7 lg:mt-0">
              <CategoryFilters
                activeCategory={categoria}
                activeCollection={coleccion}
                activeQuery={q}
                categoryCounts={categoryCounts}
              />
              <NeedFilters
                activeCategory={categoria}
                activeCollection={coleccion}
                activeSkinNeed={piel}
                activeHairNeed={cabello}
                activeQuery={q}
                skinNeedCounts={skinNeedCounts}
                hairNeedCounts={hairNeedCounts}
              />

              {relaxationMessage && (
                <div
                  className="mt-5 rounded-xl border border-brand-gold/35 bg-brand-gold-light/35 px-4 py-3 text-sm leading-relaxed text-brand-brown sm:mt-6 sm:rounded-2xl sm:px-5 sm:py-4"
                  role="status"
                >
                  {relaxationMessage}
                </div>
              )}

              {products.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-6 py-10 text-center sm:mt-10 sm:px-8 sm:py-12">
                  <p className="font-serif text-lg text-brand-brown">
                    {searchQuery
                      ? "No encontramos productos con esa búsqueda"
                      : "No hay productos con estos filtros"}
                  </p>
                  <p className="mt-2 text-sm text-brand-brown-muted">
                    {searchQuery
                      ? "Prueba con otro término o revisa el catálogo completo."
                      : "Prueba otra combinación o asigna colecciones al producto en Sanity."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <p className="text-sm text-brand-brown-muted">
                      {products.length}{" "}
                      {products.length === 1 ? "producto" : "productos"}
                    </p>
                    {hasActiveFilters && (
                      <Link
                        href={buildCatalogUrl()}
                        className="text-sm font-semibold text-brand-gold-dark hover:underline"
                      >
                        Limpiar filtros
                      </Link>
                    )}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    {pageProducts.map((product, i) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        index={i}
                      />
                    ))}
                  </ul>
                  {totalPages > 1 && (
                    <nav
                      className="mt-8 flex items-center justify-center gap-3"
                      aria-label="Paginación de productos"
                    >
                      {currentPage > 1 ? (
                        <Link
                          href={buildCatalogUrl({
                            ...paginationFilters,
                            pagina: currentPage - 1,
                          })}
                          className="inline-flex h-10 items-center justify-center rounded-full border border-brand-gold/40 px-4 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream-light"
                        >
                          ← Anterior
                        </Link>
                      ) : (
                        <span className="inline-flex h-10 items-center justify-center rounded-full border border-brand-gold/20 px-4 text-sm font-semibold text-brand-brown-muted/50">
                          ← Anterior
                        </span>
                      )}
                      <span className="text-sm text-brand-brown-muted">
                        {currentPage} de {totalPages}
                      </span>
                      {currentPage < totalPages ? (
                        <Link
                          href={buildCatalogUrl({
                            ...paginationFilters,
                            pagina: currentPage + 1,
                          })}
                          className="inline-flex h-10 items-center justify-center rounded-full bg-brand-brown px-4 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
                        >
                          Siguiente →
                        </Link>
                      ) : (
                        <span className="inline-flex h-10 items-center justify-center rounded-full bg-brand-brown/30 px-4 text-sm font-semibold text-brand-cream-light/70">
                          Siguiente →
                        </span>
                      )}
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
