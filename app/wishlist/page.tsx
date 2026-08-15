"use client";

import { useEffect, useState } from "react";
import { Header, Footer, ProductCard } from "../components";
import { getProducts } from "../../lib/supabaseProducts";
import { useStore } from "../store";
import Link from "next/link";

export default function Wishlist() {
  const { wishlist } = useStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  const list = products
    .filter((product) => wishlist.includes(product.id))
    .map((product) => ({
      ...product,

      salePrice:
        product.sale_price ?? undefined,

      newArrival:
        product.new_arrival ?? false,

      images:
        Array.isArray(product.images) &&
        product.images.length > 0
          ? product.images
          : product.image
            ? [product.image]
            : [],

      colors:
        Array.isArray(product.colors)
          ? product.colors
          : [],

      sizes:
        Array.isArray(product.sizes)
          ? product.sizes
          : [],

      price:
        Number(product.price || 0),

      stock:
        Number(product.stock || 0),

      rating:
        Number(product.rating || 0),

      reviews:
        Number(product.reviews || 0),

      description:
        product.description || "",

      material:
        product.material || "",

      fit:
        product.fit || "",

      sku:
        product.sku || product.id,
    }));

  return (
    <>
      <Header />

      <main className="listing">

        <div className="listing-head">
          <div>
            <p className="eyebrow">
              S.K / SAVED
            </p>

            <h1>
              WISHLIST
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="section">
            <p>
              Loading your wishlist...
            </p>
          </div>
        ) : list.length > 0 ? (
          <div className="grid four">
            {list.map((product) => (
              <ProductCard
                key={product.id}
                p={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>
              Your wishlist is empty.
            </p>

            <Link
              className="btn"
              href="/shop"
            >
              EXPLORE SHOP
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}