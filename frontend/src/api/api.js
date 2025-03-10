import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL: "http://localhost:8000",
});

// ✅ User Authentication

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/users/register/", userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/users/login/", credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await API.get("/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// ✅ Garbage Pickup Requests

export const createPickupRequest = async (pickupData, token) => {
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


export const getUserRequests = async (token) => {
  try {
    const response = await API.get("/requests/my-requests/", {  // ✅ Correct API
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user requests:", error);
    throw error;
  }
};

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

export const acceptRequest = async (requestId, token) => {
  try {
    const response = await API.put(`/requests/${requestId}/accept/`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

export const completeRequest = async (requestId, token) => {
  try {
    const response = await API.put(`/requests/${requestId}/complete/`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error completing request:", error);
    throw error;
  }
};

export default API;

