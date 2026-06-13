export interface ParkingSpot {
  id: string;
  source?: 'backend' | 'google-cloud';
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  pricePerHour: number;
  availableSpots: number;
  totalSpots: number;
  rating?: number;
  reviewCount?: number;
  walkingTime?: number;
  walkingDistance?: string;
  photoUrl?: string;
  features?: string[];
  category?: 'best-value' | 'shortest-walk' | 'highest-rated';
  distanceKm?: number;
}

export interface DjangoAPIResponse {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number];
  price_per_hour: number;
  slots: number;
  rating?: number;
  image?: string;
  features?: string[];
  distance_km?: number;
}
