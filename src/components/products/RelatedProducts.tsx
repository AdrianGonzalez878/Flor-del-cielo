import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { getRelatedProducts } from "@/sanity/queries";

type Props = {
  slug: string;
  categorySlug?: string;
};

export async function RelatedProducts({ slug, categorySlug }: Props) {
  const products = await getRelatedProducts(slug, categorySlug, 8);
  if (products.length === 0) return null;

  return (
    <section className="border-t border-brand-gold/20 bg-brand-cream py-14 sm:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <Reveal className="text-center">
          <p className="font-script text-2xl text-brand-gold-dark">
            Sigue explorando
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
            Te podría gustar
          </h2>
        </Reveal>
        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
