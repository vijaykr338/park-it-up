// parking-data-manager.ts

import { ParkingLocation } from './types';
import nehruPlaceData from './nehru-place-parking-cache.json';

export interface LocationDataset {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  data: any[]; // Raw parking data from API
  processed?: ParkingLocation[]; // Processed data
}

export interface ParkingDataManager {
  datasets: LocationDataset[];
  currentDataset: string;
  getAllLocations: () => string[];
  getDataset: (locationId: string) => LocationDataset | undefined;
  setCurrentDataset: (locationId: string) => void;
  getCurrentData: () => ParkingLocation[];
  processRawData: (rawData: any[], locationName: string) => ParkingLocation[];
}

// Initial datasets - you can add more locations here
const INITIAL_DATASETS: LocationDataset[] = [
  {
    id: 'nehru-place',
    name: 'Nehru Place',
    center: { lat: 28.549, lng: 77.25 },
    data: nehruPlaceData,
  },
  // Add more datasets as you get data for other locations
  // {
  //   id: 'connaught-place',
  //   name: 'Connaught Place',
  //   center: { lat: 28.6328, lng: 77.2197 },
  //   data: connaughtPlaceData,
  // },
];

class ParkingDataManagerImpl implements ParkingDataManager {
  public datasets: LocationDataset[] = [];
  public currentDataset: string = 'nehru-place';

  constructor() {
    this.datasets = INITIAL_DATASETS;
    this.processAllDatasets();
  }

  private processAllDatasets() {
    this.datasets = this.datasets.map(dataset => ({
      ...dataset,
      processed: this.processRawData(dataset.data, dataset.name)
    }));
  }

  getAllLocations(): string[] {
    return this.datasets.map(dataset => dataset.id);
  }

  getDataset(locationId: string): LocationDataset | undefined {
    return this.datasets.find(dataset => dataset.id === locationId);
  }

  setCurrentDataset(locationId: string): void {
    const dataset = this.getDataset(locationId);
    if (dataset) {
      this.currentDataset = locationId;
    }
  }

  getCurrentData(): ParkingLocation[] {
    const currentDataset = this.getDataset(this.currentDataset);
    return currentDataset?.processed || [];
  }

  getCurrentCenter(): { lat: number; lng: number } {
    const currentDataset = this.getDataset(this.currentDataset);
    return currentDataset?.center || { lat: 28.549, lng: 77.25 };
  }

  getCurrentLocationName(): string {
    const currentDataset = this.getDataset(this.currentDataset);
    return currentDataset?.name || 'Unknown Location';
  }

  processRawData(rawData: any[], locationName: string): ParkingLocation[] {
    return rawData.map((p: any, index: number): ParkingLocation => {
      const lat = p.geometry.location.lat;
      const lng = p.geometry.location.lng;

      let photoUrl: string | undefined = undefined;
      if (p.photos && p.photos.length > 0 && p.photos[0].photo_reference) {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photos[0].photo_reference}&key=${apiKey}`;
      }

      const basePrice = 15 + Math.floor(Math.random() * 50);
      const rating = p.rating ? Number(p.rating.toFixed(1)) : Number((3.5 + Math.random() * 1.5).toFixed(1));
      const reviewCount = p.user_ratings_total || (50 + Math.floor(Math.random() * 300));
      const walkingTime = 2 + Math.floor(Math.random() * 15);
      const availableSpots = Math.floor(Math.random() * 20);
      const totalSpots = availableSpots + Math.floor(Math.random() * 30);

      let category: ParkingLocation['category'] = undefined;
      if (rating > 4.5) category = 'highest-rated';
      else if (walkingTime < 5) category = 'shortest-walk';
      else if (basePrice < 25) category = 'best-value';

      return {
        id: p.place_id,
        name: p.name || 'Parking Lot',
        address: p.vicinity || 'Address not available',
        price: basePrice,
        rating,
        reviewCount,
        walkingTime,
        walkingDistance: `${(walkingTime * 0.05).toFixed(1)}mi`,
        availableSpots,
        totalSpots,
        location: { lat, lng },
        photoUrl,
        category,
        features: ['Security Camera', 'Covered', 'EV Charging'].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    });
  }

  // Method to add new datasets dynamically
  addDataset(dataset: Omit<LocationDataset, 'processed'>): void {
    const processedDataset: LocationDataset = {
      ...dataset,
      processed: this.processRawData(dataset.data, dataset.name)
    };
    this.datasets.push(processedDataset);
  }

  // Method to remove a dataset
  removeDataset(locationId: string): void {
    this.datasets = this.datasets.filter(dataset => dataset.id !== locationId);
    if (this.currentDataset === locationId && this.datasets.length > 0) {
      this.currentDataset = this.datasets[0].id;
    }
  }

  // Method to get all available location names for display
  getLocationOptions(): { id: string; name: string }[] {
    return this.datasets.map(dataset => ({
      id: dataset.id,
      name: dataset.name
    }));
  }

  // Method to check if a location exists
  hasLocation(locationId: string): boolean {
    return this.datasets.some(dataset => dataset.id === locationId);
  }

  // Method to get statistics about current location
  getCurrentLocationStats(): {
    totalSpots: number;
    averageRating: number;
    priceRange: { min: number; max: number };
  } | null {
    const data = this.getCurrentData();
    if (data.length === 0) return null;

    const totalSpots = data.reduce((sum, p) => sum + p.totalSpots, 0);
    const averageRating = data.reduce((sum, p) => sum + p.rating, 0) / data.length;
    const prices = data.map(p => p.price);
    
    return {
      totalSpots,
      averageRating: Number(averageRating.toFixed(1)),
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    };
  }
}

// Export singleton instance
export const parkingDataManager = new ParkingDataManagerImpl();
