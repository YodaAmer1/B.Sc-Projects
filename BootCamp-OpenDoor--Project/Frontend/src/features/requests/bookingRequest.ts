import { API_BASE_URL } from "@/services/api"
import type { BookingRequest } from "@/types/types";

interface CreateBookingRequest{
    availability_slot_id : number;
    requested_start_date : string;
    requested_end_date: string;
    requested_capacity: number;
    family_message: string
}

interface ChangeStatus{
    request_status: string;
    host_response: string;
}

export const getHostBookingRequests = async (token: string) : Promise<BookingRequest[]>=> {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/host/booking_request`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data
    }catch(e){
        return[];
    }
}

export const getEvacueeBookingRequests = async (token: string) : Promise<BookingRequest[]>=> {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/family/booking_request`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        }); 
        const data = await response.json();
        return data
    }catch(e){
        return[];
    }
}

export const createBookingRequest = async (token: string , params: CreateBookingRequest) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/requests`,{
            method: "POST",
            headers:{
                Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if (!response.ok) {
            throw new Error("Failed to create request");
        }
    }catch(e){
        throw e;
    }
}

export const cancelBookingRequest = async (token: string, requestID: number ) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/requests/${requestID}/cancel`,{
            method: "PATCH",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to cancel the request");
        }
    }catch(e){
        throw e;
    }
}

export const changeBookingRequestStatus = async(token:string ,requestID:number, params:ChangeStatus) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/requests/${requestID}/status`,{
            method: "PATCH",
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if (!response.ok) {
            throw new Error("Failed to change request status");
        }
    }catch(e){
        throw e;
    }
}