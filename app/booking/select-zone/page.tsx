/**
 * Backwards-compat route.
 *
 * The booking flow no longer requires selecting a zone or slot.
 * This page simply redirects to /booking?location=<id>.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, MapPin, Sparkles } from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import { useParkingLocation, useParkingZones, useZoneSlots, extractErrorMessage } from "../hooks/booking-hooks";
import type { ParkingSlot, Zone } from "../booking-types";

const SelectZonePage: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const locationId = params.get("location");

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const {
    data: location,
    isLoading: locationLoading,
    error: locationError,
  } = useParkingLocation(locationId);

  const {
    data: zonesData,
    isLoading: zonesLoading,
    error: zonesError,
  } = useParkingZones(locationId);

  const zoneId = selectedZone?.id ?? null;
  const {
    data: slotsData,
    isLoading: slotsLoading,
    error: slotsError,
  } = useZoneSlots(zoneId);

  useEffect(() => {
    if (!zonesData?.zones?.length) return;
    // Preserve current selection if it still exists; otherwise default to first zone
    if (selectedZone) {
      const stillExists = zonesData.zones.find((z) => z.id === selectedZone.id);
      if (stillExists) return;
    }
    setSelectedZone(zonesData.zones[0]);
    setSelectedSlot(null);
  }, [zonesData, selectedZone]);

  useEffect(() => {
    // Reset slot selection when switching zones
    setSelectedSlot(null);
  }, [selectedZone?.id]);

  const slots = useMemo(() => slotsData?.slots ?? [], [slotsData]);
  const freeSlots = useMemo(() => slots.filter((s) => s.status === "free"), [slots]);

  const handleContinue = () => {
    if (!locationId || !selectedZone || !selectedSlot) return;
    router.push(
      `/booking?location=${locationId}&spot=${selectedSlot.id}&zone=${selectedZone.id}`
    );
  };

  const renderError = (message: string, detail?: string) => (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
      <p className="font-semibold">{message}</p>
      {detail ? <p className="text-red-200/80 mt-1">{detail}</p> : null}
    </div>
  );

  if (!locationId) {
    return (
      <div className="min-h-screen bg-[#03050c] text-white flex items-center justify-center px-4 py-10">
        <div className="max-w-xl rounded-3xl border border-white/10 bg-[#0b1220]/80 p-6 text-center shadow-lg space-y-3">
          <Sparkles className="mx-auto h-10 w-10 text-sky-300" />
          <h1 className="text-lg font-semibold">No Location Selected</h1>
          <p className="text-sm text-gray-400">
            Please go back to the map and select a parking location before choosing a zone.
          </p>
          <button
            onClick={() => router.push("/map")}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  const isLoading = locationLoading || zonesLoading || slotsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01030a] via-[#0a0f1c] to-[#0a121a] text-white">
      <PageLoader
        open={isLoading}
        text={slotsLoading ? "Loading slots…" : "Loading…"}
      />

      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-40%] h-[420px] bg-gradient-to-b from-[#362f8c] via-transparent to-transparent opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#4d84a4] to-[#2dd4bf] opacity-15 blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4d84a4] to-[#2dd4bf]">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300 font-semibold">Step 1 of 2</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Select Zone & Slot</h1>
            <p className="text-gray-400 mt-2">Choose a zone first, then pick an available slot.</p>
          </header>

          {/* Errors */}
          <div className="space-y-2 mb-6">
            {locationError &&
              renderError(
                "Unable to load parking location.",
                extractErrorMessage(locationError, "Try reloading the page.")
              )}
            {zonesError &&
              renderError(
                "Unable to load zones.",
                extractErrorMessage(zonesError, "Please try again in a moment.")
              )}
            {slotsError &&
              renderError(
                "Unable to load slots.",
                extractErrorMessage(slotsError, "Please pick a different zone or retry.")
              )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              {/* Zone selection */}
              <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#101427] p-6 shadow-[0_15px_60px_rgba(5,8,20,0.8)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4d84a4]/20">
                      <MapPin className="h-4 w-4 text-sky-300" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Zones</h2>
                      <p className="text-sm text-gray-400">Tap to view available slots</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {zonesData?.total_zones ?? 0} zones
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {(zonesData?.zones ?? []).map((zone) => {
                    const isActive = selectedZone?.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`group relative w-full rounded-2xl border p-4 text-left transition ${isActive
                          ? "border-sky-500/60 bg-sky-500/10 shadow-[0_10px_40px_rgba(45,212,191,0.08)]"
                          : "border-white/10 bg-[#0d1422]/80 hover:border-white/20 hover:-translate-y-0.5"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Zone</p>
                            <h3 className="text-xl font-semibold">{zone.name}</h3>
                          </div>
                          {isActive ? (
                            <span className="flex items-center gap-1 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-200">
                              <Check className="h-4 w-4" /> Selected
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                          {zone.description || "Tap to view slots in this zone."}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-white/5 px-3 py-2">
                            <p className="text-gray-400">Total</p>
                            <p className="font-semibold text-white">{zone.total_slots}</p>
                          </div>
                          <div className="rounded-lg bg-green-500/10 px-3 py-2 border border-green-500/20">
                            <p className="text-green-200/80">Free</p>
                            <p className="font-semibold text-green-100">{zone.available_slots}</p>
                          </div>
                          <div className="rounded-lg bg-amber-500/10 px-3 py-2 border border-amber-500/20">
                            <p className="text-amber-200/80">Reserved</p>
                            <p className="font-semibold text-amber-100">{zone.reserved_slots}</p>
                          </div>
                          <div className="rounded-lg bg-red-500/10 px-3 py-2 border border-red-500/20">
                            <p className="text-red-200/80">Occupied</p>
                            <p className="font-semibold text-red-100">{zone.occupied_slots}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot selection */}
              <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c111a] to-[#0f1624] p-6 shadow-[0_15px_60px_rgba(5,8,20,0.8)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Available Slots</h2>
                    <p className="text-sm text-gray-400">Pick a free slot in the selected zone.</p>
                  </div>
                  <span className="text-sm text-gray-400">{freeSlots.length} free</span>
                </div>

                {!selectedZone ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0b1220]/60 p-6 text-center text-gray-400">
                    Select a zone to view its slots.
                  </div>
                ) : freeSlots.length === 0 ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-amber-100">
                    No free slots in this zone. Try another zone.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {freeSlots.map((slot) => {
                      const isActive = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl border px-4 py-3 text-left transition ${isActive
                            ? "border-sky-500/60 bg-sky-500/15 shadow-[0_10px_30px_rgba(45,212,191,0.15)]"
                            : "border-white/10 bg-[#0b1320]/80 hover:border-white/20 hover:-translate-y-0.5"}`}
                        >
                          <p className="text-xs uppercase tracking-widest text-gray-400">Slot</p>
                          <p className="text-lg font-semibold">#{slot.number}</p>
                          <p className="text-xs text-green-200 mt-1">Available</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#4d84a4]/20 via-[#0c111a] to-[#0f1624] p-6 shadow-[0_15px_60px_rgba(77,132,164,0.2)] sticky top-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-lg">🅿️</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-300">Location</p>
                    <p className="text-lg font-semibold">{location?.name || "Loading..."}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{location?.address}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-[#0a0f1c] p-3 border border-white/5">
                    <span className="text-gray-300">Zone</span>
                    <span className="font-semibold text-sky-200">
                      {selectedZone ? selectedZone.name : "Select a zone"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0a0f1c] p-3 border border-white/5">
                    <span className="text-gray-300">Slot</span>
                    <span className="font-semibold text-sky-200">
                      {selectedSlot ? `#${selectedSlot.number}` : "Select a slot"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={!selectedZone || !selectedSlot}
                  className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold transition shadow-lg ${selectedZone && selectedSlot
                    ? "bg-sky-500 text-white hover:bg-sky-400"
                    : "bg-[#1a2332] text-gray-400 cursor-not-allowed border border-white/10"}`}
                >
                  Continue to Booking
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  Slots are reserved for a short time. Confirm your booking on the next step.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectZonePage;
