"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import { getCategory, type CategoryGroupSlug } from "@/sanity/categories";
import type { Product } from "@/sanity/queries";

type Props = {
  product: Product;
  index?: number;
  animate?: boolean;
};

const accentByGroup: Record<CategoryGroupSlug, string> = {
  cuerpo: "bg-brand-gold-light/45",
  cabello: "bg-brand-gold-mid/20",
  rostro: "bg-brand-cream",
  bienestar: "bg-brand-gold/20",
  higiene: "bg-brand-gold-light/30",
  bebes: "bg-brand-gold-light/55",
};

export function ProductCard({ product, index = 0, animate = true }: Props) {
  const group = getCategory(product.category?.slug)?.group;
  const accent = group ? accentByGroup[group] : "bg-brand-cream";
  const showPlaceholder = !product.mainImage?.url;

  const card = (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/25 bg-brand-cream-light transition-all hover:border-brand-gold/60 hover:shadow-lg hover:shadow-brand-brown/10"
    >
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden ${
          showPlaceholder ? accent : "bg-brand-cream"
        }`}
      >
        {showPlaceholder ? (
          <>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-gold/10" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-brand-gold/10" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 opacity-40 transition-opacity group-hover:opacity-60">
              <ProductIcon group={group} />
              <span className="text-xs font-medium text-brand-brown">
                Foto próximamente
              </span>
            </div>
          </>
        ) : (
          <Image
            src={getSanityImageUrl(product.mainImage!.url, 720)}
            alt={product.mainImage!.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 40vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            unoptimized={isSanityImageUrl(product.mainImage!.url)}
          />
        )}

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-brown px-2.5 py-0.5 text-xs font-semibold text-brand-cream-light">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-brand-brown/0 transition-colors group-hover:bg-brand-brown/5" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-6">
        <div>
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
              {product.category.name}
            </p>
          )}
          <h3 className="mt-1 line-clamp-2 font-serif text-sm font-semibold text-brand-brown group-hover:text-brand-brown-dark sm:text-lg">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between gap-1 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="price-number text-sm text-brand-brown sm:text-lg">
              ${product.price} MXN
            </span>
            {product.compareAtPrice && (
              <span className="hidden text-xs text-brand-brown-muted line-through sm:inline">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-brown text-brand-cream-light transition-colors group-hover:bg-brand-brown-dark sm:h-8 sm:w-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );

  if (!animate) {
    return <li className="h-full">{card}</li>;
  }

  return (
    <motion.li
      initial={{ x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="h-full"
    >
      {card}
    </motion.li>
  );
}

function ProductIcon({ group }: { group?: CategoryGroupSlug }) {
  const props = {
    width: 48,
    height: 48,
    viewBox: "0 0 24 24",
    fill: "none",
    className: "text-brand-brown",
  } as const;

  if (group === "cabello") {
    return (
      <svg {...props}>
        <path d="M10 3h4v3h-4V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="7" y="6" width="10" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (group === "rostro") {
    return (
      <svg {...props}>
        <path d="M9 3h6M12 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 7h6l-1 13.5a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5L9 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10.3 14h3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (group === "bienestar") {
    return (
      <svg {...props}>
        <path d="M12 2s-2 2-2 3.8C10 7.2 12 8 12 8s2-.8 2-2.2C14 4 12 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="7" y="9" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 21h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (group === "higiene") {
    return (
      <svg {...props}>
        <path d="M9 3h6l-1 3h-4L9 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 6h4l1 12a3 3 0 0 1-3 3 3 3 0 0 1-3-3L10 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (group === "bebes") {
    return (
      <svg {...props}>
        <path d="M12 20.5S4.5 16 4.5 10.4A4 4 0 0 1 12 8.4a4 4 0 0 1 7.5 2c0 5.6-7.5 10.1-7.5 10.1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
