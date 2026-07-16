"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  resolveCategoryVisual,
  type CategoryVisual,
} from "@/lib/category-images";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import { PRODUCT_CATEGORIES } from "@/sanity/categories";

const categoryMeta: Record<string, { description: string }> = {
  jabones: { description: "Aromas suaves y fórmulas gentiles." },
  shampoos: { description: "Cuidado capilar natural." },
  velas: { description: "Fragancias que abrazan tu espacio." },
  cremas: { description: "Hidratación para piel sensible." },
  aceites: { description: "Esencias botánicas y bienestar." },
};

function CategoryCard({
  title,
  value,
  description,
  visual,
  compact = false,
}: {
  title: string;
  value: string;
  description: string;
  visual: CategoryVisual;
  compact?: boolean;
}) {
  const isSanity = isSanityImageUrl(visual.imageUrl);

  return (
    <Link
      href={`/productos?categoria=${value}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-cream-light transition-all hover:border-brand-gold hover:shadow-lg hover:shadow-brand-brown/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream">
        <Image
          src={getSanityImageUrl(visual.imageUrl, compact ? 480 : 640)}
          alt={visual.alt}
          fill
          sizes={compact ? "40vw" : "(max-width: 640px) 50vw, 20vw"}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          style={
            visual.objectPosition
              ? { objectPosition: visual.objectPosition }
              : undefined
          }
          unoptimized={isSanity}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-brown/55 via-brand-brown/10 to-transparent"
          aria-hidden
        />
        <h3 className="absolute bottom-3 left-3 right-3 font-serif text-base font-semibold text-brand-cream-light drop-shadow-sm sm:bottom-4 sm:left-4 sm:right-4 sm:text-xl">
          {title}
        </h3>
      </div>

      {!compact && (
        <div className="p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-brand-brown-muted">
            {description}
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-brand-gold-dark group-hover:underline">
            Ver productos →
          </span>
        </div>
      )}
    </Link>
  );
}

export function CategoryGridView() {
  return (
    <section
      id="categorias"
      className="scroll-mt-24 border-b border-brand-gold/20 bg-brand-cream-light py-12 sm:py-16"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-script text-2xl text-brand-gold-dark">
            Categorías
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
            ¿Qué estás buscando?
          </h2>
        </motion.div>

        <ul
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden"
          aria-label="Categorías de productos"
        >
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const meta = categoryMeta[cat.value];
            const visual = resolveCategoryVisual(cat.value, cat.title);
            return (
              <motion.li
                key={cat.value}
                className="w-[36vw] shrink-0 snap-start"
                initial={{ x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <CategoryCard
                  title={cat.title}
                  value={cat.value}
                  description={meta.description}
                  visual={visual}
                  compact
                />
              </motion.li>
            );
          })}
        </ul>

        <ul className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const meta = categoryMeta[cat.value];
            const visual = resolveCategoryVisual(cat.value, cat.title);
            return (
              <motion.li
                key={cat.value}
                initial={{ y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <CategoryCard
                  title={cat.title}
                  value={cat.value}
                  description={meta.description}
                  visual={visual}
                />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
