import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { bookingApi, BookingCreatePayload, BookingResponse } from "@/lib/api/booking";

export const extractBookingError = (error: unknown, fallback = "Something went wrong") => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { detail?: string } | undefined;
    return data?.detail || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

export const useCreateBooking = () => {
  return useMutation<BookingResponse, AxiosError, BookingCreatePayload>({
    mutationFn: async (payload) => {
      const response = await bookingApi.createBooking(payload);
      return response.data;
    },
  });
};
