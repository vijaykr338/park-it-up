import React from 'react';
import { FaStar, FaWalking, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import Image from "next/image";
import { ParkingSpot } from './features/types';

interface ParkingBottomSheetProps {
  parking: ParkingSpot;
  onClose: () => void;
}

export default function ParkingBottomSheet({ parking, onClose }: ParkingBottomSheetProps) {
  const fallbackImg = "/car_parking.svg";

  return (
    // Fixed: Proper positioning and z-index for bottom sheet
    <div className="fixed inset-0 z-[2000] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Bottom Sheet Content */}
      <div className="relative bg-[#1a1a1a] w-full max-w-md mx-4 mb-4 rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-[#2d2d2d] hover:bg-[#374151] text-[#e2e8f0] p-2 rounded-full transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4" />

          {/* Parking Image */}
          <div className="mb-2">
            <Image
              src={parking.photoUrl || fallbackImg}
              alt={parking.name}
              width={192}
              height={80}
              className="w-full h-20 object-cover rounded-lg"
              unoptimized
            />
          </div>

          {/* Parking Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#e2e8f0] mb-2">{parking.name}</h3>
              <p className="text-[#9ca3af] flex items-center gap-2">
                <FaMapMarkerAlt className="text-sm" />
                {parking.address}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-[#e2e8f0]">{parking.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaWalking className="text-[#9ca3af]" />
                  <span className="text-[#e2e8f0]">{parking.walkingTime} min</span>
                </div>
              </div>
              <div className="font-medium text-[#cbd5e1]">
                {parking.source === 'backend'
                  ? `${parking.availableSpots}/${parking.totalSpots || parking.availableSpots} slots`
                  : 'Parking spot'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
