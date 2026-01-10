"use client";

import React from "react";

type BookingStatus = "reserved" | "checked_in" | "checkout";

interface StatusDisplayProps {
  status: BookingStatus;
  locationName?: string;
  slotNumber?: number;
}

export function StatusDisplay({ status, locationName, slotNumber }: StatusDisplayProps) {
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case "reserved":
        return {
          title: "RESERVED - NOT ARRIVED",
          description: "You have not reached the parking location yet.",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/40",
          textColor: "text-blue-300",
          icon: "🚗"
        };
      case "checked_in":
        return {
          title: "CURRENTLY PARKED",
          description: "Your parking timer is running.",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/40",
          textColor: "text-green-300",
          icon: "✅"
        };
      case "checkout":
        return {
          title: "CHECKING OUT",
          description: "Review your final time and total.",
          bgColor: "bg-orange-500/20",
          borderColor: "border-blue-500/40",
          textColor: "text-blue-300",
          icon: "🚗"
        };
      default:
        return {
          title: "UNKNOWN STATUS",
          description: "Please refresh the page.",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/40",
          textColor: "text-gray-300",
          icon: "❓"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-6`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{config.icon}</div>
        <div>
          <h2 className={`text-xl md:text-2xl font-bold ${config.textColor}`}>
            {config.title}
          </h2>
          <p className="text-gray-300 mt-1">{config.description}</p>
        </div>
      </div>

      {locationName && slotNumber && (
        <div className="mt-4 p-4 rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40">
          <div className="text-sm text-gray-300 mb-1">Current Location</div>
          <div className="text-lg font-semibold">
            {locationName} — <span className="text-[#a6c8dd]">Spot {slotNumber}</span>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40">
        <div className="font-semibold mb-2 text-sm">What Happens Next</div>
        {status === "reserved" && (
          <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
            <li>Arrive at parking location</li>
            <li>Show your booking ID to the attendant</li>
            <li>Attendant will check you in and start your timer</li>
            <li>When leaving, notify the attendant for checkout</li>
            <li>Complete payment and get your receipt</li>
          </ol>
        )}
        {status === "checked_in" && (
          <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
            <li>Your parking timer is now running</li>
            <li>When ready to leave, notify the attendant</li>
            <li>Attendant will process your checkout</li>
            <li>Complete payment and get your receipt</li>
          </ol>
        )}
        {status === "checkout" && (
          <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
            <li>Your parking session has ended</li>
            <li>Review your final time and cost</li>
            <li>Complete payment to finish checkout</li>
            <li>You&apos;ll receive a receipt confirmation</li>
          </ol>
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
        <div className="flex items-center gap-2 text-sm text-green-300 mb-2">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 3V5z" 
            />
          </svg>
          <span className="font-semibold">Need Help?</span>
        </div>
        <div className="text-xs text-gray-300 mb-2">
          Having issues? Contact support anytime.
        </div>
        <a 
          href="tel:+918888888888" 
          className="text-xs text-green-400 hover:text-green-300 underline"
        >
          Call +91 8888 888 888
        </a>
      </div>
    </div>
  );
}