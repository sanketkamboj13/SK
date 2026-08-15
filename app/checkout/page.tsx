"use client";

import { Header, Footer } from "../components";
import { useStore } from "../store";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import Script from "next/script";

export default function Checkout() {
  const { cart } = useStore();

  const total = cart.reduce(
    (total, item) =>
      total +
      Number(item.sale_price ?? item.price ?? 0) * item.qty,
    0
  );

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  // Validate checkout information
  function validateCheckout() {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !pin ||
      !phone
    ) {
      alert("Please fill in all shipping details.");
      return false;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return false;
    }

    return true;
  }

  // Create order in Supabase
  async function saveOrder(
    paymentId?: string,
    orderId?: string
  ) {
    const products = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.qty,
      price: Number(item.sale_price ?? item.price ?? 0),
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
        status: paymentId ? "paid" : "pending",

        // These fields will only work if your
        // Supabase orders table contains them.
        razorpay_payment_id: paymentId || null,
        razorpay_order_id: orderId || null,
      });

    if (error) {
  console.error("ORDER ERROR:", error);

  alert(
    `ORDER SAVE ERROR:\n${error.message}\n\nCode: ${error.code}\nDetails: ${
      error.details || "N/A"
    }`
  );

  return false;
}

    return true;
  }

  // Cash on Delivery
  async function placeCODOrder() {
    if (!validateCheckout()) return;

    setLoading(true);

    const success = await saveOrder();

    setLoading(false);

    if (!success) {
      alert("Order failed. Please try again.");
      return;
    }

    alert("Order placed successfully!");

    window.location.href = "/";
  }

  // Razorpay payment
  async function payWithRazorpay() {
    if (!validateCheckout()) return;

    setLoading(true);

    try {
      // Create Razorpay order on our server
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create Razorpay order"
        );
      }

      // Check Razorpay Checkout script
      if (!(window as any).Razorpay) {
        throw new Error(
          "Razorpay Checkout is not loaded. Please refresh the page."
        );
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "S.K",
        description: "S.K Fashion Store",
        order_id: data.orderId,

        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone,
        },

        notes: {
          address: `${address}, ${city} - ${pin}`,
        },

        theme: {
          color: "#000000",
        },

        handler: async function (paymentResponse: any) {
  try {
    console.log(
      "RAZORPAY PAYMENT RESPONSE:",
      paymentResponse
    );

    // Send payment details to our server
    const verifyResponse = await fetch(
      "/api/razorpay/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id:
            paymentResponse.razorpay_order_id,

          razorpay_payment_id:
            paymentResponse.razorpay_payment_id,

          razorpay_signature:
            paymentResponse.razorpay_signature,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    // Check whether server verification succeeded
    if (
      !verifyResponse.ok ||
      !verifyData.success
    ) {
      throw new Error(
        verifyData.error ||
          "Payment verification failed"
      );
    }

    console.log(
      "PAYMENT VERIFIED:",
      verifyData
    );

    // Save verified payment as a paid order
    const saved = await saveOrder(
      paymentResponse.razorpay_payment_id,
      paymentResponse.razorpay_order_id
    );

    if (!saved) {
      throw new Error(
        "Payment was successful, but the order could not be saved."
      );
    }

    setLoading(false);

    alert(
      "Payment successful! Your order has been placed."
    );

    window.location.href = "/";
  } catch (error) {
    console.error(
      "PAYMENT VERIFICATION ERROR:",
      error
    );

    setLoading(false);

    alert(
      error instanceof Error
        ? error.message
        : "Payment verification failed."
    );
  }
},
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          setLoading(false);

          alert(
            "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "RAZORPAY ERROR:",
        error
      );

      setLoading(false);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );
    }
  }

  // Main checkout button
  function handleCheckout() {
    if (paymentMethod === "Cash on Delivery") {
      placeCODOrder();
    } else {
      payWithRazorpay();
    }
  }

  return (
    <>
      <Header />

      {/* Razorpay Checkout */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

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
                  setFirstName(e.target.value)
                }
              />

              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
              />

            </div>

            <input
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

            <div className="two">

              <input
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
              />

              <input
                placeholder="PIN code"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value)
                }
              />

            </div>

            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
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

            {/* CHECKOUT BUTTON */}

            <button
              type="button"
              className="btn full"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading
                ? "PROCESSING..."
                : paymentMethod ===
                  "Cash on Delivery"
                ? "PLACE ORDER"
                : `PAY ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
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