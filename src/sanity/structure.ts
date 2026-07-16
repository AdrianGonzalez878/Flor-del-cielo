import type { StructureResolver } from "sanity/structure";

/** Sidebar directo: Productos y Pedidos (sin carpetas anidadas). */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Flor del Cielo")
    .items([
      S.documentTypeListItem("product").title("Productos"),
      S.documentTypeListItem("pickupPoint").title("Puntos de entrega"),
      S.listItem()
        .title("Banners de categorías en home")
        .child(
          S.list()
            .title("Banners de categorías en home")
            .items([
              S.listItem()
                .title("Banner de Jabones")
                .child(
                  S.document()
                    .schemaType("homeCatalogBanner")
                    .documentId("homeCatalogBanner-jabones")
                    .title("Banner de Jabones"),
                ),
              S.listItem()
                .title("Banner de Shampoos")
                .child(
                  S.document()
                    .schemaType("homeCatalogBanner")
                    .documentId("homeCatalogBanner-shampoos")
                    .title("Banner de Shampoos"),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Pedidos")
        .child(
          S.documentTypeList("order")
            .title("Pedidos")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
        ),
    ]);
