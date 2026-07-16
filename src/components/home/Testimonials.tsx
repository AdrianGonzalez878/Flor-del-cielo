"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
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

function ReviewCard({
  review,
  className = "",
}: {
  review: (typeof reviews)[number];
  className?: string;
}) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-brand-gold/30 bg-brand-cream-light p-6 shadow-sm shadow-brand-brown/5 ${className}`}
    >
      <StarRating count={review.rating} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-brown-muted">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <div className="mt-5 border-t border-brand-gold/20 pt-4">
        <p className="font-script text-xl text-brand-brown">{review.name}</p>
        <p className="mt-0.5 text-xs text-brand-gold-dark">
          {review.location} · {review.product}
        </p>
      </div>
    </article>
  );
}

function getVisibleReviews(startIndex: number) {
  return Array.from({ length: VISIBLE }, (_, offset) => {
    const review = reviews[(startIndex + offset) % reviews.length];
    return { review, key: `${startIndex}-${review.name}` };
  });
}

export function Testimonials() {
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
    <section className="border-b border-brand-gold/20 bg-brand-cream-light py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <motion.p
            initial={{ y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-script text-2xl text-brand-gold-dark"
          >
            Lo que dicen nuestras clientas
          </motion.p>
          <motion.h2
            initial={{ y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl"
          >
            Historias reales
          </motion.h2>
          <div
            className="mx-auto mt-4 h-px w-16 bg-brand-gold/50"
            aria-hidden
          />
        </div>

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => goTo(index - 1, -1)}
            aria-label="Testimonios anteriores"
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream text-lg text-brand-brown shadow-md transition-transform hover:scale-105 sm:h-11 sm:w-11 lg:-left-2"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1, 1)}
            aria-label="Testimonios siguientes"
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream text-lg text-brand-brown shadow-md transition-transform hover:scale-105 sm:h-11 sm:w-11 lg:-right-2"
          >
            →
          </button>

          <div className="overflow-hidden px-10 sm:px-12">
            <motion.ul
              key={index}
              initial={{ x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="grid gap-5 md:grid-cols-3"
              aria-live="polite"
            >
              {visible.map(({ review, key }, i) => (
                <li
                  key={key}
                  className={i > 0 ? "hidden md:block" : undefined}
                >
                  <ReviewCard review={review} className="min-h-[260px]" />
                </li>
              ))}
            </motion.ul>
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Navegación de testimonios"
          >
            {reviews.map((review, i) => (
              <button
                key={review.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Grupo de reseñas empezando por ${review.name}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-brand-gold"
                    : "w-2 bg-brand-gold/35 hover:bg-brand-gold/55"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-brand-gold"
                aria-hidden
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-brand-brown-muted">
            5.0 de 5 · Basado en reseñas verificadas
          </p>
        </motion.div>
      </div>
    </section>
  );
}
