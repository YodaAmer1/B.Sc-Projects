import { getEvacueeBookingRequests, getHostBookingRequests } from "@/features/requests/bookingRequest";
import type { BookingRequest } from "@/types/types";

export const getRequestsByRole = async (role: string | null , token: string | null): Promise<BookingRequest[]> => {
     if (!token || !role) {
                return [];
            }
    if (role === "Host") {
        return await getHostBookingRequests(token);
    }

    if (role === "Evacuee") {
        return await getEvacueeBookingRequests(token)
    } 
    return[];
};