import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Admin pages that work without being signed in
export const PUBLIC_ADMIN_PATHS = [
  "/dashboard/login",
  "/dashboard/mot-de-passe-oublie",
  "/dashboard/reinitialiser",
];

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Expired or invalid session on an admin page → back to the login page.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      window.location.pathname.startsWith("/dashboard") &&
      !PUBLIC_ADMIN_PATHS.includes(window.location.pathname)
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      window.location.href = "/dashboard/login?expired=1";
    }
    return Promise.reject(error);
  }
);

/** The server's French error message, or a fallback. */
export const apiError = (error, fallback = "Une erreur est survenue") =>
  error?.response?.data?.message || fallback;

export default axiosInstance;
