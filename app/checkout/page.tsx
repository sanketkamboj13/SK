"use client";

import { Header, Footer } from "../components";
import { useStore } from "../store";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export default function Checkout() {
  const { cart } = useStore();

  const total = cart.reduce(
    (total, item) =>
      total +
      Number(item.sale_price ?? item.price ?? 0) *
        item.qty,
    0
  );

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("UPI");
  const [loading, setLoading] = useState(false);

  async function placeOrder() {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !pin ||
      !phone
    ) {
      alert(
        "Please fill in all shipping details."
      );
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    const products = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.qty,
      price: Number(
        item.sale_price ?? item.price ?? 0
      ),
    }));

    const { error } = await supabase
      .from("orders")
      .insert({
        customer_name: `${firstName} ${lastName}`,
        phone,
        email,
        address: `${address}, ${city} - ${pin}`,
        products,
        total_amount: total,
        payment_method: paymentMethod,
        status: "pending",
      });

    setLoading(false);

    if (error) {
      console.error(
        "ORDER ERROR:",
        error
      );

      alert(
        "Order failed. Please try again."
      );

      return;
    }

    alert(
      "Order placed successfully!"
    );

    window.location.href = "/";
  }

  return (
    <>
      <Header />

      <main className="checkout">

        {/* CHECKOUT FORM */}

        <div>

          <p className="eyebrow">
            S.K / CHECKOUT
          </p>

          <h1>
            CHECKOUT
          </h1>

          <div className="form-card">

            {/* CONTACT */}

            <h2>
              1. CONTACT INFORMATION
            </h2>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            {/* SHIPPING */}

            <h2>
              2. SHIPPING ADDRESS
            </h2>

            <div className="two">

              <input
                placeholder="First name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    e.target.value
                  )
                }
              />

            </div>

            <input
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />

            <div className="two">

              <input
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="PIN code"
                value={pin}
                onChange={(e) =>
                  setPin(
                    e.target.value
                  )
                }
              />

            </div>

            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            {/* PAYMENT */}

            <h2>
              3. PAYMENT
            </h2>

            <label>

              <input
                type="radio"
                name="pay"
                value="UPI"
                checked={
                  paymentMethod === "UPI"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              UPI

            </label>

            <label>

              <input
                type="radio"
                name="pay"
                value="Credit / Debit Card"
                checked={
                  paymentMethod ===
                  "Credit / Debit Card"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              Credit / Debit Card

            </label>

            <label>

              <input
                type="radio"
                name="pay"
                value="Cash on Delivery"
                checked={
                  paymentMethod ===
                  "Cash on Delivery"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              Cash on Delivery

            </label>

            {/* PLACE ORDER */}

            <button
              type="button"
              className="btn full"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading
                ? "PLACING ORDER..."
                : "PLACE ORDER"}
            </button>

          </div>
        </div>

        {/* ORDER SUMMARY */}

        <aside className="summary">

          <h2>
            YOUR ORDER
          </h2>

          {cart.map((item) => {

            const itemPrice = Number(
              item.sale_price ??
                item.price ??
                0
            );

            return (
              <p key={item.id}>

                {item.name} × {item.qty}

                <span>
                  ₹
                  {(
                    itemPrice *
                    item.qty
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </p>
            );
          })}

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

        </aside>

      </main>

      <Footer />
    </>
  );
}