"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { useCart } from "@/components/cart/CartProvider";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function CartPageContent() {
  const {
    items,
    itemCount,
    subtotal,
    isReady,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isReady) {
    return (
      <p className="py-12 text-center text-brand-brown-muted">
        Cargando tu carrito…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-6 py-12 text-center">
        <p className="font-serif text-2xl font-semibold text-brand-brown">
          Tu carrito está vacío
        </p>
        <p className="mt-3 text-brand-brown-muted">
          Explora nuestras fórmulas artesanales y agrega tus favoritas.
        </p>
        <Link
          href="/productos"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <ul className="divide-y divide-brand-gold/20 rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-4 sm:px-6">
        {items.map((item, index) => (
          <motion.li
            key={item._id}
            initial={{ x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.45, ease }}
            className="flex gap-4 py-5"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream sm:h-28 sm:w-24">
              {item.imageUrl ? (
                <Image
                  src={getSanityImageUrl(item.imageUrl, 240)}
                  alt={item.imageAlt ?? item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized={isSanityImageUrl(item.imageUrl)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-brand-brown-muted">
                  Sin foto
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/productos/${item.slug}`}
                className="font-serif text-lg font-semibold text-brand-brown hover:underline"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-brand-brown-muted">
                ${item.price.toLocaleString("es-MX")} MXN
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full border border-brand-gold/35">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-brand-brown hover:bg-brand-cream"
                    aria-label={`Disminuir cantidad de ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-brand-brown">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={
                      item.stock !== undefined && item.quantity >= item.stock
                    }
                    className="flex h-8 w-8 items-center justify-center text-brand-brown hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Aumentar cantidad de ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="price-number text-lg text-brand-brown">
                    ${(item.price * item.quantity).toLocaleString("es-MX")}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="text-sm font-semibold text-brand-brown-muted hover:text-brand-brown hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              </div>
              {item.stock !== undefined && (
                <p className="mt-2 text-xs text-brand-brown-muted">
                  {item.stock}{" "}
                  {item.stock === 1
                    ? "unidad disponible"
                    : "unidades disponibles"}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.aside
        initial={{ y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease }}
        className="rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-6 lg:sticky lg:top-28"
      >
        <p className="font-serif text-xl font-semibold text-brand-brown">
          Resumen
        </p>
        <div className="mt-5 flex items-center justify-between border-y border-brand-gold/20 py-4 text-sm text-brand-brown-muted">
          <span>
            {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
          </span>
          <span className="price-number">
            ${subtotal.toLocaleString("es-MX")} MXN
          </span>
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="font-semibold text-brand-brown">Total</span>
          <span className="price-number text-2xl text-brand-brown">
            ${subtotal.toLocaleString("es-MX")} MXN
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
        >
          Continuar pedido
        </Link>
        <Link
          href="/productos"
          className="mt-4 block text-center text-sm font-semibold text-brand-gold-dark hover:underline"
        >
          Seguir comprando
        </Link>
      </motion.aside>
    </div>
  );
}
