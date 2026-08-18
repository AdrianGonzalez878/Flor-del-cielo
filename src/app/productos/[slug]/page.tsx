import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContentEntrance } from "@/components/motion/ContentEntrance";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { ProductTestimonials } from "@/components/products/ProductTestimonials";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { getProductBySlug } from "@/sanity/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | Flor del Cielo`,
    description: product.shortDescription ?? undefined,
  };
}

export default async function ProductoDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream">
        <div className="border-b border-brand-gold/15">
          <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm text-brand-brown-muted sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="shrink-0 hover:text-brand-brown">
              Inicio
            </Link>
            <span aria-hidden>/</span>
            <Link href="/productos" className="shrink-0 hover:text-brand-brown">
              Productos
            </Link>
            {product.category && (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={buildCatalogUrl({
                    categoria: product.category.slug,
                  })}
                  className="shrink-0 hover:text-brand-brown"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="truncate text-brand-brown">{product.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:py-12">
          <ContentEntrance key={product.slug} replayKey={product.slug}>
            <article className="overflow-hidden rounded-2xl border border-brand-gold/20 bg-brand-cream-light shadow-lg shadow-brand-brown/10 sm:rounded-3xl">
              <div className="grid gap-8 p-4 sm:gap-10 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
                <ProductGallery
                  name={product.name}
                  mainImage={product.mainImage}
                  gallery={product.gallery}
                  badge={product.badge}
                />

                <ProductPurchasePanel
                  _id={product._id}
                  name={product.name}
                  slug={product.slug}
                  categoryName={product.category?.name}
                  categorySlug={product.category?.slug}
                  shortDescription={product.shortDescription}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  weight={product.weight}
                  stock={product.stock}
                  collections={product.collections}
                  skinNeeds={product.skinNeeds}
                  hairNeeds={product.hairNeeds}
                  ingredients={product.ingredients}
                  imageUrl={product.mainImage?.url}
                  imageAlt={product.mainImage?.alt}
                />
              </div>
            </article>
          </ContentEntrance>
        </div>

        <RelatedProducts
          slug={product.slug}
          categorySlug={product.category?.slug}
        />
        <ProductTestimonials />
      </main>
      <Footer />
    </>
  );
}
