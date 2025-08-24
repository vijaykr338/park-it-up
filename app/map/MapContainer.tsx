import { useState, useEffect, useCallback } from "react";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { ParkingLocation } from "./types";

const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

interface ParkingMarkerProps {
  parking: ParkingLocation;
  isSelected: boolean;
  onClick: (parking: ParkingLocation) => void;
}

function ParkingMarker({ parking, isSelected, onClick }: ParkingMarkerProps) {
  // Responsive: smaller marker for mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
      const handleResize = () => setIsMobile(window.innerWidth < 640);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getMarkerStyle = () => {
    const baseStyle = isMobile
      ? "rounded px-1.5 py-0.5 text-xs shadow border min-w-[24px] text-center"
      : "rounded-xl px-3 py-2 font-bold text-sm shadow-lg border-2 cursor-pointer transition-all duration-200 min-w-[50px] text-center";
    
    if (isSelected) {
      return `${baseStyle} bg-blue-600 text-white border-blue-400 scale-110 z-50`;
    }
    
    switch (parking.category) {
      case 'best-value':
        return `${baseStyle} bg-green-600 text-white border-green-400`;
      case 'shortest-walk':
        return `${baseStyle} bg-orange-600 text-white border-orange-400`;
      case 'highest-rated':
        return `${baseStyle} bg-purple-600 text-white border-purple-400`;
      default:
        return `${baseStyle} bg-white text-gray-800 border-gray-300`;
    }
  };

  const getCategoryLabel = () => {
    switch (parking.category) {
      case 'best-value':
        return 'Best Value';
      case 'shortest-walk':
        return 'Shortest Walk';
      case 'highest-rated':
        return 'Highest Rated';
      default:
        return null;
    }
  };

  return (
    <AdvancedMarker
      position={parking.location}
      onClick={() => onClick(parking)}
      zIndex={isSelected ? 1000 : parking.category ? 100 : 1}
    >
      <div className="flex flex-col items-center">
        {parking.category && (
          <div className="bg-black text-white text-xs px-2 py-1 rounded mb-1 whitespace-nowrap">
            {getCategoryLabel()}
          </div>
        )}
        
        <div className={getMarkerStyle()}>
          ₹{parking.price}
        </div>
        
        {parking.availableSpots <= 3 && parking.availableSpots > 0 && (
          <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mt-1">
            {parking.availableSpots} left
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}

export default function MapContainer({ 
  center, 
  parkingLocations, 
  selectedParking, 
  onParkingSelect 
}: { 
  center: { lat: number; lng: number };
  parkingLocations: ParkingLocation[];
  selectedParking: ParkingLocation | null;
  onParkingSelect: (parking: ParkingLocation) => void;
}) {
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  const handleCameraChange = (event: { detail?: { center?: { lat: number; lng: number } } }) => {
    if (event.detail && event.detail.center) {
      setMapCenter({
        lat: event.detail.center.lat,
        lng: event.detail.center.lng
      });
    }
  };

  const handleParkingClick = useCallback((parking: ParkingLocation) => {
    onParkingSelect(parking);
  }, [onParkingSelect]);

  return (
    <div className="relative w-full h-full">
      <Map
        center={mapCenter}
        defaultZoom={16}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        colorScheme="DARK" // Enable dark mode
        style={{ width: "100%", height: "100%" }}
        mapId={mapId}
        onCameraChanged={handleCameraChange}
      >
        {parkingLocations.map((parking) => (
          <ParkingMarker
            key={parking.id}
            parking={parking}
            isSelected={selectedParking?.id === parking.id}
            onClick={handleParkingClick}
          />
        ))}
      </Map>
    </div>
  );
}
