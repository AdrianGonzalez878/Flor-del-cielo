import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Pedido",
  type: "document",
  groups: [
    { name: "customer", title: "Cliente", default: true },
    { name: "items", title: "Productos" },
    { name: "payment", title: "Pago" },
    { name: "shipping", title: "Envío" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      title: "Número de pedido",
      type: "string",
      validation: (r) => r.required(),
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Pendiente de pago", value: "pending" },
          { title: "Pagado", value: "paid" },
          { title: "Preparando", value: "preparing" },
          { title: "Enviado", value: "shipped" },
          { title: "Entregado", value: "delivered" },
          { title: "Cancelado", value: "cancelled" },
        ],
        layout: "dropdown",
      },
      initialValue: "pending",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "customerName",
      title: "Nombre del cliente",
      type: "string",
      group: "customer",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Email",
      type: "string",
      group: "customer",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "customerPhone",
      title: "Teléfono",
      type: "string",
      group: "customer",
    }),
    defineField({
      name: "items",
      title: "Productos",
      type: "array",
      group: "items",
      of: [{ type: "orderItem" }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal (MXN)",
      type: "number",
      group: "items",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shippingCost",
      title: "Costo de envío (MXN)",
      type: "number",
      group: "items",
      initialValue: 0,
    }),
    defineField({
      name: "total",
      title: "Total (MXN)",
      type: "number",
      group: "items",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "paymentProvider",
      title: "Proveedor de pago",
      type: "string",
      group: "payment",
      options: {
        list: [{ title: "Mercado Pago", value: "mercadopago" }],
      },
      initialValue: "mercadopago",
    }),
    defineField({
      name: "paymentId",
      title: "ID de pago",
      type: "string",
      group: "payment",
      description: "ID que devuelve Mercado Pago en el webhook.",
    }),
    defineField({
      name: "paymentStatus",
      title: "Estado del pago",
      type: "string",
      group: "payment",
      options: {
        list: ["approved", "pending", "rejected", "refunded"],
      },
    }),
    defineField({
      name: "shippingAddress",
      title: "Dirección de envío",
      type: "shippingAddress",
      group: "shipping",
    }),
    defineField({
      name: "trackingNumber",
      title: "Guía de envío",
      type: "string",
      group: "shipping",
    }),
    defineField({
      name: "createdAt",
      title: "Fecha de creación",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      customer: "customerName",
      total: "total",
      status: "status",
    },
    prepare({ title, customer, total, status }) {
      return {
        title: `#${title} · ${customer}`,
        subtitle: `$${total} MXN · ${status}`,
      };
    },
  },
});
