import { groq } from "next-sanity";

import { PRODUCT_CATEGORIES } from "./categories";
import { getSanityClient } from "./client";

/* ── Tipos ── */
export type ProductImage = { url: string; alt?: string };

export type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  ingredients?: string[];
  price: number;
  compareAtPrice?: number;
  weight?: string;
  badge?: string;
  isActive: boolean;
  stock: number;
  mainImage?: ProductImage;
  gallery?: ProductImage[];
  category?: { name: string; slug: string };
  collections?: string[];
  skinNeeds?: string[];
  hairNeeds?: string[];
};

export type HomeCatalogBanner = {
  title?: string;
  image?: ProductImage;
};

export type PickupPoint = {
  _id: string;
  name: string;
  address: string;
  schedule: string;
  instructions?: string;
  mapUrl?: string;
};

/* ── GROQ ── */
/** El campo `category` es un string; se traduce al título de la línea. */
const categoryProjection = `select(
    defined(category._ref) => {
      "slug": category->slug.current,
      "name": category->name
    },
    defined(category) => {
      "slug": category,
      "name": select(
        ${PRODUCT_CATEGORIES.map(
          (c) => `category == "${c.value}" => "${c.title}"`,
        ).join(",\n        ")},
        category
      )
    }
  )`;

const productProjection = groq`{
  _id,
  name,
  "slug": slug.current,
  shortDescription,
  price,
  compareAtPrice,
  weight,
  badge,
  isActive,
  stock,
  "mainImage": mainImage{ "url": asset->url, "alt": alt },
  "category": ${categoryProjection},
  collections,
  skinNeeds,
  hairNeeds
}`;

const allProductsQuery = groq`
  *[_type == "product" && isActive == true]
    | order(_createdAt desc) ${productProjection}
`;

const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    ingredients,
    price,
    compareAtPrice,
    weight,
    badge,
    isActive,
    stock,
    "mainImage": mainImage{ "url": asset->url, "alt": alt },
    "gallery": gallery[]{ "url": asset->url, "alt": alt },
    "category": ${categoryProjection},
    collections,
    skinNeeds,
    hairNeeds
  }
`;

const productsByCollectionQuery = groq`
  *[_type == "product" && isActive == true && $collection in collections]
    | order(_createdAt desc)[0...$limit] ${productProjection}
`;

const latestProductsQuery = groq`
  *[_type == "product" && isActive == true]
    | order(_createdAt desc)[0...$limit] ${productProjection}
`;

const productsByCategoryQuery = groq`
  *[_type == "product" && isActive == true && category == $category]
    | order(_createdAt desc)[0...$limit] ${productProjection}
`;

const relatedProductsQuery = groq`
  *[_type == "product" && isActive == true && slug.current != $slug]
    | order(
      select(defined($category) && category == $category => 0, 1) asc,
      _createdAt desc
    )[0...$limit] ${productProjection}
`;

const homeCatalogBannerQuery = groq`
  *[_type == "homeCatalogBanner" && _id == $id][0] {
    title,
    "image": image{ "url": asset->url, "alt": alt }
  }
`;

const productsByIdsQuery = groq`
  *[_type == "product" && (_id in $ids || slug.current in $ids)] ${productProjection}
`;

const pickupPointByIdQuery = groq`
  *[_type == "pickupPoint" && _id == $id][0] {
    _id,
    name,
    address,
    schedule,
    instructions,
    mapUrl
  }
`;

const orderProjection = groq`{
  _id,
  orderNumber,
  status,
  paymentStatus,
  paymentId,
  customerName,
  customerEmail,
  customerPhone,
  items[] {
    name,
    quantity,
    unitPrice,
    subtotal
  },
  subtotal,
  shippingCost,
  total,
  deliveryMethod,
  pickupPointName,
  shippingAddress {
    street,
    neighborhood,
    city,
    state,
    zip,
    country,
    notes
  },
  customerEmailSentAt,
  adminEmailSentAt
}`;

const orderByNumberQuery = groq`
  *[_type == "order" && orderNumber == $orderNumber][0] ${orderProjection}
`;

const orderByPaymentIdQuery = groq`
  *[_type == "order" && paymentId == $paymentId][0] ${orderProjection}
`;

const pickupPointsQuery = groq`
  *[_type == "pickupPoint" && isActive == true]
    | order(_createdAt asc) {
      _id,
      name,
      address,
      schedule,
      instructions,
      mapUrl
    }
