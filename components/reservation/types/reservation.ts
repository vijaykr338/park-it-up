// Reservation Manager Types
export type BookingStatus = 'reserved' | 'checked_in' | 'checkout';

export interface BookingDetails {
  id: number;
  start_time: string;
  exit_time: string | null;
  fare: number | null;
  location_name: string;
  vehicle_plate: string;
  slot_number: number;
  hourly_rate: number;
  location_id: number;
  slot_id: number;
}

export interface ParkingTimer {
  startTime: Date;
  currentTime: Date;
  elapsedSeconds: number;
  elapsedMinutes: number;
  elapsedHours: number;
  formattedDuration: string; // "2h 34m"
  currentCost: number;
  hourlyRate: number;
}

export interface BookingState {
  id: number;
  status: BookingStatus;
  startTime: string;
  exitTime: string | null;
  fare: number | null;
  locationName: string;
  vehiclePlate: string;
  slotNumber: number;
  hourlyRate: number;
}

// API Response types
export interface BookingAPIResponse {
  id: number;
  start_time: string;
  exit_time: string | null;
  fare: number | null;
  location_name: string;
  vehicle_plate: string;
  slot_number: number;
  slot_status: string;
  hourly_rate: number;
  location_id: number;
  slot_id: number;
  zone_name?: string; // Optional: Zone name if booking is associated with a zone
}

// Error types
export interface ReservationError {
  message: string;
  code?: string;
  statusCode?: number;
}