"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Selección consciente",
    description:
      "Elegimos aceites, mantecas y botanicals de origen confiable. Cada lote se revisa antes de entrar al taller.",
  },
  {
    step: "02",
    title: "Elaboración artesanal",
    description:
      "Mezclamos, vertemos y moldeamos a mano, en pequeños lotes, para cuidar textura, aroma y efecto en la piel.",
  },
  {
    step: "03",
    title: "Curado y acabado",
    description:
      "Respetamos tiempos de reposo y secado. El resultado es más uniforme, duradero y agradable al uso.",
  },
  {
    step: "04",
    title: "Empaque con intención",
    description:
      "Presentamos cada pieza con el mismo cuidado con el que fue creada, lista para regalar o disfrutar en casa.",
  },
] as const;

export function CraftProcess() {
  return (
    <section className="border-t border-brand-gold/20 bg-brand-cream py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="font-script text-2xl text-brand-gold-dark">
              Detrás de cada pieza
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              Del taller a tu ritual
            </h2>
            <p className="mt-3 text-brand-brown-muted">
              No fabricamos en cadena. Cada producto pasa por un proceso
              pausado, pensado para honrar lo natural y lo hecho a mano.
            </p>
          </div>
          <p className="mt-6 hidden max-w-xs text-sm leading-relaxed text-brand-brown-muted lg:block">
            Transparencia en lo que usamos y cómo lo preparamos es parte de la
            experiencia Flor del Cielo.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <motion.li
              key={item.step}
              initial={{ y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-6"
            >
              <span className="font-serif text-3xl font-semibold text-brand-gold/40">
                {item.step}
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-brand-brown">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-brown-muted">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
