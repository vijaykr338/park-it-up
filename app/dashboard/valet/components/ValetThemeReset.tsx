"use client"
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastProvider } from './ToastProvider'

const ValetThemeReset: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = React.useMemo(() => createTheme(), [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <div style={{ background: '#ffffff', color: '#000000', minHeight: '100vh', width: '100%' }}>
          {children}
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default ValetThemeReset
