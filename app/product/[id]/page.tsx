"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import {
  Header,
  Footer,
  ProductCard,
} from "../../components";

import { products } from "../../../lib/products";
import { useStore } from "../../store";

export default function Product() {
  const { id } = useParams<{ id: string }>();

  const product =
    products.find((item) => item.id === id) || products[0];

  const {
    addToCart,
    toggleWishlist,
    wishlist,
  } = useStore();

  const [size, setSize] = useState(
    product.sizes[2] || product.sizes[0]
  );

  const [color, setColor] = useState(
    product.colors[0]
  );

  const [image, setImage] = useState(
    product.image
  );

  const isWishlisted = wishlist.includes(product.id);

  return (
    <>
      <Header />

      <main className="pdp">

        {/* =========================
            PRODUCT IMAGE AREA
        ========================== */}

        <section className="gallery">

          <div className="gallery-main">
            <img
              src={image}
              alt={product.name}
            />
          </div>

          <div className="gallery-thumbnails">

            {product.images.map((item, index) => (
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
            ))}

          </div>

        </section>


        {/* =========================
            PRODUCT INFORMATION
        ========================== */}

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


          {/* PRICE */}

          <div className="product-price">

            {product.salePrice ? (
              <>
                <strong>
                  ₹
                  {product.salePrice.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <s>
                  ₹
                  {product.price.toLocaleString(
                    "en-IN"
                  )}
                </s>

                <span className="sale-badge">
                  SALE
                </span>
              </>
            ) : (
              <strong>
                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}
              </strong>
            )}

          </div>


          {/* DESCRIPTION */}

          <p className="product-description">
            {product.description}
          </p>


          {/* SHIPPING PROMISES */}

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


          {/* COLOR */}

          <div className="product-option">

            <div className="option-heading">

              <strong>
                COLOR
              </strong>

              <span>
                {color}
              </span>

            </div>

            <div className="swatches">

              {product.colors.map((item) => (

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

              ))}

            </div>

          </div>


          {/* SIZE */}

          <div className="product-option">

            <div className="option-heading">

              <strong>
                SIZE
              </strong>

              <Link href="/size-guide">
                SIZE GUIDE
              </Link>

            </div>

            <div className="sizes">

              {product.sizes.map((item) => (

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

              ))}

            </div>

          </div>


          {/* STOCK */}

          <div className="stock-message">

            <span className="stock-dot" />

            <strong>
              Only 5 left
            </strong>

            <span>
              · Order soon
            </span>

          </div>


          {/* BUTTONS */}

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

                window.location.href = "/cart";
              }}
            >
              BUY NOW
            </button>

          </div>


          {/* PRODUCT INFORMATION */}

          <div className="product-info-grid">

            <div>
              <span>
                SKU
              </span>

              <strong>
                {product.sku}
              </strong>
            </div>

            <div>
              <span>
                MATERIAL
              </span>

              <strong>
                {product.material}
              </strong>
            </div>

            <div>
              <span>
                FIT
              </span>

              <strong>
                {product.fit}
              </strong>
            </div>

            <div>
              <span>
                AVAILABILITY
              </span>

              <strong>
                In stock
              </strong>
            </div>

          </div>


          {/* ACCORDIONS */}

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
                  Demo checkout supports standard
                  payment methods for this portfolio
                  project.
                </p>

              </div>

            </details>

          </div>

        </section>

      </main>


      {/* =========================
          RECOMMENDATIONS
      ========================== */}

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

          {products
            .filter(
              (item) =>
                item.category === product.category &&
                item.id !== product.id
            )
            .slice(0, 4)
            .map((item) => (

              <ProductCard
                key={item.id}
                p={item}
              />

            ))}

        </div>

      </section>


      <Footer />
    </>
  );
}