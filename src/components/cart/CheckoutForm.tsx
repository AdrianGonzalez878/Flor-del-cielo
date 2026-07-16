"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { getWhatsAppUrl } from "@/lib/brand";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import type { PickupPoint } from "@/sanity/queries";

type Props = {
  pickupPoints: PickupPoint[];
};

type DeliveryMethod = "shipping" | "pickup";

const FREE_SHIPPING_MIN = 700;
const SHIPPING_COST = 99;

export function CheckoutForm({ pickupPoints }: Props) {
  const { items, itemCount, subtotal, isReady, clearCart } = useCart();
  const [method, setMethod] = useState<DeliveryMethod>("shipping");
  const [submitted, setSubmitted] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const shippingCost =
    method === "shipping" && subtotal < FREE_SHIPPING_MIN ? SHIPPING_COST : 0;
  const total = subtotal + shippingCost;

  if (!isReady) {
    return (
      <p className="py-12 text-center text-brand-brown-muted">
        Cargando tu pedido…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-5 py-10 text-center sm:px-6 sm:py-12">
        <p className="font-serif text-2xl font-semibold text-brand-brown">
          Aún no tienes productos en tu carrito
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (method !== "pickup") return;
    const form = new FormData(event.currentTarget);
    const customerName = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const pickupPointId = String(form.get("pickupPoint") ?? "");
    const pickupPoint = pickupPoints.find((point) => point._id === pickupPointId);

    if (!customerName || !phone || !pickupPoint) {
      return;
    }

    const products = items
      .map(
        (item) =>
          `• ${item.quantity} × ${item.name} — $${(
            item.price * item.quantity
          ).toLocaleString("es-MX")} MXN`,
      )
      .join("\n");
    const delivery = `Recolección en punto de entrega (Oaxaca capital)\nPunto: ${
      pickupPoint.name
    }\nReferencia: ${pickupPoint.address}`;

    const message = `Hola, quiero realizar este pedido de Flor del Cielo:

${products}

Total: $${subtotal.toLocaleString("es-MX")} MXN

Datos de contacto
Nombre: ${customerName}
Teléfono: ${phone}

Método de entrega
${delivery}

¿Me confirmas disponibilidad y los siguientes pasos?`;

    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    clearCart();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-5 py-10 text-center sm:px-6 sm:py-12">
        <p className="font-serif text-2xl font-semibold text-brand-brown">
          Abrimos WhatsApp con tu pedido
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-brown-muted sm:text-base">
          Revisa el mensaje y envíalo para que podamos confirmar disponibilidad
          y recolección.
        </p>
        <Link
          href="/productos"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light"
        >
          Seguir comprando
        </Link>
      </div>
    );
  }

  const summaryList = (
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li
          key={item._id}
          className="flex items-center gap-3 text-brand-brown-muted"
        >
          <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-brand-cream">
            {item.imageUrl ? (
              <Image
                src={getSanityImageUrl(item.imageUrl, 160)}
                alt={item.imageAlt ?? item.name}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized={isSanityImageUrl(item.imageUrl)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[9px]">
                Sin foto
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-brand-brown">
              {item.quantity} × {item.name}
            </p>
            <p className="mt-0.5 text-xs">
              ${item.price.toLocaleString("es-MX")} MXN c/u
            </p>
          </div>
          <span className="price-number shrink-0 text-sm text-brand-brown">
            ${(item.price * item.quantity).toLocaleString("es-MX")}
          </span>
        </li>
      ))}
    </ul>
  );

  const actionButtons = (
    <>
      {method === "pickup" ? (
        <>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
          >
            Enviar pedido por WhatsApp
          </button>
            <p className="mt-2 text-center text-xs leading-relaxed text-brand-brown-muted">
              Disponible solo en Oaxaca capital. Confirmaremos disponibilidad y
              recolección contigo.
            </p>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setPaymentPending(true)}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
          >
            Continuar al pago
          </button>
          {paymentPending && (
            <p className="mt-2 rounded-lg bg-brand-gold/15 px-3 py-2 text-center text-xs leading-relaxed text-brand-brown">
              El pago con Mercado Pago estará disponible próximamente.
            </p>
          )}
        </>
      )}
      <Link
        href="/carrito"
        className="mt-3 block text-center text-sm font-semibold text-brand-gold-dark hover:underline"
      >
        Volver al carrito
      </Link>
    </>
  );

  return (
    <form
      onSubmit={submitOrder}
      className="grid gap-5 pb-28 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8 lg:pb-0"
    >
      {/* Resumen compacto / colapsable en móvil */}
      <div className="order-1 rounded-2xl border border-brand-gold/25 bg-brand-cream-light lg:order-2 lg:sticky lg:top-28">
        <button
          type="button"
          onClick={() => setSummaryOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 p-4 text-left lg:hidden"
          aria-expanded={summaryOpen}
        >
          <div>
            <p className="font-serif text-lg font-semibold text-brand-brown">
              Resumen del pedido
            </p>
            <p className="mt-0.5 text-sm text-brand-brown-muted">
              {itemCount} {itemCount === 1 ? "artículo" : "artículos"} · $
              {total.toLocaleString("es-MX")} MXN
            </p>
          </div>
          <span
            className={`text-brand-brown transition-transform ${
              summaryOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▾
          </span>
        </button>

        <div
          className={`${
            summaryOpen ? "block border-t border-brand-gold/20" : "hidden"
          } px-4 pb-4 lg:block lg:border-0 lg:p-6`}
        >
          <h2 className="mb-4 hidden font-serif text-xl font-semibold text-brand-brown lg:block">
            Resumen del pedido
          </h2>
          <div className="border-y border-brand-gold/20 py-4 lg:border-b-0 lg:border-t lg:py-4">
            {summaryList}
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex items-baseline justify-between text-brand-brown-muted">
              <span>Subtotal</span>
              <span className="price-number">
                ${subtotal.toLocaleString("es-MX")} MXN
              </span>
            </div>
            {method === "shipping" && (
              <div className="flex items-baseline justify-between text-brand-brown-muted">
                <span>Envío</span>
                <span className="price-number">
                  {shippingCost === 0
                    ? "Gratis"
                    : `$${shippingCost.toLocaleString("es-MX")} MXN`}
                </span>
              </div>
            )}
          </div>
          {method === "shipping" && subtotal < FREE_SHIPPING_MIN && (
            <p className="mt-2 rounded-lg bg-brand-gold/15 px-3 py-2 text-xs leading-relaxed text-brand-brown">
              Envío gratis en pedidos mayores a $
              {FREE_SHIPPING_MIN.toLocaleString("es-MX")} MXN.
            </p>
          )}
          <div className="mt-3 flex items-baseline justify-between border-t border-brand-gold/20 pt-3">
            <span className="font-semibold text-brand-brown">Total</span>
            <span className="price-number text-2xl text-brand-brown">
              ${total.toLocaleString("es-MX")} MXN
            </span>
          </div>
          <div className="mt-5 hidden lg:block">{actionButtons}</div>
        </div>
      </div>

      {/* Formulario */}
      <div className="order-2 space-y-6 rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-4 sm:space-y-7 sm:p-7 lg:order-1">
        <section>
          <h2 className="font-serif text-xl font-semibold text-brand-brown sm:text-2xl">
            Tus datos
          </h2>
          <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-brand-brown">
              Nombre completo
              <input
                required
                name="name"
                autoComplete="name"
                className="mt-2 h-12 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 text-base font-normal outline-none focus:border-brand-gold sm:h-11 sm:text-sm"
              />
            </label>
            <label className="block text-sm font-semibold text-brand-brown">
              Teléfono / WhatsApp
              <input
                required
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="mt-2 h-12 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 text-base font-normal outline-none focus:border-brand-gold sm:h-11 sm:text-sm"
              />
            </label>
          </div>
        </section>

        <section className="border-t border-brand-gold/20 pt-6 sm:pt-7">
          <h2 className="font-serif text-xl font-semibold text-brand-brown sm:text-2xl">
            ¿Cómo deseas recibirlo?
          </h2>
          <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
            <label
              className={`rounded-xl border p-4 transition-colors ${
                method === "shipping"
                  ? "border-brand-brown bg-brand-cream"
                  : "border-brand-gold/30"
              }`}
            >
              <input
                type="radio"
                name="method"
                value="shipping"
                checked={method === "shipping"}
                onChange={() => {
                  setMethod("shipping");
                  setPaymentPending(false);
                }}
                className="sr-only"
              />
              <span className="font-semibold text-brand-brown">
                Envío a domicilio
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-brand-brown-muted">
                Indica tu dirección para enviar el pedido. $99 · gratis en
                pedidos mayores a $700.
              </span>
            </label>
            <label
              className={`rounded-xl border p-4 transition-colors ${
                method === "pickup"
                  ? "border-brand-brown bg-brand-cream"
                  : "border-brand-gold/30"
              } ${
                pickupPoints.length > 0
                  ? ""
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <input
                type="radio"
                name="method"
                value="pickup"
                checked={method === "pickup"}
                disabled={pickupPoints.length === 0}
                onChange={() => {
                  setMethod("pickup");
                  setPaymentPending(false);
                }}
                className="sr-only"
              />
              <span className="font-semibold text-brand-brown">
                Recoger en punto de entrega
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-brand-brown-muted">
                Solo disponible en Oaxaca capital. Elige el punto más cómodo
                para ti.
              </span>
            </label>
          </div>

          {method === "shipping" ? (
            <label className="mt-4 block text-sm font-semibold text-brand-brown sm:mt-5">
              Dirección completa
              <textarea
                required
                name="address"
                rows={4}
                placeholder="Calle, número, colonia, municipio, estado y código postal"
                className="mt-2 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 py-3 text-base font-normal outline-none placeholder:text-brand-brown-muted/70 focus:border-brand-gold sm:text-sm"
              />
            </label>
          ) : pickupPoints.length > 0 ? (
            <label className="mt-4 block text-sm font-semibold text-brand-brown sm:mt-5">
              Punto de entrega
              <select
                required
                name="pickupPoint"
                defaultValue=""
                className="mt-2 h-12 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 text-base font-normal outline-none focus:border-brand-gold sm:h-11 sm:text-sm"
              >
                <option value="" disabled>
                  Selecciona un punto
                </option>
                {pickupPoints.map((point) => (
                  <option key={point._id} value={point._id}>
                    {point.name} — {point.schedule}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="mt-4 rounded-xl bg-brand-gold/15 px-4 py-3 text-sm text-brand-brown sm:mt-5">
              Aún no hay puntos disponibles. Selecciona envío a domicilio.
            </p>
          )}
        </section>
      </div>

      {/* Barra fija de acción en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-gold/25 bg-brand-cream-light/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-brand-brown-muted">
            Total
            {method === "shipping" && shippingCost > 0 && (
              <span className="ml-1 text-xs">
                (incluye ${SHIPPING_COST} de envío)
              </span>
            )}
          </span>
          <span className="price-number text-lg text-brand-brown">
            ${total.toLocaleString("es-MX")} MXN
          </span>
        </div>
        {method === "pickup" ? (
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light"
          >
            Enviar pedido por WhatsApp
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPaymentPending(true)}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light"
          >
            Continuar al pago
          </button>
        )}
        <Link
          href="/carrito"
          className="mt-2 block text-center text-sm font-semibold text-brand-gold-dark"
        >
          Volver al carrito
        </Link>
        {paymentPending && method === "shipping" && (
          <p className="mt-2 text-center text-xs text-brand-brown">
            Mercado Pago próximamente
          </p>
        )}
      </div>
    </form>
  );
}
