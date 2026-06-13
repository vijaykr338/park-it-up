import React, { useRef, useEffect, useState } from 'react';
import Image from "next/image";
import { FaStar, FaWalking} from 'react-icons/fa';
import { ParkingSpot } from './features/types';

interface ParkingCarouselProps {
  parkingLocations: ParkingSpot[];
  selectedParking: ParkingSpot | null;
  onParkingSelect: (parking: ParkingSpot) => void;
  onCardTap: (parking: ParkingSpot) => void;
  // onClose is currently unused; keep for future modal handling.
  onClose?: () => void;
}

function ParkingCard({ 
  parking, 
  isSelected, 
  onClick, 
  onTap 
}: { 
  parking: ParkingSpot; 
  isSelected: boolean; 
  onClick: () => void; 
  onTap: () => void; 
}) {
  const fallbackImg = "/car_parking.svg";

  return (
    <div 
      className={`
        flex-none w-48 bg-[#23263a] rounded-xl p-2 border cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-[#60a5fa] shadow-lg shadow-[#60a5fa]/20 scale-105' 
          : 'border-[#374151] hover:border-[#4b5563]'
        }
      `}
      onClick={onClick}
      onDoubleClick={onTap}
    >
      {/* Badges */}
      <div className="mb-1" />

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
      <div className="space-y-1">
        <h4 className="font-semibold text-[#e2e8f0] text-xs leading-tight">
          {parking.name}
        </h4>
        <p className="text-[#9ca3af] text-[10px] truncate">
          {parking.address}
        </p>
        {/* Stats Row */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-[#e2e8f0]">{parking.rating}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <FaWalking className="text-[#9ca3af] text-xs" />
              <span className="text-[#e2e8f0]">{parking.walkingTime} Min</span>
            </div>
          </div>
          <div className="font-medium text-[#cbd5e1]">&nbsp;</div>
        </div>
        <div className="text-center pt-1 border-t border-[#374151]" />
      </div>
    </div>
  );
}

export default function ParkingCarousel({
  parkingLocations,
  selectedParking,
  onParkingSelect,
  onCardTap,
  // onClose is optional and currently unused
}: ParkingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, [parkingLocations]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (parkingLocations.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 bg-[#1a1a1a] backdrop-blur-sm rounded-2xl shadow-2xl border border-[#374151] block md:hidden">
      {/* Carousel Container */}
      <div className="relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#374151] hover:bg-[#4b5563] text-[#e2e8f0] p-2 rounded-full shadow-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#374151] hover:bg-[#4b5563] text-[#e2e8f0] p-2 rounded-full shadow-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Cards */}
        <div 
          ref={scrollRef}
          className="flex gap-4 p-4 overflow-x-auto scrollbar-hide md:scrollbar-thin md:scrollbar-thumb-[#374151] md:scrollbar-track-[#23263a] md:hover:scrollbar-thumb-[#60a5fa]"
          onScroll={checkScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {parkingLocations.map((parking) => (
            <ParkingCard
              key={parking.id}
              parking={parking}
              isSelected={selectedParking?.id === parking.id}
              onClick={() => onParkingSelect(parking)}
              onTap={() => onCardTap(parking)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
