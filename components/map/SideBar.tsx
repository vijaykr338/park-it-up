'use client';

import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useParkingData } from "./features/useParkingData";
import { ParkingSpot, isBookableSpot } from "./features/types";
import { useQueryParams } from "./useQueryParams";
import MapContainer from "./MapContainer";
import { useAuthStore } from "@/lib/auth-store";
import AuthModal from "@/components/ui/AuthModal";
import "./sidebar-scroll.css";

const CATEGORY_BADGES: Record<string, { label: string; color: string }> = {
  "best-value": { label: "Best Value", color: "bg-green-600" },
  "shortest-walk": { label: "Shortest Walk", color: "bg-orange-600" },
  "highest-rated": { label: "Highest Rated", color: "bg-purple-600" }
};

const formatPlaceName = (value?: string | null) => {
  if (!value) return "";
  return value
    .split(/\s+/)
    .map((segment) => {
      if (!segment) return "";
      return `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`;
    })
    .join(" ")
    .trim();
};

const renderCategoryBadge = (category?: string, extraClass = "") => {
  if (!category) return null;
  const badge = CATEGORY_BADGES[category];
  if (!badge) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.05em] px-2 py-0.5 rounded-full ${badge.color} ${extraClass}`.trim()}
    >
      {badge.label}
    </span>
  );
};

// Types for Google Places Autocomplete
interface AutocompleteSuggestion {
  placePrediction: {
    text: { text: string };
    structuredFormat?: {
      secondaryText: { text: string };
    };
  };
}

interface SideBarProps {
  onParkingSelect?: (parking: ParkingSpot | null) => void;
  selectedParking?: ParkingSpot | null;
  activeTab?: 'list' | 'map';
  setActiveTab?: (tab: 'list' | 'map') => void;
}

// Enhanced Parking Detail Component for Desktop
function EnhancedParkingDetail({
  parking,
  onClose
}: {
  parking: ParkingSpot;
  onClose: () => void;
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuthenticated = !!useAuthStore((state) => state.access);

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // If authenticated, proceed with booking
    window.location.href = `/booking/select-spot?location=${String(parking.id).replace(/^django-/, "")}`;
  };
  const fallbackImg = "/car_parking.svg";

  const categoryBadge = renderCategoryBadge(parking.category);


  return (
    <div className="h-full bg-[#151823] flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-[#374151]">
        <button onClick={onClose} className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-[#e2e8f0]">Parking Details</h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {categoryBadge && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categoryBadge}
          </div>
        )}

        <div className="w-full h-48 rounded-xl overflow-hidden bg-[#2a3441] border border-[#374151] mb-6">
          <Image
            src={parking.photoUrl || fallbackImg}
            alt="Parking"
            width={400}
            height={192}
            className="object-cover w-full h-full opacity-60"
          />
        </div>

        <h3 className="font-bold text-[#e2e8f0] text-2xl leading-tight mb-3">
          {formatPlaceName(parking.name)}
        </h3>
        <p className="text-[#94a3b8] text-base mb-6">
          {parking.address}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#2a3441] rounded-xl p-4 border border-[#374151]">
            <div className="text-2xl font-bold text-[#e2e8f0] mb-1">★ {parking.rating}</div>
            <div className="text-sm text-[#94a3b8]">Rating</div>
          </div>
          <div className="bg-[#2a3441] rounded-xl p-4 border border-[#374151]">
            <div className="text-2xl font-bold text-[#e2e8f0] mb-1">{parking.walkingTime || '5'} Min</div>
            <div className="text-sm text-[#94a3b8]">Walk Distance</div>
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
              <div className="text-3xl font-bold text-[#e2e8f0]">₹{parking.pricePerHour}</div>
              <div className="text-sm text-[#94a3b8]">Per Hour</div>
            </div>
          </div>
          {/* Conditional Reserve Button - Only for Backend Spots */}
          {isBookableSpot(parking) ? (
            <button
              onClick={handleReserveClick}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Reserve This Spot
            </button>
          ) : (
            <div className="w-full bg-[#374151] text-[#94a3b8] py-4 rounded-xl font-bold text-base text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span>📍</span>
                <span>Reference Only</span>
              </div>
              <div className="text-xs opacity-75">
                Booking not available for this location
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

// SideBar Header Component
function SideBarHeader({
  isMobile,
  tab,
  setTab
}: {
  isMobile: boolean;
  tab: 'list' | 'map';
  setTab: (tab: 'list' | 'map') => void;
}) {
  return (
    <>
      <h2 className="text-lg sm:text-xl font-bold text-[#e2e8f0] mb-2 sm:mb-4">
        Find Your Perfect Spot
      </h2>
      {isMobile && (
        <div className="mb-2 flex justify-center gap-1 bg-[#2a2f3e] rounded-lg p-0.5">
          <button
            className={`flex-1 px-2 py-2 rounded-md font-semibold text-xs transition-all duration-200 ${tab === 'list'
              ? 'bg-[#3b82f6] text-white shadow-sm'
              : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            onClick={() => setTab('list')}
          >
            📋 List View
          </button>
          <button
            className={`flex-1 px-2 py-2 rounded-md font-semibold text-xs transition-all duration-200 ${tab === 'map'
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
  locations: ParkingSpot[];
  onSelect: (location: ParkingSpot) => void;
  selectedId?: string;
}) {
  const fallbackImg = "/car_parking.svg";

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar space-y-3">
      {locations.length === 0 && (
        <div className="text-[#94a3b8] text-center py-12">
          <div className="text-4xl mb-4">🅿️</div>
          <div className="text-lg font-medium mb-2">No Parking Found</div>
          <div className="text-sm">Try Searching For A Different Location</div>
        </div>
      )}
      {locations.map((location) => (
        <div
          key={location.id}
          className={`bg-[#23263a] rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 px-3 py-2 ${selectedId === location.id
            ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/30 bg-[#334155]'
            : 'border-[#374151] hover:border-[#3b82f6]/50'
            } ${isMobile ? 'min-h-0' : 'p-5'}`}
          onClick={() => onSelect(location)}
        >
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
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-bold text-[#e2e8f0] text-sm leading-tight truncate">
                {formatPlaceName(location.name)}
              </h3>
              {(isBookableSpot(location) || location.category) && (
                <div className="ml-auto flex flex-wrap items-center gap-1">
                  {isBookableSpot(location) && (
                    <span className="bg-[#60a5fa] text-white text-[10px] font-semibold tracking-[0.05em] px-2 py-0.5 rounded-full">
                      BOOKABLE
                    </span>
                  )}
                  {renderCategoryBadge(location.category)}
                </div>
              )}
            </div>
            <div className="text-xs text-[#94a3b8] truncate mb-1">{location.address}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#f59e0b] font-medium">★ {location.rating}</span>
              <span className="text-[#3b82f6] font-medium">{location.walkingTime || '5'} Min</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-[#e2e8f0]">₹{location.pricePerHour}</div>
            <div className="text-xs text-[#94a3b8]">/Hr</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SideBar({
  onParkingSelect,
  selectedParking,
  activeTab,
  setActiveTab
}: SideBarProps) {
  const places = useMapsLibrary("places");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current location from URL - CRITICAL INTEGRATION POINT
  const { lat, lng } = useQueryParams();

  // Validate and convert lat/lng to safe numbers
  const safeLat = lat && !isNaN(Number(lat)) ? Number(lat) : 28.7041;
  const safeLng = lng && !isNaN(Number(lng)) ? Number(lng) : 77.1025;

  // Fetch parking data based on URL coordinates - SHARED WITH MAPCONTAINER
  const { data: parkingSpots = [], isLoading, error } = useParkingData(safeLat, safeLng);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [internalTab, setInternalTab] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tab = isMobile ? (activeTab ?? internalTab) : 'list';
  const setTab = isMobile ? (setActiveTab ?? setInternalTab) : () => { };

  // Handle autocomplete input changes
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);

    if (!places || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const { suggestions: autocompleteSuggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        locationBias: { lat: 28.7041, lng: 77.1025 },
        includedPrimaryTypes: ["establishment", "geocode"],
        language: "en",
        region: "IN"
      });

      setSuggestions((autocompleteSuggestions || []).filter(s => s.placePrediction !== null) as AutocompleteSuggestion[]);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle location selection from autocomplete - THIS UPDATES URL FOR MAPCONTAINER
  const handleSuggestionClick = async (suggestion: AutocompleteSuggestion) => {
    if (!places) return;

    try {
      const { places: placeResults } = await places.Place.searchByText({
        textQuery: suggestion.placePrediction.text.text,
        fields: ["id", "displayName", "location", "formattedAddress"],
        locationBias: { lat: 28.7041, lng: 77.1025 }
      });

      if (!placeResults || placeResults.length === 0 || !placeResults[0].location) {
        setShowSuggestions(false);
        return;
      }

      const center = placeResults[0].location;
      const newLat = typeof center.lat === 'function' ? center.lat() : center.lat;
      const newLng = typeof center.lng === 'function' ? center.lng() : center.lng;

      // Update URL with new coordinates - MAPCONTAINER WILL AUTOMATICALLY UPDATE
      const params = new URLSearchParams(searchParams);
      params.set('lat', newLat.toString());
      params.set('lng', newLng.toString());
      params.set('name', placeResults[0].displayName || '');

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      // Clear search and hide suggestions
      setInputValue(placeResults[0].displayName || "");
      setShowSuggestions(false);

    } catch (error) {
      console.error("Error in handleSuggestionClick:", error);
      setShowSuggestions(false);
    }
  };

  if (error) {
    return (
      <aside className="sidebar-outer bg-red-50 flex items-center justify-center">
        <div className="text-red-600">Error loading parking data</div>
      </aside>
    );
  }

  // Desktop detail view
  if (!isMobile && selectedParking) {
    return (
      <aside className="h-full max-h-full sm:max-h-[92vh] w-full flex-none bg-[#151823] rounded-2xl shadow-2xl flex flex-col border border-[#23263a] relative overflow-hidden">
        <div className="transform transition-transform duration-300 ease-in-out translate-x-0">
          <EnhancedParkingDetail
            parking={selectedParking}
            onClose={() => onParkingSelect?.(null)}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full max-h-full sm:max-h-[92vh] w-full flex-none bg-[#151823] rounded-2xl shadow-2xl flex flex-col px-6 py-6 border border-[#23263a] relative">
      <SideBarHeader isMobile={isMobile} tab={tab} setTab={setTab} />

      {/* Location Search Bar */}
      <div className="mb-6 relative">
        <div className="flex items-center bg-[#2a2f3e] rounded-xl px-3 py-2 border border-[#374151] focus-within:ring-2 focus-within:ring-[#3b82f6]/60 focus-within:border-[#3b82f6]/60 transition-all">
          <FaSearch className="text-[#94a3b8] w-4 h-4 mr-2" />
          <input
            type="text"
            value={inputValue}
            placeholder="Search new location..."
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="bg-transparent outline-none text-[#e2e8f0] placeholder-[#94a3b8] flex-1 text-sm"
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2f3e] border border-[#374151] rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="p-4 hover:bg-[#374151] cursor-pointer text-[#e2e8f0] border-b border-[#374151] last:border-b-0 transition-colors"
              >
                <div className="font-medium">
                  {suggestion.placePrediction?.text?.text || 'Unknown'}
                </div>
                {suggestion.placePrediction?.structuredFormat?.secondaryText && (
                  <div className="text-sm text-[#94a3b8] mt-1">
                    {suggestion.placePrediction.structuredFormat.secondaryText.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count and Sort */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-[#94a3b8] text-sm">
          {isLoading ? 'Loading...' : `${parkingSpots.length} spots found`}
        </div>
        <select className="bg-[#2a2f3e] text-[#e2e8f0] border border-[#374151] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/60">
          <option value="popularity">Sort by Popularity</option>
          <option value="price">Sort by Price</option>
          <option value="distance">Sort by Distance</option>
        </select>
      </div>

      {/* Content based on tab */}
      <div className="sidebar-content">
        {tab === 'list' && (
          <EnhancedParkingList
            locations={parkingSpots}
            onSelect={(parking) => onParkingSelect?.(parking)}
            selectedId={selectedParking?.id}
          />
        )}

        {tab === 'map' && (
          <div className="sidebar-scrollable h-[60vh]">
            <MapContainer
              center={{ lat: safeLat, lng: safeLng }}
              selectedParking={selectedParking}
              onParkingSelect={onParkingSelect}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
