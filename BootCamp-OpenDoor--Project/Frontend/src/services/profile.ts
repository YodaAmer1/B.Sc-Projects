import { API_BASE_URL } from "./api";

interface UserLocation {
    user_id: number; 
    latitude: number; 
    longitude: number;
}

export const updateUserLocation = async (token: string,params: UserLocation) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/family/profile`, {
    method: "PATCH",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to update location");
  }

  return res.json();
};