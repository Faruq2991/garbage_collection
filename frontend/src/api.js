import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export const getGarbageRequests = async () => {
  const response = await API.get("/requests");
  return response.data;
};
