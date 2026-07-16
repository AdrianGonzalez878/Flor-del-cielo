"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Reveal } from "@/components/motion/Reveal";
import type { PickupPoint } from "@/sanity/queries";

type Props = {
  points: PickupPoint[];
};

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function PickupPointsContent({ points }: Props) {
  return (
    <>
      <section className="border-b border-brand-gold/20 bg-brand-cream-light py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-script text-3xl text-brand-gold-dark">
            Solo en Oaxaca capital
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-brand-brown sm:text-5xl">
            Puntos de entrega
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-brand-brown-muted">
            La recolección está disponible únicamente para quienes viven en
            Oaxaca capital. Elige el punto más cercano y escríbenos antes de
            acudir para confirmar que tu pedido esté listo.
          </p>
        </Reveal>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {points.length > 0 ? (
            <ul className="grid gap-5 md:grid-cols-2">
              {points.map((point, index) => (
                <motion.li
                  key={point._id}
                  initial={{ y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease }}
                  className="rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-6 shadow-sm shadow-brand-brown/5 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-2xl font-semibold text-brand-brown">
                      {point.name}
                    </h2>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-brown"
                      aria-hidden
                    >
                      <LocationIcon />
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-brown-muted">
                    <div>
                      <p className="font-semibold text-brand-brown">
                        Dirección o referencia
                      </p>
                      <p className="mt-1">{point.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-brown">
                        Horarios de recolección
                      </p>
                      <p className="mt-1">{point.schedule}</p>
                    </div>
                    {point.instructions && (
                      <div>
                        <p className="font-semibold text-brand-brown">
                          Indicaciones
                        </p>
                        <p className="mt-1">{point.instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {point.mapUrl && (
                      <a
                        href={point.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center justify-center rounded-full border border-brand-gold/40 px-5 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream"
                      >
                        Ver en Maps
                      </a>
                    )}
                    <Link
                      href="/productos"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-5 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
                    >
                      Realizar pedido
                    </Link>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <Reveal className="mx-auto max-w-2xl rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-6 py-12 text-center">
              <p className="font-serif text-2xl font-semibold text-brand-brown">
                Próximamente publicaremos nuestros puntos de entrega
              </p>
              <p className="mt-3 leading-relaxed text-brand-brown-muted">
                Mientras tanto, escríbenos para conocer la forma más cómoda de
                recibir tu pedido.
              </p>
              <Link
                href="/productos"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
              >
                Ver productos
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      <section className="border-t border-brand-gold/20 bg-brand-cream-light py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid overflow-hidden rounded-2xl border border-brand-gold/25 bg-brand-cream sm:rounded-3xl lg:grid-cols-2">
              <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]">
                <Image
                  src="/brand/informativa.jpg"
                  alt="Pedido Flor del Cielo listo para envío"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center px-6 py-10 text-center sm:px-10 sm:py-12 lg:text-left">
                <p className="font-script text-2xl text-brand-gold-dark">
                  Envíos a todo México
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
                  ¿Prefieres recibirlo en casa?
                </h2>
                <p className="mt-4 leading-relaxed text-brand-brown-muted">
                  También preparamos envíos con empaque cuidadoso. $99 de
                  envío · gratis en pedidos mayores a $700 MXN.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    href="/productos"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
                  >
                    Ver productos
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
