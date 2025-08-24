import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#18a0ff' },
    secondary: { main: '#ffd166' },
    background: {
      default: '#071939', // page background gradient start
      paper: '#0b2b42' // card surfaces
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

export default theme
