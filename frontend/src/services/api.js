import axios from 'axios';

// Em desenvolvimento aponta para o backend local (localhost:8000).
// Em producao (front e back no MESMO dominio da Vercel) usa origem relativa ''.
// Sobrescreva via VITE_API_URL caso o backend fique em outro dominio.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : '');

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acousticbuild_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;