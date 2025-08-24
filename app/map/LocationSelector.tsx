// LocationSelector.tsx
import React from 'react';
import { parkingDataManager } from './parking-data-manager';

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (locationId: string) => void;
  className?: string;
}

export default function LocationSelector({ currentLocation, onLocationChange, className = '' }: LocationSelectorProps) {
  const locations = parkingDataManager.datasets;

  if (locations.length <= 1) {
    return null; // Don't show selector if only one location
  }

  return (
    <div className={`location-selector ${className}`}>
      <select
        value={currentLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="w-full p-2 bg-[#1a1d29] border border-[#23263a] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
}
