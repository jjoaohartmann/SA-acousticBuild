import axios from 'axios';

// Em desenvolvimento o back-end roda local; em produção basta definir
// VITE_API_URL no ambiente de build — nada de endereço fixo no código.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acousticbuild_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Métodos auxiliares da Calculadora e Catálogo Construtivo
export const getMateriais = (categoria) =>
  api.get('/materiais', { params: categoria ? { categoria } : {} });

export const getSistemas = (tipoElemento) =>
  api.get('/sistemas', { params: tipoElemento ? { tipo_elemento: tipoElemento } : {} });

export const montarSistema = (camadas) =>
  api.post('/sistemas/montar', { camadas });

export const getCenarios = () =>
  api.get('/acustica/cenarios');

export default api;