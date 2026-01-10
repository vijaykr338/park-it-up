# Reservation Management System Documentation

This documentation covers the hooks, constants, and utilities used in the Park-It-Up reservation management system.

## Table of Contents

1. [Hooks](#hooks)
2. [Constants](#constants)
3. [Utilities](#utilities)
4. [Types](#types)
5. [Components](#components)
6. [Usage Examples](#usage-examples)

## Hooks

### useBookingStatus

**Purpose**: Manages real-time booking status with automatic polling and error handling.

**Parameters**:
```typescript
interface UseBookingStatusOptions {
  bookingId: string | null;
  enabled?: boolean;
  onError?: (error: ReservationError) => void;
  onStatusChange?: (status: BookingStatus) => void;
}
```

**Returns**:
```typescript
interface UseBookingStatusReturn {
  booking: BookingAPIResponse | null;
  status: BookingStatus;
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}
```

**Features**:
- Polls every 7 seconds for real-time updates
- Automatic retry with exponential backoff
- Handles 404/403 errors with navigation
- Pauses polling when tab is inactive
- Status change callbacks

**Example**:
```typescript
const { booking, status, isLoading, error, refetch } = useBookingStatus({
  bookingId: "123",
  onStatusChange: (newStatus) => console.log('Status changed:', newStatus),
  onError: (error) => console.error('Booking error:', error)
});
```

### useParkingTimer

**Purpose**: Provides live parking timer calculations with real-time cost updates.

**Parameters**:
```typescript
interface UseParkingTimerOptions {
  startTime: string | null;
  hourlyRate: number;
  status: BookingStatus;
  enabled?: boolean;
  debugTimeOffset?: number; // Debug: Add minutes to elapsed time
}
```

**Returns**:
```typescript
interface UseParkingTimerReturn {
  timer: ParkingTimer | null;
  isRunning: boolean;
  formattedDuration: string;
  currentCost: number;
}
```

**Features**:
- Updates every second when active
- Calculates elapsed time and current cost
- Pauses when tab is not visible
- Formatted duration display (e.g., "2h 34m")
- Only runs when status is 'checked_in'

**Example**:
```typescript
const { isRunning, formattedDuration, currentCost } = useParkingTimer({
  startTime: booking?.start_time,
  hourlyRate: 15,
  status: 'checked_in',
  enabled: true,
  debugTimeOffset: 120 // Debug: simulate 2 hours of parking
});
```

### useActiveBooking

**Purpose**: Fetches and manages the user's currently active booking.

**Returns**:
```typescript
interface UseActiveBookingReturn {
  activeBooking: BookingAPIResponse | null;
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}
```

**Features**:
- Polls every 7 seconds
- Returns null if no active booking (404)
- Automatic retry for network errors
- Background polling management

**Example**:
```typescript
const { activeBooking, isLoading, error } = useActiveBooking();
```

### useAllBookings

**Purpose**: Fetches all user bookings with error handling.

**Returns**:
```typescript
interface UseAllBookingsReturn {
  bookings: BookingAPIResponse[];
  isLoading: boolean;
  error: ReservationError | null;
  refetch: () => void;
}
```

**Features**:
- Fetches complete booking history
- Automatic retry on failure
- Returns empty array on error

**Example**:
```typescript
const { bookings, isLoading, error } = useAllBookings();
```

### usePollingLifecycle

**Purpose**: Manages polling lifecycle with tab visibility detection.

**Parameters**:
```typescript
interface UsePollingLifecycleOptions {
  enabled?: boolean;
  pauseOnHidden?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
}
```

**Returns**:
```typescript
interface UsePollingLifecycleReturn {
  isVisible: boolean;
  shouldPoll: boolean;
  pausePolling: () => void;
  resumePolling: () => void;
}
```

**Features**:
- Detects tab visibility changes
- Pauses polling when tab is hidden
- Manual pause/resume controls
- Performance optimization

**Example**:
```typescript
const { shouldPoll, pausePolling, resumePolling } = usePollingLifecycle({
  pauseOnHidden: true,
  onVisibilityChange: (visible) => console.log('Tab visible:', visible)
});
```

### useCleanupManager

**Purpose**: Manages cleanup of intervals and timeouts to prevent memory leaks.

**Returns**:
```typescript
{
  addTimeout: (timeout: NodeJS.Timeout) => NodeJS.Timeout;
  addInterval: (interval: NodeJS.Timeout) => NodeJS.Timeout;
  clearTimeout: (timeout: NodeJS.Timeout) => void;
  clearInterval: (interval: NodeJS.Timeout) => void;
  clearAll: () => void;
}
```

**Features**:
- Tracks all timeouts and intervals
- Automatic cleanup on unmount
- Manual cleanup methods

**Example**:
```typescript
const { addTimeout, clearAll } = useCleanupManager();
const timeout = addTimeout(setTimeout(() => {}, 1000));
```

## Constants

### POLLING_CONFIG

Configuration for API polling behavior:

```typescript
export const POLLING_CONFIG = {
  INTERVAL: 7000, // 7 seconds as per requirements
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 1000, // 1 second base delay
  MAX_RETRY_DELAY: 30000, // 30 seconds max delay
} as const;
```

### TIMER_CONFIG

Configuration for timer updates:

```typescript
export const TIMER_CONFIG = {
  UPDATE_INTERVAL: 1000, // Update every second
  COST_UPDATE_INTERVAL: 60000, // Update cost display every minute
} as const;
```

### SUPPORT_CONFIG

Support contact information:

```typescript
export const SUPPORT_CONFIG = {
  PHONE_NUMBER: '+91-9876543210',
  DISPLAY_NUMBER: '+91 98765 43210',
  SUPPORT_HOURS: '24/7 Support Available',
} as const;
```

### STATUS_CONFIG

Status display configuration for different booking states:

```typescript
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
```

### API_ENDPOINTS

API endpoint templates:

```typescript
export const API_ENDPOINTS = {
  BOOKING_DETAILS: (id: string) => `/booking/my-bookings/${id}/`,
  ACTIVE_BOOKING: '/booking/my-active-booking/',
  USER_BOOKINGS: '/booking/my-bookings/',
} as const;
```

### ERROR_MESSAGES

Standardized error messages:

```typescript
export const ERROR_MESSAGES = {
  BOOKING_NOT_FOUND: 'Booking not found. Please check your booking details.',
  ACCESS_DENIED: 'You do not have permission to access this booking.',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again in a few moments.',
  INVALID_BOOKING_ID: 'Invalid booking ID provided.',
  POLLING_FAILED: 'Unable to sync reservation status. Please refresh the page.',
} as const;
```

## Utilities

### ReservationErrorHandler

**Purpose**: Centralized error handling with retry logic and user-friendly messages.

**Methods**:

#### handleError()
```typescript
handleError(
  error: ReservationError | Error | unknown,
  options: ErrorHandlingOptions = {}
): ReservationError
```

Converts various error types to standardized ReservationError format.

#### isNetworkError()
```typescript
isNetworkError(error: ReservationError): boolean
```

Determines if error is network-related.

#### isAuthError()
```typescript
isAuthError(error: ReservationError): boolean
```

Checks for authentication/authorization errors (401/403).

#### isNotFoundError()
```typescript
isNotFoundError(error: ReservationError): boolean
```

Checks for not found errors (404).

#### shouldRetry()
```typescript
shouldRetry(error: ReservationError, attemptCount: number): boolean
```

Determines if an error should trigger a retry based on error type and attempt count.

#### getRetryDelay()
```typescript
getRetryDelay(attemptCount: number): number
```

Calculates retry delay with exponential backoff and jitter.

#### getUserFriendlyMessage()
```typescript
getUserFriendlyMessage(error: ReservationError): string
```

Converts technical errors to user-friendly messages.

**Example**:
```typescript
import { errorHandler } from '@/components/reservation/utils';

try {
  await fetchBooking();
} catch (error) {
  const processedError = errorHandler.handleError(error, {
    showToast: true,
    logError: true
  });
  console.log(errorHandler.getUserFriendlyMessage(processedError));
}
```

### withErrorHandling()

**Purpose**: Higher-order function that wraps async operations with error handling.

```typescript
function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: ErrorHandlingOptions
): Promise<T>
```

**Example**:
```typescript
const safeOperation = withErrorHandling(
  () => api.get('/booking/123'),
  { showToast: true }
);
```

### createRetryWrapper()

**Purpose**: Creates a retry wrapper for operations with automatic retry logic.

```typescript
function createRetryWrapper<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): () => Promise<T>
```

**Example**:
```typescript
const retryableOperation = createRetryWrapper(
  () => fetchBookingStatus(),
  3
);
```

## Types

### BookingStatus
```typescript
type BookingStatus = 'reserved' | 'checked_in' | 'checkout';
```

### BookingDetails
```typescript
interface BookingDetails {
  id: number;
  start_time: string;
  exit_time: string | null;
  fare: number | null;
  location_name: string;
  vehicle_plate: string;
  slot_number: number;
  hourly_rate: number;
  location_id: number;
  slot_id: number;
}
```

### ParkingTimer
```typescript
interface ParkingTimer {
  startTime: Date;
  currentTime: Date;
  elapsedSeconds: number;
  elapsedMinutes: number;
  elapsedHours: number;
  formattedDuration: string; // "2h 34m"
  currentCost: number;
  hourlyRate: number;
}
```

### ReservationError
```typescript
interface ReservationError {
  message: string;
  code?: string;
  statusCode?: number;
}
```

## Components

### ReservationErrorBoundary

**Purpose**: Catches and handles React errors in the reservation system.

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: ReservationError, retry: () => void) => ReactNode;
  onError?: (error: ReservationError) => void;
}
```

### ReservationLoadingState

**Purpose**: Displays loading state with skeleton UI for reservation pages.

**Props**:
```typescript
interface LoadingStateProps {
  message?: string;
  showSkeleton?: boolean;
  onRefresh?: () => void;
}
```

### StatusDisplay

**Purpose**: Shows current booking status with appropriate styling and information.

**Props**:
```typescript
interface StatusDisplayProps {
  status: BookingStatus;
  locationName?: string;
  slotNumber?: number;
}
```

## Usage Examples

### Complete Reservation Page Implementation

```typescript
"use client";

import React, { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { 
  StatusDisplay, 
  ReservationLoadingState,
  ReservationErrorBoundary 
} from "@/components/reservation";
import { 
  useBookingStatus, 
  useParkingTimer 
} from "@/components/reservation/hooks";

export default function ReservationPage() {
  const params = useSearchParams();
  const bookingId = params.get("booking");

  const handleError = useCallback((error) => {
    console.error('Booking error:', error);
  }, []);

  const { booking, status, isLoading, error, refetch } = useBookingStatus({
    bookingId,
    enabled: !!bookingId,
    onError: handleError
  });

  const { isRunning, formattedDuration, currentCost } = useParkingTimer({
    startTime: booking?.start_time || null,
    hourlyRate: booking?.hourly_rate || 15,
    status,
    enabled: true
  });

  if (isLoading) {
    return <ReservationLoadingState onRefresh={refetch} />;
  }

  return (
    <ReservationErrorBoundary onError={handleError}>
      <div className="reservation-page">
        <StatusDisplay 
          status={status}
          locationName={booking?.location_name}
          slotNumber={booking?.slot_number}
        />
        
        <div className="timer-display">
          <h3>Time Parked: {formattedDuration}</h3>
          <p>Current Cost: ₹{currentCost.toFixed(2)}</p>
          {isRunning && <span className="live-indicator">🔴 Live</span>}
        </div>
      </div>
    </ReservationErrorBoundary>
  );
}
```

### Error Handling Pattern

```typescript
import { errorHandler, withErrorHandling } from '@/components/reservation/utils';

// Method 1: Direct error handling
try {
  const booking = await api.get('/booking/123');
} catch (error) {
  const processedError = errorHandler.handleError(error, {
    showToast: true,
    logError: true
  });
  
  if (errorHandler.isNetworkError(processedError)) {
    // Handle network error
  } else if (errorHandler.isAuthError(processedError)) {
    // Handle auth error
  }
}

// Method 2: Using wrapper function
const safeBookingFetch = withErrorHandling(
  () => api.get('/booking/123'),
  { showToast: true }
);
```

### Custom Hook Integration

```typescript
import { usePollingLifecycle, useCleanupManager } from '@/components/reservation/hooks';

function useCustomPolling() {
  const { shouldPoll } = usePollingLifecycle({ pauseOnHidden: true });
  const { addInterval, clearAll } = useCleanupManager();

  useEffect(() => {
    if (shouldPoll) {
      const interval = addInterval(setInterval(() => {
        // Polling logic
      }, 7000));
    }

    return clearAll;
  }, [shouldPoll, addInterval, clearAll]);
}
```

## Best Practices

1. **Always use error boundaries** around reservation components
2. **Implement proper loading states** for better UX
3. **Use polling lifecycle hooks** to optimize performance
4. **Handle all error types** appropriately (network, auth, not found)
5. **Clean up timers and intervals** to prevent memory leaks
6. **Use memoized callbacks** to prevent infinite re-renders
7. **Implement retry logic** for network operations
8. **Provide user-friendly error messages**

## Debug Features

### Debug Time Simulation

In development mode, the reservation page includes debug controls to simulate time passing:

**Activation**:
- Press `Ctrl+Shift+D` to toggle debug controls
- Or click the "Debug" button in the header (development only)

**Features**:
- **Add 30 Minutes**: Incremental button that adds 30 minutes each click
- **Reset**: Clear debug time offset
- **Real-time Price Display**: Shows cost calculation as time increases
- **Visual Progress**: Three cards showing debug time, duration, and cost

**Usage**:
```typescript
// In useParkingTimer hook
const { currentCost, formattedDuration } = useParkingTimer({
  startTime: booking?.start_time,
  hourlyRate: 15,
  status: 'checked_in',
  debugTimeOffset: 120 // Adds 2 hours to elapsed time
});
```

**Visual Indicators**:
- **Debug Time Added**: Shows total debug time added (e.g., "2h 30m")
- **Simulated Duration**: Shows the formatted duration with debug time
- **Simulated Cost**: Shows real-time cost calculation
- **Cost Formula**: Displays the calculation breakdown
- **Yellow warning styling** indicates debug mode is active

**Example Progression**:
1. Click "Add 30 Minutes" → Shows 30m, ₹7.50 (at ₹15/hour)
2. Click again → Shows 1h 0m, ₹15.00
3. Click again → Shows 1h 30m, ₹22.50
4. Continue clicking to simulate hours of parking

## Performance Considerations

- Polling pauses when tab is inactive
- Timer updates pause when not visible
- Exponential backoff for retries
- Automatic cleanup of resources
- Memoized callbacks and values
- Optimized re-render cycles