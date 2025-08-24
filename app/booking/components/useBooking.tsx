"use client";
import { useState, useEffect } from 'react'

export type BookingState = {
  slotId: string | null
}

export default function useBooking() {
  const [slotId, setSlotId] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem('booking.slotId')
      return raw || null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    try {
      if (slotId) localStorage.setItem('booking.slotId', slotId)
      else localStorage.removeItem('booking.slotId')
    } catch (e) {}
  }, [slotId])

  return { slotId, setSlotId }
}
