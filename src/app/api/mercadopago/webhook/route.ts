import { NextResponse } from "next/server";
import { Payment, WebhookSignatureValidator } from "mercadopago";

import {
  getMercadoPagoClient,
  MERCADOPAGO_WEBHOOK_SECRET,
} from "@/lib/mercadopago";
import { applyPaymentToOrder } from "@/lib/orders";

export const runtime = "nodejs";

function firstHeader(value: string | null): string | undefined {
  return value ?? undefined;
}

function paymentIdFromPayload(
  body: Record<string, unknown> | null,
  searchParams: URLSearchParams,
): string | null {
  const queryId =
    searchParams.get("data.id") ??
    searchParams.get("id") ??
    searchParams.get("data_id");
  if (queryId) return queryId;

  if (!body) return null;
  const data = body.data;
  if (data && typeof data === "object" && "id" in data) {
    return String((data as { id: unknown }).id);
  }
  if (typeof body.id === "string" || typeof body.id === "number") {
    return String(body.id);
  }
  return null;
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let body: Record<string, unknown> | null = null;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = null;
  }

  const paymentId = paymentIdFromPayload(body, url.searchParams);
  const topic = String(body?.type ?? url.searchParams.get("topic") ?? "");

  if (MERCADOPAGO_WEBHOOK_SECRET) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: firstHeader(request.headers.get("x-signature")),
        xRequestId: firstHeader(request.headers.get("x-request-id")),
        dataId: url.searchParams.get("data.id") ?? paymentId,
        secret: MERCADOPAGO_WEBHOOK_SECRET,
      });
    } catch (error) {
      console.error("Mercado Pago webhook signature:", error);
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
  }

  if (!paymentId || (topic && topic !== "payment")) {
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = new Payment(getMercadoPagoClient());
    const details = await payment.get({ id: paymentId });
    const orderNumber =
      details.external_reference ||
      (typeof details.metadata?.order_number === "string"
        ? details.metadata.order_number
        : null);

    await applyPaymentToOrder({
      orderNumber,
      paymentId: String(details.id ?? paymentId),
      paymentStatus: details.status,
    });
  } catch (error) {
    console.error("Mercado Pago webhook:", error);
    return NextResponse.json({ error: "No se pudo actualizar el pedido" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
