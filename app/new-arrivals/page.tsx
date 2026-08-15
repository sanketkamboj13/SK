"use client";

import { useEffect, useState } from "react";
import { Header, Footer, ProductCard } from "../components";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function New() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("new_arrival", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("NEW ARRIVALS ERROR:", error);
        setProducts([]);
      } else {
        const formattedProducts = (data || []).map((product) => ({
          ...product,

          salePrice:
            product.sale_price ?? undefined,

          newArrival:
            product.new_arrival ?? false,

          images:
            Array.isArray(product.images)
              ? product.images
              : [product.image],

          colors:
            Array.isArray(product.colors)
              ? product.colors
              : [],

          sizes:
            Array.isArray(product.sizes)
              ? product.sizes
              : [],
        }));

        setProducts(formattedProducts);
      }

      setLoading(false);
    }

    loadNewArrivals();
  }, []);

  return (
    <>
      <Header />

      {/* =====================================================
          CINEMATIC SUMMER SALE BANNER
          ===================================================== */}

      <section className="sk-campaign">

        <div className="sk-campaign-image"></div>

        <div className="sk-campaign-overlay"></div>

        <div className="sk-campaign-content">

          <p className="sk-campaign-eyebrow">
            S.K. / SUMMER EDIT 2026
          </p>

          <h1>
            SUMMER STOCK
            <br />
            <strong>CLEARANCE SALE</strong>
          </h1>

          <p className="sk-campaign-description">
            SALE IS LIVE NOW · UP TO 50% OFF SELECTED STYLES
          </p>

          <Link
            href="/shop?category=Sale"
            className="sk-campaign-button"
          >
            <span>SHOP SALE</span>
            <strong>→</strong>
          </Link>

        </div>

        <div className="sk-campaign-scroll">
          SCROLL TO DISCOVER
          <span>↓</span>
        </div>

      </section>

      {/* =====================================================
          NEW ARRIVALS
          ===================================================== */}

      <main className="listing">

        <div className="listing-head">

          <div>

            <p className="eyebrow">
              S.K / JUST IN
            </p>

            <h1>
              NEW ARRIVALS
            </h1>

            <p>
              Fresh silhouettes for the new season.
            </p>

          </div>

        </div>

        {/* PRODUCT GRID */}

        {loading ? (

          <div className="section">
            <p>Loading new arrivals...</p>
          </div>

        ) : products.length === 0 ? (

          <div className="section">
            <h2>NO NEW ARRIVALS YET</h2>

            <p>
              Products marked as "New Arrival" in the
              S.K Admin panel will appear here.
            </p>
          </div>

        ) : (

          <div className="grid four">

            {products.map((p) => (

              <ProductCard
                key={p.id}
                p={p}
              />

            ))}

          </div>

        )}

      </main>

      <Footer />

    </>
  );
}