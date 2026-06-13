import React, { useState } from "react";
import {
  FaStar,
  FaWalking,
  FaParking,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import { ParkingSpot } from "./features/types";
import Image from "next/image";

interface ParkingDetailModalProps {
  parking: ParkingSpot;
  onClose: () => void;
  isModal?: boolean;
}

export default function ParkingDetailModal({
  parking,
  onClose,
  isModal = true,
}: ParkingDetailModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mock photos for carousel
  const photos = [
    parking.photoUrl || "/car_parking.svg",
    "/car_parking.svg",
    "/car_parking.svg",
    "/car_parking.svg",
    "/car_parking.svg",
  ];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div
      className={
        isModal
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          : "w-full h-full bg-[#181c23] rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh]"
      }
    >
      <div
        className={
          isModal
            ? "bg-[#181c23] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-y-auto max-h-[95vh] relative"
            : "w-full h-full p-0 m-0"
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <FaParking className="text-[#60a5fa] text-xl" />
            <h2 className="text-lg font-semibold text-[#e2e8f0]">
              Parking Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#374151] rounded-full transition-colors text-[#9ca3af] hover:text-[#e2e8f0]"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="px-4 pt-4" />

        {/* Photo Carousel */}
        <div className="relative px-4 pt-2">
          <div className="w-full h-48 rounded-xl overflow-hidden bg-[#2a3441] border border-[#374151] mb-6">
            <Image
              src={photos[currentPhotoIndex]}
              alt={parking.name}
              width={400}
              height={192}
              className="object-cover w-full h-full opacity-60"
              unoptimized
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#23263a] p-2 rounded-full text-[#e2e8f0] hover:bg-[#374151]"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#23263a] p-2 rounded-full text-[#e2e8f0] hover:bg-[#374151]"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
          {photos.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentPhotoIndex ? "bg-[#60a5fa]" : "bg-[#4b5563]"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Parking Details */}
        <div className="px-4 py-4 space-y-4">
          <div>
            <h3 className="font-bold text-[#e2e8f0] text-xl leading-tight mb-1">
              {parking.name}
            </h3>
            <p className="text-[#94a3b8] text-sm mb-2">{parking.address}</p>
            <div className="flex items-center gap-4 text-xs mb-2">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="text-[#e2e8f0]">{parking.rating}</span>
                <span className="text-[#94a3b8]">({parking.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <FaWalking className="text-[#9ca3af]" />
                <span className="text-[#e2e8f0]">
                  {parking.walkingTime} Min
                </span>
                <span className="text-[#94a3b8]">
                  ({parking.walkingDistance})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaParking className="text-[#60a5fa]" />
                <span className="font-medium text-[#e2e8f0]">
                  {parking.source === 'backend'
                    ? `${parking.availableSpots}/${parking.totalSpots || parking.availableSpots} Slots`
                    : 'Parking Spot'}
                </span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <div className="text-[#e2e8f0] font-semibold mb-2">Amenities</div>
            <div className="flex flex-wrap gap-2 text-[#94a3b8] text-sm">
              {[
                "Valet",
                "Garage - Covered",
                "On-Site Staff",
                "Wheelchair Accessible",
              ].map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-[#23263a] px-2 py-1 rounded"
                >
                  <FaShieldAlt className="text-[#60a5fa]" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
