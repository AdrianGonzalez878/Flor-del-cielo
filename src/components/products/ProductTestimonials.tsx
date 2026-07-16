"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Sofía M.",
    location: "CDMX",
    rating: 5,
    text: "El jabón de avena y miel es increíble. Mi piel nunca había estado tan suave. ¡Ya voy por mi tercer pedido!",
    product: "Jabón de Avena y Miel",
  },
  {
    name: "Carolina R.",
    location: "Guadalajara",
    rating: 5,
    text: "Las velas llenan el cuarto de un olor tan natural y cálido. No vuelvo a comprar velas de otra marca.",
    product: "Vela Botánica de Cedro",
  },
  {
    name: "Valentina T.",
    location: "Monterrey",
    rating: 5,
    text: "El aceite de lavanda lo uso cada noche y el shampoo sólido me cambió la vida. El empaque es precioso.",
    product: "Aceite Esencial de Lavanda",
  },
  {
    name: "Mariana L.",
    location: "Puebla",
    rating: 5,
    text: "Me encanta que todo sea 100% natural. Noto la diferencia en mi piel y sé exactamente qué me estoy poniendo.",
    product: "Shampoo Sólido de Argán",
  },
  {
    name: "Daniela P.",
    location: "Querétaro",
    rating: 5,
    text: "Pedí el set de jabones y llegaron impecables. Se nota el cuidado artesanal en cada detalle.",
    product: "Set de Jabones Artesanales",
  },
  {
    name: "Andrea G.",
    location: "Mérida",
    rating: 5,
    text: "La crema hidratante es suave y no tapa los poros. Ideal para clima cálido y piel sensible.",
    product: "Crema Hidratante Natural",
  },
] as const;

const AUTO_MS = 4500;
const VISIBLE = 3;

function StarRating({ count }: { count: number }) {
  return (
    <div
      className="flex justify-center gap-0.5"
      aria-label={`${count} de 5 estrellas`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-brand-gold"
          aria-hidden
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function getVisibleReviews(startIndex: number) {
  return Array.from({ length: VISIBLE }, (_, offset) => {
    const review = reviews[(startIndex + offset) % reviews.length];
    return { review, key: `${startIndex}-${review.name}` };
  });
}

export function ProductTestimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % reviews.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setIndex(((next % reviews.length) + reviews.length) % reviews.length);
  };

  const visible = getVisibleReviews(index);

  return (
    <section className="border-t border-brand-gold/20 bg-brand-cream-light py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-script text-2xl text-brand-gold-dark">
            Lo que dicen nuestras clientas
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
            Historias reales
          </h2>
        </motion.div>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => goTo(index - 1, -1)}
            aria-label="Testimonios anteriores"
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream-light text-lg text-brand-brown shadow-md transition-transform hover:scale-105 sm:-left-1 sm:h-11 sm:w-11 lg:-left-3"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1, 1)}
            aria-label="Testimonios siguientes"
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream-light text-lg text-brand-brown shadow-md transition-transform hover:scale-105 sm:-right-1 sm:h-11 sm:w-11 lg:-right-3"
          >
            →
          </button>

          <div className="overflow-hidden px-10 sm:px-12">
            <motion.ul
              key={index}
              initial={{ x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="grid gap-4 md:grid-cols-3"
              aria-live="polite"
            >
              {visible.map(({ review, key }, i) => (
                <li
                  key={key}
                  className={i > 0 ? "hidden md:block" : undefined}
                >
                  <article className="flex h-full flex-col rounded-2xl border border-brand-gold/30 bg-brand-cream px-5 py-6 shadow-sm shadow-brand-brown/5 sm:px-6">
                    <StarRating count={review.rating} />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-brown-muted">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <div className="mt-5 border-t border-brand-gold/20 pt-4">
                      <p className="font-script text-xl text-brand-brown">
                        {review.name}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-gold-dark">
                        {review.location} · {review.product}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </motion.ul>
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Navegación de testimonios"
          >
            {reviews.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Grupo de reseñas empezando por ${item.name}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index
                    ? "w-7 bg-brand-gold"
                    : "w-2.5 bg-brand-gold/35 hover:bg-brand-gold/55"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
