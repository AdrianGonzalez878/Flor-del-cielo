import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { brand, getWhatsAppUrl } from "@/lib/brand";

const services = [
  {
    title: "Jabones para baby shower",
    description: "Detalles suaves y aromáticos para cada invitada.",
  },
  {
    title: "Jabones para develación de sexo",
    description: "Colores naturales de achiote, grana cochinilla y cacao.",
  },
  {
    title: "Jabones para hoteles y spa",
    description: "Presentaciones pequeñas para amenidades y habitaciones.",
  },
  {
    title: "Recuerdos personalizados",
    description: "Bodas, bautizos, XV años y eventos de empresa.",
  },
  {
    title: "Velas artísticas",
    description: "Piezas moldeadas a mano para decorar o regalar.",
  },
];

const steps = [
  {
    title: "Cuéntanos tu idea",
    description:
      "Comparte el tipo de evento, la cantidad aproximada, los colores o aromas que imaginas y la fecha en que lo necesitas.",
  },
  {
    title: "Recibe tu cotización",
    description:
      "Definimos juntas el diseño, la presentación y el empaque; con eso te enviamos el precio por pieza y el anticipo.",
  },
  {
    title: "Lo elaboramos a mano",
    description:
      "Preparamos tu pedido en lotes pequeños y acordamos la entrega en Oaxaca capital o el envío a tu ciudad.",
  },
];

const notes = [
  "Los productos artesanales pueden presentar ligeras variaciones de color, aroma y textura.",
  "Los pedidos personalizados se elaboran bajo pedido, así que conviene apartar fecha con anticipación.",
  "La cotización depende del diseño, la cantidad y la presentación elegida.",
  "Podemos incluir etiquetas con nombres, fechas o el logotipo de tu empresa.",
];

const quoteMessage =
  "Hola, me interesa una cotización para un pedido personalizado (eventos / recuerdos).";

export function EventsContent() {
  return (
    <>
      <section className="border-b border-brand-gold/20">
        <div className="relative min-h-[320px] w-full overflow-hidden sm:min-h-[440px]">
          <Image
            src="/categories/jabones.jpg"
            alt="Jabones artesanales Flor del Cielo presentados como detalle de evento"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-brown/95 via-brand-brown/70 to-brand-brown/25"
            aria-hidden
          />
          <div className="relative flex min-h-[320px] items-end justify-center px-4 py-10 sm:min-h-[440px] sm:px-6 sm:py-14">
            <div className="max-w-2xl text-center">
              <p className="font-script text-3xl text-brand-gold-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
                Eventos y regalos
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold text-brand-cream-light drop-shadow-sm sm:text-5xl">
                Pedidos personalizados
              </h1>
              <p className="mt-4 leading-relaxed text-brand-cream-light/90">
                Detalles artesanales para celebraciones, hoteles y spa,
                elaborados a mano en Oaxaca y pensados para tu ocasión.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-gold/30 shadow-lg shadow-brand-brown/10 sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/categories/velas.jpg"
                  alt="Velas artesanales en forma de cruz con anillos, como recuerdo de bautizo o boda"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="font-script text-2xl text-brand-gold-dark">
                Qué podemos preparar
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
                Detalles hechos para tu celebración
              </h2>
              <p className="mt-4 leading-relaxed text-brand-brown-muted">
                Cada pieza se elabora con los mismos ingredientes naturales de
                nuestro catálogo, en la presentación y el diseño que elijas.
              </p>

              <ul className="mt-7 space-y-4">
                {services.map((service) => (
                  <li
                    key={service.title}
                    className="flex gap-3 border-b border-brand-gold/20 pb-4 last:border-0 last:pb-0"
                  >
                    <span
                      className="mt-1 shrink-0 text-brand-gold-dark"
                      aria-hidden
                    >
                      ◆
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p className="font-serif text-lg font-semibold text-brand-brown">
                          {service.title}
                        </p>
                        <span className="rounded-full border border-brand-gold/40 bg-brand-gold-light/25 px-3 py-1 text-xs font-semibold text-brand-gold-dark">
                          Cotización
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-brand-brown-muted">
                        {service.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={getWhatsAppUrl(quoteMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-7 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
              >
                Pedir cotización por WhatsApp
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-gold/20 bg-brand-cream-light py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid overflow-hidden rounded-3xl border border-brand-gold/25 bg-brand-cream lg:grid-cols-2">
              <div className="relative min-h-[260px] lg:min-h-[380px]">
                <Image
                  src="/brand/informativa.jpg"
                  alt="Mesa de exhibición de Flor del Cielo en un evento"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center px-6 py-10 text-center sm:px-10 sm:py-12 lg:text-left">
                <p className="font-script text-2xl text-brand-gold-dark">
                  Hoteles, spa y empresas
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
                  Pedidos por volumen
                </h2>
                <p className="mt-4 leading-relaxed text-brand-brown-muted">
                  Preparamos amenidades para habitaciones, kits de bienvenida y
                  regalos corporativos con etiqueta personalizada. Cotizamos por
                  cantidad y podemos sostener pedidos recurrentes.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <a
                    href={getWhatsAppUrl(
                      "Hola, quiero cotizar un pedido por volumen para hotel, spa o empresa.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
                  >
                    Cotizar por volumen
                  </a>
                  <a
                    href={`mailto:${brand.contact.email}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-brand-gold/40 px-6 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream-light"
                  >
                    Escribir por correo
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              Cómo funciona
            </h2>
            <p className="mt-3 leading-relaxed text-brand-brown-muted">
              Tres pasos y unos días de taller para tener tus detalles listos.
            </p>
          </Reveal>

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                as="li"
                delay={0.06 * index}
                className="h-full rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-6 sm:p-7"
              >
                  <span className="price-number flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold-light/40 text-brand-brown">
                    {index + 1}
                  </span>
                  <p className="mt-4 font-serif text-lg font-semibold text-brand-brown">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-brown-muted">
                    {step.description}
                  </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1} className="mt-10">
            <div className="rounded-2xl border border-brand-gold/30 bg-brand-cream-light p-6 sm:p-8">
              <h3 className="font-serif text-xl font-semibold text-brand-brown">
                Notas para tu pedido
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {notes.map((note) => (
                  <li
                    key={note}
                    className="flex gap-2.5 text-sm leading-relaxed text-brand-brown-muted"
                  >
                    <span className="mt-0.5 text-brand-gold-dark" aria-hidden>
                      ◆
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={getWhatsAppUrl(quoteMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
                >
                  Pedir cotización
                </a>
                <Link
                  href="/productos"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-brand-gold/40 px-6 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream"
                >
                  Ver el catálogo
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
