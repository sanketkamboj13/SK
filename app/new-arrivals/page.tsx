"use client";

import { Header, Footer, ProductCard } from "../components";
import { products } from "../../lib/products";
import Link from "next/link";

export default function New() {
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
        <div className="grid four">

          {products
            .filter((p) => p.newArrival)
            .map((p) => (
              <ProductCard
                key={p.id}
                p={p}
              />
            ))}

        </div>

      </main>

      <Footer />

    </>
  );
}