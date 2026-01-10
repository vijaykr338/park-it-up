"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Car, Clock, AlertCircle, History } from 'lucide-react';
import { useActiveBooking } from '@/components/reservation/hooks/useActiveBooking';
import { useAllBookings } from '@/components/reservation/hooks/useAllBookings';
import type { BookingStatus, BookingAPIResponse } from '@/components/reservation/types/reservation';

const UserBookingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  const { activeBooking, isLoading: activeLoading, error: activeError, refetch: refetchActive } = useActiveBooking();
  const { bookings, isLoading: historyLoading, error: historyError, refetch: refetchHistory } = useAllBookings();

  // Filter and sort completed bookings (those with exit_time) - most recent first
  const completedBookings = bookings
    .filter(booking => booking.exit_time)
    .sort((a, b) => new Date(b.exit_time!).getTime() - new Date(a.exit_time!).getTime());
  
  const isLoading = activeTab === 'active' ? activeLoading : historyLoading;
  const error = activeTab === 'active' ? activeError : historyError;
  
  const handleRefresh = () => {
    if (activeTab === 'active') {
      refetchActive();
    } else {
      refetchHistory();
    }
  };

  // Determine booking status
  const getBookingStatus = (): BookingStatus => {
    if (!activeBooking) return 'reserved';
    return activeBooking.exit_time 
      ? 'checkout' 
      : activeBooking.start_time 
        ? 'checked_in' 
        : 'reserved';
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'reserved':
        return 'text-blue-300 bg-blue-500/20 border border-blue-500/40';
      case 'checked_in':
        return 'text-green-300 bg-green-500/20 border border-green-500/40';
      case 'checkout':
        return 'text-orange-300 bg-orange-500/20 border border-orange-500/40';
      default:
        return 'text-gray-300 bg-gray-500/20 border border-gray-500/40';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'reserved':
        return 'Reserved';
      case 'checked_in':
        return 'Checked In';
      case 'checkout':
        return 'Checkout';
      default:
        return 'Unknown';
    }
  };

  const handleViewReservation = () => {
    if (activeBooking) {
      router.push(`/reservation?booking=${activeBooking.id}`);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a121a] text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/map')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4d84a4]/25 bg-[#232834]/60 hover:bg-[#232834]/80 transition-all"
                title="Back to map"
              >
                <svg 
                  className="w-4 h-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-3xl md:text-4xl font-bold">My Bookings</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4d84a4]/25 bg-[#232834]/60 hover:bg-[#232834]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh bookings"
            >
              <svg 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 rounded-lg bg-[#232834]/50 p-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'active'
                  ? 'bg-[#4d84a4] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#232834]/80'
              }`}
            >
              <Car className="w-4 h-4" />
              Active Booking
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-[#4d84a4] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#232834]/80'
              }`}
            >
              <History className="w-4 h-4" />
              Booking History ({completedBookings.length})
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d84a4]"></div>
            <span className="ml-3 text-gray-300">Loading your bookings...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-red-400 font-medium">Error Loading Bookings</h3>
                <p className="text-red-300 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'active' ? (
          <>
            {/* Active Booking Display */}
            {!isLoading && !error && activeBooking && (
              <ActiveBookingCard 
                booking={activeBooking} 
                onViewReservation={handleViewReservation}
                getBookingStatus={getBookingStatus}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                formatDateTime={formatDateTime}
              />
            )}

            {/* Empty State for Active */}
            {!isLoading && !error && !activeBooking && (
              <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-[#4d84a4]/20 rounded-full flex items-center justify-center mb-6">
                  <Car className="h-12 w-12 text-[#4d84a4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Active Bookings</h3>
                <p className="text-gray-300 mb-6">
                  You don&apos;t have any active parking reservations at the moment.
                </p>
                <button 
                  onClick={() => router.push('/map')}
                  className="rounded-lg bg-[#4d84a4] px-6 py-3 font-semibold hover:brightness-110 transition-all text-white"
                >
                  Find Parking
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Booking History Display */}
            {!isLoading && !error && completedBookings.length > 0 && (
              <div className="space-y-4">
                {completedBookings.map((booking) => (
                  <BookingHistoryCard 
                    key={booking.id}
                    booking={booking}
                    formatDateTime={formatDateTime}
                    onViewDetails={() => router.push(`/reservation?booking=${booking.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Empty State for History */}
            {!isLoading && !error && completedBookings.length === 0 && (
              <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-[#4d84a4]/20 rounded-full flex items-center justify-center mb-6">
                  <History className="h-12 w-12 text-[#4d84a4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Booking History</h3>
                <p className="text-gray-300 mb-6">
                  You haven&apos;t completed any parking sessions yet.
                </p>
                <button 
                  onClick={() => router.push('/map')}
                  className="rounded-lg bg-[#4d84a4] px-6 py-3 font-semibold hover:brightness-110 transition-all text-white"
                >
                  Find Parking
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Active Booking Card Component
interface ActiveBookingCardProps {
  booking: BookingAPIResponse;
  onViewReservation: () => void;
  getBookingStatus: () => BookingStatus;
  getStatusColor: (status: BookingStatus) => string;
  getStatusText: (status: BookingStatus) => string;
  formatDateTime: (dateString: string) => string;
}

function ActiveBookingCard({ 
  booking, 
  onViewReservation, 
  getBookingStatus, 
  getStatusColor, 
  getStatusText, 
  formatDateTime 
}: ActiveBookingCardProps) {
  return (
    <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Active Booking</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getBookingStatus())}`}>
          {getStatusText(getBookingStatus())}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Location and Slot */}
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-white">{booking.location_name}</p>
            <p className="text-sm text-gray-300">Slot #{booking.slot_number} {booking.zone_name && `• Zone: ${booking.zone_name}`}</p>
          </div>
        </div>

        {/* Vehicle */}
        <div className="flex items-center space-x-3">
          <Car className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-white">{booking.vehicle_plate}</p>
            <p className="text-sm text-gray-300">Vehicle</p>
          </div>
        </div>

        {/* Booking Time */}
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-white">
              {formatDateTime(booking.start_time)}
            </p>
            <p className="text-sm text-gray-300">Booking Time</p>
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-white">₹{booking.hourly_rate}/hour</p>
            <p className="text-sm text-gray-300">Rate</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[#4d84a4]/20">
          <button 
            onClick={onViewReservation}
            className="w-full rounded-lg bg-[#4d84a4] px-4 py-3 font-semibold hover:brightness-110 transition-all text-white"
          >
            View Reservation Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Booking History Card Component
interface BookingHistoryCardProps {
  booking: BookingAPIResponse;
  formatDateTime: (dateString: string) => string;
  onViewDetails: () => void;
}

function BookingHistoryCard({ booking, formatDateTime, onViewDetails }: BookingHistoryCardProps) {
  const calculateDuration = () => {
    if (!booking.start_time || !booking.exit_time) return 'N/A';
    
    const start = new Date(booking.start_time);
    const end = new Date(booking.exit_time);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return diffHours > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffMinutes}m`;
  };

  return (
    <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{booking.location_name}</h3>
            <p className="text-sm text-gray-300">Slot #{booking.slot_number} {booking.zone_name && `• Zone: ${booking.zone_name}`}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-medium text-green-300 bg-green-500/20 border border-green-500/40">
          Completed
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Vehicle</p>
          <p className="text-sm font-medium text-white">{booking.vehicle_plate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Duration</p>
          <p className="text-sm font-medium text-white">{calculateDuration()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Total Cost</p>
          <p className="text-sm font-medium text-white">₹{booking.fare || '0.00'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Date</p>
          <p className="text-sm font-medium text-white">
            {new Date(booking.start_time).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#4d84a4]/20">
        <div className="text-xs text-gray-400">
          {formatDateTime(booking.start_time)} - {booking.exit_time ? formatDateTime(booking.exit_time) : 'N/A'}
        </div>
        <button
          onClick={onViewDetails}
          className="px-4 py-2 rounded-lg border border-[#4d84a4]/25 bg-[#232834]/60 hover:bg-[#232834]/80 transition-all text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default UserBookingsPage;