import { MercadoPagoConfig } from "mercadopago";

export const MERCADOPAGO_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "";

export const MERCADOPAGO_ACCESS_TOKEN =
  process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";

export const MERCADOPAGO_WEBHOOK_SECRET =
  process.env.MERCADOPAGO_WEBHOOK_SECRET ?? "";

export function getMercadoPagoNotificationUrl(): string {
  const configured = process.env.MERCADOPAGO_WEBHOOK_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (siteUrl.startsWith("https://")) {
    return `${siteUrl}/api/mercadopago/webhook`;
  }

  return "https://flordelcielo.com/api/mercadopago/webhook";
}

export function getMercadoPagoClient(): MercadoPagoConfig {
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.");
  }

  return new MercadoPagoConfig({
    accessToken: MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 8000 },
  });
}

export function mapPaymentStatus(status?: string | null): {
  orderStatus: "pending" | "paid" | "cancelled";
  paymentStatus: "approved" | "pending" | "rejected" | "refunded";
} {
  switch (status) {
    case "approved":
      return { orderStatus: "paid", paymentStatus: "approved" };
    case "refunded":
    case "charged_back":
      return { orderStatus: "cancelled", paymentStatus: "refunded" };
    case "rejected":
    case "cancelled":
      return { orderStatus: "cancelled", paymentStatus: "rejected" };
    default:
      return { orderStatus: "pending", paymentStatus: "pending" };
  }
}
