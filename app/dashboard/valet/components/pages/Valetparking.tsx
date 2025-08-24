"use client";
import React from "react";
import Gridview from "./Gridview";
import AssignOfflineDialog from './AssignOfflineDialog'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDemo } from '../../../../DemoProvider';

const Valet_Parking = () => {
  const { slots, assignSlot } = useDemo()
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [selectedSlot, setSelectedSlot] = React.useState<string | undefined>(undefined)

  const handleSlotClick = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId)
    if (!slot) return
    // if slot is reservation-enabled and has an assignedReservationId, do nothing (already reserved)
    if (slot.isReservationSlot && slot.assignedReservationId) {
      // already reserved by an online user
      return
    }
    // open offline assign dialog for valet to fill
    setSelectedSlot(slotId)
    setAssignOpen(true)
  }

  return (
   <div className="md:w-[60%] sm:w-full">
      <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" component="h1" fontWeight={700}>
            Valet Parking
          </Typography>
        </Box>
        <Gridview slots={slots} onSlotClick={handleSlotClick}  />
  <AssignOfflineDialog open={assignOpen} onClose={() => setAssignOpen(false)} slotId={selectedSlot} />
      </Paper>
    </div>
  );
};

export default Valet_Parking;

