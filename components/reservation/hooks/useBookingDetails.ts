"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { BookingAPIResponse, ReservationError } from "@/components/reservation/types/reservation";

export interface UseBookingDetailsReturn {
  booking: BookingAPIResponse | null;
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}

export function useBookingDetails(bookingId: string | null): UseBookingDetailsReturn {
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["booking-details", bookingId],
    queryFn: async (): Promise<BookingAPIResponse> => {
      if (!bookingId) {
        throw new Error("Booking ID is required");
      }

      try {
        const response = await api.get(`/booking/my-bookings/${bookingId}/`);
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number }; message?: string };
        if (axiosError.response?.status === 404) {
          const err: ReservationError = {
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
            statusCode: 404,
          };
          throw err;
        }
        if (axiosError.response?.status === 403) {
          const err: ReservationError = {
            message: "Access denied",
            code: "ACCESS_DENIED",
            statusCode: 403,
          };
          throw err;
        }
        const err: ReservationError = {
          message: axiosError.message || "Failed to fetch booking details",
          code: "NETWORK_ERROR",
          statusCode: axiosError.response?.status,
        };
        throw err;
      }
    },
    enabled: !!bookingId,
    retry: 1,
  });

  const error: ReservationError | null = queryError
    ? {
        message: (queryError as ReservationError).message || "Unknown error",
        code: (queryError as ReservationError).code,
        statusCode: (queryError as ReservationError).statusCode,
      }
    : null;

  return {
    booking: data || null,
    isLoading,
    error,
    refetch,
  };
}
