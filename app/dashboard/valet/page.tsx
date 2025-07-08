import React from 'react'
import RightPanel from './components/pages/Rightpanel'
import Valet_Parking from './components/pages/Valetparking'
const page = () => {
  
  return (
    <div className="flex sm:flex-col md:flex-row p-5">
  <Valet_Parking />
  <RightPanel />
   </div>

  )
}

export default page
