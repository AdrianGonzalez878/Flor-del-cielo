import { NextResponse } from "next/server";

import { filterCatalogProducts } from "@/lib/filter-products";
import type { SearchPreviewItem } from "@/lib/search";
import { getAllProducts } from "@/sanity/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 1) {
    return NextResponse.json({ products: [] as SearchPreviewItem[] });
  }

  const allProducts = await getAllProducts();
  const matches = filterCatalogProducts(allProducts, { q }).slice(0, 6);

  const products: SearchPreviewItem[] = matches.map((product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    categoryName: product.category?.name,
    imageUrl: product.mainImage?.url,
  }));

  return NextResponse.json({ products });
}
