"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TimeSelectionDialog from "@/components/booking/TimeSelectionDialog";
import api from "@/lib/axios";

declare global {
  interface Window {
    Razorpay?: unknown;
  }
}

interface Vehicle {
  vehicle_id: number;
  vehicle_name: string;
  vehicle_registration_number: string;
}

interface LocationDetails {
  name: string;
  address: string;
  price_per_hour: number;
}

import PageLoader from '@/components/ui/PageLoader';

const BookingSummaryPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const locationId = params.get("location");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>(""); // ISO string
  const [startTimeDisplay, setStartTimeDisplay] = useState<string>(""); // HH:MM

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showVehicleError, setShowVehicleError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);

  const vehicleSelectRef = useRef<HTMLSelectElement | null>(null);
  const editTimeButtonRef = useRef<HTMLButtonElement | null>(null);

  const totalDueNow = 10; // ₹10

  const bookingRef = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `BK${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}${pad(now.getHours())}${pad(now.getMinutes())}`;
  }, []);

  useEffect(() => {
    let mounted = true;
    setVehiclesLoading(true);
    api
      .get("/vehicle/")
      .then((res) => {
        if (!mounted) return;
        setVehicles(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!mounted) return;
        setVehiclesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (locationId) {
      setLocationLoading(true);
      api
        .get(`/parking/${locationId}/`)
        .then((res) => {
          if (!mounted) return;
          setLocationDetails(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (!mounted) return;
          setLocationLoading(false);
        });
    } else {
      setLocationDetails(null);
    }

    return () => {
      mounted = false;
    };
  }, [locationId]);

  const handleTimeChange = (isoTime: string) => {
    const dt = new Date(isoTime);
    if (!isNaN(dt.getTime())) {
      setStartTime(isoTime);
      setStartTimeDisplay(
        `${dt.getHours().toString().padStart(2, "0")}:${dt
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
      // clear time error when user chooses a time
      if (showTimeError) setShowTimeError(false);
    }
  };

  // Handle booking creation
  const handleBooking = async () => {
    // Validate required fields and show inline indicators instead of silently blocking
    let hasError = false;
    if (!locationId) {
      setLastSaved("Missing location. Please go back and select a parking location.");
      return;
    }
    if (!selectedVehicleId) {
      setShowVehicleError(true);
      hasError = true;
      // focus the vehicle select so user notices
      vehicleSelectRef.current?.focus();
    }
    if (!startTime) {
      setShowTimeError(true);
      hasError = true;
      // if vehicle is present, focus time button; otherwise it'll be focused after vehicle
      if (selectedVehicleId) {
        editTimeButtonRef.current?.focus();
      }
    }
    if (hasError) return;

    setIsSaving(true);
    setLastSaved(null);

    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1000,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.id) {
        setLastSaved("Payment initiation failed.");
        setIsSaving(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ParkItUp",
        description: "Parking Reservation",
        order_id: orderData.id,
        handler: async function (response: unknown) {
            try {
              // Safely extract payment id from response
              const respObj = response as Record<string, unknown>;
              const paymentId = typeof respObj["razorpay_payment_id"] === "string" ? (respObj["razorpay_payment_id"] as string) : undefined;
              if (!paymentId) {
                setLastSaved("Payment succeeded but missing payment id.");
                setIsSaving(false);
                return;
              }

              // 3. Only after successful payment, call booking API
              const bookingRes = await api.post("/booking/create/", {
                vehicle_id: selectedVehicleId,
                location_id: Number(locationId),
                start_time: startTime,
              });

            // 4. Redirect user to reservation page with booking id
            const bookingId = bookingRes.data.id;
            router.push(`/reservation?booking=${bookingId}`);
          } catch (err) {
            setLastSaved("Booking failed. Try again.");
            console.error(err);
          } finally {
            setIsSaving(false);
          }
        },
        prefill: {
          email: "test@okaxis.com",
          contact: "9999999999",
        },
        theme: { color: "#4d84a4" },
        notes: {
          testmode: "true",
        },
        modal: {
          ondismiss: () => {
            setIsSaving(false);
            setLastSaved("Payment cancelled.");
          },
        },
      };

      // Obtain typed constructor from window without using `any`
      const RzpCtor = (window as unknown as { Razorpay?: new (opts: unknown) => { open: () => void } }).Razorpay;
      if (!RzpCtor) {
        setLastSaved("Razorpay not available");
        setIsSaving(false);
        return;
      }
      const rzp = new RzpCtor(options);
      rzp.open();
    } catch (err) {
      console.error("Booking error:", err);
      setLastSaved("Something went wrong. Try again.");
      setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01030a] via-[#0a0f1c] to-[#0a121a] text-white">
      <PageLoader open={vehiclesLoading || locationLoading || isSaving} text={isSaving ? 'Processing payment…' : 'Loading...'} />
      
      <div className="relative isolate overflow-hidden">
        {/* Gradient accents */}
        <div className="pointer-events-none absolute inset-x-0 top-[-40%] h-[420px] bg-gradient-to-b from-[#362f8c] via-transparent to-transparent opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#4d84a4] to-[#2dd4bf] opacity-15 blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4d84a4] to-[#2dd4bf]">
                <span className="text-sm font-bold">2</span>
              </div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300 font-semibold">Step 2 of 2</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Booking Summary</h1>
            <p className="text-gray-400 mt-2">Review your details and complete payment</p>
            <p className="text-xs md:text-sm text-gray-500 mt-3 font-mono" aria-live="polite">
              REF: {bookingRef}
            </p>
          </header>

          {/* Key Info Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {/* Location Card */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#101427] p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Location</div>
              <div className="text-lg font-semibold">{locationDetails?.name || "Loading..."}</div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{locationDetails?.address || ""}</p>
            </div>

            {/* Spot Card */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#101427] p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Parking Spot</div>
              <div className="text-lg font-semibold">Auto-assigned</div>
              <p className="text-xs text-gray-400 mt-1">Assigned after booking</p>
            </div>

            {/* Time Card */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#101427] p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Start Time</div>
              <div className="text-lg font-semibold">{startTimeDisplay ? `Today ${startTimeDisplay}` : "Select time"}</div>
              <p className="text-xs text-gray-500 mt-1">or edit below</p>
            </div>

            {/* Rate Card */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#101427] p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Hourly Rate</div>
              <div className="text-lg font-semibold">₹{locationDetails?.price_per_hour || "—"}</div>
              <p className="text-xs text-emerald-400 mt-1">per hour</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2 space-y-6">
              {/* Reservation Details */}
              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#0f1624] p-6 shadow-[0_15px_60px_rgba(5,8,20,0.8)] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4d84a4]/20">
                    <span className="text-lg">📍</span>
                  </div>
                  <h2 className="text-lg font-semibold">Reservation Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-[#0a0f1c] p-4 border border-white/5">
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Location</div>
                    <p className="text-base font-semibold">{locationDetails?.name || "Loading..."}</p>
                    <p className="text-sm text-gray-400 mt-1">{locationDetails?.address || ""}</p>
                  </div>

                  <div className="rounded-lg bg-[#0a0f1c] p-4 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Start Time</div>
                      <p className={`text-base font-semibold ${showTimeError ? 'text-red-300' : ''}`}>
                        {startTimeDisplay ? `Today ${startTimeDisplay}` : "Select start time"}
                      </p>
                      {showTimeError && (
                        <p className="text-sm text-red-400 mt-1">⚠️ Please select a start time</p>
                      )}
                    </div>
                    <button
                      ref={editTimeButtonRef}
                      onClick={() => setTimeDialogOpen(true)}
                      className="rounded-lg border border-[#4d84a4]/40 bg-[#4d84a4]/10 px-3 py-2 text-sm font-semibold text-[#a6c8dd] hover:bg-[#4d84a4]/20 transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </section>

              {/* Vehicle Selection */}
              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#0f1624] p-6 shadow-[0_15px_60px_rgba(5,8,20,0.8)] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4d84a4]/20">
                    <span className="text-lg">🚗</span>
                  </div>
                  <h2 className="text-lg font-semibold">Vehicle Details</h2>
                </div>
                <div className="space-y-3">
                  <select
                    ref={vehicleSelectRef}
                    value={selectedVehicleId ?? ""}
                    onChange={(e) => {
                      setSelectedVehicleId(Number(e.target.value));
                      if (showVehicleError) setShowVehicleError(false);
                    }}
                    className={`w-full rounded-lg px-4 py-3 text-white bg-[#0a0f1c] border transition focus:outline-none focus:ring-2 ${
                      showVehicleError
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-white/10 focus:ring-[#4d84a4]/30 hover:border-white/20'
                    }`}
                  >
                    <option value="" disabled>
                      Select your vehicle
                    </option>
                    {vehicles.map((v) => (
                      <option key={v.vehicle_id} value={v.vehicle_id}>
                        {v.vehicle_name} ({v.vehicle_registration_number})
                      </option>
                    ))}
                  </select>
                  {showVehicleError && (
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <span>⚠️</span> Please select a vehicle before booking
                    </p>
                  )}
                </div>
              </section>

              {/* Payment Breakdown */}
              <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#0f1624] p-6 shadow-[0_15px_60px_rgba(5,8,20,0.8)] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4d84a4]/20">
                    <span className="text-lg">💰</span>
                  </div>
                  <h2 className="text-lg font-semibold">Payment Breakdown</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-[#0a0f1c] p-3 border border-white/5">
                    <span className="text-gray-300">Reservation Fee</span>
                    <span className="font-semibold">₹10 <span className="text-xs text-gray-500">(50% off)</span></span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0a0f1c] p-3 border border-white/5">
                    <span className="text-gray-300">You Save</span>
                    <span className="font-semibold text-emerald-400">₹10</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0a0f1c] p-3 border border-white/5">
                    <span className="text-gray-300">After Arrival</span>
                    <span className="font-semibold">₹{locationDetails?.price_per_hour || "—"}/hour</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-[#4d84a4]/10 to-[#2dd4bf]/10 p-3 border border-white/5">
                    <span className="font-semibold">Total Due Now</span>
                    <span className="text-xl font-bold text-[#2dd4bf]">₹{totalDueNow}</span>
                  </div>
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Payment CTA Card */}
              <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#4d84a4]/20 via-[#0c111a] to-[#0f1624] p-6 shadow-[0_15px_60px_rgba(77,132,164,0.2)] sticky top-6">
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Amount Due</div>
                <div className="text-4xl font-bold mb-1">₹{totalDueNow}</div>
                <p className="text-sm text-gray-400 mb-6">Pay now to reserve your spot</p>

                <button
                  onClick={handleBooking}
                  disabled={isSaving}
                  className="w-full rounded-full bg-gradient-to-r from-[#4d84a4] to-[#2dd4bf] px-6 py-3 text-base font-semibold text-white shadow-[0_10px_30px_rgba(77,132,164,0.5)] hover:shadow-[0_15px_40px_rgba(77,132,164,0.6)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Processing...
                    </span>
                  ) : (
                    "Complete Booking"
                  )}
                </button>

                {lastSaved && (
                  <div className={`mt-4 rounded-lg p-3 text-sm text-center ${
                    lastSaved.includes("fail") || lastSaved.includes("Try")
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : lastSaved.includes("cancel")
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    {lastSaved}
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-6 space-y-2 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>🔒</span> Secure payment by Razorpay
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>✓</span> 24/7 customer support
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Time Selection Dialog */}
      <TimeSelectionDialog
        open={timeDialogOpen}
        onOpenChange={setTimeDialogOpen}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
};

export default BookingSummaryPage;
