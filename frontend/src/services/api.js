import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
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

export const getMaterial = (id) =>
  api.get(`/materiais/${id}`);

export const getSistemas = (tipoElemento) =>
  api.get('/sistemas', { params: tipoElemento ? { tipo_elemento: tipoElemento } : {} });

export const getSistemaPorCodigo = (codigo) =>
  api.get(`/sistemas/${codigo}`);

export const montarSistema = (camadas) =>
  api.post('/sistemas/montar', { camadas });

export const getCenarios = () =>
  api.get('/acustica/cenarios');

export const calcularAcustica = (payload) =>
  api.post('/acustica/calcular', payload);

export default api;