`;

/* ── Funciones ── */

export async function getAllProducts(): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(allProductsQuery, {}, { cache: "no-store" });
  } catch (error) {
    console.error("Sanity: error fetching products", error);
    return [];
  }
}

export async function getProductsByCollection(
  collection: string,
  limit = 4,
): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(
      productsByCollectionQuery,
      { collection, limit },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching products by collection", error);
    return [];
  }
}

/** Últimos productos publicados; no depende de etiquetar la colección. */
export async function getLatestProducts(limit = 12): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(
      latestProductsQuery,
      { limit },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching latest products", error);
    return [];
  }
}

export async function getProductsByCategory(
  category: string,
  limit = 8,
): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(
      productsByCategoryQuery,
      { category, limit },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching products by category", error);
    return [];
  }
}

function takeUniqueProducts(
  products: Product[],
  usedIds: Set<string>,
  limit: number,
): Product[] {
  const unique: Product[] = [];
  for (const product of products) {
    if (usedIds.has(product._id)) continue;
    unique.push(product);
    usedIds.add(product._id);
    if (unique.length >= limit) break;
  }
  return unique;
}

/**
 * Carruseles de la home: cada producto aparece en una sola vitrina,
 * en este orden: más vendidos → jabones → shampoos → herbolaria → novedades.
 */
export async function getHomeCarouselProducts(limit = 12): Promise<{
  bestsellers: Product[];
  soaps: Product[];
  shampoos: Product[];
  herbal: Product[];
  latest: Product[];
}> {
  const [bestsellers, soaps, shampoos, herbal, latest] = await Promise.all([
    getProductsByCollection("mas-vendido", limit),
    getProductsByCategory("jabones", limit * 2),
    getProductsByCategory("shampoos", limit * 2),
    getProductsByCollection("herbolaria-tradicional", limit * 2),
    getLatestProducts(limit * 3),
  ]);

  const usedIds = new Set<string>();
  return {
    bestsellers: takeUniqueProducts(bestsellers, usedIds, limit),
    soaps: takeUniqueProducts(soaps, usedIds, limit),
    shampoos: takeUniqueProducts(shampoos, usedIds, limit),
    herbal: takeUniqueProducts(herbal, usedIds, limit),
    latest: takeUniqueProducts(latest, usedIds, limit),
  };
}

export async function getRelatedProducts(
  slug: string,
  category?: string,
  limit = 8,
): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(
      relatedProductsQuery,
      { slug, category: category ?? null, limit },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching related products", error);
    return [];
  }
}

/** Banners destacados de la home; el id en Sanity es `homeCatalogBanner-<key>`. */
export type HomeCatalogBannerKey =
  | "jabones"
  | "shampoos"
  | "herbolaria-tradicional";

export async function getHomeCatalogBanner(
  category: HomeCatalogBannerKey,
): Promise<HomeCatalogBanner | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<HomeCatalogBanner | null>(
      homeCatalogBannerQuery,
      { id: `homeCatalogBanner-${category}` },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching home catalog banner", error);
    return null;
  }
}

export async function getPickupPoints(): Promise<PickupPoint[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<PickupPoint[]>(
      pickupPointsQuery,
      {},
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching pickup points", error);
    return [];
  }
}

export async function getPickupPointById(
  id: string,
): Promise<PickupPoint | null> {
  const client = getSanityClient();
  if (!client || !id) return null;
  try {
    return await client.fetch<PickupPoint | null>(
      pickupPointByIdQuery,
      { id },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching pickup point", error);
    return null;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const client = getSanityClient();
  if (!client || ids.length === 0) return [];
  try {
    return await client.fetch<Product[]>(
      productsByIdsQuery,
      { ids },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching products by id", error);
    return [];
  }
}

export type OrderSummary = {
  _id: string;
  orderNumber: string;
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  deliveryMethod?: string;
  pickupPointName?: string;
  shippingAddress?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    notes?: string;
  };
  customerEmailSentAt?: string;
  adminEmailSentAt?: string;
};

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderSummary | null> {
  const client = getSanityClient();
  if (!client || !orderNumber) return null;
  try {
    return await client.fetch<OrderSummary | null>(
      orderByNumberQuery,
      { orderNumber },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching order by number", error);
    return null;
  }
}

export async function getOrderByPaymentId(
  paymentId: string,
): Promise<OrderSummary | null> {
  const client = getSanityClient();
  if (!client || !paymentId) return null;
  try {
    return await client.fetch<OrderSummary | null>(
      orderByPaymentIdQuery,
      { paymentId },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("Sanity: error fetching order by payment id", error);
    return null;
  }
}

export function normalizeIngredients(
  ingredients?: string[] | null,
): string[] {
  if (!Array.isArray(ingredients)) return [];
  return ingredients
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function normalizeGallery(
  gallery?: ProductImage[] | null,
): ProductImage[] {
  if (!Array.isArray(gallery)) return [];
  return gallery.filter((image) => Boolean(image?.url));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    const product = await client.fetch<Product | null>(
      productBySlugQuery,
      { slug },
      { cache: "no-store" },
    );
    if (!product) return null;
    return {
      ...product,
      ingredients: normalizeIngredients(product.ingredients),
      gallery: normalizeGallery(product.gallery),
    };
  } catch (error) {
    console.error("Sanity: error fetching product by slug", error);
    return null;
  }
}

/** Una imagen representativa por categoría (primer producto activo con foto). */
export async function getCategoryCoverImages(): Promise<
  Record<string, { url: string; alt?: string }>
> {
  const products = await getAllProducts();
  const covers: Record<string, { url: string; alt?: string }> = {};

  for (const product of products) {
    const slug = product.category?.slug;
    if (!slug || covers[slug] || !product.mainImage?.url) continue;
    covers[slug] = {
      url: product.mainImage.url,
      alt: product.mainImage.alt ?? product.name,
    };
  }

  return covers;
}
