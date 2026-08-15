import { supabase } from "./supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Failed to load products:", error);
    return [];
  }

  return data || [];
}