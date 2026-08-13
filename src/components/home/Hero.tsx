"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

/** Sube este número cuando reemplaces hero-desktop.jpg o hero-movile.jpg */
const HERO_CACHE_VERSION = "2";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden sm:min-h-[92vh] lg:min-h-[90vh]">
      <div className="absolute inset-0">
        <Image
          src={`/hero-movile.jpg?v=${HERO_CACHE_VERSION}`}
          alt="Productos artesanales Flor del Cielo"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center lg:hidden"
        />
        <Image
          src={`/hero-desktop.jpg?v=${HERO_CACHE_VERSION}`}
          alt="Productos artesanales Flor del Cielo"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="hidden object-cover object-center lg:block"
        />
      </div>

      {/* Degradado crema abajo — legibilidad del texto café */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-brand-cream via-brand-cream/80 to-transparent sm:h-[45%] lg:h-[40%] lg:from-brand-cream/95 lg:via-brand-cream/55"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pb-14 lg:pb-16">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0}
            className="h-px w-12 bg-brand-gold"
            aria-hidden
          />

          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={1}
            className="mt-4 font-serif text-[2rem] leading-[1.08] font-semibold text-brand-brown sm:text-5xl lg:text-6xl"
          >
            Eleva tu rutina diaria a un{" "}
            <span className="text-brand-brown-dark">ritual botánico</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={2}
            className="mt-4 max-w-md text-base leading-relaxed text-brand-brown-muted sm:text-lg"
          >
            Jabones, shampoos, cremas y sérums elaborados a mano en Oaxaca con
            herbolaria tradicional.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={3}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/productos"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
            >
              Explorar tienda
            </Link>
            <Link
              href="/#categorias"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-brown transition-colors hover:text-brand-gold-dark"
            >
              Ver categorías
              <span
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
