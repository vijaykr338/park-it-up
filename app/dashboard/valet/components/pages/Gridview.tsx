"use client";
import React from "react";

import { Slot } from "../types";

type SlotMapProps = {
  slots: Slot[];
  onSlotClick: (slotId: string) => void;
};

const getColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "reserved":
      return "bg-green-400";
    case "reserved not checked in":
      return "bg-orange-400";
    case "overstay":
      return "bg-red-400";
    case "inactive":
    default:
      return "bg-gray-200";
  }
};

const Gridview: React.FC<SlotMapProps> = ({ slots, onSlotClick }) => {
  return (
    <div className="p-10">
      <div className="grid md:grid-cols-8 sm:grid-cols-6 gap-4 mb-6">
        {slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => onSlotClick(slot.id)}
            className={`rounded-md p-4 shadow-md cursor-pointer hover:scale-105 transition w-[80px] h-[100px] text-center text-white ${getColor(
              slot.status
            )}`}
          >
            {slot.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gridview;
