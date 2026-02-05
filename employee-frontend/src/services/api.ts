// src/services/api.ts
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7121/api",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");


  const headers = (config.headers as AxiosRequestHeaders) ?? ({} as AxiosRequestHeaders);

  if (token) {
    headers["Authorization"] = `Bearer ${token}` as unknown as string;
  }

  config.headers = headers;
  return config;
});

export default api;
