export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-24 bg-brand-cream py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-brand-gold/30 bg-brand-cream-light p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="font-script text-2xl text-brand-gold-dark">
              Nuestra esencia
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-brown">
              Artesanía que cuida de ti
            </h2>
            <p className="mt-4 leading-relaxed text-brand-brown-muted">
              En Flor del Cielo creemos en productos honestos: elaborados a
              mano, con procesos cuidadosos y presentaciones que reflejan el
              amor puesto en cada pieza. Cada jabón, vela y crema nace para
              acompañar tu rutina con calma y naturalidad.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:mt-0 lg:shrink-0">
            {[
              { title: "Sin producción masiva", desc: "Lotes pequeños y controlados." },
              { title: "Ingredientes conscientes", desc: "Selección cuidada en cada fórmula." },
              { title: "Hecho con detalle", desc: "Acabados y aromas pensados para ti." },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-2xl bg-brand-gold-light/50 px-5 py-4 text-center sm:text-left"
              >
                <p className="font-semibold text-brand-brown">{item.title}</p>
                <p className="mt-1 text-sm text-brand-brown-muted">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
