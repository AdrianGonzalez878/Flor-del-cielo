"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

import type { CheckoutCartItem, CheckoutCustomer } from "@/lib/checkout";

type Props = {
  publicKey: string;
  amount: number;
  preferenceId: string;
  orderNumber: string;
  email: string;
  customer: CheckoutCustomer;
  items: CheckoutCartItem[];
  onPaid: (result: {
    status?: string;
    paymentId?: string;
    orderNumber: string;
  }) => void;
  onError: (message: string) => void;
};

let initializedKey = "";

function ensureMercadoPago(publicKey: string) {
  if (!publicKey || typeof window === "undefined") return;
  if (initializedKey === publicKey) return;
  initMercadoPago(publicKey, { locale: "es-MX" });
  initializedKey = publicKey;
}

export function MercadoPagoBrick({
  publicKey,
  amount,
  preferenceId,
  orderNumber,
  email,
  customer,
  items,
  onPaid,
  onError,
}: Props) {
  ensureMercadoPago(publicKey);

  return (
    <div className="overflow-hidden rounded-xl bg-white px-1 py-2">
      <Payment
        initialization={{
          amount,
          preferenceId,
          payer: { email },
        }}
        customization={{
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            prepaidCard: "all",
            ticket: "all",
            bankTransfer: "all",
            mercadoPago: "all",
            maxInstallments: 12,
          },
        }}
        locale="es-MX"
        onError={(error) => {
          onError(error.message || "No se pudo cargar Mercado Pago.");
        }}
        onSubmit={async (param) => {
          const response = await fetch("/api/mercadopago/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber,
              selectedPaymentMethod: param.selectedPaymentMethod,
              formData: param.formData ?? {},
              customer,
              items,
            }),
          });
          const data = (await response.json()) as {
            error?: string;
            status?: string;
            id?: string | number;
            orderNumber?: string;
          };
          if (!response.ok) {
            throw new Error(data.error || "No se pudo procesar el pago.");
          }
          onPaid({
            status: data.status,
            paymentId: data.id != null ? String(data.id) : undefined,
            orderNumber: data.orderNumber ?? orderNumber,
          });
        }}
      />
    </div>
  );
}
