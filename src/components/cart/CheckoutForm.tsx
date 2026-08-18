"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ReactNode } from "react";

import { useCart } from "@/components/cart/CartProvider";
import type { CheckoutCustomer } from "@/lib/checkout";
import { MEXICO_COUNTRY, MEXICO_STATES } from "@/lib/mexico";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import { FREE_SHIPPING_MIN, SHIPPING_COST, quoteOrder } from "@/lib/shipping";
import type { PickupPoint } from "@/sanity/queries";

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 text-base font-normal outline-none focus:border-brand-gold sm:h-11 sm:text-sm";
const textareaClass =
  "mt-2 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 py-3 text-base font-normal outline-none placeholder:text-brand-brown-muted/70 focus:border-brand-gold sm:text-sm";

function Field({
  label,
  required,
  optional,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block text-sm font-semibold text-brand-brown ${className ?? ""}`}>
      {label}
      {required ? <span aria-hidden> *</span> : null}
      {optional ? (
        <span className="font-normal text-brand-brown-muted"> (opcional)</span>
      ) : null}
      {children}
    </label>
  );
}

const MercadoPagoBrick = dynamic(
  () =>
    import("@/components/cart/MercadoPagoBrick").then(
      (module) => module.MercadoPagoBrick,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="py-8 text-center text-sm text-brand-brown-muted">
        Cargando Mercado Pago…
      </p>
    ),
  },
);

type Props = {
  pickupPoints: PickupPoint[];
  initialError?: string | null;
};

type DeliveryMethod = "shipping" | "pickup";

type PreferenceSession = {
  preferenceId: string;
  publicKey: string;
  amount: number;
  orderNumber: string;
  email: string;
  customer: CheckoutCustomer;
};

export function CheckoutForm({ pickupPoints, initialError }: Props) {
  const router = useRouter();
  const { items, itemCount, subtotal, isReady, clearCart } = useCart();
  const [method, setMethod] = useState<DeliveryMethod>("shipping");
  const [step, setStep] = useState<"form" | "payment">("form");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [session, setSession] = useState<PreferenceSession | null>(null);

  const { shippingCost, total } = quoteOrder(subtotal, method);
  const cartItems = useMemo(
    () => items.map((item) => ({ _id: item._id, quantity: item.quantity })),
    [items],
  );

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

  async function startPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoadingPayment(true);

    const form = new FormData(event.currentTarget);
    const notes = String(form.get("notes") ?? "").trim();
    const customer: CheckoutCustomer = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim().toLowerCase(),
      phone: String(form.get("phone") ?? "").trim(),
      method,
      street: String(form.get("street") ?? "").trim() || undefined,
      neighborhood: String(form.get("neighborhood") ?? "").trim() || undefined,
      city: String(form.get("city") ?? "").trim() || undefined,
      state: String(form.get("state") ?? "").trim() || undefined,
      zip: String(form.get("zip") ?? "").trim() || undefined,
      country: String(form.get("country") ?? "").trim() || undefined,
      notes: notes || undefined,
      pickupPointId: String(form.get("pickupPoint") ?? "").trim() || undefined,
    };

    try {
      const response = await fetch("/api/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items: cartItems }),
      });
      const data = (await response.json()) as {
        error?: string;
        preferenceId?: string;
        publicKey?: string;
        amount?: number;
        orderNumber?: string;
        email?: string;
      };
      if (!response.ok || !data.preferenceId || !data.publicKey || !data.orderNumber) {
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }

      setSession({
        preferenceId: data.preferenceId,
        publicKey: data.publicKey,
        amount: data.amount ?? total,
        orderNumber: data.orderNumber,
        email: data.email ?? customer.email,
        customer,
      });
      setStep("payment");
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "No se pudo iniciar el pago.",
      );
    } finally {
      setLoadingPayment(false);
    }
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

  const totals = (
    <>
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
    </>
  );

  return (
    <form
      onSubmit={startPayment}
      className="grid gap-5 pb-28 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8 lg:pb-0"
    >
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
          {totals}
          {step === "form" && (
            <div className="mt-5 hidden lg:block">
              <button
                type="submit"
                disabled={loadingPayment}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark disabled:opacity-70"
              >
                {loadingPayment ? "Preparando pago…" : "Pagar con Mercado Pago"}
              </button>
              <Link
                href="/carrito"
                className="mt-3 block text-center text-sm font-semibold text-brand-gold-dark hover:underline"
              >
                Volver al carrito
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="order-2 space-y-6 rounded-2xl border border-brand-gold/25 bg-brand-cream-light p-4 sm:space-y-7 sm:p-7 lg:order-1">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {step === "payment" && session ? (
          <section>
            <h2 className="font-serif text-xl font-semibold text-brand-brown sm:text-2xl">
              Pago seguro
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-brown-muted">
              Pedido {session.orderNumber}. Completa el pago con tarjeta, OXXO,
              transferencia o tu cuenta Mercado Pago.
            </p>
            <div className="mt-5">
              <MercadoPagoBrick
                publicKey={session.publicKey}
                amount={session.amount}
                preferenceId={session.preferenceId}
                orderNumber={session.orderNumber}
                email={session.email}
                customer={session.customer}
                items={cartItems}
                onError={setError}
                onPaid={({ status, paymentId, orderNumber }) => {
                  clearCart();
                  const params = new URLSearchParams({
                    order: orderNumber,
                  });
                  if (status) params.set("status", status);
                  if (paymentId) params.set("payment_id", paymentId);
                  router.push(`/checkout/gracias?${params.toString()}`);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setSession(null);
              }}
              className="mt-4 text-sm font-semibold text-brand-gold-dark hover:underline"
            >
              Editar datos del pedido
            </button>
          </section>
        ) : (
          <>
            <section>
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
                    onChange={() => setMethod("shipping")}
                    className="sr-only"
                  />
                  <span className="font-semibold text-brand-brown">
                    Envío a domicilio
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-brand-brown-muted">
                    Indica tu dirección para enviar el pedido. $
                    {SHIPPING_COST} · gratis en pedidos mayores a $
                    {FREE_SHIPPING_MIN}.
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
                    onChange={() => setMethod("pickup")}
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

              {method === "pickup" && pickupPoints.length > 0 ? (
                <div className="mt-4 space-y-4 sm:mt-5">
                  <Field label="Punto de entrega" required>
                    <select
                      required
                      name="pickupPoint"
                      defaultValue=""
                      className={fieldClass}
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
                  </Field>
                  <Field label="Notas del pedido" optional>
                    <textarea
                      name="notes"
                      rows={3}
                      maxLength={500}
                      placeholder="Comentarios para tu pedido."
                      className={textareaClass}
                    />
                  </Field>
                </div>
              ) : method === "pickup" ? (
                <p className="mt-4 rounded-xl bg-brand-gold/15 px-4 py-3 text-sm text-brand-brown sm:mt-5">
                  Aún no hay puntos disponibles. Selecciona envío a domicilio.
                </p>
              ) : null}
            </section>

            <section className="border-t border-brand-gold/20 pt-6 sm:pt-7">
              <h2 className="font-serif text-xl font-semibold text-brand-brown sm:text-2xl">
                Datos de contacto
              </h2>
              <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
                <Field label="Nombre completo" required>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Teléfono" required className="sm:col-span-2">
                  <input
                    required
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="10 dígitos"
                    className={fieldClass}
                  />
                </Field>
              </div>
            </section>

            {method === "shipping" && (
              <section className="border-t border-brand-gold/20 pt-6 sm:pt-7">
                <h2 className="font-serif text-xl font-semibold text-brand-brown sm:text-2xl">
                  Dirección de envío
                </h2>
                <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
                  <Field
                    label="Calle y número"
                    required
                    className="sm:col-span-2"
                  >
                    <input
                      required
                      name="street"
                      autoComplete="address-line1"
                      placeholder="Ej. Calle de las Flores 24, int. 3"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Colonia" required>
                    <input
                      required
                      name="neighborhood"
                      autoComplete="address-level3"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Código postal" required>
                    <input
                      required
                      name="zip"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      pattern="[0-9]{5}"
                      maxLength={5}
                      title="Ingresa un código postal de 5 dígitos"
                      placeholder="00000"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Ciudad" required>
                    <input
                      required
                      name="city"
                      autoComplete="address-level2"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Estado" required>
                    <select
                      required
                      name="state"
                      defaultValue=""
                      autoComplete="address-level1"
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        Selecciona un estado
                      </option>
                      {MEXICO_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="País" className="sm:col-span-2">
                    <select
                      name="country"
                      defaultValue={MEXICO_COUNTRY}
                      autoComplete="country-name"
                      className={fieldClass}
                    >
                      <option value={MEXICO_COUNTRY}>{MEXICO_COUNTRY}</option>
                    </select>
                  </Field>
                  <Field
                    label="Notas del pedido"
                    optional
                    className="sm:col-span-2"
                  >
                    <textarea
                      name="notes"
                      rows={3}
                      maxLength={500}
                      placeholder="Indicaciones para la entrega, referencias o comentarios."
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {step === "form" && (
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
          <button
            type="submit"
            disabled={loadingPayment}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light disabled:opacity-70"
          >
            {loadingPayment ? "Preparando pago…" : "Pagar con Mercado Pago"}
          </button>
          <Link
            href="/carrito"
            className="mt-2 block text-center text-sm font-semibold text-brand-gold-dark"
          >
            Volver al carrito
          </Link>
        </div>
      )}
    </form>
  );
}
