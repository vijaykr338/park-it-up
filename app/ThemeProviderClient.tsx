"use client"
import React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#18a0ff' },
    secondary: { main: '#ffd166' },
    background: {
      default: '#071939',
      paper: '#0b2b42'
    },
    text: {
      primary: '#e6f4ff',
      secondary: '#cfe8ff'
    }
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  }
})

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
