"use client";

import Link from "next/link";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useStore } from "./store";

const colorMap: Record<string, string> = {
  Black: "#111111",
  White: "#f7f7f4",
  Grey: "#8b8b86",
  Navy: "#18253d",
  Beige: "#d8c5a8",
  Brown: "#6b4937",
  Olive: "#66704a",
  Blue: "#355f8a",
  Khaki: "#8a805f",
};


/* =========================================================
   HEADER
   ========================================================= */

export function Header() {
  const {
    cart,
    wishlist,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode =
      localStorage.getItem("sk-dark-mode") === "true";

    setDarkMode(savedMode);

    document.documentElement.classList.toggle(
      "dark",
      savedMode
    );

    document.body.classList.toggle(
      "dark",
      savedMode
    );
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "sk-dark-mode",
      String(newMode)
    );

    document.documentElement.classList.toggle(
      "dark",
      newMode
    );

    document.body.classList.toggle(
      "dark",
      newMode
    );
  };
  return (
    <>
      {/* ANNOUNCEMENT BAR */}

      <div className="announcement">
        <div className="announcement-track">

          <span>
            FREE SHIPPING ON ORDERS ABOVE ₹1,999
          </span>

          <span>
            SUMMER STOCK CLEARANCE — UP TO 50% OFF
          </span>

          <span>
            7-DAY EASY RETURNS
          </span>

          <span>
            NEW DROPS EVERY WEEK
          </span>

          <span>
            FREE SHIPPING ON ORDERS ABOVE ₹1,999
          </span>

          <span>
            SUMMER STOCK CLEARANCE — UP TO 50% OFF
          </span>

          <span>
            7-DAY EASY RETURNS
          </span>

          <span>
            NEW DROPS EVERY WEEK
          </span>

        </div>
      </div>


      {/* HEADER */}

      <header className="header">

        <button
          aria-label="Open menu"
          className="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>


        {/* LOGO */}

        <Link
          className="logo"
          href="/"
        >
          S.K
        </Link>


        {/* NAVIGATION */}

        <nav
          className={open ? "nav open" : "nav"}
          onClick={() => setOpen(false)}
        >

          <Link href="/new-arrivals">
            NEW ARRIVALS
          </Link>

          <Link href="/shop">
            CLOTHING
          </Link>

          <Link href="/shop?category=Jeans">
            JEANS
          </Link>

          <Link href="/shop?category=Shirts">
            SHIRTS
          </Link>

          <Link href="/shop?category=T-Shirts">
            T-SHIRTS
          </Link>

          <Link href="/shop?category=Trousers">
            TROUSERS
          </Link>

          <Link href="/shop?category=Jackets">
            JACKETS
          </Link>

          <Link href="/shop?category=Accessories">
            ACCESSORIES
          </Link>

          <Link href="/shop?sale=1">
            SALE
          </Link>

        </nav>


        {/* HEADER ACTIONS */}

        <div className="actions">

          <Link
            aria-label="Search"
            href="/search"
          >
            <Search />
          </Link>


          <Link
            aria-label="Account"
            href="/account"
          >
            <User />
          </Link>


          <Link
            aria-label="Wishlist"
            href="/wishlist"
            className="header-action-count"
          >
            <Heart />

            <span>
              {wishlist.length}
            </span>
          </Link>


          <Link
            aria-label="Shopping bag"
            href="/cart"
            className="header-action-count"
          >
            <ShoppingBag />

            <span>
              {cart.reduce(
                (total, item) => total + item.qty,
                0
              )}
            </span>
          </Link>


          <button
  className="theme-button"
  aria-label="Toggle dark mode"
  onClick={toggleDarkMode}
>
  {darkMode ? <Sun /> : <Moon />}
</button>

        </div>

      </header>
    </>
  );
}


/* =========================================================
   FOOTER
   ========================================================= */

export function Footer() {

  return (

    <footer>

      <div>

        <div className="footer-logo">
  S.K
</div>

        <p>
          Modern menswear for everyday confidence.
        </p>

      </div>


      <div>

        <b>
          SHOP
        </b>

        <Link href="/new-arrivals">
          New Arrivals
        </Link>

        <Link href="/shop?category=T-Shirts">
          T-Shirts
        </Link>

        <Link href="/shop?category=Shirts">
          Shirts
        </Link>

        <Link href="/shop?category=Jeans">
          Jeans
        </Link>

        <Link href="/shop?category=Trousers">
          Trousers
        </Link>

      </div>


      <div>

        <b>
          CUSTOMER SERVICE
        </b>

        <Link href="/contact">
          Contact
        </Link>

        <Link href="/shipping">
          Shipping
        </Link>

        <Link href="/returns">
          Returns
        </Link>

        <Link href="/size-guide">
          Size Guide
        </Link>

      </div>


      <div>

        <b>
          ABOUT
        </b>

        <Link href="/about">
          About S.K
        </Link>

        <Link href="/about">
          Our Story
        </Link>

        <Link href="/contact">
          Careers
        </Link>

      </div>


      <div className="copyright">
        © 2026 S.K. All rights reserved.
      </div>

    </footer>

  );
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

export function ProductCard({
  p,
}: {
  p: any;
}) {

  const {
    toggleWishlist,
    wishlist,
  } = useStore();


  const isWishlisted =
    wishlist.includes(p.id);


  return (

    <article className="product-card">

      {/* PRODUCT IMAGE */}

      <div className="product-img">

        <Link
          href={`/product/${p.id}`}
          className="product-image-link"
          aria-label={`View ${p.name}`}
        >

          {/* MAIN IMAGE */}

          <img
            className="product-main"
            src={p.image}
            alt={p.name}
          />


          {/* SECOND IMAGE ON HOVER */}

          {p.images?.[1] && (

            <img
              className="product-hover"
              src={p.images[1]}
              alt=""
              aria-hidden="true"
            />

          )}


          {/* SALE LABEL */}

          {p.sale && (

            <em>
              SALE
            </em>

          )}


          {/* VIEW PRODUCT BUTTON */}

          <span className="product-view-button">

            VIEW PRODUCT

            <span>
              →
            </span>

          </span>

        </Link>


        {/* WISHLIST */}

        <button
          className="heart"
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={() =>
            toggleWishlist(p.id)
          }
        >

          {isWishlisted ? (
            <Heart fill="currentColor" />
          ) : (
            <Heart />
          )}

        </button>

      </div>


      {/* PRODUCT INFORMATION */}

      <Link
        href={`/product/${p.id}`}
        className="product-name-link"
      >

        <h3>
          {p.name}
        </h3>

      </Link>


      <p className="muted">
        {p.category}
      </p>


      {/* PRICE */}

      <p className="product-card-price">

        {p.salePrice ? (

          <>
            <s>
              ₹
              {p.price.toLocaleString("en-IN")}
            </s>

            <strong>
              ₹
              {p.salePrice.toLocaleString("en-IN")}
            </strong>
          </>

        ) : (

          <>
            ₹
            {p.price.toLocaleString("en-IN")}
          </>

        )}

      </p>


      {/* COLOURS */}

      <div
        className="dots"
        aria-label={`Available colours: ${p.colors.join(", ")}`}
      >

        {p.colors.map(
          (c: string) => (

            <i
              key={c}
              title={c}
              style={{
                background:
                  colorMap[c] || "#222",
              }}
            />

          )
        )}

      </div>

    </article>

  );
}


/* =========================================================
   SECTION TITLE
   ========================================================= */

export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {

  return (

    <div className="section-title">

      <p>
        {eyebrow}
      </p>

      <h2>
        {title}
      </h2>

    </div>

  );
}