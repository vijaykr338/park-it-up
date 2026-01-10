"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { BookingAPIResponse, ReservationError } from '@/components/reservation/types/reservation';

export interface UseActiveBookingReturn {
  activeBooking: BookingAPIResponse | null;
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}

export function useActiveBooking(): UseActiveBookingReturn {
  const {
    data: activeBooking,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['active-booking'],
    queryFn: async (): Promise<BookingAPIResponse | null> => {
      try {
        const response = await api.get('/booking/my-active-booking/');
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number }; message?: string };
        // If no active booking found (404), return null instead of throwing
        if (axiosError.response?.status === 404) {
          return null;
        }
        
        // For other errors, throw them
        const errorObj: ReservationError = {
          message: axiosError.message || 'Failed to fetch active booking',
          code: 'NETWORK_ERROR',
          statusCode: axiosError.response?.status
        };
        throw errorObj;
      }
    },
    refetchInterval: 7000, // Poll every 7 seconds
    refetchIntervalInBackground: false, // Pause when tab is not active
    refetchOnWindowFocus: true,
    retry: (failureCount, error: unknown) => {
      const err = error as ReservationError;
      // Don't retry on 404 (no active booking)
      if (err?.statusCode === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const error: ReservationError | null = queryError ? {
    message: (queryError as ReservationError).message || 'Unknown error occurred',
    code: (queryError as ReservationError).code,
    statusCode: (queryError as ReservationError).statusCode
  } : null;

  return {
    activeBooking: activeBooking || null,
    isLoading,
    error,
    refetch
  };
}