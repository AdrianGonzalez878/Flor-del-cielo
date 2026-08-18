export const FREE_SHIPPING_MIN = 700;
export const SHIPPING_COST = 99;

export type DeliveryMethod = "shipping" | "pickup";

export function quoteOrder(subtotal: number, method: DeliveryMethod) {
  const shippingCost =
    method === "shipping" && subtotal < FREE_SHIPPING_MIN ? SHIPPING_COST : 0;
  return {
    shippingCost,
    total: subtotal + shippingCost,
  };
}
