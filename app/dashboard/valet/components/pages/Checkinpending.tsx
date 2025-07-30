import React from 'react'
import image1 from "../assests/photo.jpg"
import Car_details from './Cardetails'
import { Searchbar } from './Searchbar'
import Accept  from './Accept' 
import UserProfileCard from './Profilecard'
 const CheckInPending = () => {
  return (
     <div className=''>
      <Searchbar/>
      <div className='bg-white\20 hover:bg-white\60 shadow-md p-2 rounded-lg '>
         <UserProfileCard
         name="Jacob Jones"
        car="BMW M3 GTR WHITE (HR 45932)"
        phone="9458647273"
        timings="2 P.M. TO 3 P.M."
        qrNumber="12345"
        paymentStatus="Paid"
        imageUrl={image1.src}
        />

        <div className='flex flex-row gap-10 items-center justify-center'>
        <Car_details/>
        <button  
        className='bg-orange-400 border-2  text-white rounded-md p-2 cursor-pointer hover:scale-105 transition-transform duration-200 '>Check-in</button>
        <Accept/>
        </div>
      </div>
    </div>
  )
}

export default CheckInPending;