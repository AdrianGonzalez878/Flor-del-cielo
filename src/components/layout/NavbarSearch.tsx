"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";

import type { SearchPreviewItem } from "@/lib/search";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";

type Props = {
  onNavigate?: () => void;
};

export function NavbarSearch({ onNavigate }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const [results, setResults] = useState<SearchPreviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        setResults([]);
      }
    }

    function onPointerDown(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
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

  useEffect(() => {
    if (!open) return;

    if (deferredQuery.length < 1) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(deferredQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Search failed");
        const data = (await response.json()) as {
          products: SearchPreviewItem[];
        };
        setResults(data.products);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [deferredQuery, open]);

  function closeSearch() {
    setOpen(false);
    setQuery("");
    setResults([]);
    onNavigate?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      router.push("/productos");
    } else {
      router.push(`/productos?q=${encodeURIComponent(value)}`);
    }
    closeSearch();
  }

  const showPreview = open && query.trim().length > 0;

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        aria-label="Buscar productos"
        aria-expanded={open}
        aria-controls="nav-search-panel"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 text-brand-brown transition-colors hover:bg-brand-cream"
      >
        <SearchIcon />
      </button>

      {open && (
        <div
          id="nav-search-panel"
          className="fixed inset-x-0 top-[4.5rem] z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-y border-brand-gold/30 bg-brand-cream-light shadow-lg shadow-brand-brown/10 sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:max-h-none sm:w-[min(calc(100vw-2rem),22rem)] sm:overflow-visible sm:rounded-2xl sm:border"
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-b border-brand-gold/20 p-4 sm:p-3"
          >
            <label htmlFor="nav-search-input" className="sr-only">
              Buscar productos
            </label>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold-dark">
                <SearchIcon size={16} />
              </span>
              <input
                id="nav-search-input"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);
                  if (!value.trim()) {
                    setResults([]);
                    setLoading(false);
                  }
                }}
                placeholder="Buscar jabones, velas…"
                autoComplete="off"
                className="h-12 w-full rounded-full border border-brand-gold/35 bg-brand-cream py-2 pl-10 pr-4 text-base text-brand-brown outline-none placeholder:text-brand-brown-muted/70 focus:border-brand-gold sm:h-11 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="hidden h-11 shrink-0 items-center justify-center rounded-full bg-brand-brown px-4 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark sm:inline-flex"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/35 text-xl text-brand-brown sm:hidden"
            >
              ×
            </button>
          </form>

          {showPreview && (
            <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto sm:max-h-80">
              {loading && results.length === 0 ? (
                <p className="px-4 py-5 text-sm text-brand-brown-muted">
                  Buscando…
                </p>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-brand-gold/15 p-1">
                  {results.map((product) => (
                    <li key={product._id}>
                      <Link
                        href={`/productos/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-brand-cream sm:px-3 sm:py-2.5"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-brand-gold/25 bg-brand-cream sm:h-12 sm:w-12">
                          {product.imageUrl ? (
                            <Image
                              src={getSanityImageUrl(product.imageUrl, 160)}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                              unoptimized={isSanityImageUrl(product.imageUrl)}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-brand-brown-muted">
                              Sin foto
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          {product.categoryName && (
                            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                              {product.categoryName}
                            </p>
                          )}
                          <p className="truncate text-base font-medium text-brand-brown sm:text-sm">
                            {product.name}
                          </p>
                          <p className="price-number text-sm text-brand-brown-muted sm:text-xs">
                            ${product.price} MXN
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-sm text-brand-brown-muted">
                  No hay productos con “{query.trim()}”.
                </p>
              )}

              {results.length > 0 && (
                <div className="border-t border-brand-gold/20 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      router.push(
                        `/productos?q=${encodeURIComponent(query.trim())}`,
                      );
                      closeSearch();
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-brand-gold-dark transition-colors hover:bg-brand-cream"
                  >
                    Ver todos los resultados →
                  </button>
                </div>
              )}
            </div>
          )}

          {!showPreview && (
            <p className="px-4 py-5 text-sm text-brand-brown-muted sm:px-4 sm:py-3 sm:text-xs">
              Escribe para ver sugerencias · Esc para cerrar
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
