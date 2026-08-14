 "use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, Product } from "../lib/products";

type CartItem = Product & { qty: number; size: string; color: string };
type Store = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, size?: string, color?: string) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  setQty: (id: string, qty: number) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("sk-cart") || "[]"));
      setWishlist(JSON.parse(localStorage.getItem("sk-wishlist") || "[]"));
    } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("sk-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("sk-wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const value = useMemo(() => ({
    cart, wishlist,
    addToCart: (p: Product, size = p.sizes[2] || "M", color = p.colors[0]) =>
      setCart(c => {
        const found = c.find(x => x.id === p.id && x.size === size && x.color === color);
        return found ? c.map(x => x === found ? { ...x, qty: x.qty + 1 } : x) : [...c, {...p, qty: 1, size, color}];
      }),
    removeFromCart: (id: string) => setCart(c => c.filter(x => x.id !== id)),
    toggleWishlist: (id: string) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]),
    setQty: (id: string, qty: number) => setCart(c => c.map(x => x.id === id ? {...x, qty: Math.max(1, qty)} : x))
  }), [cart, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
