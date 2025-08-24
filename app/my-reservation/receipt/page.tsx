"use client"
import React, { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDemo } from '@/app/DemoProvider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { formatINR } from '@/app/utils/formatCurrency'
import { useState } from 'react'

declare global {
  interface Window { Razorpay?: any }
}

export default function ReceiptPage(){
  const params = useSearchParams()
  const router = useRouter()
  const reservationId = params.get('reservationId') || ''
  const { reservations, updateReservation } = useDemo()
  const reservation = reservations.find(r=>r.id===reservationId) || reservations[0]
  const [processing, setProcessing] = useState(false)

  // demo totals
  const entryTime = new Date(Date.now() - 2 * 60 * 60 * 1000)
  const exitTime = new Date()
  const durationHours = 2
  const baseFee = 50
  const hourlyRate = 30
  const total = baseFee + hourlyRate * durationHours

  async function loadScript(src: string){
    return new Promise((resolve)=>{
      const s = document.createElement('script')
      s.src = src
      s.onload = ()=>resolve(true)
      s.onerror = ()=>resolve(false)
      document.body.appendChild(s)
    })
  }

  const payNow = async ()=>{
    setProcessing(true)
    try{
      const res = await fetch('/api/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total, reservationId }) })
      const j = await res.json()
      if(!j.ok) { alert('order creation failed'); setProcessing(false); return }

      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if(!ok){ alert('Could not load razorpay script'); setProcessing(false); return }

      const options = {
        key: j.keyId,
        amount: j.order.amount,
        currency: j.order.currency,
        name: 'Park It Up',
        description: `Payment for ${reservationId}`,
        order_id: j.order.id,
        handler: async function (resp: any){
          // verify server side
          const v = await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resp) })
          const vv = await v.json()
          if(vv.ok){
            try { updateReservation(reservationId, { status: 'completed' }) } catch(e){}
            alert('Payment successful')
            router.push('/my-reservation')
          } else {
            alert('Payment could not be verified')
          }
        },
        prefill: {
          name: (reservation as any)?.ownerName || '',
          email: (reservation as any)?.contact?.email || '',
        },
        theme: { color: '#18a0ff' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    }catch(err){
      console.error(err)
      alert('Payment failed')
    }finally{ setProcessing(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a121a] text-white">
      <Card sx={{ maxWidth: 400, width: "100%", bgcolor: "#082235", color: "white", borderRadius: 4, boxShadow: 8 }}>
        <CardContent>
          <Typography variant="h4" align="center" color="#18a0ff" fontWeight={700} gutterBottom>
            Parking Receipt
          </Typography>
          <Divider sx={{ mb: 3, bgcolor: "#18a0ff" }} />
          <div className="mb-6 text-center">
            <Typography variant="subtitle1" fontWeight={600}>Session Duration</Typography>
            <Typography variant="h5" color="#4ade80" fontWeight={700}>{durationHours} hours</Typography>
            <Typography variant="body2" color="gray" mt={1}>Entry: {entryTime.toLocaleString()}</Typography>
            <Typography variant="body2" color="gray">Exit: {exitTime.toLocaleString()}</Typography>
          </div>
          <div className="mb-6">
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Charges Breakdown</Typography>
            <div className="flex justify-between text-gray-200 mb-1">
              <span>Base Fee</span>
              <span>₹{baseFee.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-200 mb-1">
              <span>Hourly Rate (₹{hourlyRate.toLocaleString("en-IN")} x {durationHours} hrs)</span>
              <span>₹{(hourlyRate * durationHours).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg mt-3">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <Button fullWidth disabled={processing} onClick={payNow} variant="contained" sx={{ bgcolor: "#18a0ff", color: "white", fontWeight: 600, py: 1.5, borderRadius: 2, boxShadow: 2, ':hover': { bgcolor: "#1490e6" } }}>
            {processing ? 'Processing...' : 'Pay Now & Finish'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
