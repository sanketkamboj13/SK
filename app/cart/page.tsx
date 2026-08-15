"use client";

import Link from "next/link";
import { Header, Footer } from "../components";
import { useStore } from "../store";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    setQty,
  } = useStore();

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(
        item.sale_price ?? item.price ?? 0
      ) * item.qty,
    0
  );

  const shipping =
    subtotal >= 2000 ? 0 : 99;

  const total = subtotal + shipping;

  return (
    <>
      <Header />

      <main className="cart-page">

        <h1>SHOPPING BAG</h1>

        {!cart.length ? (
          <div className="empty">
            <p>Your bag is empty.</p>

            <Link
              className="btn"
              href="/shop"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* CART ITEMS */}
            <div>
              {cart.map((item) => {
                const itemPrice = Number(
                  item.sale_price ??
                  item.price ??
                  0
                );

                return (
                  <div
                    className="cart-item"
                    key={item.id}
                  >
                    <img
                      src={
                        item.image ||
                        "/images/placeholder.jpg"
                      }
                      alt={item.name}
                    />

                    <div>
                      <h3>{item.name}</h3>

                      <p className="muted">
                        {item.color || "Default"}{" "}
                        /{" "}
                        {item.size || "One Size"}
                      </p>

                      <p>
                        ₹
                        {(
                          itemPrice *
                          item.qty
                        ).toLocaleString("en-IN")}
                      </p>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setQty(
                              item.id,
                              Math.max(
                                1,
                                item.qty - 1
                              )
                            )
                          }
                        >
                          -
                        </button>

                        <span>
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQty(
                              item.id,
                              item.qty + 1
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="remove"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <aside className="summary">

              <h2>ORDER SUMMARY</h2>

              <p>
                Subtotal
                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </p>

              <p>
                Shipping
                <span>
                  {shipping === 0
                    ? "FREE"
                    : "₹99"}
                </span>
              </p>

              <hr />

              <h3>
                Total
                <span>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </h3>

              <Link
                className="btn full"
                href="/checkout"
              >
                CHECKOUT
              </Link>

              <Link
                className="text-link"
                href="/shop"
              >
                CONTINUE SHOPPING
              </Link>

            </aside>

          </div>
        )}
      </main>

      <Footer />
    </>
  );
}