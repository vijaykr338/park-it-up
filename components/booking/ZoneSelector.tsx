/**
 * Zone selector component - displays list of zones with stats
 * Prefetches slots on hover for instant transitions
 */

"use client";

import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, MapPin } from "lucide-react";
import api from "@/lib/axios";
import type { Zone, SlotsListResponse } from "@/app/booking/booking-types";

interface ZoneSelectorProps {
  zones: Zone[];
  selectedZoneId: number | null;
  onSelectZone: (zoneId: number) => void;
  isLoading?: boolean;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  isLoading = false,
}) => {
  const queryClient = useQueryClient();

  /**
   * Prefetch slots for a zone on hover/focus
   * Uses the same query key and fetcher as useZoneSlots
   */
  const prefetchZoneSlots = useCallback(
    (zoneId: number) => {
      queryClient.prefetchQuery({
        queryKey: ["parking-slots", zoneId] as const,
        queryFn: async () => {
          const res = await api.get<SlotsListResponse>(`/parking/zones/${zoneId}/slots/`);
          return res.data;
        },
        staleTime: 3 * 60 * 1000, // 3 minutes, same as useZoneSlots
      });
    },
    [queryClient]
  );
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gray-400">
        <span className="h-[2px] w-20 animate-pulse bg-gradient-to-r from-sky-400 to-fuchsia-500" />
        Loading zones…
      </div>
    );
  }

  if (!zones.length) {
    return <p className="text-sm text-gray-400">No zones available at this location.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {zones.map((zone) => {
        const isSelected = zone.id === selectedZoneId;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone(zone.id)}
            onMouseEnter={() => prefetchZoneSlots(zone.id)}
            onFocus={() => prefetchZoneSlots(zone.id)}
            className={`group relative flex flex-col gap-3 rounded-2xl border bg-[#0e1424]/70 p-4 text-left transition-all duration-200 ${
              isSelected
                ? "border-sky-400/80 bg-gradient-to-br from-sky-500/10 to-slate-900 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                : "border-white/5 hover:border-sky-400/60"
            }`}
          >
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Zone {zone.name}
            </span>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-300" />
              <h2 className="text-lg font-semibold text-white">{zone.name}</h2>
            </div>

            {zone.description && (
              <p className="text-sm text-gray-300">{zone.description}</p>
            )}

            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-white/80">
                Total {zone.total_slots}
              </span>
              <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-sky-300">
                {zone.available_slots} available
              </span>
              {zone.reserved_slots > 0 && (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">
                  {zone.reserved_slots} reserved
                </span>
              )}
              {zone.occupied_slots > 0 && (
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-red-300">
                  {zone.occupied_slots} occupied
                </span>
              )}
            </div>

            {isSelected && (
              <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#4d84a4] text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
