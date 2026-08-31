import axiosInstance from "@/utils/axiosInstance";

export const userLoginAPI = async (email, password) => {
  const response = await axiosInstance.post("/api/user/login", { email, password });
  return response;
};

export const StaffRegisterAPI = async (fullName, phone, email, password) => {
  const response = await axiosInstance.post("/api/user/register", {
    fullName,
    phone,
    email,
    password,
  });
  return response;
};
