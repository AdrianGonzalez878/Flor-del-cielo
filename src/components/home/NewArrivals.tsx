import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import type { Product } from "@/sanity/queries";

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <ProductCollectionSection
      eyebrow="Recién llegados"
      title="Lo más nuevo"
      description="Los últimos productos que salieron del taller."
      collection="novedades"
      products={products}
      linkLabel="Ver todo el catálogo"
      href="/productos"
      variant="cream"
    />
  );
}
