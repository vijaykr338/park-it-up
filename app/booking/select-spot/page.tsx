"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Car } from "lucide-react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import PageLoader from '@/components/ui/PageLoader';

type SpotId = number;
type AvailabilityMap = Record<SpotId, "available" | "occupied">;

// ✅ Updated interface to use status instead of is_available
interface Slot {
  id: number;
  number: number;
  status: 'free' | 'reserved' | 'occupied';  // ✅ New status field
  status_display: string;                    // ✅ Human-readable status
  parking_lot: number;
}

function ReserveSpotPage() {
  const params = useSearchParams();
  const locationId = params.get("location");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityMap | null>(null);
  const [selected, setSelected] = useState<SpotId | null>(null);

  useEffect(() => {
    if (!locationId) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get(`/parking/locations/${locationId}/slots/`)
      .then((res) => {
        if (!mounted) return;
        const slots: Slot[] = res.data.slots;

        const map: AvailabilityMap = {};
        slots.forEach((slot) => {
          // ✅ Updated: Use status instead of is_available
          map[slot.id] = slot.status === 'free' ? "available" : "occupied";
        });

        setAvailability(map);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load parking slots"
        );
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [locationId]);

  const canContinue = useMemo(
    () =>
      Boolean(selected && availability && availability[selected] === "available"),
    [selected, availability]
  );

  const renderSpot = (spotId: SpotId) => {
    if (!availability) return null;
    const status = availability[spotId];
    const isSelected = selected === spotId;
    const isOccupied = status === "occupied";

    return (
      <button
        key={spotId}
        type="button"
        disabled={isOccupied}
        onClick={() => setSelected(spotId)}
        className={[
          "group relative rounded border transition-all",
          "w-[120px] h-[80px] md:w-[140px] md:h-[90px]",
          "hover:scale-[1.02] shadow-sm hover:shadow-md",
          isOccupied
            ? "border-orange-500/60 bg-[#4B5563] text-white cursor-not-allowed"
            : "border-[#374151] bg-[#E5E7EB] text-black hover:bg-[#f2f4f7]",
          isSelected && !isOccupied ? "border-[3px] border-[#4d84a4]" : "",
        ].join(" ")}
        aria-label={`Slot ${spotId} ${status}`}
      >
        <span
          className={`absolute top-2 left-2 font-bold ${
            isOccupied ? "text-white" : "text-black"
          }`}
        >
          {spotId}
        </span>
        {isOccupied && (
          <>
            <Car className="absolute inset-0 m-auto h-6 w-6 text-white/90" />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-semibold text-white/90">
              OCCUPIED
            </span>
          </>
        )}
        {isSelected && !isOccupied && (
          <span className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4d84a4] text-white shadow-lg">
            <Check className="h-4 w-4" />
          </span>
        )}
      </button>
    );
  };

  if (!locationId) {
    return (
      <div className="min-h-screen bg-[#0a121a] text-white flex items-center justify-center">
        <div className="text-red-400 text-lg font-semibold">
          No parking location selected. Please go back and choose a parking location.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a121a] text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Car className="h-8 w-8 text-[#4d84a4]" /> Reserve Your Parking Spot
        </h1>

  <PageLoader open={loading} text="Loading slots..." />
        {error && <p className="text-red-400">{error}</p>}

        {!loading && availability && (
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(availability).map((id) => renderSpot(Number(id)))}
          </div>
        )}

        <div className="mt-6">
          {canContinue ? (
            <Link
              href={`/booking?spot=${selected}&location=${locationId}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#4d84a4] bg-[#4d84a4] px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              Continue to Checkout
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-gray-600/50 bg-[#232834] px-5 py-3 text-sm font-medium text-gray-400"
            >
              Continue to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReserveSpotPage;
