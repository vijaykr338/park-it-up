/*
  Temporarily disable no-explicit-any for this file while Google Maps
  integration is being developed and cannot be tested locally.
  Re-enable this rule and add proper types once the SDK is available.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useParkingData } from "./features/useParkingData";
import { ParkingSpot } from "./features/types";
import { useQueryParams } from "./useQueryParams";

interface ParkingMarkerProps {
  parking: ParkingSpot;
  isSelected: boolean;
  onClick: (parking: ParkingSpot) => void;
}

function ParkingMarker({ parking, isSelected, onClick }: ParkingMarkerProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const markerLabel =
    parking.source === 'backend' && parking.totalSpots > 0
      ? `${parking.availableSpots}/${parking.totalSpots}`
      : 'P';

  // Determine background color for a marker.
  //   • Google spots: always blue (sky-600).
  //   • Django (backend) spots: red/yellow/green based on remaining slots.
  const getAvailabilityColor = () => {
    if (!parking.totalSpots) return "bg-green-600"; // fallback
    const ratio = parking.availableSpots / parking.totalSpots;
    if (ratio <= 0.2) return "bg-red-600"; // low availability
    if (ratio <= 0.5) return "bg-yellow-600"; // medium
    return "bg-green-600"; // high
  };

  const getMarkerStyle = () => {
    const baseStyle = isMobile
      ? "rounded-full px-2 py-1 text-[11px] shadow border min-w-[28px] text-center"
      : "rounded-full px-3 py-2 font-bold text-sm shadow-lg border-2 cursor-pointer transition-all duration-200 min-w-[48px] text-center";

    if (isSelected) {
      return `${baseStyle} bg-blue-600 text-white border-blue-400 scale-110 z-50`;
    }

    // Google spots (source !== 'backend') use a consistent blue.
    if (parking.source !== 'backend') {
      return `${baseStyle} bg-sky-600 text-white border-sky-300`;
    }

    // Backend spots get a color based on availability.
    const bg = getAvailabilityColor();
    // Use a matching border color (slightly lighter).
    const border = bg.replace('bg-', 'border-');
    return `${baseStyle} ${bg} text-white ${border}`;
  };

  return (
    <AdvancedMarker
      position={{ lat: parking.coordinates[1], lng: parking.coordinates[0] }}
      onClick={() => onClick(parking)}
      zIndex={isSelected ? 1000 : (parking.category ? 100 : 1)}
    >
      <div className={getMarkerStyle()}>
        <div>{markerLabel}</div>
      </div>
    </AdvancedMarker>
  );
}

export default function MapContainer({
  center,
  selectedParking,
  onParkingSelect,
}: {
  center: { lat: number; lng: number };
  selectedParking?: ParkingSpot | null; // Make optional to match SideBar
  onParkingSelect?: (parking: ParkingSpot | null) => void; // Make optional and accept null
}) {
  // Get coordinates from URL params to stay synced with SideBar
  const { lat, lng } = useQueryParams();
  
  // Use URL coordinates as primary source, fallback to props
  const currentLat = lat && !isNaN(Number(lat)) ? Number(lat) : center?.lat || 28.7041;
  const currentLng = lng && !isNaN(Number(lng)) ? Number(lng) : center?.lng || 77.1025;
  
  // Initialize map center with validation
  const [mapCenter, setMapCenter] = useState({ 
    lat: currentLat, 
    lng: currentLng 
  });
  
  // Shared data source with SideBar
  const { data: parkingSpots = [], isLoading, error } = useParkingData(currentLat, currentLng);

  // Update map center when URL params change
  useEffect(() => {
    const newLat = lat && !isNaN(Number(lat)) ? Number(lat) : center?.lat || 28.7041;
    const newLng = lng && !isNaN(Number(lng)) ? Number(lng) : center?.lng || 77.1025;
    
    setMapCenter({ lat: newLat, lng: newLng });
  }, [lat, lng, center]);

  // Handle user panning/zooming the map
  const handleCameraChange = (event: any) => {
    if (event.detail?.center) {
      const newCenter = event.detail.center;
      const lat = typeof newCenter.lat === "function" ? newCenter.lat() : newCenter.lat;
      const lng = typeof newCenter.lng === "function" ? newCenter.lng() : newCenter.lng;
      
      // Only update if we get valid numbers
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      }
    }
  };

  if (error) {
    console.error('Map loading error:', error);
  }

  return (
    <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
      center={mapCenter}
      defaultZoom={14}
      onCameraChanged={handleCameraChange}
      style={{ width: '100%', height: '100%' }}
      gestureHandling={'greedy'}
      className="w-full h-full rounded-xl"
    >
      {!isLoading && parkingSpots.map((parking) => (
        <ParkingMarker
          key={parking.id}
          parking={parking}
          isSelected={selectedParking?.id === parking.id}
          onClick={(parking) => onParkingSelect?.(parking)}
        />
      ))}
    </Map>
  );
}
