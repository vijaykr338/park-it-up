"use client";
import React, { createContext, useContext, useState, useMemo } from 'react'
import { slots as initialSlots } from './dashboard/valet/components/utils/Slots'
import type { Slot } from './dashboard/valet/components/types'

type Reservation = {
  id: string
  lotName: string
  startAt: string // ISO
  status: 'booked' | 'in_grace' | 'reserved' | 'reserved not checked in' | 'active' | 'released' | 'completed'
  bookingFee: number
  // optional demo fields
  slotId?: string
  contact?: { email?: string; phone?: string }
  vehicle?: { makeModel?: string; licensePlate?: string; state?: string }
}

type DemoContext = {
  demoMode: boolean
  toggleDemo: () => void
  reservations: Reservation[]
  addReservation: (r: Reservation) => void
  updateReservation: (id: string, patch: Partial<Reservation>) => void
  cancelReservation: (id: string) => void
  checkinReservation: (id: string) => void
  extendReservation: (id: string, minutes: number) => void
  // slots & slot operations (demo)
  slots: Slot[]
  assignSlot: (reservationId: string, slotId: string) => void
  releaseSlot: (slotId: string) => void
  assignOffline: (details: { ownerName?: string; vehicle?: any }, slotId: string) => void
}

const ctx = createContext<DemoContext | null>(null)

export const useDemo = () => {
  const c = useContext(ctx)
  if (!c) throw new Error('useDemo must be used inside DemoProvider')
  return c
}

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoMode, setDemoMode] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const now = new Date()
    const start = new Date(now.getTime() + 1000 * 60 * 30) // 30m from now
    return [
      { id: 'R-1001', lotName: 'Nehru Place', startAt: start.toISOString(), status: 'booked', bookingFee: 10 }
    ]
  })

  // seed slots from the existing static file so we don't lose the current layout
  const [slots, setSlots] = useState<Slot[]>(() => initialSlots as Slot[])

  const toggleDemo = () => setDemoMode((s) => !s)

  const addReservation = (r: Reservation) => setReservations((s) => [r, ...s])
  const updateReservation = (id: string, patch: Partial<Reservation>) => {
    setReservations((s) => s.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  const cancelReservation = (id: string) => {
    setReservations((s) => s.map(r => r.id === id ? ({ ...r, status: 'released' }) : r))
  }

  const checkinReservation = (id: string) => {
    setReservations((s) => s.map(r => r.id === id ? ({ ...r, status: 'active' }) : r))
  }

  const extendReservation = (id: string, minutes: number) => {
    setReservations((s) => s.map(r => {
      if (r.id !== id) return r
      // attach extendedMinutes field
      const extended = typeof (r as any).extendedMinutes === 'number' ? (r as any).extendedMinutes + minutes : minutes
      return { ...r, status: 'booked', // keep booked
        // @ts-ignore add optional field for demo
        extendedMinutes: extended
      }
    }))
  }

  // assign a reservation to a slot (atomic update of slot + reservation)
  const assignSlot = (reservationId: string, slotId: string) => {
    setSlots((prevSlots) => prevSlots.map(s => s.id === slotId ? ({ ...s, status: 'reserved', assignedReservationId: reservationId }) : s))
    setReservations((prev) => prev.map(r => r.id === reservationId ? ({ ...r, slotId, status: 'reserved not checked in' }) : r))
  }

  // For offline valet assignment: create a reservation and mark slot occupied
  const assignOffline = (details: { ownerName?: string; vehicle?: any }, slotId: string) => {
    const id = `OFF-${Date.now()}`
    const now = new Date().toISOString()
    const newRes: Reservation = {
      id,
      lotName: 'Nehru Place',
      startAt: now,
      status: 'active',
      bookingFee: 10,
      slotId: slotId,
      contact: { email: undefined, phone: undefined },
      vehicle: details.vehicle || { makeModel: details.ownerName || 'Guest', licensePlate: details.vehicle?.licensePlate || 'UNKNOWN', state: details.vehicle?.state || '' }
    }
    setReservations((prev) => [newRes, ...prev])
    setSlots((prevSlots) => prevSlots.map(s => s.id === slotId ? ({ ...s, status: 'occupied', assignedReservationId: id }) : s))
  }

  const releaseSlot = (slotId: string) => {
    setSlots((prev) => {
      const found = prev.find(s => s.id === slotId)
      const newSlots = prev.map(s => s.id === slotId ? ({ ...s, status: 'inactive', assignedReservationId: undefined }) : s)
      if (found?.assignedReservationId) {
        // mark reservation released
        setReservations((prevR) => prevR.map(r => r.id === found.assignedReservationId ? ({ ...r, status: 'released', slotId: undefined }) : r))
      }
      return newSlots
    })
  }

  const value = useMemo(() => ({ demoMode, toggleDemo, reservations, addReservation, updateReservation, cancelReservation, checkinReservation, extendReservation, slots, assignSlot, releaseSlot, assignOffline }), [demoMode, reservations, slots])

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export default DemoProvider
