import React, { useState } from 'react'
import image1 from "../assests/photo.jpg"
import Car_details from './Cardetails'
import { Searchbar } from './Searchbar'
import UserProfileCard from './Profilecard'
import { useDemo } from '../../../../DemoProvider'
import { useToast } from '../ToastProvider'
import ScanQRDialog from './ScanQRDialog'

const CheckInPending = () => {
  const { reservations, slots, assignSlot, checkinReservation } = useDemo()
  const [loading, setLoading] = useState(false)
  const [assigned, setAssigned] = useState<string | null>(null)
  const [scanOpen, setScanOpen] = useState(false)

  // find a booked reservation for demo
  const booked = reservations.find(r => r.status === 'booked')

  const simulateCheckin = async () => {
    if (!booked) return alert('No booked reservation')
    setScanOpen(true)
  }

  const onScanned = async () => {
    setScanOpen(false)
    if (!booked) return
    setLoading(true)
  // choose only reservation-enabled slots that are actually reserved (yellow) and not yet assigned
  const candidates = slots.filter(s => s.isReservationSlot && s.isReserved && !s.assignedReservationId)
    const slot = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null
    if (!slot) {
      setLoading(false)
      try { useToast().show('No reservation-enabled free slots available', 'warning') } catch(e){}
      return
    }
    assignSlot(booked.id, slot.id)
    checkinReservation(booked.id)
    setAssigned(slot.id)
    setLoading(false)
    try { useToast().show(`Assigned slot ${slot.id} to ${booked.id}`, 'success') } catch(e){}
  }

  return (
     <div className=''>
      <Searchbar/>
      <div className='bg-white\20 hover:bg-white\60 shadow-md p-2 rounded-lg '>
         {booked ? (
           <>
             <UserProfileCard
               name={booked.id}
               car={booked.vehicle?.makeModel ?? 'N/A'}
               phone={booked.contact?.phone ?? '—'}
               timings={new Date(booked.startAt).toLocaleTimeString()}
               qrNumber={booked.id}
               paymentStatus={'Paid'}
               imageUrl={image1.src}
             />

            <div className='flex flex-row gap-10 items-center justify-center'>
              <Car_details/>
              <button onClick={simulateCheckin} disabled={loading} 
                className='bg-orange-400 border-2  text-white rounded-md p-2 cursor-pointer hover:scale-105 transition-transform duration-200 '>
                {loading ? 'Checking...' : 'Check-in'}
              </button>
            </div>
            {assigned && <div className='mt-2 text-center'>Assigned Slot: <strong>{assigned}</strong></div>}
            <ScanQRDialog open={scanOpen} onClose={()=>setScanOpen(false)} onScanned={onScanned} reservationId={booked.id} />
           </>
         ) : (
           <div className='p-6 text-center text-gray-500'>No pending check-ins</div>
         )}

      </div>
    </div>
  )
}

export default CheckInPending;