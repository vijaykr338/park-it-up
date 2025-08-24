"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ActivePage(){
  const params = useSearchParams()
  const router = useRouter()
  const reservationId = params.get('reservationId') || ''
  const [info, setInfo] = useState<any>(null)

  useEffect(()=>{
    let mounted = true
    async function poll(){
      if(!reservationId) return
      const r = await fetch(`/api/session/status?reservationId=${reservationId}`)
      const j = await r.json()
      if(mounted) setInfo(j.accrued||null)
    }
    poll()
    const t = setInterval(poll, 15000)
    return ()=>{ mounted=false; clearInterval(t) }
  },[reservationId])

  const end = ()=> router.push(`/my-reservation/exit?reservationId=${reservationId}`)
  const extend = async ()=>{
    if(!reservationId) return
    const r = await fetch('/api/session/extend', { method: 'POST', body: JSON.stringify({ reservationId, hours: 1 }) })
    const j = await r.json()
    if(j.ok) setInfo((prev:any)=> ({...prev, session: j.session}))
    else alert(j.error||'error')
  }

  if(!reservationId) return <div className="p-6">Missing reservationId</div>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Active session</h2>
      <div className="mb-4">Reservation: <strong>{reservationId}</strong></div>
      <div className="mb-4">Current accrued: <strong>₹{info?.amountSoFar ?? '—'}</strong> ({info?.hoursSoFar ?? '—'} hrs)</div>
      <div className="flex gap-3">
        {/* Show Extend button only if status is 'booked' (not checked in) */}
        {info?.status === 'booked' && (
          <button onClick={extend} className="bg-blue-600 text-white px-4 py-2 rounded">Extend 1 hour (prepay)</button>
        )}
        <button onClick={end} className="bg-red-500 text-white px-4 py-2 rounded">End session</button>
      </div>
    </div>
  )
}
