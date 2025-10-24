import { useQuery } from '@tanstack/react-query';
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect } from 'react';
import { parkingService } from './parkingService';
import { ParkingSpot } from './types';
import api from '@/lib/axios'; 

export function useParkingData(lat?: number, lng?: number) {
  const googleMaps = useMapsLibrary("places");

  // Set Google Maps instance when available
  useEffect(() => {
    if (googleMaps) {
      parkingService.setGoogleMapsInstance(googleMaps);
    }
  }, [googleMaps]);

  return useQuery<ParkingSpot[]>({
    queryKey: ['parking', lat, lng],
    queryFn: () => parkingService.getNearbyParking(lat!, lng!),
    enabled: !!lat && !!lng && !!googleMaps,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Fix the type issue by making the return type nullable
export function useParkingDetails(parkingId?: string) {
  return useQuery<ParkingSpot | null>({ // Change to nullable type
    queryKey: ['parking-details', parkingId],
    queryFn: async (): Promise<ParkingSpot | null> => { // Explicit return type
      // If it's a Django spot, fetch detailed info
      if (parkingId?.startsWith('django-')) {
        const id = parkingId.replace('django-', '');
        try {
          const response = await api.get(`/parking/${id}/`);
          return {
            id: parkingId,
            name: response.data.name,
            address: response.data.address,
            coordinates: response.data.coordinates,
            pricePerHour: response.data.price_per_hour,
            availableSpots: response.data.slots || 0,
            totalSpots: response.data.total_slots || response.data.slots || 0,
            rating: response.data.rating || 4.0,
            photoUrl: response.data.image || "/car_parking.svg",
            features: response.data.features || ["Covered", "Security"],
          };
        } catch (error) {
          console.error('Error fetching parking details:', error);
          return null;
        }
      }
      // For Google spots, return null since we don't have detailed API
      return null;
    },
    enabled: !!parkingId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
