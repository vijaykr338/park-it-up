
import React,{useState} from 'react'
import Gridview from './Gridview';
import { useDemo } from '../../../../DemoProvider';

const Accept = () => {
    const[showpopup,setShowpopup]=useState(false);
    const { assignSlot, slots } = useDemo()
    const reservationId = 'R-1001' // demo: in a real flow this would be passed in

    const handleSlotClick = (slotId: string) => {
      const ok = confirm(`Assign slot ${slotId} to reservation ${reservationId}?`)
      if (ok) {
        assignSlot(reservationId, slotId)
        setShowpopup(false)
        alert(`Slot ${slotId} assigned (demo).`)
      }
    }
  return (
    <div >
         <button className='bg-green-600 border-2 border-green-600 rounded-md p-2  text-white shadow-md hover:scale-105 transition-transform duration-200  cursor-pointer' onClick={()=>{setShowpopup(true)}}>Accept</button>
        
        {
            showpopup &&(
                <div className="fixed inset-0 bg-gray-400 bg-opacity-25 flex  flex-col items-center justify-center z-50 h-auto p-5">
                    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                    <Gridview slots={slots} onSlotClick={handleSlotClick} />
                   <span> <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 align-middle mt-0">Assign this slot to the user</button>
                        <button
                        onClick={() => setShowpopup(false)}
                         className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 align-middle ml-5 "
                         >
                         Return
                         </button>
                         </span>
                    
                </div>
            )
        }
    </div>
  )
}

export default Accept
