import axiosInstance from "@/lib/axios";

export type ParkingLocationSummary = {
  id: number;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  hourly_rate: string;
  images: Array<{ id: number; picture_link: string | null }>;
  // added by NearbyParkingView
  distance_km?: number;
};

export type SlotAvailability = {
  location: string;
  location_id: number;
  availability: {
    total: number;
    free: number;
    reserved: number;
    occupied: number;
  };
  slots: Array<{
    id: number;
    number: string;
    status: string;
    zone: number;
  }>;
};

export const parkingApi = {
  nearby: (lat: number, lng: number) =>
    axiosInstance.get<ParkingLocationSummary[]>("/parking/nearby/", {
      params: { lat, lng },
    }),

  locationDetail: (id: number) =>
    axiosInstance.get<ParkingLocationSummary>(`/parking/${id}/`),

  locationSlots: (locationId: number, page?: number) =>
    axiosInstance.get<SlotAvailability>(`/parking/locations/${locationId}/slots/`, {
      params: page ? { page } : undefined,
    }),
};
