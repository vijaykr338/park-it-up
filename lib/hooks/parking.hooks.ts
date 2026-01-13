"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { parkingApi } from "@/lib/api/parking";

export function useNearbyParking(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ["parking", "nearby", lat, lng],
    queryFn: async () => {
      const { data } = await parkingApi.nearby(lat!, lng!);
      return data;
    },
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 5 * 60 * 1000,
  });
}

export function useParkingLocation(id?: number) {
  return useQuery({
    queryKey: ["parking", "location", id],
    queryFn: async () => {
      const { data } = await parkingApi.locationDetail(id!);
      return data;
    },
    enabled: id !== undefined,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLocationSlots(locationId?: number, page?: number) {
  return useQuery({
    queryKey: ["parking", "slots", locationId, page],
    queryFn: async () => {
      const { data } = await parkingApi.locationSlots(locationId!, page);
      return data;
    },
    enabled: locationId !== undefined,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}
