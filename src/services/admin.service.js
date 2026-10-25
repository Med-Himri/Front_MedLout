import axiosInstance from "@/utils/axiosInstance";

// All admin calls go through axiosInstance, which adds the Bearer token and
// sends the user back to the login page when the session has expired.

/* ================= SESSION ================= */
export const loginAPI = (email, password) =>
  axiosInstance.post("/api/user/login", { email, password });
export const getMeAPI = () => axiosInstance.get("/api/user/me");
export const changeMyPasswordAPI = (current, next) =>
  axiosInstance.post("/api/user/change-password", { current, next });
export const forgotPasswordAPI = (email) =>
  axiosInstance.post("/api/user/forgot-password", { email });
export const resetPasswordAPI = (userId, code, newPassword) =>
  axiosInstance.post("/api/user/reset-password", { userId, code, newPassword });

/* ================= DASHBOARD ================= */
export const getDashboardAPI = () => axiosInstance.get("/api/admin/dashboard");

/* ================= ORDERS ================= */
export const getOrdersAPI = (params) => axiosInstance.get("/api/order", { params });
export const getOrderAPI = (id) => axiosInstance.get(`/api/order/${id}`);
export const updateOrderAPI = (id, data) => axiosInstance.patch(`/api/order/${id}`, data);
export const deleteOrderAPI = (id) => axiosInstance.delete(`/api/order/${id}`);

/* ================= MESSAGES ================= */
export const getMessagesAPI = () => axiosInstance.get("/api/message");
export const updateMessageAPI = (id, data) => axiosInstance.patch(`/api/message/${id}`, data);
export const deleteMessageAPI = (id) => axiosInstance.delete(`/api/message/${id}`);

/* ================= STAFF (admin) ================= */
export const getStaffAPI = () => axiosInstance.get("/api/user/staff");
export const createStaffAPI = (data) => axiosInstance.post("/api/user/staff", data);
export const updateStaffRoleAPI = (id, role) => axiosInstance.patch(`/api/user/staff/${id}`, { role });
export const setStaffPasswordAPI = (id, password) =>
  axiosInstance.post(`/api/user/staff/${id}/password`, { password });
export const deleteStaffAPI = (id) => axiosInstance.delete(`/api/user/staff/${id}`);
