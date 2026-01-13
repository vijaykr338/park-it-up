"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";

interface TimeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTimeChange: (isoTime: string) => void; // ISO string for today
}

export default function TimeSelectionDialog({
  open,
  onOpenChange,
  onTimeChange,
}: TimeSelectionDialogProps) {
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots: Array<{ time: string; label: string; disabled: boolean }> = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Generate slots from 8 AM to 11:30 PM
    for (let hour = 8; hour <= 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        // Check if this time slot has passed
        const isPast = hour < currentHour || (hour === currentHour && minute <= currentMinute);

        // Format label
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const minuteStr = minute === 0 ? '' : `:${minute.toString().padStart(2, '0')}`;
        const label = `${displayHour}${minuteStr} ${ampm}`;
        
        slots.push({
          time: timeString,
          label,
          disabled: isPast,
        });
      }
    }
    
    return slots;
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const today = new Date();
    today.setHours(hours, minutes, 0, 0);

    onTimeChange(today.toISOString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-[#0a121a] border border-[#4d84a4]/25 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-xl font-semibold">
            <Clock className="h-5 w-5 text-[#4d84a4]" />
            Select Start Time
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Choose when you want to start parking today
          </p>
        </DialogHeader>

        <div className="py-6">
          <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={slot.disabled}
                className={`
                  px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${slot.disabled 
                    ? 'bg-[#1a1f2e]/50 text-gray-600 cursor-not-allowed opacity-50' 
                    : selectedTime === slot.time
                      ? 'bg-[#4d84a4] text-white shadow-lg shadow-[#4d84a4]/30 scale-105'
                      : 'bg-[#151823] text-gray-200 border border-[#4d84a4]/20 hover:bg-[#1e2736] hover:border-[#4d84a4]/40 hover:scale-102'
                  }
                `}
              >
                {slot.label}
              </button>
            ))}
          </div>
          {selectedTime && (
            <div className="mt-6 p-4 bg-[#151823] rounded-xl border border-[#4d84a4]/30">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Selected time</p>
              <p className="text-lg font-semibold text-white">
                Today at {timeSlots.find(s => s.time === selectedTime)?.label}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-5 py-3 border border-[#4d84a4]/30 rounded-xl text-gray-200 font-semibold hover:bg-[#151823] hover:border-[#4d84a4]/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTime}
            className={`
              flex-1 px-5 py-3 rounded-xl font-semibold transition-all
              ${selectedTime 
                ? 'bg-[#4d84a4] text-white hover:brightness-110 shadow-lg shadow-[#4d84a4]/30' 
                : 'bg-[#1a1f2e] text-gray-600 cursor-not-allowed'
              }
            `}
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
