import Link from "next/link";

import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { buildCatalogUrl } from "@/lib/catalog-url";
import type { ProductCollectionSlug } from "@/sanity/collections";
import { getProductsByCollection, type Product } from "@/sanity/queries";

/** Vista previa cuando aún no hay productos en Sanity con esa colección. */
const fallbackProducts: Product[] = [
  {
    _id: "fallback-1",
    name: "Jabón de Avena y Miel",
    slug: "jabon-avena-miel",
    shortDescription:
      "Suaviza e hidrata con avena y miel orgánica. Apto para piel sensible.",
    price: 85,
    badge: "Más vendido",
    isActive: true,
    stock: 12,
    category: { name: "Jabones", slug: "jabones" },
    collections: ["mas-vendido", "rutina-diaria"],
  },
  {
    _id: "fallback-2",
    name: "Aceite Esencial de Lavanda",
    slug: "aceite-esencial-lavanda",
    shortDescription:
      "Relajante y reparador. Ideal para masajes y rutina nocturna.",
    price: 145,
    badge: "Nuevo",
    isActive: true,
    stock: 8,
    category: { name: "Aceites", slug: "aceites" },
    collections: ["novedades", "rutina-diaria"],
  },
  {
    _id: "fallback-3",
    name: "Vela Botánica de Cedro",
    slug: "vela-botanica-cedro",
    shortDescription:
      "50h de duración, cera de soja natural y fragancias botánicas.",
    price: 120,
    isActive: true,
    stock: 5,
    category: { name: "Velas", slug: "velas" },
    collections: ["novedades", "familia"],
  },
  {
    _id: "fallback-4",
    name: "Shampoo Sólido de Argán",
    slug: "shampoo-solido-argan",
    shortDescription:
      "Hidratación profunda sin sulfatos. Un jabón = 3 botellas de shampoo.",
    price: 95,
    badge: "Favorito",
    isActive: true,
    stock: 15,
    category: { name: "Shampoos", slug: "shampoos" },
    collections: ["mas-vendido", "rutina-diaria"],
  },
];

type Props = {
  eyebrow: string;
  title: string;
  collection: ProductCollectionSlug;
  linkLabel?: string;
  limit?: number;
  variant?: "cream" | "light";
};

export async function ProductCollectionSection({
  eyebrow,
  title,
  collection,
  linkLabel = "Ver colección",
  limit = 12,
  variant = "cream",
}: Props) {
  const productsFromSanity = await getProductsByCollection(collection, limit);
  const fallback = fallbackProducts.filter((p) =>
    (p.collections ?? []).includes(collection),
  );
  const products =
    productsFromSanity.length > 0 ? productsFromSanity : fallback.slice(0, limit);
  const usingFallback = productsFromSanity.length === 0;

  const bgClass =
    variant === "light"
      ? "border-b border-brand-gold/20 bg-brand-cream-light"
      : "border-b border-brand-gold/20 bg-brand-cream";

  return (
    <section className={`py-16 sm:py-20 ${bgClass}`}>
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <Reveal className="text-center">
          <p className="font-script text-2xl text-brand-gold-dark">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
            {title}
          </h2>
        </Reveal>

        {products.length > 0 ? (
          <ProductCarousel products={products} />
        ) : (
          <p className="mt-10 rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-8 py-12 text-center text-brand-brown-muted">
            Pronto habrá productos en esta sección. Asigna la colección en{" "}
            <Link href="/studio" className="underline hover:text-brand-brown">
              Sanity
            </Link>
            .
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            href={buildCatalogUrl({ coleccion: collection })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-brown px-7 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
          >
            {linkLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {usingFallback && products.length > 0 && (
          <p className="mt-8 text-center text-xs text-brand-brown-muted">
            Vista previa con productos de ejemplo. Carga productos reales desde{" "}
            <Link href="/studio" className="underline hover:text-brand-brown">
              el panel de Sanity
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
