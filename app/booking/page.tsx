"use client";
import React, { useState } from "react";
import Image from "next/image";
import ParkitUp from "./assets/Parkitup_logo.png";
import Link from "next/link";
import LOCK from "./assets/lock.svg";
import TimeSelectionDialog from "@/app/booking/components/TimeSelectionDialog";
import ContactInfoDialog from "@/app/booking/components/ContactInfoDialog";
import PaymentMethodDialog from "@/app/booking/components/PaymentMethodDialog";
import VehicleDialog from "@/app/booking/components/VehicleDialog";
import PaymentModal from './components/PaymentModal'
import { useDemo } from '@/app/DemoProvider'
import BookingHero from './components/BookingHero'
import HeaderStatus from '@/app/components/HeaderStatus'
import SuccessToaster from '@/app/components/SuccessToaster'
import useBooking from './components/useBooking'
// SlotSelector is available as a dedicated booking page at /booking/select-slot

interface ReservationTime {
  date: string;
  time: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  receiveSMS: boolean;
}

interface PaymentMethod {
  type: "card" | "paytm" | "googlepay";
  cardNumber?: string;
  cardName?: string;
}

interface Vehicle {
  makeModel: string;
  licensePlate: string;
  state: string;
}

import { useRouter } from "next/navigation";

// expose Razorpay on window (light typing)
declare global {
  interface Window {
    Razorpay?: any;
  }
}

