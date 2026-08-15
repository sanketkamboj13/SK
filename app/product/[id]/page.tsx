"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Header,
  Footer,
  ProductCard,
} from "../../components";

import { supabase } from "../../../lib/supabase";
import { useStore } from "../../store";

export default function Product() {
  const { id } = useParams<{ id: string }>();

  const {
    addToCart,
    toggleWishlist,
    wishlist,
  } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("PRODUCT ERROR:", error);
        setProduct(null);
        setLoading(false);
        return;
      }

      const formattedProduct = {
        ...data,
        salePrice: data.sale_price ?? undefined,
        newArrival: data.new_arrival ?? false,
        images: Array.isArray(data.images)
          ? data.images
          : [data.image],
        colors: Array.isArray(data.colors)
          ? data.colors
          : [],
        sizes: Array.isArray(data.sizes)
          ? data.sizes
          : [],
      };

      setProduct(formattedProduct);

      setSize(
        formattedProduct.sizes[2] ||
        formattedProduct.sizes[0] ||
        ""
      );

      setColor(
        formattedProduct.colors[0] || ""
      );

      setImage(
        formattedProduct.image || ""
      );

      // Load related products
      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(4);

      if (related) {
        setRelatedProducts(
          related.map((item) => ({
            ...item,
            salePrice: item.sale_price ?? undefined,
            newArrival: item.new_arrival ?? false,
            images: Array.isArray(item.images)
              ? item.images
              : [item.image],
            colors: Array.isArray(item.colors)
              ? item.colors
              : [],
            sizes: Array.isArray(item.sizes)
              ? item.sizes
              : [],
          }))
        );
      }

      setLoading(false);
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const isWishlisted =
    product ? wishlist.includes(product.id) : false;

  if (loading) {
    return (
      <>
        <Header />

        <main className="section">
          <p>Loading product...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />

        <main className="section">
          <h1>PRODUCT NOT FOUND</h1>

          <Link href="/shop">
            BACK TO SHOP
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pdp">

        <section className="gallery">

          <div className="gallery-main">
            <img
              src={image}
              alt={product.name}
            />
          </div>

          <div className="gallery-thumbnails">

            {product.images.map(
              (item: string, index: number) => (
                <button
                  key={`${item}-${index}`}
                  className={
                    image === item
                      ? "gallery-thumb active"
                      : "gallery-thumb"
                  }
                  onClick={() => setImage(item)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={item}
                    alt=""
                  />
                </button>
              )
            )}

          </div>

        </section>

        <section className="pinfo">

          <div className="product-top">

            <div>

              <p className="eyebrow">
                {product.category}
              </p>

              <h1>
                {product.name}
              </h1>

              <div className="product-rating">

                <span className="stars">
                  ★★★★★
                </span>

                <span>
                  {product.rating}
                </span>

                <span className="muted">
                  ({product.reviews} reviews)
                </span>

              </div>

            </div>

            <button
              className="product-wishlist"
              onClick={() =>
                toggleWishlist(product.id)
              }
              aria-label="Add to wishlist"
            >
              {isWishlisted ? "♥" : "♡"}
            </button>

          </div>

          <div className="product-price">

            {product.salePrice ? (
              <>
                <strong>
                  ₹
                  {Number(
                    product.salePrice
                  ).toLocaleString("en-IN")}
                </strong>

                <s>
                  ₹
                  {Number(
                    product.price
                  ).toLocaleString("en-IN")}
                </s>

                <span className="sale-badge">
                  SALE
                </span>
              </>
            ) : (
              <strong>
                ₹
                {Number(
                  product.price
                ).toLocaleString("en-IN")}
              </strong>
            )}

          </div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="purchase-benefits">

            <div>
              <span>✓</span>
              <p>
                Free shipping on orders above ₹1,999
              </p>
            </div>

            <div>
              <span>↻</span>
              <p>
                Easy 7-day returns on eligible products
              </p>
            </div>

            <div>
              <span>⌾</span>
              <p>
                Secure checkout with protected payment
              </p>
            </div>

          </div>

          <div className="product-option">

            <div className="option-heading">
              <strong>COLOR</strong>
              <span>{color}</span>
            </div>

            <div className="swatches">

              {product.colors.map(
                (item: string) => (
                  <button
                    key={item}
                    className={
                      color === item
                        ? "swatch selected"
                        : "swatch"
                    }
                    onClick={() =>
                      setColor(item)
                    }
                    aria-label={`Select ${item}`}
                  >
                    <span
                      className={`swatch-circle swatch-${item
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    />

                    <span>
                      {item}
                    </span>
                  </button>
                )
              )}

            </div>

          </div>

          <div className="product-option">

            <div className="option-heading">

              <strong>SIZE</strong>

              <Link href="/size-guide">
                SIZE GUIDE
              </Link>

            </div>

            <div className="sizes">

              {product.sizes.map(
                (item: string) => (
                  <button
                    key={item}
                    className={
                      size === item
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSize(item)
                    }
                  >
                    {item}
                  </button>
                )
              )}

            </div>

          </div>

          <div className="stock-message">

            <span className="stock-dot" />

            <strong>
              {product.stock > 5
                ? `${product.stock} in stock`
                : `Only ${product.stock} left`}
            </strong>

            <span>
              · Order soon
            </span>

          </div>

          <div className="purchase-actions">

            <button
              className="btn full primary-buy"
              onClick={() =>
                addToCart(
                  product,
                  size,
                  color
                )
              }
            >
              ADD TO BAG
            </button>

            <button
              className="btn secondary full"
              onClick={() => {
                addToCart(
                  product,
                  size,
                  color
                );

                window.location.href =
                  "/cart";
              }}
            >
              BUY NOW
            </button>

          </div>

          <div className="product-info-grid">

            <div>
              <span>SKU</span>
              <strong>
                {product.sku}
              </strong>
            </div>

            <div>
              <span>MATERIAL</span>
              <strong>
                {product.material}
              </strong>
            </div>

            <div>
              <span>FIT</span>
              <strong>
                {product.fit}
              </strong>
            </div>

            <div>
              <span>AVAILABILITY</span>
              <strong>
                {product.stock > 0
                  ? "In stock"
                  : "Out of stock"}
              </strong>
            </div>

          </div>

          <div className="product-accordions">

            <details open>

              <summary>
                PRODUCT DETAILS
              </summary>

              <div className="accordion-content">

                <p>
                  {product.description}
                </p>

                <p>
                  Designed for everyday wear with
                  a clean silhouette and easy styling.
                </p>

              </div>

            </details>

            <details>

              <summary>
                MATERIAL & CARE
              </summary>

              <div className="accordion-content">

                <p>
                  <strong>
                    Material:
                  </strong>{" "}
                  {product.material}
                </p>

                <p>
                  Machine wash cold.
                  Wash with similar colours.
                  Do not bleach.
                  Do not dry clean.
                </p>

              </div>

            </details>

            <details>

              <summary>
                DELIVERY & RETURNS
              </summary>

              <div className="accordion-content">

                <p>
                  Standard delivery is available
                  across India.
                </p>

                <p>
                  Easy 7-day returns on eligible
                  products.
                </p>

              </div>

            </details>

            <details>

              <summary>
                SECURE CHECKOUT
              </summary>

              <div className="accordion-content">

                <p>
                  Your payment information is
                  protected during checkout.
                </p>

                <p>
                  Secure checkout supports
                  standard payment methods.
                </p>

              </div>

            </details>

          </div>

        </section>

      </main>

      <section className="section recommendations">

        <div className="section-title">

          <p>
            COMPLETE THE LOOK
          </p>

          <h2>
            YOU MAY ALSO LIKE
          </h2>

        </div>

        <div className="grid four">

          {relatedProducts.map(
            (item) => (
              <ProductCard
                key={item.id}
                p={item}
              />
            )
          )}

        </div>

      </section>

      <Footer />
    </>
  );
}