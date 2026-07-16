import type { Metadata } from "next";

import { ProductQuiz } from "@/components/home/ProductQuiz";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAllProducts } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Encuentra tu producto ideal",
  description:
    "Responde tres preguntas y descubre los productos Flor del Cielo que mejor encajan con tus necesidades.",
};

export default async function TestPage() {
  const products = await getAllProducts();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-script text-2xl text-brand-gold-dark">
              Tu ritual empieza aquí
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl lg:text-5xl">
              Encuentra el producto ideal para ti
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-brand-brown-muted">
              Cuéntanos qué quieres cuidar y te mostraremos opciones reales del
              catálogo que encajan con tus necesidades.
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-brand-brown-muted">
              {["3 preguntas", "Sin registro", "Productos disponibles"].map(
                (item) => (
                  <li
                    key={item}
                    className="rounded-full border border-brand-gold/30 bg-brand-cream-light px-3 py-1.5"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <section className="relative mt-10 overflow-hidden rounded-3xl border border-brand-gold/35 bg-brand-cream-light px-5 py-8 shadow-lg shadow-brand-brown/5 sm:px-10 sm:py-12">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-gold/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-gold-light/30"
              aria-hidden
            />
            <ProductQuiz products={products} />
          </section>

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-brand-brown-muted">
            Esta orientación es informativa y no sustituye el diagnóstico de
            un profesional de la salud.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
