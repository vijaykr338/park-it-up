/**
 * Booking flow types - covering zone selection and slot picking
 */

export type SlotStatus = "free" | "reserved" | "occupied";

export interface Zone {
  id: number;
  name: string;
  description: string | null;
  parking_location: number;
  total_slots: number;
  available_slots: number;
  reserved_slots: number;
  occupied_slots: number;
  images: ZoneImage[];
}

export interface ParkingSlot {
  id: number;
  number: number;
  zone: number;
  zone_name: string;
  parking_lot: number;
  status: SlotStatus;
  status_display: string;
}

export interface ZoneImage {
  id: number;
  zone: number;
  image: string;
  caption: string | null;
  is_primary: boolean;
}

export interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  parkingSlots: number;
  hourly_rate: number;
  images: ParkingImage[];
}

export interface ParkingImage {
  id: number;
  parking_location_id: number;
  image: string;
}

export interface ZonesListResponse {
  location_id: number;
  location_name: string;
  total_zones: number;
  zones: Zone[];
}

export interface SlotsListResponse {
  zone_id: number;
  zone_name: string;
  description: string | null;
  total_slots: number;
  available_slots: number;
  reserved_slots: number;
  occupied_slots: number;
  slots: ParkingSlot[];
}
