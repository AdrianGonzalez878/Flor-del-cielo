import { defineField, defineType } from "sanity";

export const pickupPointType = defineType({
  name: "pickupPoint",
  title: "Punto de entrega",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre del punto",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "address",
      title: "Dirección o referencia",
      type: "text",
      rows: 3,
      description:
        "Incluye una referencia fácil de reconocer. Evita datos personales.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "schedule",
      title: "Horarios de recolección",
      type: "string",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "instructions",
      title: "Indicaciones para recoger",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "mapUrl",
      title: "Enlace de Google Maps (opcional)",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "isActive",
      title: "Punto disponible",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      isActive: "isActive",
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: title || "Punto de entrega",
        subtitle: `${isActive === false ? "No disponible" : "Disponible"}${
          subtitle ? ` · ${subtitle}` : ""
        }`,
      };
    },
  },
});
