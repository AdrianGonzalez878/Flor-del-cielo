import Image from "next/image";
import Link from "next/link";

import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import type { ProductCategorySlug } from "@/sanity/categories";
import {
  getHomeCatalogBanner,
  getProductsByCategory,
  type HomeCatalogBanner,
  type Product,
} from "@/sanity/queries";

const categoryContent: Record<
  "jabones" | "shampoos",
  { title: string; description: string }
> = {
  jabones: {
    title: "Jabones",
    description:
      "Fórmulas elaboradas para limpiar con suavidad y acompañar el cuidado diario de tu piel.",
  },
  shampoos: {
    title: "Shampoos",
    description:
      "Ingredientes seleccionados para distintas necesidades del cabello y cuero cabelludo.",
  },
};

function CategoryProducts({
  category,
  products,
  banner,
  variant,
}: {
  category: "jabones" | "shampoos";
  products: Product[];
  banner: HomeCatalogBanner | null;
  variant: "cream" | "light";
}) {
  const content = categoryContent[category];
  const background =
    variant === "cream" ? "bg-brand-cream" : "bg-brand-cream-light";
  const bannerImage = banner?.image?.url ?? `/categories/${category}.jpg`;
  const bannerAlt =
    banner?.image?.alt ?? `Colección de ${content.title.toLowerCase()}`;

  return (
    <section
      className={`border-b border-brand-gold/20 pb-16 sm:pb-20 ${background}`}
    >
      <Reveal
        from="up"
        duration={0.7}
        className="relative min-h-[251px] w-full overflow-hidden sm:min-h-[580px]"
      >
        <Image
          src={getSanityImageUrl(bannerImage, 1920)}
          alt={bannerAlt}
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized={isSanityImageUrl(bannerImage)}
        />
        {banner?.title && (
          <>
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-brown/75 via-brand-brown/10 to-transparent"
              aria-hidden
            />
            <div className="relative flex min-h-[251px] items-end justify-center px-4 py-8 text-center sm:min-h-[580px] sm:px-6 sm:py-10 lg:px-10 xl:px-12">
              <h2 className="max-w-3xl font-serif text-3xl font-semibold text-brand-cream-light sm:text-4xl">
                {banner.title}
              </h2>
            </div>
          </>
        )}
      </Reveal>

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <Reveal className="mt-12 text-center" delay={0.08}>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-3 leading-relaxed text-brand-brown-muted">
              {content.description}
            </p>
          </div>
        </Reveal>

        {products.length > 0 ? (
          <ProductCarousel products={products} />
        ) : (
          <p className="mt-10 rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-8 py-12 text-center text-brand-brown-muted">
            Próximamente agregaremos productos a esta sección.
          </p>
        )}

        <Reveal className="mt-8 text-center" delay={0.1}>
          <Link
            href={buildCatalogUrl({ categoria: category })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-brown px-7 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
          >
            Ver todos
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export async function HomeCategoryShowcase() {
  const [soapsBanner, shampoosBanner, soaps, shampoos] = await Promise.all([
    getHomeCatalogBanner("jabones"),
    getHomeCatalogBanner("shampoos"),
    getProductsByCategory("jabones" satisfies ProductCategorySlug, 12),
    getProductsByCategory("shampoos" satisfies ProductCategorySlug, 12),
  ]);

  return (
    <>
      <CategoryProducts
        category="jabones"
        products={soaps}
        banner={soapsBanner}
        variant="cream"
      />
      <CategoryProducts
        category="shampoos"
        products={shampoos}
        banner={shampoosBanner}
        variant="light"
      />
    </>
  );
}
