// Reservation Manager Constants

// Polling configuration
export const POLLING_CONFIG = {
  INTERVAL: 7000, // 7 seconds as per requirements
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 1000, // 1 second base delay
  MAX_RETRY_DELAY: 30000, // 30 seconds max delay
} as const;

// Timer configuration
export const TIMER_CONFIG = {
  UPDATE_INTERVAL: 1000, // Update every second
  COST_UPDATE_INTERVAL: 60000, // Update cost display every minute (optional optimization)
} as const;

// Support contact information
export const SUPPORT_CONFIG = {
  PHONE_NUMBER: '+91-9876543210', // Hardcoded support phone number
  DISPLAY_NUMBER: '+91 98765 43210', // Formatted for display
  SUPPORT_HOURS: '24/7 Support Available',
} as const;

// Status display configuration
export const STATUS_CONFIG = {
  RESERVED: {
    title: 'RESERVED - NOT ARRIVED',
    description: 'You have not reached the parking location yet.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/25',
  },
  CHECKED_IN: {
    title: 'CURRENTLY PARKED',
    description: 'Your parking timer is running.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/25',
  },
  CHECKOUT: {
    title: 'PAYMENT REQUIRED',
    description: 'Your session has ended. Complete payment to finish checkout.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/25',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BOOKING_DETAILS: (id: string) => `/booking/my-bookings/${id}/`,
  ACTIVE_BOOKING: '/booking/my-active-booking/',
  USER_BOOKINGS: '/booking/my-bookings/',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  BOOKING_NOT_FOUND: 'Booking not found. Please check your booking details.',
  ACCESS_DENIED: 'You do not have permission to access this booking.',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again in a few moments.',
  INVALID_BOOKING_ID: 'Invalid booking ID provided.',
  POLLING_FAILED: 'Unable to sync reservation status. Please refresh the page.',
} as const;