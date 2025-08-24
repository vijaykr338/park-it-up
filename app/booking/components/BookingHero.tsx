"use client";
import React, { useState } from 'react'

export default function BookingHero() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(() => {
    const d = new Date()
    d.setHours(d.getHours() + 1, 0, 0, 0)
    return d.toTimeString().slice(0,5)
  })

  // Pricing: original ₹20, 50% off => charge ₹10 (display only)
  const originalPrice = 20
  const discountedPrice = Math.round(originalPrice * 0.5)
  const bookingFee = Math.round(discountedPrice * 0.2)

  return (
    <div className="bg-[#0f2a44] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-2">Reserve a spot</h2>
      <p className="text-sm text-slate-200 mb-4">Booking fee reserves the spot until your start time.</p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-slate-200">Date</label>
          <input value={date} onChange={(e)=>setDate(e.target.value)} type="date" className="mt-1 w-full p-2 rounded bg-[#082235] text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-200">Start time</label>
          <input value={time} onChange={(e)=>setTime(e.target.value)} type="time" className="mt-1 w-full p-2 rounded bg-[#082235] text-white" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-sm text-slate-200">Price</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400 line-through">₹{originalPrice}</div>
            <div className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">50% off</div>
          </div>
          <div className="text-2xl font-semibold text-white mt-1">₹{discountedPrice}</div>

        </div>

        {/* Payment is handled from the page-level summary to avoid duplicate CTAs */}
        <div className="flex gap-3">
          {/* Intentionally left blank - single Pay & Reserve CTA lives in the right summary column */}
        </div>
      </div>
    </div>
  )
}

