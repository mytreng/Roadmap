import axios from "axios";
import { parseApiError } from "./errors";

export const AUTH_EXPIRED_EVENT = "auth:expired";

// Endpoints where a 401 means "wrong credentials", not "session expired".
const PUBLIC_ENDPOINTS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const api = axios.create({
  // for server
  baseURL: "/mytr/backEnd/public/api",
  // for local
  //  baseURL: "http://127.0.0.1:8000/api",
  timeout: 20000,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = parseApiError(error);
    error.apiError = apiError;

    const url = error.config?.url || "";
    const isPublic = PUBLIC_ENDPOINTS.some((path) => url.startsWith(path));

    // Expired/invalid token: clear it and let the app send the user to login.
    if (apiError.kind === "auth" && !isPublic) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  },
);

export default api;
