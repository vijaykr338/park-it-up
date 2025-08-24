'use client'
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { PendingRequests } from './PendingRequests';
import CheckInPending from './Checkinpending';
import { ActiveReservations } from './Active';
import { Completed } from './Completed';

const RightPanel = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box className=" p-2 border-l border-gray-300 mb-8 w-[60%]">
      <Paper elevation={1} sx={{ p: 1, bgcolor: 'background.paper' }}>
        <Tabs value={tabIndex} onChange={handleChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Check-in" />
          <Tab label="Active" />
          <Tab label="Completed" />
        </Tabs>

        <Box sx={{ mt: 1 }}>
          {tabIndex === 0 && <CheckInPending />}
          {tabIndex === 1 && <ActiveReservations />}
          {tabIndex === 2 && <Completed />}
        </Box>
      </Paper>
    </Box>
  );
};

export default RightPanel;

