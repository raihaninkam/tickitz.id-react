import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST + "/api",
  withCredentials: true, // kalau pakai cookie
});

export default api;
