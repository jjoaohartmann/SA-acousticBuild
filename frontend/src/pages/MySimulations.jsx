import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { IconWaveform } from '../components/IconSet';
import styles from '../style/MySimulations.module.css';

export default function MySimulations() {
  const { user } = useAuth();
  const [simulacoes, setSimulacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { data } = await api.get('/acustica/simulacoes');
        if (ativo) setSimulacoes(data);
      } catch (err) {
        if (ativo) setError(err.response?.data?.detail || 'Erro ao carregar as simulações.');
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => { ativo = false; };
  }, []);

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Home</Link>

      <div className={styles.card}>
        <h1 className={styles.title}>MINHAS SIMULAÇÕES</h1>
        <p className={styles.subtitle}>Histórico de simulações de {user?.name?.split(' ')[0] || 'usuário'}</p>

        {loading && <p className={styles.status}>Carregando...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && simulacoes.length === 0 && (
          <div className={styles.empty}>
            <IconWaveform size={40} color="#94a3b8" />
            <p>Você ainda não salvou nenhuma simulação.</p>
            <Link to="/calculadora" className={styles.emptyLink}>Fazer uma simulação →</Link>
          </div>
        )}

        {simulacoes.length > 0 && (
          <ul className={styles.list}>
            {simulacoes.map((sim) => {
              const isImpacto = sim.tipo_analise === 'impacto' || sim.tipo_analise === 'lnt';
              const tipoLabel = isImpacto ? "Ruído de Impacto (L'nT)" : 'Ruído Aéreo (DnT)';
              const principal = sim.resultado?.indicador_principal;
              const classificacao = sim.resultado?.classificacao;
              // 'indisponivel' significa "faltou dado", não "reprovou" — pintar
              // de vermelho e escrever "Não Atende" seria mentir sobre o sistema.
              const seloSemDado = { texto: 'Sem dado para julgar', cor: '#FACC15' };
              const selo = {
                atende: { texto: 'Atende NBR 15575', cor: '#22C55E' },
                nao_atende: { texto: 'Não Atende', cor: '#F43F5E' },
                indisponivel: seloSemDado,
                // é o valor que o back-end grava quando recusa o cálculo
                'NÃO DETERMINADO': seloSemDado,
              }[classificacao];

              return (
                <li key={sim.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemType}>{tipoLabel}</span>
                    {/* O selo fica fora do indicador: quando não há número, ainda
                        é preciso dizer por quê — antes a linha sumia inteira. */}
                    <span className={styles.itemValue}>
                      {principal ? (
                        <>
                          {principal.nome} ={' '}
                          {Number.isFinite(principal.valor)
                            ? `${principal.valor.toFixed(2).replace('.', ',')} ${principal.unidade}`
                            : '—'}
                        </>
                      ) : 'Sem resultado numérico'}
                      {selo && (
                        <span style={{
                          marginLeft: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: selo.cor,
                        }}>
                          ({selo.texto})
                        </span>
                      )}
                    </span>
                  </div>
                  <span className={styles.itemDate}>
                    {new Date(sim.criado_em).toLocaleDateString('pt-BR')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className={styles.copyright}>Copyright © 2026 AcousticBuild. Todos os direitos reservados.</p>
    </div>
  );
}