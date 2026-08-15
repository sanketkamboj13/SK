import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment verification details",
        },
        { status: 400 }
      );
    }

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay secret key is not configured",
        },
        { status: 500 }
      );
    }

    const generatedSignature =
      crypto
        .createHmac("sha256", keySecret)
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error(
      "RAZORPAY VERIFY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
      },
      { status: 500 }
    );
  }
}