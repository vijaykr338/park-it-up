import React,{useState} from 'react'
import Gridview from './Gridview';
import { slots } from '../utils/Slots';
import { Scheduleview } from './Scheduleview';
const Accept = () => {
    const[showpopup,setShowpopup]=useState(false);
  return (
    <div >
         <button className='bg-green-600 border-2 border-green-600 rounded-md p-2  text-white shadow-md hover:scale-105 transition-transform duration-200  cursor-pointer' onClick={()=>{setShowpopup(true)}}>Accept</button>
        
        {
            showpopup &&(
                <div className="fixed inset-0 bg-gray-400 bg-opacity-25 flex  flex-col items-center justify-center z-50 h-auto p-5">
                    <Gridview slots={slots}/>
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
