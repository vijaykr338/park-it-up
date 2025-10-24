"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
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
  const selectedSpot = params.get("spot");
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
      setStartTimeDisplay(`${dt.getHours().toString().padStart(2, "0")}:00`);
      // clear time error when user chooses a time
      if (showTimeError) setShowTimeError(false);
    }
  };

  // Handle booking creation
  const handleBooking = async () => {
    // Validate required fields and show inline indicators instead of silently blocking
    let hasError = false;
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
                slot_id: Number(selectedSpot),
                start_time: startTime,
                payment_id: paymentId,
                order_id: orderData.id,
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
    <div className="min-h-screen bg-[#0a121a] text-white">
      <PageLoader open={vehiclesLoading || locationLoading || isSaving} text={isSaving ? 'Processing payment…' : 'Loading...'} />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Booking Summary</h1>
          <p className="text-gray-300">Review your details before payment</p>
          <p className="text-xs md:text-sm text-gray-400 mt-1" aria-live="polite">
            REF: {bookingRef}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 space-y-4">
            {/* Parking Spot */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <h2 className="text-sm text-gray-200 mb-2">🅿️ YOUR PARKING SPOT</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-lg font-semibold">
                  Selected:{" "}
                  <span className="text-white">Spot {selectedSpot || "Not selected"}</span>
                </div>
                <Link
                  href={`/booking/select-spot?location=${locationId}`}
                  className="inline-flex items-center justify-center rounded-lg border border-[#4d84a4] bg-[#0b1320] hover:bg-[#0f1826] px-3 py-2 text-sm text-white"
                >
                  Change Parking Spot
                </Link>
              </div>
            </section>

            {/* Reservation Details */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <h2 className="text-sm text-gray-200 mb-3">📍 RESERVATION DETAILS</h2>
              <div className="space-y-2 text-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Location</p>
                    <p className="font-medium">{locationDetails?.name || "Loading..."}</p>
                    <p className="text-xs text-gray-400">{locationDetails?.address || ""}</p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Start Time</p>
                    <p className={`font-medium ${showTimeError ? 'text-red-300' : ''}`}>
                      {startTimeDisplay ? `Today ${startTimeDisplay}` : "Select start time"}
                    </p>
                    {showTimeError && (
                      <p className="text-sm text-red-400 mt-1">Please select a start time before booking.</p>
                    )}
                  </div>
                  <button
                    ref={editTimeButtonRef}
                    onClick={() => setTimeDialogOpen(true)}
                    className="text-sm underline text-[#a6c8dd] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4d84a4]/40"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </section>

            {/* Vehicle Selection */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <h2 className="text-sm text-gray-200 mb-2">🚗 VEHICLE DETAILS</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="w-full">
                <select
                  ref={vehicleSelectRef}
                  value={selectedVehicleId ?? ""}
                  onChange={(e) => {
                    setSelectedVehicleId(Number(e.target.value));
                    if (showVehicleError) setShowVehicleError(false);
                  }}
                  className={`bg-[#232834] text-white rounded-lg px-3 py-2 w-full ${showVehicleError ? 'border border-red-500' : 'border border-[#4d84a4]'}`}
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
                  <p className="text-sm text-red-400 mt-2">Please select a vehicle before booking.</p>
                )}
                </div>
              </div>
            </section>

            {/* Payment Summary */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <h2 className="text-sm text-gray-200 mb-3">💰 PAYMENT BREAKDOWN</h2>
              <div className="space-y-2 text-gray-100">
                <div className="flex items-center justify-between">
                  <span>Reservation Fee</span>
                  <span>
                    ₹10 <span className="text-gray-400">(50% off from ₹20)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>You Save</span>
                  <span className="text-green-400">₹10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>After Arrival</span>
                  <span>₹{locationDetails?.price_per_hour || "..."} /hour</span>
                </div>
                <div className="border-t border-[#334155] pt-2 flex items-center justify-between font-semibold">
                  <span>Total Due Now</span>
                  <span>₹{totalDueNow}</span>
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="text-sm text-gray-300 mb-1">Amount Due</div>
              <div className="text-3xl font-bold">₹{totalDueNow}</div>
              <p className="text-xs text-gray-400 mt-1">Pay now to reserve your spot</p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleBooking}
                  disabled={isSaving}
                  className="w-full rounded-full bg-[#4d84a4] px-5 py-3 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#4d84a4]/40 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Booking..." : "Complete Booking"}
                </button>
                {lastSaved && (
                  <div className="text-sm text-yellow-300 mt-2">{lastSaved}</div>
                )}
              </div>
            </div>
          </aside>
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
