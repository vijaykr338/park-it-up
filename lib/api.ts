import axios from "axios"; 
import {
    LoginPayload,
    SignupPayload,
    LoginResponse,
    SignupResponse,
    UpdateUserPayload,
    BasicMessageResponse,
    UploadProfilePictureResponse,
    Vehicle,
    CreateVehiclePayload,
    VehicleImagesResponse,
    ParkingLocation,
    CreateParkingLocationPayload,
    NearbyParkingItem,
    Booking,
    CreateBookingPayload,
    VerifyArrivalPayload,
    ProcessExitResponse,
} from "./types";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers = config.headers ?? {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

// ---- Auth ----
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
        const res = await api.post(`/user/login/`, {
            phone: payload.phone,
            password: payload.password,
        });
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "login failed");
    }
};

export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
    try {
        const res = await api.post(`/user/signup/`, {
            firstname: payload.firstName,
            lastname: payload.lastName,
            password: payload.password,
            cnf_password: payload.cnf_password,
            email: payload.email,
            phone: payload.phone,
        });
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Signup failed");
    }
};

// Update user profile (firstname/lastname)
export const updateUser = async (phone: string, payload: UpdateUserPayload): Promise<BasicMessageResponse> => {
    try {
        const res = await api.patch(`/user/update/${encodeURIComponent(phone)}/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.detail || e?.response?.data?.message || "Update failed");
    }
};

export const deleteUser = async (phone: string): Promise<BasicMessageResponse> => {
    try {
        const res = await api.delete(`/user/delete/${encodeURIComponent(phone)}/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.detail || e?.response?.data?.message || "Delete failed");
    }
};

export const uploadProfilePicture = async (phone: string, file: File): Promise<UploadProfilePictureResponse> => {
    try {
        const form = new FormData();
        form.append("profile_picture", file);
        const res = await api.patch(`/user/profile-picture/${encodeURIComponent(phone)}/`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Upload failed");
    }
};

export const deleteProfilePicture = async (phone: string): Promise<BasicMessageResponse> => {
    try {
        const res = await api.delete(`/user/profile-picture/${encodeURIComponent(phone)}/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Delete failed");
    }
};

// ---- Vehicles ----
export const listVehicles = async (): Promise<Vehicle[]> => {
    try {
        const res = await api.get(`/vehicle/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to load vehicles");
    }
};

export const createVehicle = async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    try {
        const res = await api.post(`/vehicle/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to create vehicle");
    }
};

export const updateVehicle = async (vehicleId: number, payload: Partial<CreateVehiclePayload>): Promise<Vehicle> => {
    try {
        const res = await api.put(`/vehicle/${vehicleId}/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to update vehicle");
    }
};

export const deleteVehicle = async (vehicleId: number): Promise<void> => {
    try {
        await api.delete(`/vehicle/${vehicleId}/`);
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to delete vehicle");
    }
};

export const listVehicleImages = async (vehicleId: number): Promise<VehicleImagesResponse> => {
    try {
        const res = await api.get(`/vehicle/${vehicleId}/images/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to load vehicle images");
    }
};

export const uploadVehicleImages = async (vehicleId: number, files: File[]): Promise<VehicleImagesResponse> => {
    try {
        const form = new FormData();
        files.forEach((f) => form.append("images", f));
        const res = await api.post(`/vehicle/${vehicleId}/images/`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to upload vehicle images");
    }
};

export const deleteVehicleImage = async (pictureId: number): Promise<BasicMessageResponse> => {
    try {
        const res = await api.delete(`/vehicle/delete-image/${pictureId}/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to delete vehicle image");
    }
};

// ---- Parking ----
export const listParkingLocations = async (): Promise<ParkingLocation[]> => {
    try {
        const res = await api.get(`/parking/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to load parking locations");
    }
};

export const getParkingLocation = async (id: number): Promise<ParkingLocation> => {
    try {
        const res = await api.get(`/parking/${id}/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to load parking location");
    }
};

export const createParkingLocation = async (payload: CreateParkingLocationPayload): Promise<ParkingLocation> => {
    try {
        const res = await api.post(`/parking/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to create parking location");
    }
};

export const updateParkingLocation = async (id: number, payload: Partial<CreateParkingLocationPayload>): Promise<ParkingLocation> => {
    try {
        const res = await api.put(`/parking/${id}/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to update parking location");
    }
};

export const deleteParkingLocation = async (id: number): Promise<void> => {
    try {
        await api.delete(`/parking/${id}/`);
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to delete parking location");
    }
};

export const nearbyParking = async (lat: number, lng: number): Promise<NearbyParkingItem[]> => {
    try {
        const res = await api.get(`/parking/nearby/`, { params: { lat, lng } });
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to fetch nearby parking");
    }
};

// ---- Booking ----
export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
    try {
        const res = await api.post(`/booking/create/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to create booking");
    }
};

export const listMyBookings = async (): Promise<Booking[]> => {
    try {
        const res = await api.get(`/booking/my-bookings/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to fetch bookings");
    }
};

export const cancelBooking = async (id: number): Promise<BasicMessageResponse> => {
    try {
        const res = await api.delete(`/booking/${id}/cancel/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to cancel booking");
    }
};

export const verifyArrival = async (payload: VerifyArrivalPayload): Promise<BasicMessageResponse> => {
    try {
        const res = await api.post(`/booking/verify-arrival/`, payload);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to verify arrival");
    }
};

export const processExit = async (id: number): Promise<ProcessExitResponse> => {
    try {
        const res = await api.post(`/booking/${id}/process-exit/`);
        return res.data;
    } catch (e: any) {
        throw Error(e?.response?.data?.message || "Failed to process exit");
    }
};