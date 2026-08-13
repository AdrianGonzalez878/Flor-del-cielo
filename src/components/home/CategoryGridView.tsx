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

type Covers = Record<string, { url: string; alt?: string }>;

function CategoryCard({
  title,
  value,
  visual,
}: {
  title: string;
  value: string;
  visual: CategoryVisual;
}) {
  const isSanity = visual.imageUrl
    ? isSanityImageUrl(visual.imageUrl)
    : false;

  return (
    <Link
      href={`/productos?categoria=${value}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-cream-light transition-all hover:border-brand-gold hover:shadow-lg hover:shadow-brand-brown/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream">
        {visual.imageUrl ? (
          <Image
            src={getSanityImageUrl(visual.imageUrl, 480)}
            alt={visual.alt}
            fill
            sizes="(max-width: 640px) 40vw, 15vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            style={
              visual.objectPosition
                ? { objectPosition: visual.objectPosition }
                : undefined
            }
            unoptimized={isSanity}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-gold-light/60 via-brand-cream to-brand-gold/25"
            aria-hidden
          >
            <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-gold/15" />
            <span className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-brand-gold/10" />
          </div>
        )}

        <div
          className={`absolute inset-0 ${
            visual.imageUrl
              ? "bg-gradient-to-t from-brand-brown/55 via-brand-brown/10 to-transparent"
              : "bg-gradient-to-t from-brand-brown/45 via-brand-brown/5 to-transparent"
          }`}
          aria-hidden
        />
        <h3 className="absolute bottom-3 left-3 right-3 font-serif text-base font-semibold text-brand-cream-light drop-shadow-sm sm:bottom-4 sm:left-4 sm:right-4 sm:text-lg">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export function CategoryGridView({ covers = {} }: { covers?: Covers }) {
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
          <p className="mt-3 leading-relaxed text-brand-brown-muted">
            Del jabón de tepezcohuite a los sérums, las pomadas de masaje y la
            línea dermosuave para bebés.
          </p>
        </motion.div>

        <ul
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden"
          aria-label="Categorías de productos"
        >
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <motion.li
              key={cat.value}
              className="w-[36vw] shrink-0 snap-start"
              initial={{ x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
            >
              <CategoryCard
                title={cat.title}
                value={cat.value}
                visual={resolveCategoryVisual(
                  cat.value,
                  cat.title,
                  covers[cat.value],
                )}
              />
            </motion.li>
          ))}
        </ul>

        <ul className="mt-10 hidden gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <motion.li
              key={cat.value}
              initial={{ y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 6) * 0.05, duration: 0.45 }}
            >
              <CategoryCard
                title={cat.title}
                value={cat.value}
                visual={resolveCategoryVisual(
                  cat.value,
                  cat.title,
                  covers[cat.value],
                )}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
