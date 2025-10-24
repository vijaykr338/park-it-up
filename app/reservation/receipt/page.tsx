"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

// ✅ Local type definitions (no global Window extension)
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: (response: RazorpayErrorResponse) => void) => void;
};

type RazorpayErrorResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
};

type OrderResponse = {
  orderId?: string;
  message?: string;
  error?: string;
};

// ✅ Type-safe Razorpay constructor type
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

export default function ReceiptPage() {
  const params = useSearchParams();
  const router = useRouter();
  const ref = params.get("ref") || "BK202509041555";
  const spot = params.get("spot") || "P10";
  const amount = 10;

  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("Razorpay SDK is still loading. Please wait.");
      return;
    }

    // ✅ Type assertion for window.Razorpay
    const RazorpayConstructor = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;

    if (!RazorpayConstructor) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    setPaying(true);
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxx";
    const amountPaise = amount * 100;

    try {
      // Create order on server
      const orderResp = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: `rec_${ref}`,
        }),
      });

      const order: OrderResponse = await orderResp.json();

      if (!orderResp.ok || !order?.orderId) {
        alert("Failed to create order. Please try again.");
        setPaying(false);
        return;
      }

      const options: RazorpayOptions = {
        key,
        amount: amountPaise,
        currency: "INR",
        name: "ParkItUp",
        description: `Final Payment for ${ref}`,
        order_id: order.orderId,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            const verifyResp = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResp.json();

            if (verifyData.success) {
              router.push(
                `/feedback?ref=${encodeURIComponent(ref)}&spot=${encodeURIComponent(spot)}`
              );
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          email: "test@okaxis.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4d84a4",
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const rzp = new RazorpayConstructor(options);

      // Handle payment failure
      rzp.on("payment.failed", function (response: RazorpayErrorResponse) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setPaying(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => alert("Failed to load Razorpay SDK")}
      />

      <div className="min-h-screen bg-[#0a121a] text-white">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Receipt</h1>
          <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Reservation ID</span>
              <span className="font-semibold">{ref}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Location & Spot</span>
              <span className="font-semibold">Pacific Mall — Spot {spot}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Amount Due</span>
              <span className="text-lg font-bold">₹{amount}</span>
            </div>
            <div className="pt-3 border-t border-[#4d84a4]/20">
              <button
                disabled={paying || !scriptLoaded}
                onClick={handlePayment}
                className="w-full rounded-lg bg-[#4d84a4] px-5 py-3 font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {!scriptLoaded
                  ? "Loading Payment Gateway..."
                  : paying
                  ? "Processing…"
                  : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
