"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import type { ProductImage } from "@/sanity/queries";

type Props = {
  name: string;
  mainImage?: ProductImage;
  gallery?: ProductImage[];
  badge?: string;
};

export function ProductGallery({
  name,
  mainImage,
  gallery,
  badge,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const images = useMemo(() => {
    const safeGallery = Array.isArray(gallery) ? gallery : [];
    const items: ProductImage[] = [];
    if (mainImage?.url) items.push(mainImage);
    for (const image of safeGallery) {
      if (image.url && !items.some((item) => item.url === image.url)) {
        items.push(image);
      }
    }
    return items;
  }, [mainImage, gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const current = images[activeIndex];

  const thumbs = images.length > 1 && (
    <ul
      className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:w-16 lg:flex-col lg:overflow-visible lg:overflow-y-auto [&::-webkit-scrollbar]:hidden"
      aria-label="Miniaturas del producto"
    >
      {images.map((image, index) => (
        <li key={image.url} className="shrink-0">
          <button
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ver imagen ${index + 1}`}
            aria-pressed={index === activeIndex}
            className={`relative h-14 w-14 overflow-hidden rounded-md border transition-all lg:h-16 lg:w-16 ${
              index === activeIndex
                ? "border-brand-brown"
                : "border-brand-gold/20 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={getSanityImageUrl(image.url, 160)}
              alt={image.alt ?? `${name} — imagen ${index + 1}`}
              fill
              sizes="64px"
              className="object-cover"
              unoptimized={isSanityImageUrl(image.url)}
            />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-3">
      {/* Desktop: thumbs a la izquierda */}
      <div className="hidden lg:block">{thumbs}</div>

      <motion.div
        key={current?.url ?? name}
        initial={shouldReduceMotion ? false : { x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-w-0 flex-1 aspect-[3/4] overflow-hidden rounded-lg bg-[#f3f1ec]"
      >
        {current?.url ? (
          <Image
            key={current.url}
            src={getSanityImageUrl(current.url, 1440)}
            alt={current.alt ?? name}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-center"
            unoptimized={isSanityImageUrl(current.url)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-brown-muted">
            Sin imagen
          </div>
        )}
        {badge && activeIndex === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-brown px-2.5 py-1 text-[11px] font-semibold text-brand-cream-light">
            {badge}
          </span>
        )}
      </motion.div>

      {/* Móvil: thumbs debajo */}
      <div className="lg:hidden">{thumbs}</div>
    </div>
  );
}
