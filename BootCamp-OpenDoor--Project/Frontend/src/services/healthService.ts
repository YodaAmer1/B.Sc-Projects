import { API_BASE_URL } from "./api"

export const getHealth = async () => {
    try {
        const respone = await fetch(`${API_BASE_URL}/health`);
        const data = await respone.json();
        return data;
    }catch{
        return {status: "error"};
    }
}