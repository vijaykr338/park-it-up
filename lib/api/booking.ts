import axiosInstance from "@/lib/axios";

export interface BookingCreatePayload {
  vehicle_id: number;
  location_id: number;
  slot_id?: number;
  start_time: string;
}

export interface BookingResponse {
  id: number;
  start_time: string;
  exit_time: string | null;
  fare: string | null;
  status: string;
  location_name: string;
  vehicle_plate: string;
  slot_number: number;
  slot_status: string;
  zone_name: string;
  hourly_rate: string;
}

export const bookingApi = {
  createBooking: (payload: BookingCreatePayload) =>
    axiosInstance.post<BookingResponse>("/booking/create/", payload),
};
