import React,{useState} from 'react'
import image1 from "../assests/car.jpg"
const Car_details = () => {
    const[showpopup,setShowpopup]=useState(false);


  return (
    <div>
         <button className='bg-gray-700 border-2  border-gray-900 rounded-md p-2  text-white shadow-md hover:scale-105 transition-transform duration-200  cursor-pointer' onClick={()=>{setShowpopup(true)}}>See car details</button>
        
        {
            showpopup &&(
                <div className="fixed inset-0 bg-gray-400 bg-opacity-25 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <img src={image1.src} alt="car-img" className="w-full h-50"/>
                        <h3>Car Name:BMW</h3>
                        <h3>Car Number: HR 45932</h3>
                        <h3>Type of Car:</h3>
                        <button
                        onClick={() => setShowpopup(false)}
                         className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 align-middle mt-2"
                         >
                         Return
                         </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Car_details
