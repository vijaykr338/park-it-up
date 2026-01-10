"use client";

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import type { BookingAPIResponse, BookingStatus, ReservationError } from '@/components/reservation/types/reservation';

export interface UseBookingStatusOptions {
  bookingId: string | null;
  enabled?: boolean;
  onError?: (error: ReservationError) => void;
  onStatusChange?: (status: BookingStatus) => void;
}

export interface UseBookingStatusReturn {
  booking: BookingAPIResponse | null;
  status: BookingStatus;
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}

export function useBookingStatus({
  bookingId,
  enabled = true,
  onError,
  onStatusChange
}: UseBookingStatusOptions): UseBookingStatusReturn {
  const router = useRouter();
  const previousStatusRef = useRef<BookingStatus | null>(null);

  const {
    data: booking,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['booking-status', bookingId],
    queryFn: async (): Promise<BookingAPIResponse> => {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      try {
        const response = await api.get(`/booking/my-bookings/${bookingId}/`);
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number }; message?: string };
        // Handle specific error cases
        if (axiosError.response?.status === 404) {
          const errorObj: ReservationError = {
            message: 'Booking not found',
            code: 'BOOKING_NOT_FOUND',
            statusCode: 404
          };
          onError?.(errorObj);
          // Redirect to user bookings page for invalid booking
          router.push('/user-bookings');
          throw errorObj;
        }

        if (axiosError.response?.status === 403) {
          const errorObj: ReservationError = {
            message: 'Access denied to this booking',
            code: 'ACCESS_DENIED',
            statusCode: 403
          };
          onError?.(errorObj);
          // Redirect to user bookings page for unauthorized access
          router.push('/user-bookings');
          throw errorObj;
        }

        // Network or other errors
        const errorObj: ReservationError = {
          message: axiosError.message || 'Failed to fetch booking status',
          code: 'NETWORK_ERROR',
          statusCode: axiosError.response?.status
        };
        onError?.(errorObj);
        throw errorObj;
      }
    },
    enabled: enabled && !!bookingId,
    refetchInterval: 7000, // Poll every 7 seconds as per requirements
    refetchIntervalInBackground: false, // Pause when tab is not active
    refetchOnWindowFocus: true,
    retry: (failureCount, error: unknown) => {
      const err = error as ReservationError;
      // Don't retry on 404 or 403 errors
      if (err?.statusCode === 404 || err?.statusCode === 403) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Determine booking status based on slot status and exit time
  const status: BookingStatus = booking?.exit_time 
    ? 'checkout' 
    : booking?.slot_status === 'occupied'
      ? 'checked_in' 
      : 'reserved';

  // Handle status changes - only call when status actually changes
  React.useEffect(() => {
    if (booking && onStatusChange && previousStatusRef.current !== status) {
      previousStatusRef.current = status;
      onStatusChange(status);
    }
  }, [status, booking, onStatusChange]);

  // Note: Removed automatic redirect to receipt page
  // Users now need to manually click "Pay Now" button when status is checkout

  const error: ReservationError | null = queryError ? {
    message: (queryError as ReservationError).message || 'Unknown error occurred',
    code: (queryError as ReservationError).code,
    statusCode: (queryError as ReservationError).statusCode
  } : null;

  return {
    booking: booking || null,
    status,
    isLoading,
    error,
    refetch
  };
}

// Import React for useEffect and useRef
import React, { useRef } from 'react';