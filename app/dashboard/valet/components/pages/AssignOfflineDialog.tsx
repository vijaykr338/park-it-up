"use client";
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useDemo } from '../../../../DemoProvider'
import { useToast } from '../ToastProvider'

export default function AssignOfflineDialog({ open, onClose, slotId }: { open: boolean; onClose: () => void; slotId?: string }){
  const { assignOffline } = useDemo()
  const toast = useToast()
  const [ownerName, setOwnerName] = useState('')
  const [license, setLicense] = useState('')

  const submit = () => {
    if(!slotId) return
    if(!ownerName.trim()) return toast.show('Owner name is required', 'warning')
    if(!license.trim()) return toast.show('License plate is required', 'warning')
    // minimal payload for offline assignment
    const payload = {
      ownerName: ownerName.trim(),
      vehicle: { licensePlate: license.trim() }
    }
    assignOffline(payload, slotId)
    onClose()
    toast.show(`Assigned ${slotId} to ${ownerName}`, 'success')
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Spot - {slotId}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'grid', gap: 12 }}>
          <TextField fullWidth label="Owner Name" value={ownerName} onChange={(e)=>setOwnerName(e.target.value)} sx={{ mt: 1 }} />
          <TextField fullWidth label="License Plate" value={license} onChange={(e)=>setLicense(e.target.value)} sx={{ mt: 1 }} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Assign</Button>
      </DialogActions>
    </Dialog>
  )
}
