"use client";

import { useState, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import SideBar from "../../components/map/SideBar";
import MapContainer from "../../components/map/MapContainer";
import ParkingCarousel from "../../components/map/ParkingCarousel";
import ParkingDetailModal from "../../components/map/ParkingDetailModal";
import { useQueryParams } from "../../components/map/useQueryParams";

import { ParkingSpot } from "../../components/map/features/types";

export default function MapPage() {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 28.7041,
    lng: 77.1025,
  });
  
  const [activeTab, setActiveTab] = useState<"map" | "list">("list");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedParking, setSelectedParking] = useState<ParkingSpot | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { lat, lng } = useQueryParams();
  
  useEffect(() => {
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      setCenter({ lat: Number(lat), lng: Number(lng) });
    }
  }, [lat, lng]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setActiveTab("list");
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // // Memoized handlePlaceSelect to prevent infinite re-render loop in SideBar
  // const handlePlaceSelect = useCallback((place: PlaceSelect) => {
  //   if (!place.location) return;
  //   const lat = typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat;
  //   const lng = typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng;
  //   setCenter({ lat, lng });
  // }, []);

  // FIXED: This function just sets selected parking - for sidebar detail view
  const handleParkingSelect = (parking: ParkingSpot | null) => {
    if (parking && parking.id) {
      setSelectedParking(parking);
      setCenter({ lat: parking.coordinates[1], lng: parking.coordinates[0] });
      
      // On mobile, switch to map view when selecting from list
      if (isMobile && activeTab === 'list') {
        setActiveTab('map');
      }
      // On desktop, selectedParking will trigger sidebar detail view automatically
    }
  };

  // FIXED: This function opens modal - only for carousel card taps
  const handleParkingCardTap = (parking: ParkingSpot | null) => {
    if (!parking) return;
    setSelectedParking(parking);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedParking(null);
  };

  // FIXED: Handler for closing sidebar detail view (desktop only)
  const handleCloseDetailView = () => {
    setSelectedParking(null);
  };

  // Handler for closing the carousel (deselects parking)
  const handleCloseCarousel = () => {
    setSelectedParking(null);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["places", "marker"]}>
      <div className="fixed inset-0 w-screen h-screen z-0 bg-[linear-gradient(145deg,_#1a1d29_0%,_#1e293b_100%)]">
        
        {/* Mobile Layout */}
        {isMobile && (
          <>
            {/* Full Sidebar for List View */}
            {activeTab === 'list' && (
              <div className="absolute top-0 left-0 z-20 w-full h-full">
                <SideBar 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onParkingSelect={handleParkingCardTap}  // FIXED - Opens modal
                />
              </div>
            )}
            
            {/* Partial Sidebar + Map for Map View */}
            {activeTab === 'map' && (
              <div className="flex flex-col h-full">
                <div className="flex-none z-30 bg-[#151823] border-b border-[#23263a] shadow-lg">
                  <SideBar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onParkingSelect={handleParkingCardTap}  // FIXED - Opens modal
                  />
                </div>
                
                <div className="flex-1 relative">
                  <MapContainer 
                    center={center} 
                    selectedParking={selectedParking}
                    onParkingSelect={handleParkingCardTap}  // FIXED - Opens modal
                  />
                  
                  {/* Swipeable Card Carousel */}
                  <ParkingCarousel 
                    parkingLocations={[]} // Will be populated by SideBar data
                    selectedParking={selectedParking}
                    onParkingSelect={setSelectedParking}
                    onCardTap={handleParkingCardTap}
                    onClose={handleCloseCarousel}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* FIXED: Desktop Layout */}
        {!isMobile && (
          <>
            {/* Sidebar with ParkingDetailModal as panel if selectedParking */}
            <div className="absolute top-6 left-6 z-20 w-[28rem] max-w-full h-auto rounded-2xl overflow-hidden max-h-[92vh] pointer-events-auto bg-transparent">
              {selectedParking ? (
                <ParkingDetailModal 
                  parking={selectedParking}
                  onClose={handleCloseDetailView}
                  isModal={false}
                />
              ) : (
                <SideBar 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onParkingSelect={handleParkingSelect}
                  selectedParking={selectedParking}
                />
              )}
            </div>
            <MapContainer 
              center={center} 
              selectedParking={selectedParking}
              onParkingSelect={handleParkingSelect}
            />
            
            {/* Swipeable Card Carousel for Desktop */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
              <ParkingCarousel 
                parkingLocations={[]} // Will be populated by SideBar data
                selectedParking={selectedParking}
                onParkingSelect={setSelectedParking}
                onCardTap={handleParkingCardTap}
                onClose={handleCloseCarousel}
              />
            </div>
          </>
        )}

        {/* Detail Modal - ONLY FOR MOBILE */}
        {isMobile && showDetailModal && selectedParking && (
          <ParkingDetailModal 
            parking={selectedParking}
            onClose={handleCloseDetailModal}
            isModal={true}
          />
        )}
      </div>
    </APIProvider>
  );
}
