"use client";
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function ConfirmationPanel({ reservation, onClose }: { reservation: any; onClose: ()=>void }){
  const [minutes, setMinutes] = useState(0)
  useEffect(()=>{
    const start = new Date(reservation.startAt)
    const update = ()=> setMinutes(Math.max(0, Math.round((start.getTime() - Date.now())/60000)))
    update()
    const t = setInterval(update, 1000*30)
    return ()=>clearInterval(t)
  },[reservation])

  return (
    <Box className="bg-[#062433] p-6 rounded-lg shadow-md text-white">
      <h3 className="text-xl font-semibold mb-2">Reservation confirmed</h3>
      <div className="mb-2">Code: <strong>{reservation.id}</strong></div>
      <div className="mb-2">Lot: {reservation.lotName}</div>
      <div className="mb-4">Starts in: {minutes} minutes</div>
      <div className="flex gap-3">
        <Button variant="contained" color="primary" onClick={onClose}>Done</Button>
        <Button variant="outlined" onClick={onClose}>Share</Button>
      </div>
    </Box>
  )
}
