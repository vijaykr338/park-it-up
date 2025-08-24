"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDemo } from '@/app/DemoProvider'
import { QRCodeSVG } from 'qrcode.react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { formatINR } from '@/app/utils/formatCurrency'

function formatCurrency(n?: number){
  if (typeof n !== 'number') return '0'
  return n.toString()
}

export default function ReservationManager(){
  const params = useSearchParams()
  const router = useRouter()
  const reservationId = params.get('reservationId') || ''
  const { reservations, updateReservation, checkinReservation } = useDemo()
  const reservation = reservations.find(r => r.id === reservationId) || reservations[0]

  const [accrued, setAccrued] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let mounted = true
    async function poll(){
      if(!reservationId) return
      const r = await fetch(`/api/session/status?reservationId=${reservationId}`)
      const j = await r.json()
      if(mounted) setAccrued(j.accrued || null)
    }
    poll()
    const t = setInterval(poll, 10000)
    return ()=>{ mounted = false; clearInterval(t) }
  },[reservationId])

  const simulateValetScan = async ()=>{
    if(!reservationId) return alert('missing reservation id')
    setLoading(true)
    const r = await fetch('/api/session/start', { method: 'POST', body: JSON.stringify({ reservationId }) })
    const j = await r.json()
    setLoading(false)
    if(j.ok){
      try { checkinReservation(reservationId) } catch(e){}
      try { updateReservation(reservationId, { status: 'active' }) } catch(e){}
      const s = await fetch(`/api/session/status?reservationId=${reservationId}`)
      const js = await s.json()
      setAccrued(js.accrued||null)
    } else {
      alert(j.error||'could not start session')
    }
  }

  const extendHour = async ()=>{
    if(!reservationId) return
    const r = await fetch('/api/session/extend', { method: 'POST', body: JSON.stringify({ reservationId, hours: 1 }) })
    const j = await r.json()
    if(j.ok) {
      const s = await fetch(`/api/session/status?reservationId=${reservationId}`)
      const js = await s.json()
      setAccrued(js.accrued||null)
    } else alert(j.error||'error')
  }

  const endAndPay = async ()=>{
    if(!reservationId) return
    // open confirmation dialog first
    setConfirmOpen(true)
  }

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [ending, setEnding] = React.useState(false)

  const confirmEnd = async ()=>{
    if(!reservationId) return
    setEnding(true)
    const r = await fetch('/api/session/end', { method: 'POST', body: JSON.stringify({ reservationId }) })
    const j = await r.json()
    setEnding(false)
    setConfirmOpen(false)
    if(j.ok){
      try { updateReservation(reservationId, { status: 'completed' }) } catch(e){}
      alert(`Final amount: ${formatINR(j.amountDue ?? j.amount)}. Hours: ${j.hours}`)
      router.push('/my-reservation')
    } else {
      alert(j.error||'error')
    }
  }

  if(!reservation) return (
    <Box p={4}>No reservation found. Go to <a href="/booking">booking</a>.</Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#071026', py: 6, px: 2 }}>
      <Card sx={{ maxWidth: 1000, mx: 'auto', bgcolor: '#071a2b', color: 'white', borderRadius: 3, boxShadow: 8, animation: 'fadeIn 500ms ease' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Reservation Manager
              </Typography>
              <Typography color="gray" sx={{ mb: 1 }}>Reservation: <strong style={{color:'#fff'}}>{reservation.id}</strong></Typography>
              <Typography sx={{ mb: 1 }}>Lot: {reservation.lotName}</Typography>
              <Typography sx={{ mb: 1 }}>Slot: {reservation.slotId ?? 'Not assigned'}</Typography>
              <Typography sx={{ mb: 2 }}>Booking fee paid: <strong>₹{reservation.bookingFee}</strong></Typography>

              {reservation.status !== 'active' && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button variant="outlined" color="info" onClick={extendHour}>Extend 1 hour (prepay)</Button>
                </Box>
              )}

              {/* Hidden action buttons for demo, bottom right corner */}
              <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1, opacity: 0.15, pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={simulateValetScan} disabled={loading || reservation.status==='active'} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
                  {reservation.status==='active' ? 'Active' : 'Simulate valet QR scan (Start)'}
                </Button>
                <Button variant="contained" color="error" onClick={() => router.push(`/my-reservation/receipt?reservationId=${reservationId}`)}>End & Pay</Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>QR code (show to valet)</Typography>
                <Paper sx={{ p: 1, borderRadius: 2, bgcolor: 'white', transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: 12 } }} elevation={3}>
                  <QRCodeSVG value={reservation.id} size={140} />
                </Paper>
                <Chip label={reservation.status.toUpperCase()} color={reservation.status === 'active' ? 'success' : 'default'} sx={{ mt: 2 }} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ bgcolor: '#16324a', my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#071a2b', color: 'white', p:2, borderRadius:2, transition: 'transform 160ms ease', '&:hover': { transform: 'translateY(-6px)' } }}>
                    <Typography variant="subtitle2" color="gray">Accrued</Typography>
                    <Typography variant="h5">{formatINR(accrued?.amountDue ?? accrued?.amountSoFar ?? 0)}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Card sx={{ bgcolor: '#071a2b', color: 'white', p:2, borderRadius:2, transition: 'transform 160ms ease', '&:hover': { transform: 'translateY(-6px)' } }}>
                    <Typography variant="subtitle2" color="gray">Hours so far</Typography>
                    <Typography variant="h6">{accrued?.hoursSoFar ?? '—'}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Card sx={{ bgcolor: '#071a2b', color: 'white', p:2, borderRadius:2, transition: 'transform 160ms ease', '&:hover': { transform: 'translateY(-6px)' } }}>
                    <Typography variant="subtitle2" color="gray">Prepaid hours</Typography>
                    <Typography variant="h6">{accrued?.prepaidHours ?? 0}</Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)}>
        <DialogTitle>Confirm End & Pay</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>You're about to end the session for <strong>{reservation.id}</strong>.</Typography>
          <Typography variant="body2">Current accrued: <strong>{formatINR(accrued?.amountSoFar ?? 0)}</strong></Typography>
          <Typography variant="body2">Prepaid: <strong>{formatINR((accrued?.prepaidHours ?? 0) * (accrued?.hourlyRate ?? 0))}</strong></Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Estimated due: <strong>{formatINR(Math.max(0, (accrued?.amountSoFar ?? 0) - ((accrued?.prepaidHours ?? 0) * (accrued?.hourlyRate ?? 0))))}</strong></Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)} disabled={ending}>Cancel</Button>
          <Button onClick={confirmEnd} color="error" variant="contained" disabled={ending}>{ending ? 'Processing...' : 'End & Pay'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
