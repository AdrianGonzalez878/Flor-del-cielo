"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "flor-del-cielo-cart";

export type CartItem = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  imageAlt?: string;
  stock?: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        Boolean(
          item &&
            typeof item._id === "string" &&
            typeof item.name === "string" &&
            typeof item.slug === "string" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number" &&
            item.quantity > 0,
        ),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      subtotal,
      isReady,
      addItem: (item, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((cartItem) => cartItem._id === item._id);
          const availableStock = item.stock ?? Number.POSITIVE_INFINITY;
          if (!existing) {
            return [
              {
                ...item,
                quantity: Math.min(Math.max(quantity, 1), availableStock),
              },
            ];
          }
          return current.map((cartItem) =>
            cartItem._id === item._id
              ? {
                  ...cartItem,
                  stock: item.stock ?? cartItem.stock,
                  quantity: Math.min(
                    cartItem.quantity + Math.max(quantity, 1),
                    item.stock ?? cartItem.stock ?? Number.POSITIVE_INFINITY,
                  ),
                }
              : cartItem,
          );
        });
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          quantity < 1
            ? current.filter((item) => item._id !== id)
            : current.map((item) =>
                item._id === id
                  ? {
                      ...item,
                      quantity: Math.min(
                        quantity,
                        item.stock ?? Number.POSITIVE_INFINITY,
                      ),
                    }
                  : item,
              ),
        );
      },
      removeItem: (id) => {
        setItems((current) => current.filter((item) => item._id !== id));
      },
      clearCart: () => setItems([]),
    };
  }, [isReady, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
