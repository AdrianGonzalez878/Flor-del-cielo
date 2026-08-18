import { isMexicoState, MEXICO_COUNTRY } from "@/lib/mexico";
import { quoteOrder, type DeliveryMethod } from "@/lib/shipping";
import type { Product } from "@/sanity/queries";

export type CheckoutCartItem = {
  _id: string;
  quantity: number;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  method: DeliveryMethod;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
  address?: string;
  pickupPointId?: string;
};

export function formatShippingAddress(parts: {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}): string {
  return [
    parts.street,
    parts.neighborhood,
    `${parts.city}, ${parts.state}`,
    `C.P. ${parts.zip}`,
    parts.country || MEXICO_COUNTRY,
  ].join(" · ");
}

export type QuotedLine = {
  _id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type CheckoutQuote = {
  lines: QuotedLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
  method: DeliveryMethod;
};

export function parseCheckoutCustomer(input: unknown): CheckoutCustomer | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim().toLowerCase();
  const phone = String(data.phone ?? "").trim();
  const method = data.method === "pickup" ? "pickup" : "shipping";
  const street = String(data.street ?? "").trim();
  const neighborhood = String(data.neighborhood ?? "").trim();
  const city = String(data.city ?? "").trim();
  const state = String(data.state ?? "").trim();
  const zip = String(data.zip ?? "").replace(/\s/g, "");
  const country = String(data.country ?? MEXICO_COUNTRY).trim() || MEXICO_COUNTRY;
  const notes = String(data.notes ?? "").trim().slice(0, 500);
  const pickupPointId = String(data.pickupPointId ?? "").trim();

  if (!name || !email || !phone) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (method === "pickup" && !pickupPointId) return null;

  if (method === "shipping") {
    if (!street || !neighborhood || !city || !zip) return null;
    if (!isMexicoState(state)) return null;
    if (!/^\d{5}$/.test(zip)) return null;
    if (country !== MEXICO_COUNTRY && country.toLowerCase() !== "mexico") {
      return null;
    }
  }

  const address =
    method === "shipping"
      ? formatShippingAddress({
          street,
          neighborhood,
          city,
          state,
          zip,
          country: MEXICO_COUNTRY,
        })
      : undefined;

  return {
    name,
    email,
    phone,
    method,
    street: method === "shipping" ? street : undefined,
    neighborhood: method === "shipping" ? neighborhood : undefined,
    city: method === "shipping" ? city : undefined,
    state: method === "shipping" ? state : undefined,
    zip: method === "shipping" ? zip : undefined,
    country: method === "shipping" ? MEXICO_COUNTRY : undefined,
    notes: notes || undefined,
    address,
    pickupPointId: pickupPointId || undefined,
  };
}

export function parseCheckoutItems(input: unknown): CheckoutCartItem[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const data = item as Record<string, unknown>;
    const _id = String(data._id ?? "").trim();
    const quantity = Number(data.quantity);
    if (!_id || !Number.isInteger(quantity) || quantity < 1) return [];
    return [{ _id, quantity }];
  });
}

export function buildCheckoutQuote(
  cartItems: CheckoutCartItem[],
  products: Product[],
  method: DeliveryMethod,
): CheckoutQuote {
  const byId = new Map(products.map((product) => [product._id, product]));
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const lines: QuotedLine[] = [];

  for (const item of cartItems) {
    const product = byId.get(item._id) ?? bySlug.get(item._id);
    if (!product || product.isActive === false) {
      throw new Error("Uno o más productos ya no están disponibles.");
    }
    if (product.stock > 0 && item.quantity > product.stock) {
      throw new Error(`No hay suficiente stock de ${product.name}.`);
    }

    const unitPrice = product.price;
    lines.push({
      _id: product._id,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    });
  }

  if (lines.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const { shippingCost, total } = quoteOrder(subtotal, method);

  return { lines, subtotal, shippingCost, total, method };
}

export function createOrderNumber(now = new Date()): string {
  const ymd = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FDC-${ymd}-${suffix}`;
}
