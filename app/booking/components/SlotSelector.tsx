"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useBooking from './useBooking';

interface ParkingSlot {
  id: string;
  status: 'available' | 'occupied' | 'reserved';
  row: number;
  column: 'left' | 'right';
  price?: number;
}

interface SlotSelectorProps {
  onSelect?: (slotId: string | null) => void;
  initialSelected?: string | null;
}

// Generate parking slots with better layout
const generateParkingSlots = (): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];
  
  // Left side slots (P1-P5)
  for (let i = 0; i < 5; i++) {
    slots.push({
      id: `P${i + 1}`,
      status: 'available',
      row: i,
      column: 'left',
      price: 50
    });
  }
  
  // Right side slots (P6-P10) - some occupied for demo
  for (let i = 0; i < 5; i++) {
    slots.push({
      id: `P${i + 6}`,
      status: [0, 3].includes(i) ? 'occupied' : 'available', // P6 and P9 occupied
      row: i,
      column: 'right',
      price: 50
    });
  }
  
  return slots;
};

const SlotSelector: React.FC<SlotSelectorProps> = ({ onSelect, initialSelected }) => {
  const { slotId, setSlotId } = useBooking();
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    slotId ?? initialSelected ?? null
  );
  const [showUnavailableDialog, setShowUnavailableDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parkingSlots = useMemo(() => generateParkingSlots(), []);

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status !== 'available') {
      setShowUnavailableDialog(true);
      return;
    }
    
    setSelectedSlot(slot.id);
    setSlotId(slot.id);
    onSelect?.(slot.id);
  };

  const handleContinue = async () => {
    if (!selectedSlot) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/booking');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSlotStatusColor = (slot: ParkingSlot, isSelected: boolean) => {
    if (isSelected) return 'border-4 border-[#18a0ff] bg-[#e6f7ff] shadow-lg';
    if (slot.status === 'occupied') return 'border-2 border-red-500 bg-red-100';
    return 'border-2 border-gray-400 bg-white hover:border-[#18a0ff] hover:bg-[#e6f7ff]';
  };

  const getSlotStatusIcon = (status: ParkingSlot['status']) => {
    switch (status) {
      case 'occupied':
        return (
          <div className="absolute inset-1 flex items-center justify-center pointer-events-none z-20">
            <img src="/gaadi.png" alt="car" className="w-28 h-16 object-contain" />
          </div>
        );
      case 'available':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Choose Your Parking Spot
          </h2>
        </div>

        {/* Parking Layout */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4">
            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-500 rounded"></div>
                <span className="text-gray-800 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                <span className="text-red-700 font-medium">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#e6f7ff] border-4 border-[#18a0ff] rounded"></div>
                <span className="text-[#18a0ff] font-semibold">Selected</span>
              </div>
            </div>

            {/* Parking Grid */}
            <div className="space-y-3">
              <div className="text-center text-xs text-gray-500 font-medium mb-2">
                ↑ ENTRANCE
              </div>
              
              {/* Render each row */}
              {[0, 1, 2, 3, 4].map((row) => {
                const leftSlot = parkingSlots.find(s => s.row === row && s.column === 'left');
                const rightSlot = parkingSlots.find(s => s.row === row && s.column === 'right');
                
                return (
                  <div key={row} className="flex items-center gap-4 justify-center">
                    {/* Left slot */}
                    <button
                      onClick={() => leftSlot && handleSlotClick(leftSlot)}
                      disabled={leftSlot?.status !== 'available'}
                      className={`
                        relative w-28 h-20 rounded-lg transition-all duration-200
                        flex items-center justify-center text-base font-bold
                        ${leftSlot ? getSlotStatusColor(leftSlot, selectedSlot === leftSlot.id) : ''}
                        ${leftSlot?.status === 'available' ? 'cursor-pointer' : 'cursor-not-allowed'}
                        disabled:opacity-60
                      `}
                    >
                      <span className="z-10 text-gray-900">
                        {leftSlot?.id}
                      </span>
                      {leftSlot && getSlotStatusIcon(leftSlot.status)}
                      {selectedSlot === leftSlot?.id && (
                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#18a0ff] border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">✓</span>
                        </div>
                      )}
                    </button>

                    {/* Right slot */}
                    <button
                      onClick={() => rightSlot && handleSlotClick(rightSlot)}
                      disabled={rightSlot?.status !== 'available'}
                      className={`
                        relative w-28 h-20 rounded-lg transition-all duration-200
                        flex items-center justify-center text-base font-bold
                        ${rightSlot ? getSlotStatusColor(rightSlot, selectedSlot === rightSlot.id) : ''}
                        ${rightSlot?.status === 'available' ? 'cursor-pointer' : 'cursor-not-allowed'}
                        disabled:opacity-60
                      `}
                    >
                      <span className="z-10 text-gray-900">
                        {rightSlot?.id}
                      </span>
                      {rightSlot && getSlotStatusIcon(rightSlot.status)}
                      {selectedSlot === rightSlot?.id && (
                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#18a0ff] border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
              
              <div className="text-center text-xs text-gray-500 font-medium mt-2">
                ↓ EXIT
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Selected: {' '}
              <span className="font-semibold text-gray-900">
                {selectedSlot || 'None'}
              </span>
             
            </div>
            
            <button
              onClick={handleContinue}
              disabled={!selectedSlot || isLoading}
              className="
                px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Continue to Checkout'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Unavailable Dialog */}
      {showUnavailableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Slot Unavailable
              </h3>
              <p className="text-gray-600 mb-6">
                This parking spot is currently occupied. Please choose another available slot.
              </p>
              <button
                onClick={() => setShowUnavailableDialog(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
