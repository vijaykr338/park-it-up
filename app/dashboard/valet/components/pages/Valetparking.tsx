"use client";
import React, { useState } from "react";
import { Scheduleview } from "./Scheduleview";
import Gridview from "./Gridview";
import { slots } from "../utils/Slots";

const Valet_Parking = () => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "schedule">("grid");

  const handleSlotClick = (slotId: string) => {
    setSelectedSlotId(slotId);
    setView("schedule"); 
  };

  return (
   <div className="md:w-[60%] sm:w-full">
      <h1 className="text-4xl font-bold py-2">Valet Parking</h1>
      <select
        className="border border-gray-300 p-2 rounded mb-6"
        onChange={(e) => setView(e.target.value as "grid" | "schedule")}
        value={view}
      >
        <option value="grid">Grid View</option>
        <option value="valet">Schedule View</option>
      </select>

      {view === "grid" ? (
        <Gridview slots={slots} onSlotClick={handleSlotClick}  />
      ) : (
        <Scheduleview selectedSlotId={selectedSlotId} />
      )}
    </div>
  );
};

export default Valet_Parking;

