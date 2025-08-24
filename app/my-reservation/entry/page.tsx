"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EntryPage(){
  const [resId, setResId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const start = async ()=>{
    if(!resId) return
    setLoading(true)
    const r = await fetch('/api/session/start', { method: 'POST', body: JSON.stringify({ reservationId: resId }) })
    const j = await r.json()
    setLoading(false)
    if (j.ok) router.push(`/my-reservation/active?reservationId=${resId}`)
    else alert(j.error||'error')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Check-in / Start session</h2>
      <p className="mb-4">Enter reservation code to start hourly billing.</p>
      <input value={resId} onChange={(e)=>setResId(e.target.value)} className="w-full p-2 mb-3 rounded bg-[#082235] text-white" placeholder="Reservation id e.g. R-1234" />
      <div className="flex gap-3">
        <button onClick={start} disabled={loading} className="bg-[#18a0ff] px-4 py-2 rounded">Start</button>
      </div>
    </div>
  )
}
