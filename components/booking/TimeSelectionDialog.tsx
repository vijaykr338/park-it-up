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

    // Debug-friendly: keep original list, but allow selecting any slot (no past-time disabling).
    // Generate slots from 8 AM to 11:30 PM.
    for (let hour = 8; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        // Format label
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const minuteStr = minute === 0 ? '' : `:${minute.toString().padStart(2, '0')}`;
        const label = `${displayHour}${minuteStr} ${ampm}`;
        
        slots.push({
          time: timeString,
          label,
          disabled: false,
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
      <DialogContent className="sm:max-w-[500px] bg-[#232834] border-[#4d84a4]/25 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-[#4d84a4]" />
            Select Start Time
          </DialogTitle>
          <p className="text-sm text-gray-300">
            Choose when you want to start parking today
          </p>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={slot.disabled}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${slot.disabled 
                    ? 'bg-[#374151] text-gray-500 cursor-not-allowed' 
                    : selectedTime === slot.time
                      ? 'bg-[#4d84a4] text-white border-2 border-[#4d84a4]'
                      : 'bg-[#0b1320] text-gray-200 border border-[#4d84a4]/30 hover:bg-[#0f1826] hover:border-[#4d84a4]/50'
                  }
                `}
              >
                {slot.label}
              </button>
            ))}
          </div>
          {selectedTime && (
            <div className="mt-4 p-3 bg-[#0b1320] rounded-lg border border-[#4d84a4]/25">
              <p className="text-sm text-gray-300">Selected time:</p>
              <p className="text-lg font-semibold text-white">
                Today at {timeSlots.find(s => s.time === selectedTime)?.label}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 border border-[#4d84a4]/30 rounded-lg text-gray-200 hover:bg-[#0f1826] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTime}
            className={`
              flex-1 px-4 py-2 rounded-lg font-semibold transition-colors
              ${selectedTime 
                ? 'bg-[#4d84a4] text-white hover:brightness-110' 
                : 'bg-[#374151] text-gray-500 cursor-not-allowed'
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