const BookingPage = () => {
  const [open, setOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  // Dummy data (simulates backend auto-fill)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>({ email: 'guest@example.com', phone: '+91 98765 43210', receiveSMS: true });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>({ type: 'card', cardNumber: '4242424242424242', cardName: 'Guest User' });
  const [vehicle, setVehicle] = useState<Vehicle | null>({ makeModel: 'Honda City', licensePlate: 'DL4C AB 1234', state: 'Delhi' });
  const [reservation, setReservation] = useState({
    enterTime: { date: "Today", time: "3:00 PM" },
    exitTime: { date: "Today", time: "2:00 PM" },
  });
  const { addReservation, assignSlot } = useDemo()
  const { slotId } = useBooking()
  const router = useRouter();

  React.useEffect(() => {
    if (!slotId) {
      router.replace("/booking/select-slot");
    }
  }, [slotId, router]);
  const [payOpen, setPayOpen] = useState(false)

  const handleTimeChange = (
    newEnterTime: ReservationTime,
    newExitTime: ReservationTime
  ) => {
    setReservation({
      enterTime: newEnterTime,
      exitTime: newExitTime,
    });
  };

  const handleContactInfoChange = (newContactInfo: ContactInfo) => {
    setContactInfo(newContactInfo);
  };

  const handlePaymentMethodChange = (newPaymentMethod: PaymentMethod) => {
    setPaymentMethod(newPaymentMethod);
  };

  const handleVehicleChange = (newVehicle: Vehicle) => {
    setVehicle(newVehicle);
  };

  const originalPrice = 10
  const discountedPrice = Math.round(originalPrice * 0.5)
  const bookingFee = Math.round(discountedPrice * 0.2)

  // Load Razorpay checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false)
      if ((window as any).Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Start Razorpay payment for the booking fee (amount in rupees)
  const handleRazorpayPayment = async () => {
    const ok = await loadRazorpayScript()
    if (!ok) {
      alert('Unable to load payment gateway. Please try again later.')
      return
    }

    try {
      // create an order on the server (expects { orderId, key } in response)
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: bookingFee * 10 })
      })
      const orderJson = await orderRes.json()
      if (!orderRes.ok) {
        alert(orderJson?.error || 'Failed to create payment order')
        return
      }

      // server returns { ok: true, order, keyId }
      const orderId = orderJson?.order?.id
      const key = orderJson?.keyId

      const options: any = {
        key,
        amount: bookingFee * 10,
        currency: 'INR',
        name: 'ParkItUp',
        description: 'Booking fee',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // verify the payment signature on the server
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(response)
            })
            const verifyJson = await verifyRes.json()
            if (!verifyRes.ok) {
              alert(verifyJson?.error || 'Payment verification failed')
              return
            }

            // On successful verification, proceed with the reservation flow
            await onPaymentSuccess()
          } catch (err) {
            console.error(err)
            alert('Error while verifying payment')
          }
        },
        prefill: {
          name: contactInfo?.email || '',
          email: contactInfo?.email || '',
          contact: contactInfo?.phone ? contactInfo.phone.replace(/\s+/g, '') : ''
        },
        theme: { color: '#18a0ff' }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error(e)
      alert('Unable to initialize payment')
    }
  }

  const onPaymentSuccess = async () => {
    // safe parse of reservation start
    const parseStart = () => {
      const dateLabel = reservation.enterTime?.date || 'Today'
      const timeLabel = reservation.enterTime?.time || '12:00 PM'

      let base = new Date()
      if (dateLabel && dateLabel !== 'Today') {
        const parsed = Date.parse(dateLabel)
        if (!isNaN(parsed)) base = new Date(parsed)
      }

      const m = (timeLabel || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
      if (m) {
        let hh = parseInt(m[1], 10)
        const mm = parseInt(m[2], 10)
        const ampm = (m[3] || '').toUpperCase()
        if (ampm === 'PM' && hh < 12) hh += 12
        if (ampm === 'AM' && hh === 12) hh = 0
        base.setHours(hh, mm, 0, 0)
      } else {
        base.setMinutes(0, 0, 0)
      }
      return base
    }

    const start = parseStart()

    // build payload
    const payload: any = { startAt: start.toISOString() }
    if (slotId) payload.slotId = slotId

    try {
      // call mock-reserve to create a reservation id
      const res = await fetch('/api/mock-reserve', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await res.json()
      if (!res.ok || !j?.reservationId) {
        alert(j?.error || 'Reservation failed')
        return
      }

      const reservationId = j.reservationId
      const newReservation = {
        id: reservationId,
        lotName: 'Pacific Mall',
        startAt: start.toISOString(),
        status: 'booked' as const,
        bookingFee,
        ...(slotId ? { slotId } : {})
      }
      addReservation(newReservation)
      if (slotId) {
        try { assignSlot(reservationId, slotId) } catch (e) { /* ignore */ }
      }

      setPayOpen(false)
      setShowPaymentSuccess(true)
      // go to reservation manager
      router.push(`/my-reservation/manager?reservationId=${reservationId}`)
    } catch (e) {
      console.error(e)
      alert('Network error while creating reservation')
    }
  }

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a121a] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-6">
          <Image
            src={ParkitUp}
            alt="ParkItUp Logo"
            width={90}
            height={40}
            className="object-contain"
          />
          <span className="text-gray-200 text-sm font-regular flex items-center">
            <Image src={LOCK} alt="" className="size-5" />
            Secure Checkout
          </span>
        </div>

  {/* Reservation status (demo) */}
  <HeaderStatus />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: booking form */}
          <div className="md:col-span-2 space-y-6">
            <BookingHero />
          </div>

          {/* Right: Summary & details */}
          <div className="md:col-span-1">
            {/* Guest Checkout */}
            <div className="bg-[#082235] p-4 rounded-lg shadow-sm text-white">
              <div className="flex gap-2 items-center mb-4">
                <span>Checking out as a guest</span>
                <Link href="/login">
                  <span className="text-blue-500 underline">Log in</span>
                </Link>
              </div>

              {/* Reservation Period */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-100">Reservation Period</h3>
                    <p className="text-gray-300">Pacific Mall</p>
                    <span className="text-gray-200 font-semibold">
                      {reservation.enterTime.time}
                    </span>
                  </div>
                  <button
                    className="text-blue-400 cursor-pointer underline"
                    onClick={() => setOpen(true)}
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Contact Info */}
      <div className="py-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
        <h3 className="font-medium text-gray-100">Contact Info</h3>
    <p className="text-gray-200">
                      {contactInfo
                        ? `${contactInfo.email} • ${contactInfo.phone}`
                        : "None"}
                    </p>
                  </div>
      <button
    className="text-blue-300 border border-gray-600 w-16 rounded-md cursor-pointer hover:bg-[#0b3a52] transition duration-200"
                    onClick={() => setContactDialogOpen(true)}
                  >
                    {contactInfo ? "Change" : "Add"}
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-100">Payment Method</h3>
                    <p className="text-gray-300">
                      {paymentMethod
                        ? paymentMethod.type === "card"
                          ? `Card ending in ${paymentMethod.cardNumber?.slice(-4)}`
                          : paymentMethod.type === "paytm"
                            ? "Paytm"
                            : "Google Pay"
                        : "None"}
                    </p>
                  </div>
                  <button
                    className="text-blue-300 border border-gray-600 w-16 rounded-md cursor-pointer hover:bg-[#0b3a52] transition duration-200"
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    {paymentMethod ? "Change" : "Add"}
                  </button>
                </div>
              </div>

              {/* Vehicle */}
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-100">Vehicle</h3>
                      <p className="text-gray-200">
                      {vehicle
                        ? `${vehicle.makeModel} • ${vehicle.licensePlate} • ${vehicle.state}`
                        : "I'll add my vehicle later"}
                    </p>
                  </div>
                  <button
                      className="text-blue-300 border border-gray-600 w-16 rounded-md cursor-pointer hover:bg-[#0b3a52] transition duration-200"
                    onClick={() => setVehicleDialogOpen(true)}
                  >
                    {vehicle ? "Change" : "Add"}
                  </button>
                </div>
              </div>
            </div>
              <div className="bg-[#082235] p-4 rounded-lg shadow-sm text-white">
                <div className="mt-4 space-y-3">
                  <div className="py-3">
                    <a href="/booking/select-slot" className="w-full inline-block text-center bg-white text-[#0a121a] px-4 py-3 rounded-md font-semibold hover:opacity-90">Choose Parking Spot</a>
                    <p className="text-xs text-gray-400 mt-2">Select the exact reserved bay on the next screen.</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Cancel free until start time
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Easily change or extend
                  </div>

                  <button onClick={handleRazorpayPayment} className="w-full bg-[#18a0ff] text-white py-3 rounded-lg font-medium hover:bg-[#1490e6] transition-colors cursor-pointer">
                    Pay And Reserve
                  </button>

                  <p className="text-xs text-gray-300 text-center">
                    By purchasing, you agree to ParkItUp's Terms and Conditions
                    and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <TimeSelectionDialog
        open={open}
        onOpenChange={setOpen}
        reservation={reservation}
        onTimeChange={handleTimeChange}
      />
      <ContactInfoDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        onContactInfoChange={handleContactInfoChange}
      />
      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onPaymentMethodChange={handlePaymentMethodChange}
      />
      <VehicleDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        onVehicleChange={handleVehicleChange}
      />
  <PaymentModal open={payOpen} onClose={()=>setPayOpen(false)} amount={discountedPrice} onSuccess={onPaymentSuccess} />
  <SuccessToaster open={showPaymentSuccess} onClose={()=>setShowPaymentSuccess(false)} message="Reservation Confirmed!" />
    </div>
  );
};

export default BookingPage;
