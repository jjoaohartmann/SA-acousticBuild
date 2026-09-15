import axios from 'axios';

// URL/endereco do backend (API).
// - PRODUCAO: defina VITE_API_URL na Vercel com a URL do backend na Render.
// - DEV LOCAL: sem VITE_API_URL, cai automaticamente em http://localhost:8000.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acousticbuild_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;