/**
 * Slot picker component - displays available slots in a grid with status
 */

"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import type { ParkingSlot, SlotStatus } from "@/app/booking/booking-types";

const STATUS_STYLES: Record<SlotStatus, string> = {
  free: "bg-emerald-300/80 text-emerald-950",
  reserved: "bg-amber-300/90 text-amber-900",
  occupied: "bg-red-500/70 text-white",
};

interface SlotPickerProps {
  slots: ParkingSlot[];
  selectedSlotId: number | null;
  onSelectSlot: (slotId: number) => void;
  zoneName?: string;
  isLoading?: boolean;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  zoneName = "Zone",
  isLoading = false,
}) => {
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);
  const freeCount = slots.filter((s) => s.status === "free").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">Select a Parking Slot</h3>
          <p className="text-sm text-gray-400">
            {freeCount} of {slots.length} slots available in {zoneName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
          <Sparkles className="h-4 w-4 text-emerald-300" />
          {selectedSlot ? `Slot ${selectedSlot.number} selected` : "No slot selected"}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gray-400">
          <span className="h-[2px] w-20 animate-pulse bg-gradient-to-r from-sky-400 to-fuchsia-500" />
          Loading slots…
        </div>
      ) : !slots.length ? (
        <p className="text-sm text-gray-400">No slots available in this zone.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {slots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            const isFree = slot.status === "free";

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isFree}
                onClick={() => isFree && onSelectSlot(slot.id)}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center transition ${
                  isSelected
                    ? "border-sky-400/80 bg-sky-500/10 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                    : "border-white/10 bg-white/5 hover:border-sky-400/60"
                } ${isFree ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                aria-label={`Slot ${slot.number} - ${slot.status_display}`}
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Slot
                </span>
                <span className="text-2xl font-bold text-white">{slot.number}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${STATUS_STYLES[slot.status]}`}>
                  {slot.status_display}
                </span>

                {isSelected && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#4d84a4] text-xs text-white shadow-lg">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
