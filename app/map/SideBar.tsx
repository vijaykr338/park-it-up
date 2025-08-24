import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import "./sidebar-scrollbar.css";
import { ParkingLocation } from "./types";
import LocationSelector from "./LocationSelector";

interface SideBarProps {
  activeTab?: 'list' | 'map';
  setActiveTab?: (tab: 'list' | 'map') => void;
  partialMode?: boolean;
  onParkingSelect?: (parking: ParkingLocation) => void;
  selectedParking?: ParkingLocation | null;
  onCloseDetail?: () => void;
  parkingLocations?: ParkingLocation[];
  onSearch?: (query: string) => void;
  currentLocation?: string;
  onLocationChange?: (locationId: string) => void;
}

function EnhancedParkingDetail({
  parking,
  onClose
}: {
  parking: ParkingLocation & { photoUrls?: string[] };
  onClose: () => void;
}) {
  const fallbackImg = "/car_parking.svg";

  const getAvailabilityColor = () => {
    if (parking.availableSpots <= 3) return 'text-red-400';
    if (parking.availableSpots <= 8) return 'text-orange-400';
    return 'text-green-400';
  };

  const getAvailabilityText = () => {
    if (parking.availableSpots <= 3) return `${parking.availableSpots} left`;
    if (parking.availableSpots <= 8) return 'Limited availability';
    return 'Available';
  };

  const getCategoryBadge = () => {
    if (!parking.category) return null;
    const badges: Record<string, { label: string; color: string }> = {
      'best-value': { label: 'Best Value', color: 'bg-green-600' },
      'shortest-walk': { label: 'Shortest Walk', color: 'bg-orange-600' },
      'highest-rated': { label: 'Highest Rated', color: 'bg-purple-600' }
    };
    const badge = badges[parking.category] || null;
    return badge ? (
      <div className={`inline-flex items-center px-2 py-1 rounded text-white text-xs font-medium ${badge.color} mb-3`}>
        {badge.label}
      </div>
    ) : null;
  };

  const images: string[] = Array.isArray(parking.photoUrls) && parking.photoUrls.length > 0
    ? parking.photoUrls
    : parking.photoUrl ? [parking.photoUrl] : [];

  return (
    <div className="h-full bg-[#151823] flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-[#374151]">
        <button
          onClick={onClose}
          className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-[#e2e8f0]">Parking Details</h2>
      </div>
      <div className="flex-1 overflow-y-auto sidebar-scrollbar p-6">
        {getCategoryBadge()}
        {images.length > 0 ? (
          <div className="w-full h-48 rounded-xl overflow-x-auto flex gap-4 bg-[#2a3441] border border-[#374151] mb-6">
            {images.map((img, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={idx}
                src={img}
                alt={parking.name}
                className="object-cover w-64 h-48 rounded-xl flex-shrink-0"
                onError={e => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== fallbackImg) target.src = fallbackImg;
                }}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-48 rounded-xl overflow-hidden bg-[#2a3441] border border-[#374151] mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fallbackImg} alt="Parking" className="object-cover w-full h-full opacity-60" />
          </div>
        )}
        <h3 className="font-bold text-[#e2e8f0] text-2xl leading-tight mb-3">
          {parking.name}
        </h3>
        <p className="text-[#94a3b8] text-base mb-6">
          {parking.address}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#2a3441] rounded-xl p-4 border border-[#374151]">
            <div className="text-2xl font-bold text-[#e2e8f0] mb-1">★ {parking.rating}</div>
            <div className="text-sm text-[#94a3b8]">{parking.reviewCount} reviews</div>
          </div>
          <div className="bg-[#2a3441] rounded-xl p-4 border border-[#374151]">
            <div className="text-2xl font-bold text-[#e2e8f0] mb-1">{parking.walkingTime} min</div>
            <div className="text-sm text-[#94a3b8]">walk distance</div>
          </div>
        </div>
        <div className="bg-[#2a3441] rounded-xl p-4 border border-[#374151] mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[#e2e8f0] font-medium">Availability</span>
            <span className={`font-bold ${getAvailabilityColor()}`}>
              {getAvailabilityText()}
            </span>
          </div>
        </div>
        {parking.features && parking.features.length > 0 && (
          <div className="mb-8">
            <h4 className="text-[#e2e8f0] font-semibold mb-3">Features</h4>
            <div className="space-y-2">
              {parking.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#2a3441] text-[#e2e8f0] text-sm px-3 py-2 rounded-lg border border-[#374151]"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-[#2a3441] rounded-xl p-6 border border-[#374151]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-[#e2e8f0]">₹{parking.price}</div>
              <div className="text-sm text-[#94a3b8]">per hour</div>
            </div>
          </div>
          <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl">
            Reserve This Spot
          </button>
        </div>
      </div>
    </div>
  );
}

// Extract the heading and tabs into a new component
function SideBarHeader({ 
  isMobile, 
  tab, 
  setTab, 
  partialMode 
}: { 
  isMobile: boolean, 
  tab: 'list' | 'map', 
  setTab: (tab: 'list' | 'map') => void,
  partialMode?: boolean 
}) {
  return (
    <>
      {!partialMode && (
        <h2 className="text-lg sm:text-xl font-bold text-[#e2e8f0] mb-2 sm:mb-4">
          Find Your Perfect Spot
        </h2>
      )}
      {/* Enhanced tabs for mobile */}
      {isMobile && (
        <div className="mb-2 flex justify-center gap-1 bg-[#2a2f3e] rounded-lg p-0.5">
          <button
            className={`flex-1 px-2 py-2 rounded-md font-semibold text-xs transition-all duration-200 ${
              tab === 'list' 
                ? 'bg-[#3b82f6] text-white shadow-sm' 
                : 'text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
            onClick={() => setTab('list')}
          >
            📋 List View
          </button>
          <button
            className={`flex-1 px-2 py-2 rounded-md font-semibold text-xs transition-all duration-200 ${
              tab === 'map' 
                ? 'bg-[#3b82f6] text-white shadow-sm' 
                : 'text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
            onClick={() => setTab('map')}
          >
            🗺️ Map View
          </button>
        </div>
      )}
    </>
  );
}

// Enhanced Parking List Component
function EnhancedParkingList({ 
  locations, 
  onSelect,
  selectedId 
}: { 
  locations: ParkingLocation[], 
  onSelect: (location: ParkingLocation) => void,
  selectedId?: string
}) {
  const fallbackImg = "/car_parking.svg";

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'best-value':
        return <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Best Value</span>;
      case 'shortest-walk':
        return <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">Shortest Walk</span>;
      case 'highest-rated':
        return <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Highest Rated</span>;
      default:
        return null;
    }
  };

  const getAvailabilityColor = (available: number) => {
    if (available <= 3) return 'text-red-400';
    if (available <= 8) return 'text-orange-400';
    return 'text-green-400';
  };

  const getAvailabilityText = (available: number) => {
    if (available <= 3) return `${available} left`;
    if (available <= 8) return 'Limited';
    return 'Available';
  };

  // Responsive: compact card for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar space-y-3">
      {locations.length === 0 && (
        <div className="text-[#94a3b8] text-center py-12">
          <div className="text-4xl mb-4">🅿️</div>
          <div className="text-lg font-medium mb-2">No parking found</div>
          <div className="text-sm">Try a different search term.</div>
        </div>
      )}
      {locations.map((location) => (
        <div
          key={location.id}
          className={`bg-[#23263a] rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 px-3 py-2 ${
            selectedId === location.id 
              ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/30 bg-[#334155]' 
              : 'border-[#374151] hover:border-[#3b82f6]/50'
          } ${isMobile ? 'min-h-0' : 'p-5'}`}
          onClick={() => onSelect(location)}
        >
          {/* Parking image */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#374151] bg-[#23263a]">
            <Image
              src={location.photoUrl || fallbackImg}
              alt={location.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#e2e8f0] text-sm leading-tight truncate">
                {location.name}
              </h3>
              {location.category && getCategoryBadge(location.category)}
            </div>
            <div className="text-xs text-[#94a3b8] truncate mb-1">{location.address}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#f59e0b] font-medium">★ {location.rating}</span>
              <span className="text-[#3b82f6] font-medium">{location.walkingTime} min</span>
              <span className={`font-medium ${getAvailabilityColor(location.availableSpots)}`}>{getAvailabilityText(location.availableSpots)}</span>
            </div>
          </div>
          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-[#e2e8f0]">₹{location.price}</div>
            <div className="text-xs text-[#94a3b8]">/hr</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SideBar({
  activeTab,
  setActiveTab,
  partialMode = false,
  onParkingSelect,
  selectedParking,
  onCloseDetail,
  parkingLocations: parkingLocationsProp = [],
  onSearch,
  currentLocation,
  onLocationChange
}: SideBarProps) {
  const [inputValue, setInputValue] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [internalTab, setInternalTab] = useState<'list' | 'map'>('list');
  const tab = isMobile ? (activeTab ?? internalTab) : 'list';
  const setTab = isMobile ? (setActiveTab ?? setInternalTab) : () => { };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    onSearch?.(query);
  };

  const handleEnhancedParkingSelect = (location: ParkingLocation) => {
    onParkingSelect?.(location);
  };

  const handleCloseDetail = () => {
    onCloseDetail?.();
  };

  if (partialMode) {
    return (
      <div className="w-full bg-[#151823] px-6 py-4 rounded-t-2xl">
        <SideBarHeader isMobile={isMobile} tab={tab} setTab={setTab} partialMode={true} />
        
        {/* Location Selector */}
        {currentLocation && onLocationChange && (
          <div className="mb-3">
            <LocationSelector 
              currentLocation={currentLocation}
              onLocationChange={onLocationChange}
              className="mb-3"
            />
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center bg-[#2a2f3e] rounded-2xl px-5 py-4 border border-[#374151] focus-within:ring-2 focus-within:ring-[#3b82f6]/60 focus-within:border-[#3b82f6]/60 transition-all">
            <FaSearch className="text-[#94a3b8] w-5 h-5 mr-4" />
            <input
              type="text"
              value={inputValue}
              placeholder="Search parking..."
              onChange={handleInputChange}
              className="bg-transparent outline-none text-[#e2e8f0] placeholder-[#94a3b8] flex-1 text-base"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isMobile && selectedParking) {
    return (
      <aside className="h-full max-h-full sm:max-h-[92vh] w-full flex-none bg-[#151823] rounded-2xl shadow-2xl flex flex-col border border-[#23263a] relative overflow-hidden">
        <div className="transform transition-transform duration-300 ease-in-out translate-x-0">
          <EnhancedParkingDetail
            parking={selectedParking}
            onClose={handleCloseDetail}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full max-h-full sm:max-h-[92vh] w-full flex-none bg-[#151823] rounded-2xl shadow-2xl flex flex-col px-6 py-6 border border-[#23263a] relative">
      <SideBarHeader isMobile={isMobile} tab={tab} setTab={setTab} partialMode={false} />
      
      {/* Location Selector */}
      {currentLocation && onLocationChange && (
        <div className="mb-4">
          <LocationSelector 
            currentLocation={currentLocation}
            onLocationChange={onLocationChange}
          />
        </div>
      )}
      
      <div className="mb-6 relative">
        <div className="flex items-center bg-[#2a2f3e] rounded-xl px-3 py-2 border border-[#374151] focus-within:ring-2 focus-within:ring-[#3b82f6]/60 focus-within:border-[#3b82f6]/60 transition-all">
          <FaSearch className="text-[#94a3b8] w-4 h-4 mr-2" />
          <input
            type="text"
            value={inputValue}
            placeholder="Search parking..."
            onChange={handleInputChange}
            className="bg-transparent outline-none text-[#e2e8f0] placeholder-[#94a3b8] flex-1 text-sm"
          />
        </div>
      </div>
      {(tab === 'list') && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div className="text-[#94a3b8] text-sm">
              {parkingLocationsProp.length} spots found
            </div>
            <select className="bg-[#2a2f3e] text-[#e2e8f0] border border-[#374151] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/60">
              <option value="popularity">Sort by Popularity</option>
              <option value="price">Sort by Price</option>
              <option value="distance">Sort by Distance</option>
            </select>
          </div>
          <EnhancedParkingList
            locations={parkingLocationsProp}
            onSelect={handleEnhancedParkingSelect}
            selectedId={selectedParking?.id}
          />
        </>
      )}
    </aside>
  );
}
