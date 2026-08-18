import { NextResponse } from "next/server";
import { Preference } from "mercadopago";

import { brand } from "@/lib/brand";
import {
  buildCheckoutQuote,
  createOrderNumber,
  parseCheckoutCustomer,
  parseCheckoutItems,
} from "@/lib/checkout";
import {
  getMercadoPagoClient,
  getMercadoPagoNotificationUrl,
  MERCADOPAGO_PUBLIC_KEY,
} from "@/lib/mercadopago";
import { createPendingOrder, newIdempotencyKey } from "@/lib/orders";
import { getPickupPointById, getProductsByIds } from "@/sanity/queries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!MERCADOPAGO_PUBLIC_KEY) {
      return NextResponse.json(
        { error: "Mercado Pago no está configurado." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as unknown;
    const payload = (body ?? {}) as Record<string, unknown>;
    const customer = parseCheckoutCustomer(payload.customer);
    const items = parseCheckoutItems(payload.items);

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "Revisa tus datos de contacto y la dirección de envío (calle, colonia, ciudad, estado y C.P.).",
        },
        { status: 400 },
      );
    }
    if (items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 },
      );
    }

    const products = await getProductsByIds(items.map((item) => item._id));
    const quote = buildCheckoutQuote(items, products, customer.method);
    const pickupPoint =
      customer.method === "pickup" && customer.pickupPointId
        ? await getPickupPointById(customer.pickupPointId)
        : null;

    if (customer.method === "pickup" && !pickupPoint) {
      return NextResponse.json(
        { error: "Elige un punto de entrega válido." },
        { status: 400 },
      );
    }

    const orderNumber = createOrderNumber();
    const preferenceItems = [
      ...quote.lines.map((line) => ({
        id: line._id,
        title: line.name.slice(0, 120),
        quantity: line.quantity,
        unit_price: line.unitPrice,
        currency_id: "MXN" as const,
      })),
    ];
    if (quote.shippingCost > 0) {
      preferenceItems.push({
        id: "envio",
        title: "Envío a domicilio",
        quantity: 1,
        unit_price: quote.shippingCost,
        currency_id: "MXN",
      });
    }

    const siteUrl = brand.siteUrl.replace(/\/$/, "");
    const preference = new Preference(getMercadoPagoClient());
    const created = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: customer.name,
          email: customer.email,
          phone: {
            number: customer.phone.replace(/\D/g, ""),
          },
          ...(customer.method === "shipping" && customer.zip
            ? {
                address: {
                  zip_code: customer.zip,
                  street_name: customer.street,
                },
              }
            : {}),
        },
        external_reference: orderNumber,
        statement_descriptor: "FLOR DEL CIELO",
        notification_url: getMercadoPagoNotificationUrl(),
        metadata: {
          order_number: orderNumber,
        },
        back_urls: {
          success: `${siteUrl}/checkout/gracias`,
          pending: `${siteUrl}/checkout/gracias`,
          failure: `${siteUrl}/checkout?pago=error`,
        },
        ...(siteUrl.startsWith("https://") ? { auto_return: "approved" } : {}),
      },
      requestOptions: { idempotencyKey: newIdempotencyKey() },
    });

    await createPendingOrder({
      orderNumber,
      customer,
      quote,
      preferenceId: created.id,
      pickupPoint,
    });

    return NextResponse.json({
      preferenceId: created.id,
      publicKey: MERCADOPAGO_PUBLIC_KEY,
      amount: quote.total,
      orderNumber,
      email: customer.email,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo iniciar el pago.";
    console.error("Mercado Pago preference:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
