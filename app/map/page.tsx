"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import SideBar from "./SideBar";
import MapContainer from "./MapContainer";
import ParkingCarousel from "./ParkingCarousel";
import ParkingDetailModal from "./ParkingDetailModal";
import LocationSelector from "./LocationSelector";
import { useQueryParams } from "./useQueryParams";
import { ParkingLocation, PlaceSelect } from "./types";
import { parkingDataManager } from './parking-data-manager';

export default function MapPage() {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 28.549, // Default to Nehru Place
    lng: 77.25,
  });
  
  const [activeTab, setActiveTab] = useState<"map" | "list">("list");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedParking, setSelectedParking] = useState<ParkingLocation | null>(null);
  
  const [currentLocation, setCurrentLocation] = useState<string>(parkingDataManager.currentDataset);
  const [allParkingData, setAllParkingData] = useState<ParkingLocation[]>([]);
  const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>([]); // This is the filtered list
  
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { lat, lng } = useQueryParams();
  
  useEffect(() => {
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      setCenter({ lat: Number(lat), lng: Number(lng) });
    }
  }, [lat, lng]);

  // Load data for the current location
  useEffect(() => {
    const loadLocationData = () => {
      parkingDataManager.setCurrentDataset(currentLocation);
      const processedData = parkingDataManager.getCurrentData();
      const locationCenter = parkingDataManager.getCurrentCenter();
      
      setAllParkingData(processedData);
      setParkingLocations(processedData);
      
      // Update center to the new location's center if not overridden by URL params
      if (!lat || !lng) {
        setCenter(locationCenter);
      }
    };

    loadLocationData();
  }, [currentLocation, lat, lng]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
        if (window.innerWidth < 640) setActiveTab("list");
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const handleLocationChange = useCallback((locationId: string) => {
    setCurrentLocation(locationId);
    setSelectedParking(null); // Clear selected parking when changing location
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setParkingLocations(allParkingData);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const filtered = allParkingData.filter(p => 
      p.name.toLowerCase().includes(lowerCaseQuery) ||
      p.address.toLowerCase().includes(lowerCaseQuery)
    );
    setParkingLocations(filtered);
  }, [allParkingData]);

  const handleParkingSelect = (parking: ParkingLocation) => {
    if (parking && parking.id) {
      setSelectedParking(parking);
      setCenter(parking.location);
      
      if (isMobile && activeTab === 'list') {
        setActiveTab('map');
      }
    }
  };

  const handleParkingCardTap = (parking: ParkingLocation) => {
    setSelectedParking(parking);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedParking(null);
  };

  const handleCloseDetailView = () => {
    setSelectedParking(null);
  };

  const handleCloseCarousel = () => {
    setSelectedParking(null);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["places", "marker"]}>
      <div className="fixed inset-0 w-screen h-screen z-0 bg-[linear-gradient(145deg,_#1a1d29_0%,_#1e293b_100%)]">
        
        {isMobile && (
          <>
            {activeTab === 'list' && (
              <div className="absolute top-0 left-0 z-20 w-full h-full">
                <SideBar 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  partialMode={false}
                  onParkingSelect={handleParkingCardTap}
                  parkingLocations={parkingLocations}
                  onSearch={handleSearch}
                  currentLocation={currentLocation}
                  onLocationChange={handleLocationChange}
                />
              </div>
            )}
            
            {activeTab === 'map' && (
              <div className="flex flex-col h-full">
                <div className="flex-none z-30 bg-[#151823] border-b border-[#23263a] shadow-lg">
                  <SideBar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    partialMode={true}
                    onParkingSelect={handleParkingCardTap}
                    parkingLocations={parkingLocations}
                    onSearch={handleSearch}
                    currentLocation={currentLocation}
                    onLocationChange={handleLocationChange}
                  />
                </div>
                
                <div className="flex-1 relative">
                  <MapContainer 
                    center={center} 
                    parkingLocations={parkingLocations}
                    selectedParking={selectedParking}
                    onParkingSelect={handleParkingCardTap}
                  />
                  
                  {parkingLocations.length > 0 && (
                    <ParkingCarousel 
                      parkingLocations={parkingLocations}
                      selectedParking={selectedParking}
                      onParkingSelect={setSelectedParking}
                      onCardTap={handleParkingCardTap}
                      onClose={handleCloseCarousel}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!isMobile && (
          <>
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
                  partialMode={false}
                  onParkingSelect={handleParkingSelect}
                  selectedParking={selectedParking}
                  onCloseDetail={handleCloseDetailView}
                  parkingLocations={parkingLocations}
                  onSearch={handleSearch}
                  currentLocation={currentLocation}
                  onLocationChange={handleLocationChange}
                />
              )}
            </div>
            <MapContainer 
              center={center} 
              parkingLocations={parkingLocations}
              selectedParking={selectedParking}
              onParkingSelect={handleParkingSelect}
            />
            
            {parkingLocations.length > 0 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                <ParkingCarousel 
                  parkingLocations={parkingLocations}
                  selectedParking={selectedParking}
                  onParkingSelect={setSelectedParking}
                  onCardTap={handleParkingCardTap}
                  onClose={handleCloseCarousel}
                />
              </div>
            )}
          </>
        )}

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
