// Re-export the main parking types for convenience
export type { ParkingSpot, DjangoAPIResponse } from '../components/map/features/types';

// Re-export reservation types
export type {
  BookingStatus,
  BookingDetails,
  ParkingTimer,
  BookingState,
  BookingAPIResponse,
  ReservationError
} from '../components/reservation/types/reservation';