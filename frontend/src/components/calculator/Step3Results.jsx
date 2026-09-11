import React, { useState } from 'react';
import PdfReportGenerator from './PdfReportGenerator';
import styles from '../../style/Calculator.module.css';

export default function Step3Results({ resultado, user, salvarSimulacao, saved, form = {} }) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  if (!resultado) return null;

  const tipo = resultado.tipo || 'aereo';
  const principal = resultado.indicador_principal;
  const secundario = resultado.indicador_secundario;
  const criterios = resultado.criterios || {};
  const detalhes = resultado.detalhes || {};
  const fontes = resultado.fontes || [];
  const limitacoes = resultado.limitacoes || [];
  const composicao = resultado.composicao || [];
  const propriedades = resultado.propriedades_fisicas || {};

  const statusAtende = resultado.status_atendimento === 'ATENDE' || resultado.classificacao === 'atende';
  const semDado = resultado.confiabilidade === 'sem_dado' || !principal;

  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.4px' }}>
            Relatório de Desempenho Acústico
          </span>
          <h2 className={styles.cardTitle} style={{ margin: '4px 0 0 0' }}>
            {criterios.cenario || (tipo === 'impacto' ? 'Avaliação de Ruído de Impacto' : 'Avaliação de Isolamento Aéreo')}
          </h2>
        </div>

        {/* Exportação em PDF */}
        <PdfReportGenerator resultado={resultado} form={form} user={user} />
      </div>

      {/* CASO A: RESULTADO DISPONÍVEL */}
      {!semDado ? (
        <>
          {/* Card de Destaque do Resultado Principal e Origem */}
          <div
            style={{
              background: '#0a1532',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                {principal?.descricao || 'Indicador Principal de Desempenho'}
              </span>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: statusAtende ? '#4ade80' : '#f87171', lineHeight: 1.1, margin: '6px 0' }}>
                {principal?.nome} = {principal?.valor?.toFixed(1)} {principal?.unidade}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                <strong>Origem do valor: </strong>
                {resultado.origem || 'Cálculo analítico fundamentado em ensaio de laboratório'}
              </div>
            </div>

            {/* Badge de Confiabilidade */}
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.2px',
                  background:
                    resultado.confiabilidade === 'ensaio_laboratorio' || resultado.confiabilidade === 'documentado'
                      ? 'rgba(34, 197, 94, 0.14)'
                      : resultado.confiabilidade === 'medicao_usuario'
                      ? 'rgba(59, 130, 246, 0.14)'
                      : 'rgba(234, 179, 8, 0.14)',
                  color:
                    resultado.confiabilidade === 'ensaio_laboratorio' || resultado.confiabilidade === 'documentado'
                      ? '#4ade80'
                      : resultado.confiabilidade === 'medicao_usuario'
                      ? '#93c5fd'
                      : '#fde047',
                  border: '1px solid currentColor',
                }}
              >
                {resultado.confiabilidade === 'ensaio_laboratorio'
                  ? 'Ensaio de Laboratório Documentado'
                  : resultado.confiabilidade === 'medicao_usuario'
                  ? 'Medição in situ do Usuário'
                  : resultado.confiabilidade === 'estimativa_teorica'
                  ? 'Estimativa Teórica (Lei da Massa)'
                  : 'Dado Documentado'}
              </span>
            </div>
          </div>

          {/* Julgamento Normativo NBR 15575 */}
          <div
            style={{
              background: statusAtende ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${statusAtende ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '14px',
              padding: '18px 24px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.3px' }}>
                Avaliação Conforme ABNT NBR 15575
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                Critério Exigido: {criterios.referencia ? (tipo === 'aereo' ? `≥ ${criterios.referencia} dB` : `≤ ${criterios.referencia} dB`) : 'Sob consulta'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
                Cenário: {criterios.cenario || 'Requisitos Gerais de Desempenho'}
              </div>
            </div>

            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.3px',
                  background: statusAtende ? '#15803d' : '#b91c1c',
                  color: '#FFFFFF',
                  boxShadow: statusAtende
                    ? '0 2px 10px rgba(22, 163, 74, 0.3)'
                    : '0 2px 10px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {statusAtende ? 'ATENDE AO CRITÉRIO' : 'NÃO ATENDE AO CRITÉRIO'}
              </span>
            </div>
          </div>
        </>
      ) : (
        /* CASO B: SEM DADO ACÚSTICO DOCUMENTADO */
        <div
          style={{
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '14px',
            padding: '22px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#fde047', fontSize: '1.1rem', fontWeight: 700 }}>
            Cálculo Acústico Suspenso por Ausência de Ensaio Documentado
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.5' }}>
            A AcousticBuild adota o princípio de <strong>não inventar desempenhos acústicos</strong> para sistemas multicamadas que não possuam ensaios laboratoriais ou referências normativas comprovadas. As propriedades físicas da composição foram determinadas, mas o isolamento sonoro exige dado de ensaio específico.
          </p>
        </div>
      )}

      {/* Detalhamento Técnico Expansível (Accordion) */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
        <button
          type="button"
          onClick={() => setDetalhesAbertos(!detalhesAbertos)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#93c5fd',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s ease',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: detalhesAbertos ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span>{detalhesAbertos ? 'Ocultar Detalhamento Técnico' : 'Ver Detalhamento Técnico e Memória de Cálculo'}</span>
        </button>

        {detalhesAbertos && (
          <div
            style={{
              marginTop: '16px',
              padding: '20px',
              background: '#0a142c',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.85rem',
              lineHeight: '1.6',
            }}
          >
            {/* Metodologia */}
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#93c5fd' }}>Modelo e Equação Normalizada:</strong>
              <div>{resultado.metodo?.nome || 'ISO 12354 / ISO 16283'}</div>
              {resultado.metodo?.equacao && (
                <div style={{ background: '#070E22', padding: '6px 12px', borderRadius: '6px', marginTop: '4px', fontFamily: 'monospace', color: '#93c5fd' }}>
                  {resultado.metodo.equacao}
                </div>
              )}
            </div>

            {/* Parâmetros do Ambiente */}
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#93c5fd' }}>Parâmetros Geométricos e Físicos:</strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', marginTop: '6px' }}>
                <div>Área Separadora (S): <strong>{detalhes.s || form.area || 15} m²</strong></div>
                <div>Volume Receptor (V): <strong>{detalhes.v || form.volume || 36} m³</strong></div>
                <div>Tempo de Reverb (T): <strong>{detalhes.t || form.t || 0.6} s</strong></div>
                <div>Absorção Sabine (A): <strong>{detalhes.absorcao_equivalente || '—'} m²</strong></div>
                {propriedades.espessura_total_cm && (
                  <div>Espessura Total: <strong>{propriedades.espessura_total_cm} cm</strong></div>
                )}
                {propriedades.massa_superficial_kg_m2 && (
                  <div>Massa Superficial (m'): <strong>{propriedades.massa_superficial_kg_m2} kg/m²</strong></div>
                )}
              </div>
            </div>

            {/* Camadas da Composição */}
            {composicao.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#93c5fd' }}>Composição Estrutural das Camadas:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  {composicao.map((c, i) => (
                    <li key={i}>
                      Camada {c.ordem || i + 1}: {c.material_nome || c.material} — {c.espessura_cm} cm
                      {c.densidade ? ` (densidade: ${c.densidade} kg/m³)` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fontes Rastreáveis */}
            {fontes.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#93c5fd' }}>Fontes Documentais dos Dados Acústicos:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  {fontes.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Observações e Limitações do Cálculo */}
            <div>
              <strong style={{ color: '#fde047' }}>Observações e Limitações do Método:</strong>
              <ul style={{ margin: '6px 0 0 16px', padding: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
                {limitacoes.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
                <li>O resultado é uma estimativa técnica que não substitui a realização de ensaio acústico in situ formal com laudo pericial.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Ação de Salvar Simulação */}
      {salvarSimulacao && (
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={salvarSimulacao}
              disabled={saved}
            >
              <span>{saved ? 'Simulação Salva no Histórico' : 'Salvar no Meu Histórico'}</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Faça login para salvar esta simulação em seu perfil.
            </span>
          )}
        </div>
      )}
    </div>
  );
}