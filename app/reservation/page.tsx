"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import api from "@/lib/axios";

type Status = "reserved" | "checked_in" | "checkout";

interface BookingDetails {
  id: number;
  start_time: string;
  exit_time: string | null;
  fare: number | null;
  location_name: string;
  vehicle_plate: string;
  slot_number: number;
}

export default function ReservationManagerPage() {
  const params = useSearchParams();
  const bookingId = params.get("booking");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [status, setStatus] = useState<Status>("reserved");
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    if (bookingId) {
      api.get(`/booking/my-bookings/${bookingId}/`)
        .then(res => setBooking(res.data))
        .catch(console.error);
    }
  }, [bookingId]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(id);
  }, []);

  const startTime = booking ? new Date(booking.start_time) : null;
  const elapsedMins = startTime ? Math.max(0, Math.floor((now.getTime() - startTime.getTime()) / 60000)) : 0;
  const hourlyRate = 15; // ₹15/hr
  const currentCost = startTime ? Math.round((elapsedMins / 60) * hourlyRate * 100) / 100 : 0;

  return (
    <div className="reservation-root min-h-screen bg-[#0a121a] text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 md:mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">My Parking Reservation</h1>
          {/* Key info banner */}
          <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-300">Reservation ID</div>
              <div className="text-xl md:text-2xl font-semibold tracking-wide">{booking?.id || bookingId}</div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-[#4d84a4]/20" />
            <div className="space-y-1">
              <div className="text-xs text-gray-300">Location & Spot</div>
              <div className="text-xl md:text-2xl font-semibold">
                {booking?.location_name || "Loading..."} — <span className="text-[#a6c8dd]">Spot {booking?.slot_number || ""}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Status Card */}
          <section className="lg:col-span-2 rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-5">
            <div className="mb-3">
              {status === "reserved" && (
                <>
                  <div className="text-xl md:text-2xl font-bold">RESERVED - NOT PARKED</div>
                  <p className="text-gray-300 mt-1">You haven’t checked in yet. Head to the parking location.</p>
                </>
              )}
              {status === "checked_in" && (
                <>
                  <div className="text-xl md:text-2xl font-bold">CURRENTLY PARKED</div>
                  <p className="text-gray-300 mt-1">Your parking timer is running.</p>
                </>
              )}
              {status === "checkout" && (
                <>
                  <div className="text-xl md:text-2xl font-bold">CHECKING OUT</div>
                  <p className="text-gray-300 mt-1">Review your final time and total.</p>
                </>
              )}
            </div>

            {/* QR Section */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-lg border border-dashed border-[#4d84a4]/40 p-4 flex flex-col items-center justify-center">
                <div className="bg-white p-2 rounded">
                  <QRCodeCanvas value={`RES:${booking?.id}|SPOT:${booking?.slot_number}`} size={192} includeMargin fgColor="#000000" />
                </div>
                <p className="text-sm text-gray-200 mt-3">Show this QR to the valet</p>
                <p className="text-xs text-gray-400">Use when you arrive{status !== "reserved" ? " or when leaving" : ""}</p>
              </div>

              {/* Quick Actions & Big Timer */}
              <div className="space-y-4">
                {status === "reserved" && (
                  <button
                    onClick={() => {
                      setStatus("checked_in");
                    }}
                    className="w-full rounded-lg bg-[#4d84a4] px-5 py-3 font-semibold hover:brightness-110"
                  >
                    I&apos;ve Arrived
                  </button>
                )}
                {status === "checked_in" && (
                  <button
                    onClick={() => setStatus("checkout")}
                    className="w-full rounded-lg bg-[#4d84a4] px-5 py-3 font-semibold hover:brightness-110"
                  >
                    Ready to Leave
                  </button>
                )}
                {/* Big time display */}
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-4 text-center">
                  <div className="text-xs text-gray-300">Time Parked</div>
                  <div className="mt-1 text-3xl md:text-5xl font-bold tracking-wide">
                    {status === "checked_in" || status === "checkout" ? `${Math.floor(elapsedMins / 60)}h ${elapsedMins % 60}m` : "Not started"}
                  </div>
                  {(status === "checked_in" || status === "checkout") && (
                    <div className="mt-2 text-sm text-gray-300">Current Cost: <span className="font-semibold text-white">₹{currentCost.toFixed(2)}</span></div>
                  )}
                </div>
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3 text-sm text-gray-300">
                  <div className="font-semibold mb-1">What Happens Next</div>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Arrive at parking location</li>
                    <li>Show QR code to valet</li>
                    <li>Valet starts your parking timer</li>
                    <li>When leaving, show QR again for checkout</li>
                    <li>Get receipt on your phone</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar: Booking Info + Live Billing + Support */}
          <aside className="space-y-4">
            {/* Booking Information */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="font-semibold mb-3 text-lg">Booking Information</div>
              <div className="grid grid-cols-1 gap-3 text-gray-100 text-sm">
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3">
                  <div className="text-xs text-gray-300">Date</div>
                  <div className="text-base font-medium">{booking ? new Date(booking.start_time).toLocaleDateString() : ""}</div>
                </div>
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3">
                  <div className="text-xs text-gray-300">Start Time</div>
                  <div className="text-base font-medium">{booking ? new Date(booking.start_time).toLocaleTimeString() : ""}</div>
                </div>
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3">
                  <div className="text-xs text-gray-300">Vehicle</div>
                  <div className="text-base font-medium">{booking?.vehicle_plate || ""}</div>
                </div>
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3">
                  <div className="text-xs text-gray-300">Reservation Fee</div>
                  <div className="text-base font-medium">₹10 paid</div>
                </div>
              </div>
            </section>

            {/* Live Billing */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="font-semibold mb-3 text-lg">Live Billing</div>
              <div className="space-y-2 text-gray-100 text-sm">
                <div className="flex justify-between"><span>Time Parked</span><span className="font-semibold">{status === "checked_in" || status === "checkout" ? `${Math.floor(elapsedMins / 60)}h ${elapsedMins % 60}m` : "Not started"}</span></div>
                <div className="flex justify-between"><span>Current Cost</span><span className="font-semibold">₹{(status === "checked_in" || status === "checkout") ? currentCost.toFixed(2) : "0.00"}</span></div>
                <div className="flex justify-between"><span>Hourly Rate</span><span>₹{hourlyRate} per hour</span></div>
              </div>
            </section>

            {/* Checkout Section */}
            {status === "checkout" && (
              <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
                <div className="font-semibold mb-2">Finish Up</div>
                <div className="grid grid-cols-1 gap-2">
                  <Link href={`/reservation/receipt?ref=${encodeURIComponent(booking?.id || "")}&spot=${encodeURIComponent(booking?.slot_number || "")}`} className="w-full rounded-lg bg-[#4d84a4] px-5 py-3 font-semibold hover:brightness-110 text-center">
                    Get Receipt
                  </Link>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}


