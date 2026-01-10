"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { BookingAPIResponse, ReservationError } from '@/components/reservation/types/reservation';

export interface UseAllBookingsReturn {
  bookings: BookingAPIResponse[];
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}

export function useAllBookings(): UseAllBookingsReturn {
  const {
    data: bookings,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: async (): Promise<BookingAPIResponse[]> => {
      try {
        const response = await api.get('/booking/my-bookings/');
        return response.data || [];
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number }; message?: string };
        const errorObj: ReservationError = {
          message: axiosError.message || 'Failed to fetch bookings',
          code: 'NETWORK_ERROR',
          statusCode: axiosError.response?.status
        };
        throw errorObj;
      }
    },
    retry: (failureCount) => {
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const error: ReservationError | null = queryError ? {
    message: queryError.message || 'Unknown error occurred',
    code: (queryError as ReservationError).code,
    statusCode: (queryError as ReservationError).statusCode
  } : null;

  return {
    bookings: bookings || [],
    isLoading,
    error,
    refetch
  };
}