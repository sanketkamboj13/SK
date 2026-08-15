"use client";

import { useEffect, useMemo, useState } from "react";
import { Header, Footer, ProductCard } from "../components";
import { supabase } from "../../lib/supabase";

export default function Search() {
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "SEARCH PRODUCTS ERROR:",
          error
        );

        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return products.filter((product) => {
      const name =
        String(product.name || "").toLowerCase();

      const category =
        String(
          product.category || ""
        ).toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query)
      );
    });
  }, [q, products]);

  return (
    <>
      <Header />

      <main className="listing search-page">

        <div className="listing-head">
          <div>
            <p className="eyebrow">
              S.K / SEARCH
            </p>

            <h1>
              FIND YOUR NEXT FIT
            </h1>
          </div>
        </div>

        <input
          autoFocus
          className="search-input"
          value={q}
          onChange={(e) =>
            setQ(e.target.value)
          }
          placeholder="Search shirts, jeans, t-shirts..."
          type="search"
        />

        {!q.trim() ? (
          <p className="muted">
            Try "black shirt" or "oversized tee".
          </p>
        ) : loading ? (
          <div className="section">
            <p>
              Searching S.K collection...
            </p>
          </div>
        ) : (
          <>
            <p>
              {list.length}{" "}
              {list.length === 1
                ? "result"
                : "results"}
            </p>

            {list.length > 0 ? (
              <div className="grid four">
                {list.map((product) => {
                  const safeProduct = {
                    ...product,

                    salePrice:
                      product.sale_price ??
                      undefined,

                    newArrival:
                      product.new_arrival ??
                      false,

                    images:
                      Array.isArray(
                        product.images
                      ) &&
                      product.images.length > 0
                        ? product.images
                        : product.image
                        ? [product.image]
                        : [],

                    colors:
                      Array.isArray(
                        product.colors
                      )
                        ? product.colors
                        : [],

                    sizes:
                      Array.isArray(
                        product.sizes
                      )
                        ? product.sizes
                        : [],

                    price: Number(
                      product.price || 0
                    ),

                    stock: Number(
                      product.stock || 0
                    ),

                    rating: Number(
                      product.rating || 0
                    ),

                    reviews: Number(
                      product.reviews || 0
                    ),

                    description:
                      product.description ||
                      "",

                    material:
                      product.material ||
                      "",

                    fit:
                      product.fit || "",

                    sku:
                      product.sku ||
                      product.id,
                  };

                  return (
                    <ProductCard
                      key={product.id}
                      p={safeProduct}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty">
                <h2>
                  No products found
                </h2>

                <p>
                  Try another search.
                </p>
              </div>
            )}
          </>
        )}

      </main>

      <Footer />
    </>
  );
}