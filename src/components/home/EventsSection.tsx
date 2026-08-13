import { Reveal } from "@/components/motion/Reveal";
import { getWhatsAppUrl } from "@/lib/brand";

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

const notes = [
  "Los productos artesanales pueden presentar ligeras variaciones de color, aroma y textura.",
  "Algunas preparaciones se elaboran en pequeños lotes o bajo pedido.",
  "La disponibilidad, las presentaciones y los precios pueden actualizarse.",
  "Los productos cosméticos son de uso externo, salvo los de higiene bucal.",
  "Para eventos y pedidos especiales cotizamos según diseño, cantidad y presentación.",
];

export function EventsSection() {
  return (
    <section
      id="eventos"
      className="scroll-mt-24 border-b border-brand-gold/20 bg-brand-cream py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-script text-2xl text-brand-gold-dark">
            Eventos y regalos
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
            Pedidos personalizados
          </h2>
          <p className="mt-3 leading-relaxed text-brand-brown-muted">
            Detalles artesanales para celebraciones, hoteles y spa. Se cotizan
            según el diseño, la cantidad y la presentación que elijas.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          <Reveal delay={0.08}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <li
                  key={service.title}
                  className="rounded-2xl border border-brand-gold/30 bg-brand-cream-light p-5"
                >
                  <p className="font-serif text-base font-semibold text-brand-brown">
                    {service.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-brown-muted">
                    {service.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-dark">
                    Cotización
                  </p>
                </li>
              ))}
              <li className="flex flex-col justify-center rounded-2xl border border-brand-brown/20 bg-brand-gold-light/30 p-5">
                <p className="font-serif text-base font-semibold text-brand-brown">
                  Cuéntanos tu idea
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-brown-muted">
                  Comparte diseño, cantidad y fecha; te enviamos la cotización.
                </p>
                <a
                  href={getWhatsAppUrl(
                    "Hola, me interesa una cotización para un pedido personalizado (eventos / recuerdos).",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-5 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
                >
                  Pedir cotización
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="h-full rounded-2xl border border-brand-gold/30 bg-brand-cream-light p-6 sm:p-7">
              <h3 className="font-serif text-xl font-semibold text-brand-brown">
                Notas para tu pedido
              </h3>
              <ul className="mt-4 space-y-3">
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
