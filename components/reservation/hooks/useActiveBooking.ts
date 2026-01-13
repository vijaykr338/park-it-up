"use client";

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) return null;
          const errorObj: ReservationError = {
            message: error.message || 'Failed to fetch active booking',
            code: 'NETWORK_ERROR',
            statusCode: error.response?.status
          };
          throw errorObj;
        }

        const fallbackError: ReservationError = {
          message: (error as Error).message || 'Failed to fetch active booking',
          code: 'NETWORK_ERROR',
          statusCode: undefined
        };
        throw fallbackError;
      }
    },
    refetchInterval: 7000, // Poll every 7 seconds
    refetchIntervalInBackground: false, // Pause when tab is not active
    refetchOnWindowFocus: true,
    staleTime: 5000, // Consider data fresh for 5 seconds
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
    meta: {
      // Suppress error logging for 404s in dev tools
      errorBoundary: false,
    }
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