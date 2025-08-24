"use client"
import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

export default function ScanQRDialog({ open, onClose, onScanned, reservationId } : { open: boolean; onClose: ()=>void; onScanned: ()=>void; reservationId?: string }){
  useEffect(()=>{
    if(!open) return
    const t = setTimeout(()=>{
      onScanned()
    }, 1400)
    return ()=> clearTimeout(t)
  },[open])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Scanning QR</DialogTitle>
      <DialogContent>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:12 }}>
          <div style={{ width:180, height:180, borderRadius:8, background:'#071a2b', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            {/* real QR graphic for animation */}
            <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.35 }} style={{ width:140, height:140, borderRadius:6, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:'#071a2b' }}>
              <div style={{ position:'absolute', inset:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <QRCodeSVG value={reservationId ?? 'demo-scan'} size={124} bgColor="#071a2b" fgColor="#18a0ff" />
              </div>
              {/* animated scan line */}
              <motion.div initial={{ y:-140 }} animate={{ y:140 }} transition={{ repeat: Infinity, duration:1.4, ease:'linear' }} style={{ position:'absolute', left:0, right:0, height:28, background:'linear-gradient(180deg, rgba(24,160,255,0.06), rgba(24,160,255,0.18), rgba(24,160,255,0.06))', pointerEvents:'none' }} />
            </motion.div>
          </div>
          <div style={{ color:'#9fb8c9' }}>Scanning reservation QR {reservationId ? `(${reservationId})` : ''}...</div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
