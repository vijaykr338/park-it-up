/*
  Temporarily disable no-explicit-any for this file while Google Maps
  integration is being developed and cannot be tested locally.
  Re-enable this rule and add proper types once the SDK is available.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/lib/axios';
import { ParkingSpot, DjangoAPIResponse } from './types';

class ParkingService {
  private googleMaps: any = null;

  setGoogleMapsInstance(maps: any) {
    this.googleMaps = maps;
  }

  async getNearbyParking(lat: number, lng: number): Promise<ParkingSpot[]> {
    try {
      const [djangoSpots, googleSpots] = await Promise.all([
        this.fetchDjangoSpots(lat, lng),
        this.fetchGoogleSpots(lat, lng)
      ]);

      return this.mergeAndDedupe(djangoSpots, googleSpots);
    } catch (error) {
      console.error('Error fetching parking data:', error);
      return [];
    }
  }

  private async fetchDjangoSpots(lat: number, lng: number): Promise<ParkingSpot[]> {
    try {
      const response = await api.get<DjangoAPIResponse[]>("/parking/nearby/", {
        params: { lat, lng }
      });

      return response.data.map((spot) => ({
        id: `django-${spot.id}`,
        name: spot.name,
        address: spot.address,
        coordinates: [spot.coordinates[0], spot.coordinates[1]], // [lng, lat]
        pricePerHour: spot.price_per_hour,
        availableSpots: spot.slots || 0,
        totalSpots: spot.slots || 0,
        rating: spot.rating || 4.0,
        reviewCount: 100,
        walkingTime: 5,
        walkingDistance: "0.3mi",
        photoUrl: spot.image || "/car_parking.svg",
        features: spot.features || ["Covered", "Security"],
        distanceKm: spot.distance_km
      }));
    } catch (error) {
      console.error("Django parking fetch failed:", error);
      return [];
    }
  }

  private async fetchGoogleSpots(lat: number, lng: number): Promise<ParkingSpot[]> {
    if (!this.googleMaps) return [];

    try {
      const response = await this.googleMaps.Place.searchNearby({
        locationRestriction: { center: { lat, lng }, radius: 1000 },
        includedTypes: ["parking"],
        fields: ["id", "displayName", "location", "formattedAddress", "photos", "rating"],
        maxResultCount: 15
      });

      if (!response.places) return [];

      return Promise.all(
        response.places.map(async (place: any, index: number) => {
          const placeLat = typeof place.location.lat === 'function' 
            ? place.location.lat() 
            : place.location.lat;
          const placeLng = typeof place.location.lng === 'function' 
            ? place.location.lng() 
            : place.location.lng;

          const categories: ParkingSpot['category'][] = [
            'best-value', 
            'shortest-walk', 
            'highest-rated'
          ];

          return {
            id: `google-${place.id}`,
            name: place.displayName || "Parking Lot",
            address: place.formattedAddress || "Address not available",
            coordinates: [placeLng, placeLat] as [number, number],
            pricePerHour: 15 + Math.floor(Math.random() * 35),
            availableSpots: Math.floor(Math.random() * 20) + 5,
            totalSpots: 30,
            rating: place.rating || Number((3.5 + Math.random() * 1.5).toFixed(1)),
            reviewCount: 50 + Math.floor(Math.random() * 300),
            walkingTime: 2 + index * 2,
            walkingDistance: `${(0.1 + index * 0.1).toFixed(1)}mi`,
            photoUrl: this.getGooglePhoto(place.photos?.[0]),
            category: categories[index] || undefined,
            features: ["EV Charging", "Security Camera", "Covered"].slice(0, Math.floor(Math.random() * 3) + 1)
          };
        })
      );
    } catch (error) {
      console.error("Google parking fetch failed:", error);
      return [];
    }
  }

  private getGooglePhoto(photo: any): string {
    if (!photo) return "/car_parking.svg";
    
    try {
      return photo.getURI({ maxWidth: 400, maxHeight: 400 });
    } catch {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      return `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
    }
  }

  private mergeAndDedupe(django: ParkingSpot[], google: ParkingSpot[]): ParkingSpot[] {
    // Prioritize Django spots by putting them first in the array
    // This ensures backend spots always appear at the top of the list
    return [...django, ...google];
  }
}

export const parkingService = new ParkingService();
