"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Header, Footer, ProductCard } from "../components";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

const categories = [
  "All",
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Jackets",
  "Hoodies",
  "Knitwear",
  "Accessories",
];

function ShopContent() {
  const searchParams = useSearchParams();

  const categoryFromUrl =
    searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] =
    useState(categoryFromUrl || "All");

  const [sort, setSort] =
    useState("featured");

  useEffect(() => {
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "SHOP PRODUCTS ERROR:",
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // SORT
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => {
        const dateA = a.created_at
          ? new Date(
              a.created_at
            ).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(
              b.created_at
            ).getTime()
          : 0;

        return dateB - dateA;
      });
    }

    if (sort === "sale") {
      result = result.filter(
        (product) =>
          product.sale === true ||
          product.sale_price !== null
      );
    }

    if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.featured)) -
          Number(Boolean(a.featured))
      );
    }

    return result;
  }, [products, category, sort]);

  return (
    <>
      <Header />

      <main className="shop">

        {/* SHOP HEADER */}
        <section className="shop-head">
          <div>
            <p className="eyebrow">
              S.K / COLLECTION
            </p>

            <h1>SHOP MEN</h1>
          </div>

          <p>
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}
          </p>
        </section>

        {/* FILTER BAR */}
        <div className="shop-toolbar">

          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            aria-label="Sort products"
          >
            <option value="featured">
              Featured
            </option>

            <option value="newest">
              Newest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="sale">
              On Sale
            </option>
          </select>

        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="section">
            <p>
              Loading S.K collection...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="section">
            <h2>
              No products available
            </h2>

            <p>
              Products added through the
              S.K Admin panel will appear
              here.
            </p>
          </div>
        ) : (
          <div className="grid four">

            {filteredProducts.map(
              (product) => {

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
              }
            )}

          </div>
        )}

      </main>

      <Footer />
    </>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <>
          <Header />

          <main className="shop">
            <div className="section">
              <p>
                Loading S.K collection...
              </p>
            </div>
          </main>

          <Footer />
        </>
      }
    >
      <ShopContent />
    </Suspense>
  );
}