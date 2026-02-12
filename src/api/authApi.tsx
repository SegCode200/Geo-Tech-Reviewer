import axios from "axios";

const API_URL = "https://geo-tech-backend.onrender.com/api";

 const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow sending/receiving cookies
});

export const loginInternalUser = async (data: { email: string; password: string }) => {
  const res = await api.post(`/internal-users/login`, data);
  return res.data;
};
export const refreshSession = async () => {
  const res = await api.get("/internal-users/session");
  return res.data;
};
export const logoutAdmin = async () => {
  await api.post("/auth/logout");
};

// Email Verification and Password Setup
export const verifyInternalUserEmail = async (token: string) => {
  // send token as query param using axios params to ensure safe encoding
  const res = await api.get(`/internal-users/verify?token=${token}`);
  return res.data;
};

export const setInternalUserPassword = async (data: {
  token: string;
  password: string;
}) => {
  const res = await api.post(`/internal-users/set-password`, data);
  return res.data;
};

export const logout = async () => {
  await api.get("/internal-users/logout");
};

// Governor Signature Upload
export const uploadSignature = async (formData: FormData) => {
  const res = await api.post("/internal-users/upload-signature", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
