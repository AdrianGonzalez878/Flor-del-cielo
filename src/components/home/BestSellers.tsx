import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";

export function BestSellers() {
  return (
    <ProductCollectionSection
      eyebrow="Favoritos de la tienda"
      title="Los más vendidos"
      collection="mas-vendido"
      linkLabel="Ver más vendidos"
      variant="cream"
    />
  );
}
