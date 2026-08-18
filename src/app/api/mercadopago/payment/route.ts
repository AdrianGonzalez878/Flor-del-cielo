import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import type { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";

import {
  buildCheckoutQuote,
  parseCheckoutCustomer,
  parseCheckoutItems,
} from "@/lib/checkout";
import {
  getMercadoPagoClient,
  getMercadoPagoNotificationUrl,
} from "@/lib/mercadopago";
import { applyPaymentToOrder, newIdempotencyKey } from "@/lib/orders";
import { getOrderByNumber, getProductsByIds } from "@/sanity/queries";

export const runtime = "nodejs";

const WALLET_METHODS = new Set(["wallet_purchase", "onboarding_credits"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const orderNumber = String(body.orderNumber ?? "").trim();
    const selectedPaymentMethod = String(body.selectedPaymentMethod ?? "");
    const formData =
      body.formData && typeof body.formData === "object"
        ? (body.formData as Record<string, unknown>)
        : {};

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Falta el número de pedido." },
        { status: 400 },
      );
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json(
        { error: "No encontramos este pedido." },
        { status: 404 },
      );
    }

    if (WALLET_METHODS.has(selectedPaymentMethod)) {
      return NextResponse.json({
        status: "pending",
        orderNumber,
        message: "El pago con cuenta Mercado Pago se confirma enseguida.",
      });
    }

    const customer = parseCheckoutCustomer(body.customer);
    const items = parseCheckoutItems(body.items);
    if (customer && items.length > 0) {
      const products = await getProductsByIds(items.map((item) => item._id));
      const quote = buildCheckoutQuote(items, products, customer.method);
      if (Math.abs(quote.total - (order.total ?? 0)) > 0.5) {
        return NextResponse.json(
          { error: "El total del carrito cambió. Recarga e inténtalo de nuevo." },
          { status: 409 },
        );
      }
    }

    const payment = new Payment(getMercadoPagoClient());
    const paymentBody = {
      ...formData,
      transaction_amount: order.total,
      external_reference: orderNumber,
      notification_url: getMercadoPagoNotificationUrl(),
      statement_descriptor: "FLORDELCIELO",
      metadata: {
        order_number: orderNumber,
      },
    } as PaymentCreateRequest;

    const created = await payment.create({
      body: paymentBody,
      requestOptions: { idempotencyKey: newIdempotencyKey() },
    });

    await applyPaymentToOrder({
      orderNumber,
      paymentId: String(created.id),
      paymentStatus: created.status,
    });

    return NextResponse.json({
      id: created.id,
      status: created.status,
      statusDetail: created.status_detail,
      orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo procesar el pago.";
    console.error("Mercado Pago payment:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
