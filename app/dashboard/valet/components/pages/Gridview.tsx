"use client";
import React from "react";
import { Slot } from "../types";

type SlotMapProps = {
  slots: Slot[];
  onSlotClick: (slotId: string) => void;
}

const Gridview: React.FC<SlotMapProps> = ({ slots, onSlotClick }) => {
  // Helper to determine color based on new rules
  const getSlotColor = (slot: Slot) => {
    // Red: Occupied (any assignedReservationId or offline assigned)
    if (slot.assignedReservationId) return "bg-red-500";
    // Reservation-enabled slots: yellow if actually reserved, otherwise show free (green)
    if (slot.isReservationSlot) {
      return slot.isReserved ? "bg-yellow-400" : "bg-green-500";
    }
    // Green: FREE for non-reservation slots with no assignment
    return "bg-green-500";
  };

  return (
    <div className="p-4">
      <div className="grid md:grid-cols-8 sm:grid-cols-6 gap-3 mb-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => onSlotClick(slot.id)}
            title={(() => {
              if (slot.assignedReservationId) return `${slot.id} (occupied)`
              if (slot.isReservationSlot) return `${slot.id} (reservation-enabled${slot.isReserved ? ' - reserved' : ' - free'})`
              return `${slot.id}`
            })()}
            className={`relative rounded-md p-2 shadow-md cursor-pointer hover:scale-105 transition w-[68px] h-[84px] text-center text-white ${getSlotColor(slot)}`}
          >
            <div className="text-sm font-semibold">{slot.id}</div>
            {slot.isReservationSlot && (
              <div className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs px-1 rounded">R</div>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-3">
        <div className="inline-flex items-center gap-4 text-sm text-white bg-[#071a2b] p-3 rounded-md shadow-md">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-green-500 border border-white/10" /> <span className="text-sm">Free</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-yellow-400 border border-white/10" /> <span className="text-sm">Reserved (online)</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-red-500 border border-white/10" /> <span className="text-sm">Occupied / Checked-in</span></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-sm bg-blue-700 text-white text-xs flex items-center justify-center border border-white/10">R</div> <span className="text-sm">Reservation-enabled slot</span></div>
        </div>
      </div>
    </div>
  );
};

export default Gridview;
