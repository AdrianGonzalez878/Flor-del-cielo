import Image from "next/image";
import Link from "next/link";

import { buildCatalogUrl } from "@/lib/catalog-url";
import { brand } from "@/lib/brand";
import {
  PRODUCT_CATEGORIES,
  type CategoryGroupSlug,
} from "@/sanity/categories";
import { PRODUCT_COLLECTIONS } from "@/sanity/collections";

const featuredCollections = PRODUCT_COLLECTIONS.filter((c) =>
  [
    "mas-vendido",
    "novedades",
    "rutina-diaria",
    "herbolaria-tradicional",
    "solidos",
    "bebes-ninos",
  ].includes(c.value),
);

/** Las 14 líneas agrupadas en tres columnas para no alargar el pie. */
const categoryColumns: { title: string; groups: CategoryGroupSlug[] }[] = [
  { title: "Piel y rostro", groups: ["cuerpo", "rostro"] },
  { title: "Cabello", groups: ["cabello"] },
  { title: "Bienestar y familia", groups: ["bienestar", "higiene", "bebes"] },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-brand-gold-light/85 transition-colors hover:text-brand-cream-light"
    >
      {children}
    </Link>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 font-serif text-sm font-semibold text-brand-cream-light">
        {title}
      </p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-gold/25 bg-brand-brown text-brand-gold-light">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-14">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex">
              <div className="rounded-2xl bg-brand-cream-light p-3 shadow-md shadow-black/15">
                <Image
                  src="/logo.png"
                  alt="Flor del Cielo"
                  width={1024}
                  height={1024}
                  className="h-11 w-auto object-contain"
                  style={{ width: "auto" }}
                />
              </div>
            </Link>
            <p className="mt-5 font-serif text-lg text-brand-cream-light">
              {brand.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-gold-light/80">
              {brand.essence}
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={`mailto:${brand.contact.email}`}
                className="flex items-center gap-2 text-sm font-medium text-brand-cream-light transition-colors hover:text-brand-gold-light"
              >
                <MailIcon />
                {brand.contact.email}
              </a>
              <a
                href={`tel:+${brand.contact.whatsapp}`}
                className="flex items-center gap-2 text-sm font-medium text-brand-cream-light transition-colors hover:text-brand-gold-light"
              >
                <PhoneIcon />
                {brand.contact.phoneDisplay}
              </a>
              <a
                href={brand.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-brand-cream-light transition-colors hover:text-brand-gold-light"
              >
                <InstagramIcon />@{brand.contact.instagram}
              </a>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                "Hecho a mano en Oaxaca",
                "Lotes pequeños",
                "Envío $99 · gratis desde $700",
              ].map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-brand-gold/30 bg-brand-brown-dark/40 px-3 py-1 text-xs text-brand-cream-light/90"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          <nav
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
            aria-label="Pie de página"
          >
            <FooterColumn title="Explorar">
              <li>
                <FooterLink href="/">Inicio</FooterLink>
              </li>
              <li>
                <FooterLink href="/productos">Todo el catálogo</FooterLink>
              </li>
              <li>
                <FooterLink href="/test">Test</FooterLink>
              </li>
              <li>
                <FooterLink href="/puntos-de-entrega">
                  Puntos de entrega
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/eventos">Eventos y regalos</FooterLink>
              </li>
              <li>
                <FooterLink href="/#nosotros">Nuestra esencia</FooterLink>
              </li>
              <li>
                <FooterLink href="/carrito">Carrito</FooterLink>
              </li>
            </FooterColumn>

            {categoryColumns.map((column) => (
              <FooterColumn key={column.title} title={column.title}>
                {PRODUCT_CATEGORIES.filter((cat) =>
                  column.groups.includes(cat.group),
                ).map((cat) => (
                  <li key={cat.value}>
                    <FooterLink href={buildCatalogUrl({ categoria: cat.value })}>
                      {cat.title}
                    </FooterLink>
                  </li>
                ))}
              </FooterColumn>
            ))}

            <FooterColumn title="Colecciones">
              {featuredCollections.map((col) => (
                <li key={col.value}>
                  <FooterLink
                    href={buildCatalogUrl({ coleccion: col.value })}
                  >
                    {col.title}
                  </FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href="/#categorias">Categorías</FooterLink>
              </li>
              <li>
                <FooterLink href="/productos">Ver todas →</FooterLink>
              </li>
            </FooterColumn>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-gold/20 pt-8 sm:flex-row">
          <p className="text-center text-xs text-brand-gold-light/60 sm:text-left">
            © {year} {brand.name}. Todos los derechos reservados.
          </p>
          <p className="text-center text-xs text-brand-gold-light/60 sm:text-right">
            Desarrollado por{" "}
            <a
              href="https://argaweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold-light/70 transition-colors hover:text-brand-cream-light hover:underline"
            >
              argaweb.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-brand-gold"
    >
      <path
        d="M6.5 3h3l1.5 4-2 1.5c.9 2 2.5 3.6 4.5 4.5L17 11l4 1.5v3c0 .6-.4 1-1 1C9.6 16.5 3.5 10.4 3.5 4c0-.6.4-1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-brand-gold"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-brand-gold"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 7l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
