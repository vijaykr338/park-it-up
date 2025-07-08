'use client'
import React, { useState } from 'react';
import { PendingRequests } from './PendingRequests';
import  CheckInPending from './Checkinpending';
import { ActiveReservations } from './Active';
import { Overstays } from './Overstays';
import { Completed } from './Completed';
const RightPanel = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const renderContent = () => {
    switch (activeTab) {
      case 'pending':
        return <PendingRequests />;
      case 'checkin':
        return <CheckInPending />;
      case 'active':
        return <ActiveReservations />;
      case 'overstay':
        return <Overstays/>;
      case 'completed':
        return <Completed/>;
      default:
        return null;
    }
  };

  return (
    <div className=" p-4 border-l border-gray-300 mb-20 w-[60%">
      <div className="flex space-x-6 border-b border-gray-300 pb-2 mb-4">
        <button
          className={`font-medium ${activeTab === 'pending' ? 'border-b-2 border-black cursor-pointer' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests
        </button>
        <button
          className={`font-medium ${activeTab === 'checkin' ? 'border-b-2 border-black cursor-pointer' : ''}`}
          onClick={() => setActiveTab('checkin')}
        >
          Check-in Pending
        </button>
        <button
          className={`font-medium ${activeTab === 'active' ? 'border-b-2 border-black cursor-pointer' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
         <button
          className={`font-medium ${activeTab === 'overstay' ? 'border-b-2 border-black cursor-pointer' : ''}`}
          onClick={() => setActiveTab('overstay')}
        >
          Overstays
        </button>
         <button
          className={`font-medium ${activeTab === 'completed' ? 'border-b-2 border-black cursor-pointer' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default RightPanel;

