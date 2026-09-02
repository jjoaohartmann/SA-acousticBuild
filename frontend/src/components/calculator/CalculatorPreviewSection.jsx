import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { IconWaveform, IconChartUp } from '../IconSet';
import styles from '../../style/CalculatorPreviewSection.module.css';

const EXEMPLO_FIXO = {
  area_elemento: 15.5,
  volume_receptor: 30,
  reverberacao: 0.6,
  reducao_sonora: 52,
  l1: 85,
};

export default function CalculatorPreviewSection() {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calcularExemplo = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/acustica/calcular', { tipo_analise: 'aereo', ...EXEMPLO_FIXO });
      setResultado(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao calcular o exemplo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <span className={styles.label}>Produto</span>
      <h2 className={styles.title}>Veja a calculadora em acao</h2>
      <p className={styles.description}>
        Um exemplo real de parede entre unidades — clique e veja o isolamento acustico previsto.
      </p>

      <div className={styles.card}>
        <div className={styles.iconBox}><IconWaveform size={32} color="#1E5EFF" /></div>
        <ul className={styles.exampleList}>
          <li>Area do elemento: 15,5 m²</li>
          <li>Volume do ambiente receptor: 30 m³</li>
          <li>Reducao sonora do material (R): 52 dB</li>
        </ul>

        {!resultado ? (
          <button className={styles.calcBtn} onClick={calcularExemplo} disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular exemplo'}
          </button>
        ) : (
          <div className={styles.resultBox}>
            <IconChartUp size={28} color="#1E5EFF" />
            <p className={styles.resultMain}>
              <strong>DnT ≈ {resultado.indicador_principal.valor.toFixed(2)} dB</strong>
            </p>
            <p className={styles.resultClass}>
              {resultado.classificacao === 'atende' ? 'Atende ao criterio' : 'Nao atende ao criterio'}
            </p>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <Link to="/calculadora" className={styles.ctaLink}>Fazer minha propria simulacao →</Link>
      </div>
    </section>
  );
}