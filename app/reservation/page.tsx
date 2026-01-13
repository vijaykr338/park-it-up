"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StatusDisplay } from "@/components/reservation";
import { useBookingStatus } from "@/components/reservation/hooks/useBookingStatus";
import { useParkingTimer } from "@/components/reservation/hooks/useParkingTimer";
import { ReservationLoadingState } from "@/components/reservation";
import type { BookingStatus, ReservationError } from "@/lib/types";

export default function ReservationManagerPage() {
  const params = useSearchParams();
  const bookingId = params.get("booking");
  
  // Debug state for simulating time
  const [debugTimeOffset, setDebugTimeOffset] = useState(0);
  
  // Memoize callbacks to prevent infinite loops
  const handleError = useCallback((error: ReservationError) => {
    console.error('Booking status error:', error);
  }, []);

  const handleStatusChange = useCallback((newStatus: BookingStatus) => {
    console.log('Status changed to:', newStatus);
  }, []);

  // Use the real-time polling hook
  const {
    booking,
    status,
    isLoading,
    error,
    refetch
  } = useBookingStatus({
    bookingId,
    enabled: !!bookingId,
    onError: handleError,
    onStatusChange: handleStatusChange
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Use the parking timer hook for live calculations
  const {
    isRunning,
    formattedDuration,
    currentCost
  } = useParkingTimer({
    startTime: booking?.start_time || null,
    hourlyRate: booking?.hourly_rate || 15,
    status,
    enabled: true,
    debugTimeOffset
  });

  const hourlyRate = booking?.hourly_rate || 15; // Use API hourly rate or fallback

  // Create modified booking with debug fare for Razorpay
  const modifiedBooking = React.useMemo(() => {
    if (!booking) return null;
    return {
      ...booking,
      fare: debugTimeOffset > 0 ? currentCost : booking.fare // Use debug cost if debug is active
    };
  }, [booking, debugTimeOffset, currentCost]);

  // Debug functions
  const incrementDebugTime = () => {
    setDebugTimeOffset(prev => prev + 30); // Add 30 minutes each click
  };



  // Show loading state while fetching booking data
  if (isLoading) {
    return <ReservationLoadingState onRefresh={handleRefresh} />;
  }

  // Show error state if booking fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a121a] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-red-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-400 mb-2">
                Unable to Load Reservation
              </h2>
              <p className="text-gray-300 text-sm mb-4">
                {error.message || "Something went wrong while loading your reservation."}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="w-full rounded-lg bg-[#4d84a4] px-4 py-2 font-semibold hover:brightness-110 transition-all"
              >
                Try Again
              </button>
              
              <Link
                href="/user-bookings"
                className="block w-full rounded-lg border border-gray-500/25 px-4 py-2 font-semibold hover:bg-gray-500/10 transition-all"
              >
                Go to My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to bookings if no booking ID provided
  if (!bookingId) {
    return (
      <div className="min-h-screen bg-[#0a121a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Booking Selected</h1>
          <p className="text-gray-300 mb-6">Please select a booking to view its details.</p>
          <Link href="/user-bookings" className="bg-[#4d84a4] px-6 py-3 rounded-lg font-semibold hover:brightness-110">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-root min-h-screen bg-[#0a121a] text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 md:mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold">My Parking Reservation</h1>
            <div className="flex items-center gap-2">
              {/* Single Debug Button */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={incrementDebugTime}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-500/25 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all text-yellow-300"
                  title="Add 30 minutes for demo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">+30min (₹{(currentCost + (hourlyRate * 0.5)).toFixed(0)})</span>
                </button>
              )}
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4d84a4]/25 bg-[#232834]/60 hover:bg-[#232834]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh reservation status"
              >
                <svg 
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
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
            {booking?.zone_name && (
              <>
                <div className="hidden sm:block h-10 w-px bg-[#4d84a4]/20" />
                <div className="space-y-1">
                  <div className="text-xs text-gray-300">Zone</div>
                  <div className="text-xl md:text-2xl font-semibold text-sky-300">{booking.zone_name}</div>
                </div>
              </>
            )}
          </div>
        </header>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Status Card */}
          <section className="lg:col-span-2">
            <StatusDisplay 
              status={status} 
              locationName={booking?.location_name}
              slotNumber={booking?.slot_number}
            />

            {/* Timer and Actions Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Live Timer Display */}
              <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-300 mb-2">
                  <span>Time Parked</span>
                  {isRunning && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="mt-1 text-3xl md:text-5xl font-bold tracking-wide">
                  {status === "checked_in" || status === "checkout" ? formattedDuration : "Not started"}
                </div>
                {(status === "checked_in" || status === "checkout") && (
                  <div className="mt-2 text-sm text-gray-300">
                    Current Cost: <span className="font-semibold text-white">₹{currentCost.toFixed(2)}</span>
                  </div>
                )}
                {status === "reserved" && (
                  <div className="mt-2 text-xs text-gray-400">
                    Timer will start when you check in
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                {status === "reserved" && (
                  <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 p-4 text-center">
                    <div className="text-sm text-blue-300 mb-2">Waiting for Check-in</div>
                    <div className="text-xs text-gray-300">
                      Arrive at the location and the attendant will check you in
                    </div>
                  </div>
                )}
                {status === "checked_in" && (
                  <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-center">
                    <div className="text-sm text-green-300 mb-2">Currently Parked</div>
                    <div className="text-xs text-gray-300">
                      Notify the attendant when you&apos;re ready to leave
                    </div>
                  </div>
                )}
                {status === "checkout" && (
                  <div className="rounded-lg border border-orange-500/40 bg-orange-500/10 p-4 text-center">
                    <div className="text-sm text-orange-300 mb-2">Processing Checkout</div>
                    <div className="text-xs text-gray-300">
                      You will be redirected to payment shortly
                    </div>
                  </div>
                )}

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
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Live Billing</span>
                  {isRunning && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  Auto-updates every 7s
                </div>
              </div>
              <div className="space-y-2 text-gray-100 text-sm">
                <div className="flex justify-between">
                  <span>Time Parked</span>
                  <span className="font-semibold">
                    {status === "checked_in" || status === "checkout" ? formattedDuration : "Not Started"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Cost</span>
                  <span className="font-semibold">
                    ₹{(status === "checked_in" || status === "checkout") ? currentCost.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Rate</span>
                  <span>₹{hourlyRate} Per Hour</span>
                </div>
                {status === "checked_in" && (
                  <div className="pt-2 border-t border-[#4d84a4]/20">
                    <div className="text-xs text-gray-400">
                      Cost Updates Every Minute • Timer Runs Live
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Support Contact */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="font-semibold mb-3 text-lg">Need Help?</div>
              <div className="space-y-3">
                <div className="text-sm text-gray-300">
                  Having issues with your parking? Contact our support team.
                </div>
                <a 
                  href="tel:+918888888888" 
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold hover:brightness-110 transition-all"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                    />
                  </svg>
                  Call Support
                </a>
                <div className="text-xs text-center text-gray-400">
                  +91 8888 888 888 • Available 24/7
                </div>
              </div>
            </section>

            {/* Checkout Section */}
            {status === "checkout" && (
              <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
                <div className="font-semibold mb-2">Payment Required</div>
                <div className="mb-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-sm text-orange-300">
                    Your parking session has ended. Please complete payment to finish checkout.
                  </div>
                  {(modifiedBooking?.fare || currentCost > 0) && (
                    <div className="text-lg font-bold text-orange-200 mt-1">
                      Amount Due: ₹{Math.max(0, modifiedBooking?.fare || currentCost)}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Link 
                    href={`/reservation/receipt?booking=${encodeURIComponent(booking?.id || "")}&debugFare=${encodeURIComponent(currentCost.toString())}`} 
                    className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold hover:brightness-110 text-center text-white"
                  >
                    💳 Pay Now
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