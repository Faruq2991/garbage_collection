import axios from "axios";

// Base URL is proxied via Vite's configuration, so /api maps to FastAPI
const API = axios.create({
  baseURL: "/api",
});

// Example: Submit a garbage pickup request
export const submitPickupRequest = async (pickupData, token) => {
  try {
    const response = await API.post("/requests/", pickupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting pickup request:", error);
    throw error;
  }
};

// Example: Fetch all pickup requests (for collectors)
export const getPickupRequests = async (token) => {
  try {
    const response = await API.get("/requests/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    throw error;
  }
};
