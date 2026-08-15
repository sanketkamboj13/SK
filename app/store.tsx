"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Product } from "../lib/products";

type CartItem = Product & {
  qty: number;
  size: string;
  color: string;
};

type Store = {
  cart: CartItem[];
  wishlist: string[];

  addToCart: (
    p: Product,
    size?: string,
    color?: string
  ) => void;

  removeFromCart: (id: string) => void;

  clearCart: () => void;

  toggleWishlist: (id: string) => void;

  setQty: (id: string, qty: number) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load saved cart and wishlist ONCE
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sk-cart");
      const savedWishlist = localStorage.getItem("sk-wishlist");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("STORE LOAD ERROR:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save cart only AFTER localStorage has been loaded
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "sk-cart",
      JSON.stringify(cart)
    );
  }, [cart, hydrated]);

  // Save wishlist only AFTER localStorage has been loaded
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "sk-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist, hydrated]);

  const value = useMemo(
    () => ({
      cart,
      wishlist,

      addToCart: (
        p: Product,
        size = p.sizes[2] || "M",
        color = p.colors[0]
      ) =>
        setCart((currentCart) => {
          const found = currentCart.find(
            (item) =>
              item.id === p.id &&
              item.size === size &&
              item.color === color
          );

          if (found) {
            return currentCart.map((item) =>
              item === found
                ? {
                    ...item,
                    qty: item.qty + 1,
                  }
                : item
            );
          }

          return [
            ...currentCart,
            {
              ...p,
              qty: 1,
              size,
              color,
            },
          ];
        }),

      removeFromCart: (id: string) =>
        setCart((currentCart) =>
          currentCart.filter(
            (item) => item.id !== id
          )
        ),

      // Clear cart after successful order
      clearCart: () => {
        setCart([]);
        localStorage.removeItem("sk-cart");
      },

      toggleWishlist: (id: string) =>
        setWishlist((currentWishlist) =>
          currentWishlist.includes(id)
            ? currentWishlist.filter(
                (item) => item !== id
              )
            : [...currentWishlist, id]
        ),

      setQty: (id: string, qty: number) =>
        setCart((currentCart) =>
          currentCart.map((item) =>
            item.id === id
              ? {
                  ...item,
                  qty: Math.max(1, qty),
                }
              : item
          )
        ),
    }),
    [cart, wishlist]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const value = useContext(Ctx);

  if (!value) {
    throw new Error(
      "StoreProvider missing"
    );
  }

  return value;
}