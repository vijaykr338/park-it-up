"use client";
import React, { useEffect, useRef } from "react";
import { slots } from "../utils/Slots";

type Props = {
  selectedSlotId: string | null;
};

export const Scheduleview: React.FC<Props> = ({ selectedSlotId }) => {
  const slotRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  useEffect(() => {
    if (selectedSlotId && slotRefs.current[selectedSlotId]) {
      slotRefs.current[selectedSlotId]?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [selectedSlotId]);

  const timeLabels = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00",
  ];

  const displayTime = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour === 0) return "12 A.M.";
    if (hour < 12) return `${hour} A.M.`;
    if (hour === 12) return "12 P.M.";
    return `${hour - 12} P.M.`;
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
        return "bg-white";
    }
  };

  return (
   <div className="mt-2 w-full">
  <div className=" overflow-x-auto">
    <table className="table-fixed w-full border-collapse text-center bg-white">
      <thead>
        <tr className="h-[50px]">
          <th
            className="border-b border-b-black border-r border-r-black bg-white sticky left-0 z-10 w-[100px] min-w-[100px] p-2"
          ></th>
          {slots.map((slot) => (
            <th
              key={slot.id}
              ref={(el) => (slotRefs.current[slot.id] = el)}
              className={`border-b border-b-black border-r border-r-black text-xs w-[80px] min-w-[80px] max-w-[80px] p-2 ${
                selectedSlotId === slot.id ? "bg-yellow-300" : "bg-white"
              }`}
            >
              Slot {slot.id}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeLabels.map((time) => (
          <tr key={time} className="h-[50px]">
            <td className="border-b border-b-black border-r border-r-black font-semibold text-sm bg-white sticky left-0 z-10 w-[100px] min-w-[100px] p-2">
              {displayTime(time)}
            </td>
            {slots.map((slot) => {
              const status = slot.schedule?.[time] || "";
              const bgColor = getColor(status);
              return (
                <td
                  key={`${slot.id}-${time}`}
                  className={`border border-black text-xs text-black w-[80px] min-w-[80px] max-w-[80px] h-[50px] p-1 ${bgColor}`}
                >
                  {status || " "}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


  );
};
