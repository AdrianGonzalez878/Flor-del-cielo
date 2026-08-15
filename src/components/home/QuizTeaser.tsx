import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";

const hints = [
  "Piel seca o sensible",
  "Cabello graso o teñido",
  "Cuidado para bebés",
  "Masaje y relajación",
];

export function QuizTeaser() {
  return (
    <section className="border-y border-brand-gold/25 bg-brand-brown py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <p className="font-script text-2xl text-brand-gold">
              No sabes por dónde empezar
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-cream-light sm:text-4xl">
              Encuentra tu producto en tres preguntas
            </h2>
            <p className="mt-4 leading-relaxed text-brand-cream-light/75">
              Responde qué buscas cuidar y te sugerimos las líneas y los
              productos que mejor acompañan tu rutina.
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {hints.map((hint) => (
                <li
                  key={hint}
                  className="rounded-full border border-brand-gold/30 bg-brand-brown-dark/40 px-4 py-1.5 text-sm text-brand-cream-light/90"
                >
                  {hint}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-center lg:mt-0 lg:shrink-0">
            <Link
              href="/test"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-cream-light px-8 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-gold-light"
            >
              Hacer el test
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
