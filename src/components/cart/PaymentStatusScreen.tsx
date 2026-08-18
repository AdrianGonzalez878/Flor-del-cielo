"use client";

import { initMercadoPago, StatusScreen } from "@mercadopago/sdk-react";

let initializedKey = "";

function ensureMercadoPago(publicKey: string) {
  if (!publicKey || typeof window === "undefined") return;
  if (initializedKey === publicKey) return;
  initMercadoPago(publicKey, { locale: "es-MX" });
  initializedKey = publicKey;
}

export function PaymentStatusScreen({
  publicKey,
  paymentId,
}: {
  publicKey: string;
  paymentId: string;
}) {
  ensureMercadoPago(publicKey);

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <StatusScreen initialization={{ paymentId }} />
    </div>
  );
}
