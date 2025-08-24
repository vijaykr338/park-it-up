"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDemo } from '@/app/DemoProvider'

export default function ExitPage(){
  const params = useSearchParams()
  const reservationId = params.get('reservationId') || ''
  const [result, setResult] = useState<any>(null)
  const { updateReservation } = useDemo()
  const router = useRouter()

  useEffect(()=>{
    // not required to prefetch
  },[])

  const finish = async ()=>{
    if(!reservationId) return
    const r = await fetch('/api/session/end',{ method: 'POST', body: JSON.stringify({ reservationId }) })
    const j = await r.json()
    if(j.ok){
      setResult(j)
      // update demo reservation status to completed
      try { updateReservation(reservationId, { status: 'completed' }) } catch(e){}
    } else {
      alert(j.error||'error')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Exit / Final payment</h2>
      <div className="mb-3">Reservation: <strong>{reservationId}</strong></div>
      {!result && <button onClick={finish} className="bg-[#18a0ff] px-4 py-2 rounded">Compute final amount & Pay</button>}
      {result && (
        <div className="mt-4 bg-[#082235] p-4 rounded text-white">
          <div>Hours: <strong>{result.hours}</strong></div>
          <div>Amount: <strong>₹{result.amount}</strong></div>
          <div className="mt-3"><button onClick={()=>router.push('/my-reservation')} className="bg-green-600 px-3 py-2 rounded">Done</button></div>
        </div>
      )}
    </div>
  )
}
