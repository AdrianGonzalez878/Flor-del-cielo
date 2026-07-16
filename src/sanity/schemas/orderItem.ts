import { defineField, defineType } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Producto del pedido",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Producto",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "name",
      title: "Nombre (snapshot)",
      type: "string",
      description: "Guardado en el momento del pedido.",
    }),
    defineField({
      name: "quantity",
      title: "Cantidad",
      type: "number",
      validation: (r) => r.required().positive().integer(),
    }),
    defineField({
      name: "unitPrice",
      title: "Precio unitario (MXN)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal (MXN)",
      type: "number",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", quantity: "quantity", subtotal: "subtotal" },
    prepare({ title, quantity, subtotal }) {
      return {
        title: title ?? "Producto",
        subtitle: `${quantity} × · $${subtotal} MXN`,
      };
    },
  },
});
