import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach Clerk token automatically
api.interceptors.request.use(async (config) => {
  const token = await window.Clerk?.session?.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});