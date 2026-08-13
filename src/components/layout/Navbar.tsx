"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { getCategoriesByGroup } from "@/sanity/categories";

const categoryGroups = getCategoriesByGroup();

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/test", label: "Test" },
  { href: "/puntos-de-entrega", label: "Puntos de entrega" },
  { href: "/#eventos", label: "Eventos" },
] as const;

function linkClassName(active: boolean) {
  return `relative py-1 text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-gold after:transition-transform hover:text-brand-brown hover:after:scale-x-100 ${
    active ? "text-brand-brown after:scale-x-100" : "text-brand-brown-muted"
  }`;
}

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isHash = href.startsWith("/#");
  const isActive =
    !isHash &&
    (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={linkClassName(isActive)}
    >
      {label}
    </Link>
  );
}

function ProductsDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = pathname.startsWith("/productos");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/productos"
        className={`${linkClassName(isActive)} inline-flex items-center gap-1`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(false)}
      >
        Productos
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div
        role="menu"
        aria-label="Tipos de producto"
        className={`absolute left-1/2 top-full z-50 w-[42rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3 transition-all ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-cream-light shadow-lg shadow-brand-brown/10">
          <div className="grid grid-cols-3 gap-x-4 gap-y-5 p-5">
            {categoryGroups.map((group) => (
              <div key={group.value}>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-dark">
                  {group.title}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {group.categories.map((category) => (
                    <li key={category.value}>
                      <Link
                        href={buildCatalogUrl({ categoria: category.value })}
                        role="menuitem"
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        className="block rounded-lg px-2 py-1.5 text-sm text-brand-brown-muted transition-colors hover:bg-brand-cream hover:text-brand-brown"
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-gold/20">
            <Link
              href="/productos"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-5 py-3 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream"
            >
              Ver todo el catálogo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileProductsSection({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = pathname.startsWith("/productos");

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/productos"
          onClick={onNavigate}
          className={linkClassName(isActive)}
        >
          Productos
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-product-types"
          aria-label={open ? "Ocultar tipos de producto" : "Ver tipos de producto"}
          onClick={() => setOpen((value) => !value)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-brand-brown-muted transition-colors hover:bg-brand-cream hover:text-brand-brown"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        id="mobile-product-types"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "mt-2 max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-3 rounded-xl border border-brand-gold/20 bg-brand-cream/70 p-3">
          {categoryGroups.map((group) => (
            <div key={group.value}>
              <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-brand-gold-dark">
                {group.title}
              </p>
              <ul className="mt-1 space-y-0.5">
                {group.categories.map((category) => (
                  <li key={category.value}>
                    <Link
                      href={buildCatalogUrl({ categoria: category.value })}
                      onClick={onNavigate}
                      className="block rounded-lg px-3 py-2 text-sm text-brand-brown-muted transition-colors hover:bg-brand-cream-light hover:text-brand-brown"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isReady } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gold/25 bg-brand-cream-light/95 shadow-sm shadow-brand-brown/5 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Flor del Cielo"
            width={1024}
            height={1024}
            className="h-11 w-auto object-contain sm:h-12"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Principal"
        >
          <NavLink href="/" label="Inicio" />
          <ProductsDropdown />
          {navLinks.slice(1).map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavbarSearch onNavigate={() => setMenuOpen(false)} />

          <Link
            href="/carrito"
            aria-label={
              itemCount > 0
                ? `Carrito con ${itemCount} productos`
                : "Ver carrito"
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 text-brand-brown transition-colors hover:bg-brand-cream"
          >
            <CartIcon />
            {isReady && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-brown px-1 text-[10px] font-bold text-brand-cream-light">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 text-brand-brown transition-colors hover:bg-brand-cream lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-brand-gold/20 bg-brand-cream-light transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[80vh] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6"
          aria-label="Móvil"
        >
          <NavLink
            href="/"
            label="Inicio"
            onClick={() => setMenuOpen(false)}
          />
          <MobileProductsSection onNavigate={() => setMenuOpen(false)} />
          {navLinks.slice(1).map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L5 3H2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="20" r="1.25" fill="currentColor" />
      <circle cx="18" cy="20" r="1.25" fill="currentColor" />
    </svg>
  );
}
