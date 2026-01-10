/**
 * Backwards-compat route.
 *
 * The booking flow no longer requires selecting a zone or slot.
 * This page simply redirects to /booking?location=<id>.
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";

const SelectZonePage: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const locationId = params.get("location");

  useEffect(() => {
    if (!locationId) return;
    router.replace(`/booking?location=${locationId}`);
  }, [locationId, router]);

  // Missing location ID
  if (!locationId) {
    return (
      <div className="min-h-screen bg-[#03050c] text-white flex items-center justify-center px-4 py-10">
        <div className="max-w-xl rounded-3xl border border-white/10 bg-[#0b1220]/80 p-6 text-center shadow-lg space-y-3">
          <Sparkles className="mx-auto h-10 w-10 text-sky-300" />
          <h1 className="text-lg font-semibold">No Location Selected</h1>
          <p className="text-sm text-gray-400">
            Please go back to the map and select a parking location before choosing a zone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050c] text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-[#0b1220]/80 p-6 text-center shadow-lg space-y-3">
        <Sparkles className="mx-auto h-10 w-10 text-sky-300" />
        <h1 className="text-lg font-semibold">Redirecting…</h1>
        <p className="text-sm text-gray-400">Taking you to booking.</p>
      </div>
    </div>
  );
};

export default SelectZonePage;
