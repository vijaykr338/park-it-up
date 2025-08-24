export type Slot = {
  id: string;
  status: string;
  schedule?: Record<string, string | undefined>;
  isReservationSlot?: boolean;
  // indicates an actual online booking has been made for this slot (awaiting check-in)
  isReserved?: boolean;
  // optional demo bookkeeping
  assignedReservationId?: string;
}
