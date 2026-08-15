import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { brand, getWhatsAppUrl } from "@/lib/brand";
import { buildCatalogUrl } from "@/lib/catalog-url";
import type { ProductCollectionSlug } from "@/sanity/collections";

const collections: {
  collection: ProductCollectionSlug;
  title: string;
  description: string;
}[] = [
  {
    collection: "rutina-diaria",
    title: "Rutina diaria",
    description: "Lo esencial para el día a día, del baño al cuidado facial.",
  },
  {
    collection: "solidos",
    title: "Formatos sólidos",
    description: "Barras concentradas que duran más y evitan el plástico.",
  },
  {
    collection: "bebes-ninos",
    title: "Bebés y niños",
    description: "Fórmulas dermosuaves para la piel más delicada.",
  },
  {
    collection: "familia",
    title: "Toda la familia",
    description: "Productos suaves que sirven para todas en casa.",
  },
];

export function HomeClosing() {
  return (
    <section className="bg-brand-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-script text-2xl text-brand-gold-dark">
            Colecciones
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
            Otra forma de recorrer la tienda
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item, index) => (
            <Reveal
              key={item.collection}
              as="li"
              delay={Math.min(index, 3) * 0.06}
            >
              <Link
                href={buildCatalogUrl({ coleccion: item.collection })}
                className="group flex h-full flex-col rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-6 transition-all hover:border-brand-gold hover:shadow-lg hover:shadow-brand-brown/10"
              >
                <h3 className="font-serif text-xl font-semibold text-brand-brown">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-brown-muted">
                  {item.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-brand-gold-dark">
                  Ver productos{" "}
                  <span
                    className="inline-block transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-3xl border border-brand-gold/30 bg-brand-cream-light px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="font-script text-2xl text-brand-gold-dark">
              Estamos del otro lado del mensaje
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              ¿Te ayudamos a elegir?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-brand-brown-muted">
              Escríbenos y te orientamos según tu tipo de piel o cabello. Envío
              de $99 a todo México, gratis en pedidos mayores a $700, o
              recolección en nuestros puntos de Oaxaca capital.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={getWhatsAppUrl(
                  "Hola, me gustaría que me ayuden a elegir un producto.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-7 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
              >
                Escribir por WhatsApp
              </a>
              <a
                href={brand.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand-gold/40 px-7 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream"
              >
                @{brand.contact.instagram}
              </a>
            </div>

            <p className="mt-8 text-sm text-brand-brown-muted">
              ¿Preparas un evento?{" "}
              <Link
                href="/eventos"
                className="font-semibold text-brand-gold-dark hover:underline"
              >
                Cotizamos recuerdos personalizados
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
