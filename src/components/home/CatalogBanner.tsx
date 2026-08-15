import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import type { HomeCatalogBanner } from "@/sanity/queries";

export type CatalogBannerContent = {
  image: string;
  alt: string;
  title?: string;
};

/** Resuelve el banner de Sanity con una imagen local de respaldo. */
export function resolveCatalogBanner(
  banner: HomeCatalogBanner | null,
  fallbackImage: string,
  fallbackAlt: string,
): CatalogBannerContent {
  return {
    image: banner?.image?.url ?? fallbackImage,
    alt: banner?.image?.alt ?? fallbackAlt,
    title: banner?.title,
  };
}

export function CatalogBanner({ image, alt, title }: CatalogBannerContent) {
  return (
    <Reveal
      from="up"
      duration={0.7}
      className="relative min-h-[251px] w-full overflow-hidden sm:min-h-[580px]"
    >
      <Image
        src={getSanityImageUrl(image, 1920)}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        unoptimized={isSanityImageUrl(image)}
      />
      {title && (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-brown/75 via-brand-brown/10 to-transparent"
            aria-hidden
          />
          <div className="relative flex min-h-[251px] items-end justify-center px-4 py-8 text-center sm:min-h-[580px] sm:px-6 sm:py-10 lg:px-10 xl:px-12">
            <h2 className="max-w-3xl font-serif text-3xl font-semibold text-brand-cream-light sm:text-4xl">
              {title}
            </h2>
          </div>
        </>
      )}
    </Reveal>
  );
}
