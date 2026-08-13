import { defineField, defineType } from "sanity";

import { getCategoryLabel, getCategoryOptions } from "../categories";
import { PRODUCT_COLLECTIONS, getCollectionLabel } from "../collections";
import {
  HAIR_NEEDS,
  SKIN_NEEDS,
  categorySupportsHairNeeds,
  categorySupportsSkinNeeds,
  getHairNeedLabel,
  getSkinNeedLabel,
} from "../needs";

export const productType = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Tipo de producto",
      type: "string",
      description: "Línea a la que pertenece: jabones, shampoo sólido, sérums…",
      options: {
        list: getCategoryOptions(),
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "collections",
      title: "Colecciones",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Agrupaciones generales: familia, bebés, más vendido, novedades… Puedes marcar varias.",
      options: {
        list: PRODUCT_COLLECTIONS.map((c) => ({
          title: c.title,
          value: c.value,
        })),
        layout: "grid",
      },
    }),
    defineField({
      name: "skinNeeds",
      title: "Necesidades de la piel",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Selecciona las necesidades de piel que atiende este producto.",
      options: {
        list: [...SKIN_NEEDS],
        layout: "grid",
      },
      hidden: ({ parent }) => !categorySupportsSkinNeeds(parent?.category),
    }),
    defineField({
      name: "hairNeeds",
      title: "Necesidades del cabello",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Selecciona las necesidades de cabello o cuero cabelludo.",
      options: {
        list: [...HAIR_NEEDS],
        layout: "grid",
      },
      hidden: ({ parent }) => !categorySupportsHairNeeds(parent?.category),
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción",
      type: "text",
      rows: 4,
      validation: (r) => r.max(500),
    }),
    defineField({
      name: "ingredients",
      title: "Ingredientes",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Escribe cada ingrediente y presiona Enter para agregarlo como etiqueta.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "weight",
      title: "Peso / Volumen",
      type: "string",
      description: 'Ej: "100g", "150ml"',
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "price",
      title: "Precio (MXN)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Precio comparativo (tachado)",
      type: "number",
      description: "Opcional. Mostrar este precio tachado para indicar descuento.",
    }),
    defineField({
      name: "stock",
      title: "Stock disponible",
      type: "number",
      initialValue: 0,
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "badge",
      title: "Etiqueta especial",
      type: "string",
      options: {
        list: [
          { title: "Ninguna", value: "" },
          { title: "Nuevo", value: "Nuevo" },
          { title: "Más vendido", value: "Más vendido" },
          { title: "Favorito", value: "Favorito" },
          { title: "Edición limitada", value: "Edición limitada" },
        ],
        layout: "radio",
        direction: "vertical",
      },
    }),
    defineField({
      name: "isActive",
      title: "Activo (visible en la tienda)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category",
      collections: "collections",
      skinNeeds: "skinNeeds",
      hairNeeds: "hairNeeds",
      media: "mainImage",
      price: "price",
    },
    prepare({
      title,
      category,
      collections,
      skinNeeds,
      hairNeeds,
      media,
      price,
    }) {
      const typeLabel = category ? getCategoryLabel(category) : "";
      const collLabels = Array.isArray(collections)
        ? collections.map((c: string) => getCollectionLabel(c)).join(", ")
        : "";
      const needLabels = [
        ...(Array.isArray(skinNeeds)
          ? skinNeeds.map((need: string) => getSkinNeedLabel(need))
          : []),
        ...(Array.isArray(hairNeeds)
          ? hairNeeds.map((need: string) => getHairNeedLabel(need))
          : []),
      ].join(", ");
      const subtitle = [
        typeLabel,
        collLabels,
        needLabels,
        price != null ? `$${price} MXN` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      return {
        title,
        subtitle: subtitle || undefined,
        media,
      };
    },
  },
});
