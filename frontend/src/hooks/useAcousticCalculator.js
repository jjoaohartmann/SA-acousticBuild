import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useAcousticCalculator(tipoInicial) {
  const { user } = useAuth();
  const [tipoAnalise, setTipoAnalise] = useState(tipoInicial || 'aereo');
  const [dados, setDados] = useState({});
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const calcular = async (payload) => {
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const { data } = await api.post('/acustica/calcular', payload);
      setDados(payload);
      setResultado(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao calcular. Verifique os dados.');
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  const salvarSimulacao = async () => {
    // so e chamado se user existir — o token ja vai no header pelo interceptor do api.js
    try {
      await api.post('/acustica/salvar', { tipo_analise: tipoAnalise, dados_entrada: dados, resultado });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar a simulacao.');
    }
  };

  return {
    user,
    tipoAnalise,
    setTipoAnalise,
    dados,
    setDados,
    resultado,
    loading,
    error,
    saved,
    calcular,
    salvarSimulacao,
  };
}