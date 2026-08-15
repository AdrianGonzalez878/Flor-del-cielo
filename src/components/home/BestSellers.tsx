import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import type { Product } from "@/sanity/queries";

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <ProductCollectionSection
      eyebrow="Favoritos de la tienda"
      title="Los más vendidos"
      collection="mas-vendido"
      products={products}
      linkLabel="Ver más vendidos"
      variant="cream"
    />
  );
}
