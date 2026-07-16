import { defineField, defineType } from "sanity";

export const shippingAddressType = defineType({
  name: "shippingAddress",
  title: "Dirección de envío",
  type: "object",
  fields: [
    defineField({ name: "fullName", title: "Nombre completo", type: "string" }),
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "street", title: "Calle y número", type: "string" }),
    defineField({ name: "neighborhood", title: "Colonia", type: "string" }),
    defineField({ name: "city", title: "Ciudad", type: "string" }),
    defineField({ name: "state", title: "Estado", type: "string" }),
    defineField({ name: "zip", title: "Código postal", type: "string" }),
    defineField({
      name: "country",
      title: "País",
      type: "string",
      initialValue: "México",
    }),
    defineField({ name: "notes", title: "Notas de entrega", type: "text", rows: 2 }),
  ],
});
