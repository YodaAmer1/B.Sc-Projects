import type { UserData } from "@/types/types";
import { API_BASE_URL } from ".././api"

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
    role: string;
}


export const loginUser = async ({ email, password }: LoginUserRequest) => {

         const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email: email,
            password: password,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || data.message || "Login failed");
        }

        return data;
}

export const registerUser = async ({ username, email, password, role }: RegisterUserRequest) => {
     const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            role: role
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || data.message || "Registration failed");
        }

        return data;
}

export const getAllUsers= async (token: string): Promise<UserData[]>=> {
    try{
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/pending`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      console.log("Fetched users:", data);
      return data;
    }catch(e){
      return []; 
    }
}

export const verifyUser = async (token: string , id: number) => {
  try{
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${id}/verify`,{
      method: "PATCH",
      headers: {
          Authorization: `Bearer ${token}`
        },
     });
     if (!response.ok) {
      throw new Error("Failed to verify user");
    }
  }catch(e){
    throw new Error("Request failed");
  }
}

export const rejectUser = async (token: string , id: number) => {
  try{
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${id}/reject`,{
      method: "PATCH",
      headers: {
          Authorization: `Bearer ${token}`
        },
     });
     if (!response.ok) {
      throw new Error("Failed to reject user");
    }
  }catch(e){
    throw new Error("Request failed");
  }
}

export const updatePicture = async (token: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/v1/user/image/picture`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update picture");
    }

    return await response.json();
  } catch (e) {
    throw e;
  }
};

export const getPicture = async (token: string, userId: number) :Promise<Blob | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/${userId}/image/picture`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch picture");
    }
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();

      if (!data.picture) {
        return null;
      }

      return null;
    }

    return await response.blob();
  } catch (e) {
    throw e;
  }
};

export const decodeJwtToken = (token: string) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      throw new Error("Invalid token payload");
    }

    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    return JSON.parse(decodedPayload);
  } catch {
    throw new Error("Failed to decode token");
  }
};
