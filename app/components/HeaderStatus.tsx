"use client";
import React, { useState } from 'react'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useDemo } from '../DemoProvider'
import ReservationPanel from './ReservationPanel'

export default function HeaderStatus() {
  const { reservations } = useDemo()
  const current = reservations[0]
  const [open, setOpen] = useState(false)

  if (!current) return null

  const start = new Date(current.startAt)
  const minutes = Math.max(0, Math.round((start.getTime() - Date.now()) / 60000))

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Chip
          label={`Reserved • ${current.lotName} • ${minutes}m`}
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
      <ReservationPanel open={open} onClose={() => setOpen(false)} reservationId={current.id} />
    </>
  )
}
