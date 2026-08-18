import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getWhatsAppUrl } from "@/lib/brand";
import { MERCADOPAGO_PUBLIC_KEY } from "@/lib/mercadopago";
import { getOrderByNumber } from "@/sanity/queries";

const PaymentStatusScreen = nextDynamic(
  () =>
    import("@/components/cart/PaymentStatusScreen").then(
      (module) => module.PaymentStatusScreen,
    ),
  { ssr: false },
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gracias por tu pedido",
  description: "Recibimos tu pago. Te confirmamos el pedido a la brevedad.",
};

type PageProps = {
  searchParams: Promise<{
    order?: string;
    payment_id?: string;
    collection_id?: string;
    status?: string;
    collection_status?: string;
    external_reference?: string;
  }>;
};

export default async function CheckoutThanksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? params.external_reference;
  const paymentId = params.payment_id ?? params.collection_id;
  const status = params.status ?? params.collection_status;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  const approved = status === "approved" || order?.paymentStatus === "approved";
  const pending = !approved && (status === "pending" || status === "in_process");

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream py-10 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-2xl border border-brand-gold/25 bg-brand-cream-light px-5 py-10 text-center sm:px-8 sm:py-12">
            <p className="font-script text-2xl text-brand-gold-dark">
              Flor del Cielo
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              {approved
                ? "Gracias por tu pedido"
                : pending
                  ? "Pago en proceso"
                  : "Recibimos tu solicitud"}
            </h1>
            <p className="mt-4 leading-relaxed text-brand-brown-muted">
              {approved
                ? "El pago fue aprobado. Prepararemos tu pedido y te escribimos para confirmar envío o recolección."
                : pending
                  ? "Si elegiste OXXO o transferencia, el pedido se confirma cuando Mercado Pago reciba el pago."
                  : "Si el pago no se completó, puedes volver al checkout e intentarlo de nuevo."}
            </p>
            {orderNumber && (
              <p className="mt-4 text-sm font-semibold text-brand-brown">
                Pedido {orderNumber}
              </p>
            )}

            {paymentId && MERCADOPAGO_PUBLIC_KEY && (
              <div className="mt-8 text-left">
                <PaymentStatusScreen
                  publicKey={MERCADOPAGO_PUBLIC_KEY}
                  paymentId={paymentId}
                />
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/productos"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
              >
                Seguir comprando
              </Link>
              <a
                href={getWhatsAppUrl(
                  orderNumber
                    ? `Hola, acabo de realizar el pedido ${orderNumber} y quiero confirmar los siguientes pasos.`
                    : "Hola, acabo de realizar un pedido y quiero confirmar los siguientes pasos.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-brand-gold/40 px-6 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
