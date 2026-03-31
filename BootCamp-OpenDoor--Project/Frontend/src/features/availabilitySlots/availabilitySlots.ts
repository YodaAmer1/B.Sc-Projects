import { API_BASE_URL } from "@/services/api";
import type { AvailabilitySlot } from "@/types/types";

interface SlotCreate{
    property_id: number;
    start_date: string;
    end_date: string;
}
interface slotUpdate {
    start_date: string;
    end_date: string;
}

export const getPropertyAvailabilitySlots = async(token:string , propertyID: string): Promise<AvailabilitySlot[]> => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyID}/available_slots`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data
    }catch(e){
        return[]
    }
}

export const createAvailabilitySlot = async(token:string , params:SlotCreate) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/availability_slots`,{
            method: "POST",
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if (!response.ok) {
            throw new Error("Failed to create availability slot");
        }
    }catch(e){
        throw e;
    }
}

export const updateAvailabilitySlot = async(token:string ,slotID:number, params:slotUpdate) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/availability_slots/${slotID}`,{
            method: "PATCH",
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if (!response.ok) {
            throw new Error("Failed to create availability slot");
        }
    }catch(e){
        throw e;
    }
}

export const deleteAvailabilitySlot = async (token: string, slotId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/availability_slots/${slotId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete availability slot");
    }
  } catch (e) {
    throw e;
  }
};