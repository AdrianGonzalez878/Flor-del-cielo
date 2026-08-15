import { resolveCatalogBanner } from "@/components/home/CatalogBanner";
import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import { getHomeCatalogBanner, type Product } from "@/sanity/queries";

export async function HerbalCollection({
  products,
}: {
  products: Product[];
}) {
  const banner = await getHomeCatalogBanner("herbolaria-tradicional");

  return (
    <ProductCollectionSection
      eyebrow="Saberes ancestrales"
      title="Herbolaria tradicional"
      description="Fórmulas con plantas de uso tradicional oaxaqueño: tepezcohuite, árnica, caléndula, romero y sábila."
      collection="herbolaria-tradicional"
      products={products}
      banner={resolveCatalogBanner(
        banner,
        "/categories/aceites.jpg",
        "Aceites y productos de herbolaria tradicional Flor del Cielo",
      )}
      linkLabel="Ver la colección"
      variant="light"
    />
  );
}
