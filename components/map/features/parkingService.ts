/*
  Temporarily disable no-explicit-any for this file while Google Maps
  integration is being developed and cannot be tested locally.
  Re-enable this rule and add proper types once the SDK is available.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parkingApi } from "@/lib/api/parking";
import { ParkingSpot } from "./types";

class ParkingService {
  private googleMaps: any = null;

  setGoogleMapsInstance(maps: any) {
    this.googleMaps = maps;
  }

  async getNearbyParking(lat: number, lng: number): Promise<ParkingSpot[]> {
    try {
      const [djangoSpots, googleSpots] = await Promise.all([
        this.fetchDjangoSpots(lat, lng),
        this.fetchGoogleSpots(lat, lng),
      ]);

      return this.mergeAndDedupe(djangoSpots, googleSpots);
    } catch (error) {
      console.error("Error fetching parking data:", error);
      return [];
    }
  }

  private async fetchDjangoSpots(
    lat: number,
    lng: number,
  ): Promise<ParkingSpot[]> {
    try {
      const response = await parkingApi.nearby(lat, lng);

      // Keep only spots that provide valid coordinates.
      const filtered = response.data.filter((spot) => {
        const withinRadius = Number(spot.distance_km ?? Infinity) <= 5;

        if (!withinRadius) {
          return false;
        }

        if (typeof spot.location === "string") {
          return true;
        }

        const coords = spot.location?.coordinates;
        return coords && coords.length >= 2;
      });

      const extractCoords = (location: any): [number, number] | null => {
        if (typeof location === "string") {
          const match = location.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);

          if (!match) return null;

          return [
            parseFloat(match[1]), // lng
            parseFloat(match[2]), // lat
          ];
        }

        return location?.coordinates ?? null;
      };

      // Log how many Django spots were fetched (no distance filtering).
      console.log("Django spots fetched (valid coordinates):", filtered.length);

      const djangoSpots = filtered.map((spot) => {
        const coords = extractCoords(spot.location)!;

        const availableSpots = Number(spot.available_slots ?? spot.slots ?? 0);
        const totalSpots = Number(spot.total_slots ?? spot.slots ?? 0);

        return {
          id: `django-${spot.id}`,
          source: "backend",
          name: spot.name,
          address: spot.address ?? "",
          coordinates: [coords[0], coords[1]],
          pricePerHour: Number(spot.hourly_rate ?? 0),
          availableSpots,
          totalSpots,
          rating: 4.0,
          reviewCount: 0,
          walkingTime: 5,
          walkingDistance: "0.3mi",
          photoUrl: spot.images?.[0]?.picture_link || "/car_parking.svg",
          features: ["Covered", "Security"],
          distanceKm: Number(spot.distance_km ?? Infinity),
        } as ParkingSpot;
      });
      return djangoSpots;
    } catch (error) {
      console.error("Django parking fetch failed:", error);
      return [];
    }
  }

  private async fetchGoogleSpots(
    lat: number,
    lng: number,
  ): Promise<ParkingSpot[]> {
    if (!this.googleMaps) return [];

    try {
      const response = await this.googleMaps.Place.searchNearby({
        locationRestriction: { center: { lat, lng }, radius: 1000 },
        includedTypes: ["parking"],
        fields: [
          "id",
          "displayName",
          "location",
          "formattedAddress",
          "photos",
          "rating",
        ],
        maxResultCount: 15,
      });

      if (!response.places) return [];

      return Promise.all(
        response.places.map(async (place: any, index: number) => {
          const placeLat =
            typeof place.location.lat === "function"
              ? place.location.lat()
              : place.location.lat;
          const placeLng =
            typeof place.location.lng === "function"
              ? place.location.lng()
              : place.location.lng;

          const categories: ParkingSpot["category"][] = [
            "best-value",
            "shortest-walk",
            "highest-rated",
          ];

          return {
            id: `google-${place.id}`,
            source: "google-cloud",
            name: place.displayName || "Parking Lot",
            address: place.formattedAddress || "Address not available",
            coordinates: [placeLng, placeLat] as [number, number],
            pricePerHour: 15 + Math.floor(Math.random() * 35),
            availableSpots: Math.floor(Math.random() * 20) + 5,
            totalSpots: 30,
            rating:
              place.rating || Number((3.5 + Math.random() * 1.5).toFixed(1)),
            reviewCount: 50 + Math.floor(Math.random() * 300),
            walkingTime: 2 + index * 2,
            walkingDistance: `${(0.1 + index * 0.1).toFixed(1)}mi`,
            photoUrl: this.getGooglePhoto(place.photos?.[0]),
            category: categories[index] || undefined,
            features: ["EV Charging", "Security Camera", "Covered"].slice(
              0,
              Math.floor(Math.random() * 3) + 1,
            ),
          };
        }),
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

  private mergeAndDedupe(
    django: ParkingSpot[],
    google: ParkingSpot[],
  ): ParkingSpot[] {
    // Combine both sources and sort purely by distance. Backend spots will naturally
    // appear first when they are closer, but we no longer force backend to win.
    return [...django, ...google].sort((a, b) => {
      const aDist = a.distanceKm ?? Number.POSITIVE_INFINITY;
      const bDist = b.distanceKm ?? Number.POSITIVE_INFINITY;
      return aDist - bDist;
    });
  }
}

export const parkingService = new ParkingService();
