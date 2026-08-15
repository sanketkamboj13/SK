import Link from "next/link";
import {
  Header,
  Footer,
  ProductCard,
  SectionTitle,
} from "./components";
import { categories } from "../lib/products";
import { getProducts } from "../lib/supabaseProducts";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const products = await getProducts();

  // Products marked as featured
  const featured = products
    .filter((p: any) => p.featured)
    .slice(0, 6);

  // Use database products for category/editorial images
  const availableProducts = products;

  const getProductImage = (
    index: number,
    imageIndex = 0
  ) => {
    if (availableProducts.length === 0) {
      return "/images/hero-model.jpg";
    }

    const product =
      availableProducts[index % availableProducts.length];

    return (
      product?.images?.[imageIndex] ||
      product?.images?.[0] ||
      product?.image ||
      "/images/hero-model.jpg"
    );
  };

  return (
    <>
      <Header />

      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="hero">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=90"
            alt="S.K men's fashion editorial"
          />

          <div className="hero-copy">
            <p>S.K / 2026 EDIT</p>

            <h1>
              DEFINE YOUR
              <br />
              EVERYDAY.
            </h1>

            <p>
              Modern essentials designed for the way you move.
            </p>

            <div>
              <Link
                className="btn light"
                href="/shop"
              >
                SHOP MEN
              </Link>

              <Link
                className="btn outline-light"
                href="/new-arrivals"
              >
                NEW ARRIVALS
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            NEW ARRIVALS
        ========================== */}
        <section className="section">
          <SectionTitle
            eyebrow="JUST IN"
            title="NEW ARRIVALS"
          />

          {featured.length > 0 ? (
            <div className="grid four">
              {featured.map((product: any) => (
                <ProductCard
                  key={product.id}
                  p={product}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid four">
              {products.slice(0, 6).map((product: any) => (
                <ProductCard
                  key={product.id}
                  p={product}
                />
              ))}
            </div>
          ) : (
            <p className="muted">
              New products coming soon.
            </p>
          )}
        </section>

        {/* =========================
            SHOP BY CATEGORY
        ========================== */}
        <section className="section">
          <SectionTitle
            eyebrow="EXPLORE"
            title="SHOP BY CATEGORY"
          />

          <div className="category-grid">
            {categories.slice(0, 6).map(
              (category, index) => (
                <Link
                  key={category}
                  href={`/shop?category=${encodeURIComponent(
                    category
                  )}`}
                  className="cat"
                >
                  <img
                    src={getProductImage(index)}
                    alt={`${category} men's fashion`}
                  />

                  <span>
                    {category.toUpperCase()}
                    <ArrowRight />
                  </span>
                </Link>
              )
            )}
          </div>
        </section>

        {/* =========================
            SEASONAL EDITORIAL
        ========================== */}
        <section className="editorial">
          <img
            src={getProductImage(17, 1)}
            alt="S.K seasonal collection"
          />

          <div>
            <p>THE AUTUMN EDIT</p>

            <h2>
              Layer up.
              <br />
              Dress better.
            </h2>

            <Link
              className="btn"
              href="/shop"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </section>

        {/* =========================
            STYLE GUIDE
        ========================== */}
        <section className="section">
          <SectionTitle
            eyebrow="THE S.K APPROACH"
            title="STYLE, SIMPLIFIED."
          />

          <div className="style-grid">
            {[
              "Everyday Essentials",
              "Smart Casual",
              "Weekend Fits",
              "Streetwear",
            ].map((style, index) => (
              <Link
                href="/shop"
                className="style-card"
                key={style}
              >
                <img
                  src={getProductImage(10 + index)}
                  alt={`${style} men's fashion`}
                />

                <h3>{style}</h3>

                <span>
                  EXPLORE →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================
            NEWSLETTER
        ========================== */}
        <section className="newsletter">
          <p>STAY IN THE LOOP</p>

          <h2>
            New drops. Exclusive offers.
            <br />
            Style inspiration.
          </h2>

          <form>
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
            />

            <button type="submit">
              SUBSCRIBE
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}