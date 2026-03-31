import { API_BASE_URL } from "@/services/api";
import type { Property} from "@/types/types";

 interface PropertyRequest {
  name: string;
  street_address: string;
  city: string;
  capacity: number;
  specific_tags: string | null;
  status?: "Active" | "Suspended" | "Inactive";
  latitude?: number;
  longitude?: number;
}

interface PropertyFilters {
  fromDate?: string;
  toDate?: string;
  city?: string;
  tags?: string[];
  radius?: number;
}

export const getProperties = async (token:string): Promise<Property[]> => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/properties`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log("Fetched properties:", data);
        return data;
    }catch(e){
        return []
    }
}

export const getFamilyProperties = async(token?:string,filters?: PropertyFilters): Promise<Property[]> => {
    try{
        const params = new URLSearchParams();
        if (filters?.fromDate) {
         params.append("fromDate", filters.fromDate);
        }

        if (filters?.toDate) {
         params.append("toDate", filters.toDate);
        }

        if (filters?.city?.trim()) {
         params.append("city", filters.city.trim());
        }
        if (filters?.radius !== undefined)
         params.append("radius_km", String(filters.radius));

        if (filters?.tags?.length) {
            filters.tags.forEach((tag) => {
                if (tag.trim()) {
                params.append("tags", tag.trim());
                }
            });
        }

        const queryString = params.toString();
        const url = queryString
        ? `${API_BASE_URL}/api/v1/family/properties/radius?${queryString}`
        : `${API_BASE_URL}/api/v1/family/properties/radius`;

        const response = await fetch(url,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        return data
    }catch(e){
        return[]
    }
}

export const getAllProperties = async(token?:string,filters?: PropertyFilters): Promise<Property[]> => {
    try{
        const params = new URLSearchParams();
        if (filters?.fromDate) {
            params.append("fromDate", filters.fromDate);
            }

            if (filters?.toDate) {
            params.append("toDate", filters.toDate);
            }

            if (filters?.city?.trim()) {
            params.append("city", filters.city.trim());
            }
            if (filters?.radius !== undefined)
            params.append("radius_km", String(filters.radius));

            if (filters?.tags?.length) {
                filters.tags.forEach((tag) => {
                    if (tag.trim()) {
                    params.append("tags", tag.trim());
                    }
                });
            }

            const queryString = params.toString();
            const url = queryString
            ? `${API_BASE_URL}/api/v1/public/properties?${queryString}`
            : `${API_BASE_URL}/api/v1/public/properties`;

        const response = await fetch(url,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        return data
    }catch(e){
        return[]
    }
}

export const getPropertyByID = async(token:string, propertyID: string): Promise<Property> => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyID}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch property");
        }
        const data = await response.json();
        return data
    }catch(e){
        throw e ;
    }
}

export const createProperty = async (token:string , params : PropertyRequest) => {
    try{
        const res = await fetch(`${API_BASE_URL}/api/v1/properties`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if (!res.ok) {
            throw new Error("Failed to add property");
        }
    }catch(e){
        throw e ;
    }
}

export const deleteProperty = async (token:string , propertyID : number) => {
    try{
        const res = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyID}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error("Failed to delete property");
        }
    }catch(e){
        throw e ;
    }
}

export const updateProperty = async (token:string , propertyID : number, params: PropertyRequest) => {
    try{
        const res = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyID}`,{
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });
        if (!res.ok) {
            throw new Error("Failed to update property");
        }
    }catch(e){
        throw e ;
    }
}