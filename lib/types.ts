export interface LoginPayload {
    phone : string,
    password : string
}

export interface SignupPayload{
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    cnf_password: string;
    email: string;
}

export interface LoginResponse{
    message: string,
    access :string, 
    refresh:string
}

export interface User{
    firstname : string,
    lastname : string,
    email : string,
    phone : string
}


export interface SignupResponse{
    message : string,
    user : User
}

// ---- User endpoints ----
export interface UpdateUserPayload {
    firstname?: string;
    lastname?: string;
}

export interface BasicMessageResponse {
    message: string;
}

export interface UploadProfilePictureResponse extends BasicMessageResponse {
    profile_picture_url: string;
}

// ---- Vehicle endpoints ----
export interface Vehicle {
    vehicle_id: number;
    vehicle_registration_number: string;
    vehicle_type: string;
    vehicle_name: string;
}

export interface CreateVehiclePayload {
    vehicle_registration_number: string;
    vehicle_type: string;
    vehicle_name: string;
}

export interface VehicleImage {
    id: number;
    vehicle: number; // vehicle id (FK)
    picture_link: string;
    created_at: string; // ISO
}

export interface VehicleImagesResponse {
    vehicle: string; // as returned by backend __str__
    images: VehicleImage[];
}

// ---- Parking endpoints ----
export interface ParkingLocation {
    id: number;
    name: string;
    address: string;
    // GeoJSON-ish from serializer; use minimal shape we rely upon
    location: unknown;
    parkingSlots: number;
    hourly_rate: number;
    images?: ParkingImage[];
}

export interface ParkingImage {
    id: number;
    parking_location_id: number;
    image: string; // Cloudinary URL or identifier
}

export interface CreateParkingLocationPayload {
    name: string;
    address: string;
    location: { coordinates: [number, number] }; // [lng, lat]
    parkingSlots?: number;
    hourly_rate: number | string;
}

export interface NearbyParkingItem {
    id: number;
    name: string;
    address: string;
    price_per_hour: number; // backend uses this key in nearby API
    distance_km: number;
    coordinates: [number, number]; // [lng, lat]
}

// ---- Booking endpoints ----
export interface Booking {
    id: number;
    start_time: string; // ISO
    exit_time: string | null;
    fare: string | null; // Decimal as string
    location_name: string;
    vehicle_plate: string;
}

export interface CreateBookingPayload {
    start_time: string; // ISO
    vehicle_id: number;
    location_id: number;
}

export interface VerifyArrivalPayload {
    vehicle_plate: string;
}

export interface ProcessExitResponse {
    message: string;
    fare: string;
    total_hours: number;
}