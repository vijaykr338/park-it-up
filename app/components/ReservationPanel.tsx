import React from 'react'
import { useDemo } from '../DemoProvider'
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography, Stack } from '@mui/material'

export default function ReservationPanel({ open, onClose, reservationId }: { open: boolean; onClose: () => void; reservationId?: string }) {
  const { reservations, cancelReservation, checkinReservation, extendReservation } = useDemo()
  const res = reservations.find(r => r.id === reservationId)

  if (!res) return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>No reservation</DialogTitle>
      <DialogContent>
        <Typography>No active reservation found.</Typography>
      </DialogContent>
    </Dialog>
  )

  const minutesUntil = Math.max(0, Math.round((new Date(res.startAt).getTime() - Date.now()) / 60000))

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Your reservation</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <img src="/app_photo.svg" alt="qr" style={{ width: 160, height: 160, objectFit: 'contain' }} />
          </Box>
          <Typography variant="h6">{res.lotName}</Typography>
          <Typography color="text.secondary">Starts in ~{minutesUntil} minutes</Typography>
          <Typography>Booking fee paid: ₹{res.bookingFee?.toFixed?.(2) ?? '0.00'}</Typography>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={() => { checkinReservation(res.id); onClose() }}>Check in</Button>
            <Button variant="outlined" onClick={() => { extendReservation(res.id, 30); onClose() }}>Extend +30m</Button>
            <Button variant="text" color="error" onClick={() => { cancelReservation(res.id); onClose() }}>Cancel</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
