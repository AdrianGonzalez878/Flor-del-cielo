import { Resend } from "resend";

import {
  brand,
  formatResendFrom,
  getBrandInlineStyles,
  getBrandLogoUrl,
} from "@/lib/brand";
import type { OrderEmailPayload } from "@/lib/order-email-types";

const resendApiKey = process.env.RESEND_API_KEY?.trim() ?? "";

export function isEmailConfigured(): boolean {
  return Boolean(resendApiKey);
}

function getResend(): Resend | null {
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

function adminInbox(): string {
  return (
    process.env.ORDER_ADMIN_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    brand.contact.email
  );
}

function money(amount: number): string {
  return `$${amount.toLocaleString("es-MX")} MXN`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function deliveryLabel(order: OrderEmailPayload): string {
  if (order.deliveryMethod === "pickup") {
    return order.pickupPointName
      ? `Recoger en ${order.pickupPointName}`
      : "Recoger en punto de entrega";
  }
  return "Envío a domicilio";
}

function formatAddress(order: OrderEmailPayload): string {
  const a = order.shippingAddress;
  if (!a) return "—";
  if (order.deliveryMethod === "pickup") {
    return [a.notes, a.city, a.country].filter(Boolean).join(" · ") || "—";
  }
  return [
    a.street,
    a.neighborhood,
    [a.city, a.state].filter(Boolean).join(", "),
    a.zip ? `C.P. ${a.zip}` : "",
    a.country,
  ]
    .filter(Boolean)
    .join(" · ");
}

function itemsRows(order: OrderEmailPayload): string {
  return order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${brand.colors.gold}40;">
          ${escapeHtml(item.name)}
          <div style="color:${brand.colors.brownMuted};font-size:13px;margin-top:2px;">
            ${item.quantity} × ${money(item.unitPrice)}
          </div>
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid ${brand.colors.gold}40;white-space:nowrap;">
          ${money(item.subtotal)}
        </td>
      </tr>`,
    )
    .join("");
}

function emailShell(title: string, bodyHtml: string): string {
  const styles = getBrandInlineStyles();
  const logo = getBrandLogoUrl();
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${styles.page.backgroundColor};color:${styles.page.color};font-family:${styles.page.fontFamily};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.colors.cream};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${brand.colors.creamLight};border:1px solid ${brand.colors.gold}55;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 8px;text-align:center;">
              <img src="${logo}" alt="${escapeHtml(brand.name)}" width="72" height="72" style="display:inline-block;border-radius:999px;" />
              <p style="margin:12px 0 0;font-family:${brand.fonts.serif};font-size:22px;font-weight:600;color:${brand.colors.brown};">
                ${escapeHtml(brand.name)}
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:${brand.colors.brownMuted};">${escapeHtml(brand.tagline)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:12px;color:${brand.colors.brownMuted};text-align:center;">
          ${escapeHtml(brand.city)} ·
          <a href="mailto:${brand.contact.email}" style="color:${brand.colors.goldDark};">${brand.contact.email}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function orderSummaryBlock(order: OrderEmailPayload): string {
  const notes = order.shippingAddress?.notes?.trim();
  return `
    <p style="margin:0 0 16px;font-size:14px;color:${brand.colors.brownMuted};">
      Pedido <strong style="color:${brand.colors.brown};">${escapeHtml(order.orderNumber)}</strong>
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:${brand.colors.brown};">
      ${itemsRows(order)}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:14px;color:${brand.colors.brownMuted};">
      <tr>
        <td style="padding:4px 0;">Subtotal</td>
        <td align="right">${money(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;">Envío</td>
        <td align="right">${order.shippingCost > 0 ? money(order.shippingCost) : "Gratis"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:${brand.colors.brown};">Total</td>
        <td align="right" style="padding:12px 0 0;font-size:16px;font-weight:700;color:${brand.colors.brown};">${money(order.total)}</td>
      </tr>
    </table>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid ${brand.colors.gold}40;font-size:14px;color:${brand.colors.brownMuted};line-height:1.55;">
      <p style="margin:0 0 6px;"><strong style="color:${brand.colors.brown};">Entrega:</strong> ${escapeHtml(deliveryLabel(order))}</p>
      <p style="margin:0;"><strong style="color:${brand.colors.brown};">Dirección:</strong> ${escapeHtml(formatAddress(order))}</p>
      ${
        notes
          ? `<p style="margin:10px 0 0;"><strong style="color:${brand.colors.brown};">Notas:</strong> ${escapeHtml(notes)}</p>`
          : ""
      }
    </div>`;
}

export function buildCustomerOrderEmail(order: OrderEmailPayload): {
  subject: string;
  html: string;
} {
  const paid = order.paymentStatus === "approved" || order.status === "paid";
  const subject = paid
    ? `Confirmamos tu pedido ${order.orderNumber} · ${brand.name}`
    : `Recibimos tu pedido ${order.orderNumber} · ${brand.name}`;

  const intro = paid
    ? `¡Gracias, ${escapeHtml(order.customerName)}! Tu pago quedó confirmado y ya estamos preparando tu pedido.`
    : `¡Gracias, ${escapeHtml(order.customerName)}! Recibimos tu pedido. Te avisaremos cuando el pago se confirme.`;

  const html = emailShell(
    subject,
    `
      <h1 style="margin:0 0 12px;font-family:${brand.fonts.serif};font-size:24px;font-weight:600;color:${brand.colors.brown};">
        ${paid ? "Pedido confirmado" : "Pedido recibido"}
      </h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${brand.colors.brownMuted};">
        ${intro}
      </p>
      ${orderSummaryBlock(order)}
      <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:${brand.colors.brownMuted};">
        Si tienes dudas, responde a este correo o escríbenos por WhatsApp al
        ${brand.contact.phoneDisplay}.
      </p>
    `,
  );

  return { subject, html };
}

export function buildAdminOrderEmail(order: OrderEmailPayload): {
  subject: string;
  html: string;
} {
  const paid = order.paymentStatus === "approved" || order.status === "paid";
  const subject = paid
    ? `Nuevo pedido pagado ${order.orderNumber}`
    : `Nuevo pedido pendiente ${order.orderNumber}`;

  const html = emailShell(
    subject,
    `
      <h1 style="margin:0 0 12px;font-family:${brand.fonts.serif};font-size:24px;font-weight:600;color:${brand.colors.brown};">
        ${paid ? "Pedido pagado" : "Pedido pendiente de pago"}
      </h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${brand.colors.brownMuted};">
        ${escapeHtml(order.customerName)} ·
        <a href="mailto:${escapeHtml(order.customerEmail)}" style="color:${brand.colors.goldDark};">${escapeHtml(order.customerEmail)}</a>
        ${order.customerPhone ? ` · ${escapeHtml(order.customerPhone)}` : ""}
      </p>
      ${orderSummaryBlock(order)}
      ${
        order.paymentId
          ? `<p style="margin:16px 0 0;font-size:13px;color:${brand.colors.brownMuted};">Pago MP: ${escapeHtml(order.paymentId)}</p>`
          : ""
      }
    `,
  );

  return { subject, html };
}

export async function sendOrderEmails(
  order: OrderEmailPayload,
): Promise<{ customer: boolean; admin: boolean }> {
  const client = getResend();
  if (!client) {
    console.warn("Resend: RESEND_API_KEY no configurada; no se enviaron emails.");
    return { customer: false, admin: false };
  }

  const from = formatResendFrom();
  const customerMail = buildCustomerOrderEmail(order);
  const adminMail = buildAdminOrderEmail(order);
  const result = { customer: false, admin: false };

  try {
    const customerResult = await client.emails.send({
      from,
      to: order.customerEmail,
      replyTo: brand.contact.email,
      subject: customerMail.subject,
      html: customerMail.html,
    });
    if (customerResult.error) {
      console.error("Resend customer email:", customerResult.error);
    } else {
      result.customer = true;
    }
  } catch (error) {
    console.error("Resend customer email:", error);
  }

  try {
    const adminResult = await client.emails.send({
      from,
      to: adminInbox(),
      replyTo: order.customerEmail,
      subject: adminMail.subject,
      html: adminMail.html,
    });
    if (adminResult.error) {
      console.error("Resend admin email:", adminResult.error);
    } else {
      result.admin = true;
    }
  } catch (error) {
    console.error("Resend admin email:", error);
  }

  return result;
}
