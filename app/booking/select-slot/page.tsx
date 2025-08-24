import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import SlotSelector from '@/app/booking/components/SlotSelector';

export default function Page() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#071939',
      py: 6
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
            mb: 2
          }}>
            <DirectionsCar sx={{ 
              fontSize: 40, 
              color: '#ffd166'
            }} />
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#e6f4ff',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Reserve Your Parking Spot
            </Typography>
          </Box>
          
        </Box>
        
        <SlotSelector />
      </Container>
    </Box>
  );
}
