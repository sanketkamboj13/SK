// lib/products.ts

export type Product = {
  id: string;
  name: string;
  category: string;

  price: number;
  sale_price?: number | null;

  image?: string | null;
  images: string[];

  colors: string[];
  sizes: string[];

  material?: string | null;
  fit?: string | null;

  rating?: number | null;
  reviews?: number | null;

  stock: number;
  sku: string;

  description?: string | null;

  featured?: boolean;
  new_arrival?: boolean;
  sale?: boolean;

  created_at?: string;
  updated_at?: string;
};

// Categories used by the shop filters and navigation.
// Product data itself comes from Supabase.
export const categories = [
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Jackets",
  "Hoodies",
  "Knitwear",
  "Accessories",
] as const;

export type ProductCategory = (typeof categories)[number];