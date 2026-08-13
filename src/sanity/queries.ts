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

export async function getHomeCatalogBanner(
  category: "jabones" | "shampoos",
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
