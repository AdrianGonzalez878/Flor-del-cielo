"use client";

import { motion } from "framer-motion";

const highlights = [
  {
    name: "Avena y miel",
    benefit: "Calma e hidrata pieles sensibles",
  },
  {
    name: "Aceites esenciales",
    benefit: "Aromas botánicos sin fragancias sintéticas",
  },
  {
    name: "Manteca de karité",
    benefit: "Nutrición profunda y textura sedosa",
  },
  {
    name: "Cera de soja",
    benefit: "Combustión limpia en nuestras velas",
  },
] as const;

const avoids = [
  "Parabenos",
  "Sulfatos agresivos",
  "Colorantes artificiales",
  "Pruebas en animales",
] as const;

export function IngredientsPhilosophy() {
  return (
    <section className="bg-brand-cream-light py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <p className="font-script text-2xl text-brand-gold-dark">
              Ingredientes
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              Lo que sí va en tu piel
            </h2>
            <p className="mt-3 text-brand-brown-muted">
              Priorizamos lo vegetal, lo reconocible y lo que aporta bienestar
              real. Cada fórmula nace para acompañar, no para cubrir.
            </p>

            <ul className="mt-8 space-y-4">
              {highlights.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex gap-4 rounded-xl border border-brand-gold/20 bg-brand-cream/60 px-5 py-4"
                >
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold"
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold text-brand-brown">{item.name}</p>
                    <p className="mt-0.5 text-sm text-brand-brown-muted">
                      {item.benefit}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-brand-gold/30 bg-brand-brown p-8 sm:p-10"
          >
            <p className="font-script text-2xl text-brand-gold">
              Lo que evitamos
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-brand-cream-light">
              Fórmulas conscientes
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-cream-light/75">
              Creemos en menos ingredientes, mejor elegidos. Si no aporta al
              cuidado de tu piel o de tu hogar, no lo incluimos.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {avoids.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-brand-gold/30 bg-brand-brown-dark/50 px-4 py-1.5 text-sm text-brand-cream-light/90"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-brand-gold-light/60">
              Consulta la lista completa de ingredientes en la ficha de cada
              producto antes de comprar.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
