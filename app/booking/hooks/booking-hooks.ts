/**
 * Custom hooks for parking zone and slot selection
 * Handles data fetching with React Query + axios
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { ParkingLocation, ZonesListResponse, SlotsListResponse } from "@/app/booking/booking-types";

const QUERY_KEYS = {
  location: (id: string | number | null) => ["parking-location", id] as const,
  zones: (locationId: string | number | null) => ["parking-zones", locationId] as const,
  slots: (zoneId: string | number | null) => ["parking-slots", zoneId] as const,
};

export const extractErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
  if (isAxiosError(error)) {
    return (error.response?.data as { detail?: string } | undefined)?.detail || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

/**
 * Fetch parking location details
 */
export const useParkingLocation = (
  locationId: string | number | null
): UseQueryResult<ParkingLocation, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.location(locationId),
    queryFn: async () => {
      const res = await api.get<ParkingLocation>(`/parking/${locationId}/`);
      return res.data;
    },
    enabled: Boolean(locationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Fetch zones for a location
 */
export const useParkingZones = (
  locationId: string | number | null
): UseQueryResult<ZonesListResponse, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.zones(locationId),
    queryFn: async () => {
      const res = await api.get<ZonesListResponse>(`/parking/locations/${locationId}/zones/`);
      return res.data;
    },
    enabled: Boolean(locationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch slots for a specific zone
 */
export const useZoneSlots = (
  zoneId: string | number | null
): UseQueryResult<SlotsListResponse, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.slots(zoneId),
    queryFn: async () => {
      const res = await api.get<SlotsListResponse>(`/parking/zones/${zoneId}/slots/`);
      return res.data;
    },
    enabled: Boolean(zoneId),
    staleTime: 3 * 60 * 1000, // slots update more frequently
    gcTime: 10 * 60 * 1000,
  });
};
