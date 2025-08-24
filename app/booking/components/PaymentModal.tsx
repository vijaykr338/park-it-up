"use client";
import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

export default function PaymentModal({ open, onClose, amount, onSuccess }: { open: boolean; onClose: ()=>void; amount: number; onSuccess: ()=>void }){
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pay ₹{amount}</DialogTitle>
      <DialogContent>
        <div className="min-w-[300px]">This is a mocked payment dialog for the demo.</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSuccess}>Simulate success</Button>
      </DialogActions>
    </Dialog>
  )
}
