/**
 * Booking Flow Navigation Routes
 * 
 * This document outlines the complete user journey through the parking booking system
 */

/**
 * NAVIGATION FLOW:
 * 
 * 1. MAP PAGE (/map)
 *    User browses parking locations on the map
 *    - Clicks "Book Now" on a parking location card
 *    - Checks authentication status
 *    
 * 2. ZONE SELECTION PAGE (/booking/select-zone?location=<id>)
 *    User selects a parking zone within the location
 *    - Fetches location details via GET /parking/<location_id>/
 *    - Fetches available zones via GET /parking/locations/<location_id>/zones/
 *    - User selects a zone
 *    
 * 3. SLOT SELECTION (within select-zone page)
 *    User picks a specific parking slot
 *    - Fetches slots for zone via GET /parking/zones/<zone_id>/slots/
 *    - User selects a free slot
 *    
 * 4. BOOKING SUMMARY PAGE (/booking?spot=<slot_id>&location=<location_id>)
 *    User reviews booking details and completes payment
 *    - Displays selected slot and location
 *    - Selects vehicle and start time
 *    - Initiates Razorpay payment
 *    - Creates booking via POST /booking/create/
 *    
 * 5. RESERVATION PAGE (/reservation?booking=<booking_id>)
 *    User views active booking details
 *    - Displays parking timer
 *    - Shows booking status
 *    - Allows cancellation or checkout
 */

/**
 * API ENDPOINTS CALLED:
 * 
 * GET /parking/<location_id>/
 *   Returns: ParkingLocation
 *   
 * GET /parking/locations/<location_id>/zones/
 *   Returns: { zones: Zone[], location_id, location_name, total_zones }
 *   
 * GET /parking/zones/<zone_id>/slots/
 *   Returns: { slots: ParkingSlot[], zone_id, zone_name, description, ... stats }
 *   
 * POST /booking/create/
 *   Body: { vehicle_id, location_id, slot_id, start_time, payment_id, order_id }
 *   Returns: { id, ... booking details }
 */

/**
 * DEPRECATED ROUTES:
 * 
 * /booking/select-spot?location=<id>
 * - Old route that showed all slots for a location without zones
 * - Kept for backwards compatibility but new flow uses /booking/select-zone
 */

export {};
