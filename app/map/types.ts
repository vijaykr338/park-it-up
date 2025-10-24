// types.ts


export interface ParkingPlace {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  priceLevel?: number;
  location: { lat: number; lng: number };
  photoUrl?: string;
}

export interface PlaceSelect {
  name?: string;
  location: {
    lat: () => number;
    lng: () => number;
  } | {
    lat: number;
    lng: number;
  };
  formatted_address?: string;
  place_id?: string;
}

export interface AutocompleteSuggestion {
  placePrediction: {
    text: { text: string };
    placeId: string; // Ensure we get placeId for detail lookups
    structuredFormat?: {
      secondaryText: { text: string };
    };
  };
}
