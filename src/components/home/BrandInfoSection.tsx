"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/** Sube este número cuando reemplaces public/brand/informativa.jpg */
const BRAND_IMAGE_VERSION = "1";
const BRAND_IMAGE_SRC = `/brand/informativa.jpg?v=${BRAND_IMAGE_VERSION}`;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function BrandInfoSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-24 border-b border-brand-gold/20 bg-brand-cream pb-16 sm:py-20"
    >
      <div className="lg:mx-auto lg:max-w-6xl lg:px-6">
        <div className="grid lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* Imagen: entra de derecha a izquierda */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ x: 56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream sm:aspect-[5/6] lg:aspect-[4/5] lg:rounded-3xl lg:border lg:border-brand-gold/30 lg:shadow-lg lg:shadow-brand-brown/10">
              <Image
                src={BRAND_IMAGE_SRC}
                alt="Elaboración artesanal Flor del Cielo"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </motion.div>

          {/* Texto: también de derecha a izquierda, con leve retraso */}
          <motion.div
            className="order-2 px-4 pt-10 text-center sm:px-6 lg:order-1 lg:px-0 lg:pt-0 lg:text-left"
            initial={{ x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.12, ease }}
          >
            <p className="font-script text-2xl text-brand-gold-dark">
              Nuestra esencia
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              Cosmética artesanal que cuida de ti
            </h2>

            <p className="mt-4 leading-relaxed text-brand-brown-muted lg:hidden">
              Productos honestos, elaborados a mano en lotes pequeños, con
              ingredientes naturales y sin químicos agresivos. Cuidamos cada
              pedido para que llegue bien a cualquier rincón de México.
            </p>

            <div className="mt-4 hidden space-y-4 leading-relaxed text-brand-brown-muted lg:block">
              <p>
                En Flor del Cielo creemos en productos honestos: elaborados a
                mano, en lotes pequeños y con procesos cuidadosos. Seleccionamos
                ingredientes naturales y evitamos químicos agresivos que irriten
                tu piel.
              </p>
              <p>
                Jabones, velas, cremas y más: fórmulas suaves para distintas
                necesidades — piel sensible, bebés, rutina diaria y momentos de
                bienestar. Cada pedido lo preparamos con cariño para que llegue
                bien a cualquier rincón de México.
              </p>
            </div>

            <Link
              href="/productos"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
            >
              Explorar catálogo
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
