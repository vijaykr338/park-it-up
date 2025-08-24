"use client"
import React, { createContext, useContext, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

type Toast = { open: boolean; message: string; severity?: 'success'|'info'|'warning'|'error' }
const ToastContext = createContext<{ show: (m:string, s?:Toast['severity'])=>void } | null>(null)

export const useToast = ()=>{
  const c = useContext(ToastContext)
  if(!c) throw new Error('useToast must be used inside ToastProvider')
  return c
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast>({ open:false, message:'', severity:'info' })
  const show = (message:string, severity:Toast['severity']='info')=> setToast({ open:true, message, severity })
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={()=>setToast((t)=>({...t, open:false}))} anchorOrigin={{vertical:'top', horizontal:'right'}}>
        <Alert onClose={()=>setToast((t)=>({...t, open:false}))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}
