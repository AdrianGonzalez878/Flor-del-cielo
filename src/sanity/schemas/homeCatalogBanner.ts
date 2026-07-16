import { defineField, defineType } from "sanity";

export const homeCatalogBannerType = defineType({
  name: "homeCatalogBanner",
  title: "Banner de categoría en home",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título (opcional)",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "image",
      title: "Imagen del banner",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          description: "Describe brevemente la imagen para accesibilidad.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Banner de categoría en home",
        media,
      };
    },
  },
});
