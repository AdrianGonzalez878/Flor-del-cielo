import { randomUUID } from "node:crypto";

import { brand } from "@/lib/brand";
import type { CheckoutCustomer, CheckoutQuote } from "@/lib/checkout";
import { mapPaymentStatus } from "@/lib/mercadopago";
import type { OrderEmailPayload } from "@/lib/order-email-types";
import { sendOrderEmails } from "@/lib/order-emails";
import { getSanityWriteClient } from "@/sanity/client";
import {
  getOrderByNumber,
  getOrderByPaymentId,
  type OrderSummary,
  type PickupPoint,
} from "@/sanity/queries";

type PendingOrderInput = {
  orderNumber: string;
  customer: CheckoutCustomer;
  quote: CheckoutQuote;
  preferenceId?: string;
  pickupPoint?: PickupPoint | null;
};

function toEmailPayload(order: OrderSummary): OrderEmailPayload | null {
  if (
    !order._id ||
    !order.orderNumber ||
    !order.customerName ||
    !order.customerEmail ||
    !order.items?.length ||
    order.subtotal == null ||
    order.total == null
  ) {
    return null;
  }

  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentId: order.paymentId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost ?? 0,
    total: order.total,
    deliveryMethod: order.deliveryMethod,
    pickupPointName: order.pickupPointName,
    shippingAddress: order.shippingAddress,
    customerEmailSentAt: order.customerEmailSentAt,
    adminEmailSentAt: order.adminEmailSentAt,
  };
}

export async function createPendingOrder({
  orderNumber,
  customer,
  quote,
  preferenceId,
  pickupPoint,
}: PendingOrderInput): Promise<string> {
  const existing = await getOrderByNumber(orderNumber);
  if (existing?._id) return existing._id;

  const client = getSanityWriteClient();
  const created = await client.create({
    _type: "order",
    orderNumber,
    status: "pending",
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    items: quote.lines.map((line) => ({
      _type: "orderItem",
      _key: line._id,
      product: { _type: "reference", _ref: line._id },
      name: line.name,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      subtotal: line.subtotal,
    })),
    subtotal: quote.subtotal,
    shippingCost: quote.shippingCost,
    total: quote.total,
    paymentProvider: "mercadopago",
    paymentStatus: "pending",
    preferenceId,
    deliveryMethod: customer.method,
    pickupPointName: pickupPoint?.name,
    shippingAddress:
      customer.method === "shipping"
        ? {
            _type: "shippingAddress",
            fullName: customer.name,
            phone: customer.phone,
            street: customer.street,
            neighborhood: customer.neighborhood,
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            country: customer.country ?? "México",
            notes: customer.notes,
          }
        : {
            _type: "shippingAddress",
            fullName: customer.name,
            phone: customer.phone,
            city: brand.city,
            country: "México",
            notes: [
              pickupPoint
                ? `Recolección en ${pickupPoint.name}. ${pickupPoint.address}`
                : "Recolección en punto de entrega.",
              customer.notes,
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
    createdAt: new Date().toISOString(),
  });

  return created._id;
}

export async function applyPaymentToOrder(params: {
  orderNumber?: string | null;
  paymentId: string;
  paymentStatus?: string | null;
}): Promise<void> {
  const { orderNumber, paymentId, paymentStatus } = params;
  const mapped = mapPaymentStatus(paymentStatus);
  const existing =
    (orderNumber ? await getOrderByNumber(orderNumber) : null) ??
    (await getOrderByPaymentId(paymentId));

  if (!existing?._id) return;

  const wasAlreadyApproved = existing.paymentStatus === "approved";
  const protectedStatuses = new Set(["preparing", "shipped", "delivered"]);
  const nextStatus = protectedStatuses.has(existing.status ?? "")
    ? existing.status
    : mapped.orderStatus;

  const client = getSanityWriteClient();
  await client
    .patch(existing._id)
    .set({
      paymentId,
      paymentStatus: mapped.paymentStatus,
      status: nextStatus,
    })
    .commit();

  const shouldNotify =
    mapped.paymentStatus === "approved" && !wasAlreadyApproved;
  if (!shouldNotify) return;

  const refreshed = await getOrderByNumber(existing.orderNumber);
  if (!refreshed) return;

  const payload = toEmailPayload({
    ...refreshed,
    paymentStatus: mapped.paymentStatus,
    status: nextStatus,
    paymentId,
  });
  if (!payload) return;
  if (payload.customerEmailSentAt && payload.adminEmailSentAt) return;

  const sent = await sendOrderEmails(payload);
  const now = new Date().toISOString();
  const emailPatch: Record<string, string> = {};
  if (sent.customer && !payload.customerEmailSentAt) {
    emailPatch.customerEmailSentAt = now;
  }
  if (sent.admin && !payload.adminEmailSentAt) {
    emailPatch.adminEmailSentAt = now;
  }
  if (Object.keys(emailPatch).length > 0) {
    await client.patch(existing._id).set(emailPatch).commit();
  }
}

export function newIdempotencyKey(): string {
  return randomUUID();
}
