"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { BookingAPIResponse } from "@/components/reservation/types/reservation";

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
  const bookingId = params.get("booking");
  const debugFare = params.get("debugFare");

  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Fetch booking details from API
  const { data: booking, isLoading, error } = useQuery<BookingAPIResponse>({
    queryKey: ['booking-details', bookingId],
    queryFn: async (): Promise<BookingAPIResponse> => {
      if (!bookingId) {
        throw new Error('No booking ID provided');
      }
      
      try {
        const response = await api.get(`/booking/my-bookings/${bookingId}/`);
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          throw new Error('Booking not found');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Unauthorized access to booking');
        }
        throw new Error('Failed to fetch booking details');
      }
    },
    enabled: !!bookingId,
    retry: 1,
  });

  // Redirect to bookings page if no booking ID or error
  React.useEffect(() => {
    if (!bookingId || error) {
      router.push('/user-bookings');
    }
  }, [bookingId, error, router]);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("Razorpay SDK is still loading. Please wait.");
      return;
    }

    // Use debug fare if available, otherwise use booking fare
    const fareAmount = debugFare ? parseFloat(debugFare) : booking?.fare;
    
    if (!booking || (!fareAmount && fareAmount !== 0)) {
      alert("No booking data or amount available for payment.");
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
    const amountPaise = Math.max(100, Math.abs(fareAmount) * 100); // Ensure positive, minimum ₹1

    try {
      // Create order on server
      const orderResp = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: `rec_${bookingId}`,
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
        description: `Final Payment for ${booking?.id || bookingId}`,
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
              // Payment verified successfully, redirect to feedback
              router.push(
                `/feedback?ref=${encodeURIComponent(booking?.id?.toString() || bookingId || "")}&spot=${encodeURIComponent(booking?.slot_number?.toString() || "")}`
              );
            } else {
              // Payment verification failed
              console.error("Payment verification failed:", verifyData.error);
              alert(`Payment verification failed: ${verifyData.error || 'Unknown error'}. Please contact support if amount was deducted.`);
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed due to network error. Please contact support if amount was deducted.");
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
        alert(`Payment failed: ${response.error.description || 'Unknown error occurred'}`);
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
          
          {isLoading ? (
            <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          ) : booking ? (
            <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Reservation ID</span>
                <span className="font-semibold">{booking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Location & Spot</span>
                <span className="font-semibold">{booking.location_name} — Spot {booking.slot_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vehicle</span>
                <span className="font-semibold">{booking.vehicle_plate}</span>
              </div>
              {booking.start_time && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Start Time</span>
                  <span className="font-semibold">
                    {new Date(booking.start_time).toLocaleString()}
                  </span>
                </div>
              )}
              {booking.exit_time && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">End Time</span>
                  <span className="font-semibold">
                    {new Date(booking.exit_time).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Amount Due</span>
                <span className="text-lg font-bold">₹{Math.max(0, debugFare ? parseFloat(debugFare) : booking.fare || 0)}</span>
              </div>
              <div className="pt-3 border-t border-[#4d84a4]/20">
                <button
                  disabled={paying || !scriptLoaded || (!booking.fare && !debugFare)}
                  onClick={handlePayment}
                  className="w-full rounded-lg bg-[#4d84a4] px-5 py-3 font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {!scriptLoaded
                    ? "Loading Payment Gateway..."
                    : paying
                    ? "Processing…"
                    : (!booking.fare && !debugFare)
                    ? "No Amount Due"
                    : "Pay with Razorpay"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-red-500/25 bg-red-900/20 p-4">
              <p className="text-red-300">Unable to load booking details. Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
