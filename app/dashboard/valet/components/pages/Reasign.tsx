import React, { useState } from 'react';

const Reassign = () => {
  const [showpopup, setShowpopup] = useState(false);
  

  return (
    <div>
      <button
        className="bg-orange-400 border-2 border-orange-600 rounded-md p-2 text-white shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
        onClick={() => setShowpopup(true)}
      >
        Reassign
      </button>

      {showpopup && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
            <h1 className="text-xl font-bold mb-4"> Reassign Parking Slot</h1>

            <p className="mb-2">Current Slot: <strong>P7</strong></p>
            <p className="mb-4">Suggested Slot: <strong>P12</strong></p>

            

            <button
              onClick={() => {
                setShowpopup(false);
               
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mt-6 hover:scale-110"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reassign;
