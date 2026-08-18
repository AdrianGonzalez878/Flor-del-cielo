import type { Metadata } from "next";

import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import { getPickupPoints } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description:
    "Completa tus datos y paga con Mercado Pago: tarjeta, OXXO o transferencia.",
};

type PageProps = {
  searchParams: Promise<{ pago?: string }>;
};

export default async function CheckoutPage({ searchParams }: PageProps) {
  const [pickupPoints, params] = await Promise.all([
    getPickupPoints(),
    searchParams,
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream py-6 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-6 text-center sm:mb-10">
            <p className="font-script text-2xl text-brand-gold-dark sm:text-3xl">
              Estamos casi listos
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              Finaliza tu pedido
            </h1>
            <p className="mt-2 text-sm text-brand-brown-muted sm:mt-3 sm:text-base">
              Elige envío o recolección y paga con Mercado Pago.
            </p>
          </Reveal>
          <CheckoutForm
            pickupPoints={pickupPoints}
            initialError={
              params.pago === "error"
                ? "El pago no se completó. Puedes intentarlo de nuevo."
                : null
            }
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
