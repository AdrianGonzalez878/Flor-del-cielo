"use client";

import dynamic from "next/dynamic";

const PaymentStatusScreen = dynamic(
  () =>
    import("@/components/cart/PaymentStatusScreen").then(
      (module) => module.PaymentStatusScreen,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="py-4 text-center text-sm text-brand-brown-muted">
        Cargando estado del pago…
      </p>
    ),
  },
);

type Props = {
  publicKey: string;
  paymentId: string;
};

export function CheckoutThanksPaymentStatus({ publicKey, paymentId }: Props) {
  return <PaymentStatusScreen publicKey={publicKey} paymentId={paymentId} />;
}
