import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PdfReportGenerator({ resultado, form, user }) {
  const reportRef = useRef(null);
  const [gerando, setGerando] = useState(false);

  const principal = resultado?.indicador_principal;
  const criterios = resultado?.criterios;
  const statusAtende = resultado?.status_atendimento === 'ATENDE' || resultado?.classificacao === 'atende';

  const gerarPdf = async () => {
    if (!reportRef.current) return;
    setGerando(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`relatorio-acustico-${resultado?.tipo || 'simulacao'}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar relatório em PDF:', err);
      alert('Não foi possível gerar o PDF. Verifique o console para mais detalhes.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        type="button"
        onClick={gerarPdf}
        disabled={gerando}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '11px 22px',
          background: '#1e40af',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '0.88rem',
          cursor: gerando ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.22s ease',
        }}
        onMouseEnter={(e) => {
          if (!gerando) {
            e.currentTarget.style.background = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!gerando) {
            e.currentTarget.style.background = '#1e40af';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>{gerando ? 'Compilando Relatório em PDF...' : 'Baixar Relatório Técnico em PDF'}</span>
      </button>

      {/* Template de Impressão do Relatório (Renderizado em branco/preto corporativo de alta definição) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={reportRef}
          style={{
            width: '800px',
            padding: '40px',
            backgroundColor: '#FFFFFF',
            color: '#1e293b',
            fontFamily: 'Helvetica, Arial, sans-serif',
            boxSizing: 'border-box',
          }}
        >
          {/* Cabeçalho */}
          <div style={{ borderBottom: '3px solid #2F6FFF', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 800 }}>AcousticBuild</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Relatório de Análise e Previsão de Desempenho Acústico
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
              <div><strong>Data da Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
              <div><strong>Normas de Referência:</strong> NBR 15575 / ISO 16283 / ISO 717</div>
              {user?.name && <div><strong>Responsável:</strong> {user.name}</div>}
            </div>
          </div>

          {/* Destaque do Resultado */}
          <div
            style={{
              background: statusAtende ? '#f0fdf4' : '#fef2f2',
              border: `2px solid ${statusAtende ? '#22c55e' : '#ef4444'}`,
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 700 }}>
                Indicador Principal ({resultado?.tipo === 'aereo' ? 'Isolamento ao Ruído Aéreo' : 'Ruído de Impacto'})
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: statusAtende ? '#15803d' : '#b91c1c', margin: '4px 0' }}>
                {principal ? `${principal.nome} = ${principal.valor} ${principal.unidade}` : 'Não Determinado'}
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                {resultado?.origem || 'Resultado calculado pelo motor técnico'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                Conformidade NBR 15575
              </span>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '6px 18px',
                  background: statusAtende ? '#16a34a' : '#dc2626',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '14px',
                }}
              >
                {statusAtende ? 'ATENDE AO CRITÉRIO' : 'NÃO ATENDE AO CRITÉRIO'}
              </div>
              {criterios && (
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                  Exigência: {resultado?.tipo === 'aereo' ? `≥ ${criterios.referencia}` : `≤ ${criterios.referencia}`} dB
                </div>
              )}
            </div>
          </div>

          {/* Sistema Construtivo e Camadas */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              1. Composição do Elemento Construtivo
            </h3>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div><strong>Elemento:</strong> {form.elemento === 'piso_laje' ? 'Piso / Laje' : 'Parede de Vedação'}</div>
              {form.sistemaNome && <div><strong>Sistema Documentado:</strong> {form.sistemaNome} {form.sistema_codigo && `(${form.sistema_codigo})`}</div>}
              {resultado?.propriedades_fisicas?.espessura_total_cm && (
                <div><strong>Espessura Total:</strong> {resultado.propriedades_fisicas.espessura_total_cm} cm</div>
              )}
              {resultado?.propriedades_fisicas?.massa_superficial_kg_m2 && (
                <div><strong>Massa Superficial (m'):</strong> {resultado.propriedades_fisicas.massa_superficial_kg_m2} kg/m²</div>
              )}
            </div>

            {/* Tabela de Camadas se houver */}
            {resultado?.composicao && resultado.composicao.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '6px', textAlign: 'left' }}>Ordem</th>
                    <th style={{ padding: '6px', textAlign: 'left' }}>Material Componente</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>Espessura (cm)</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>Densidade (kg/m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.composicao.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px' }}>{c.ordem || i + 1}</td>
                      <td style={{ padding: '6px' }}>{c.material_nome || c.material}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{c.espessura_cm ?? '—'}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{c.densidade ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Dados do Ambiente Receptor */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              2. Parâmetros do Ambiente Receptor
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
              <div><strong>Área (S):</strong> {form.area || 15} m²</div>
              <div><strong>Volume (V):</strong> {form.volume || 36} m³</div>
              <div><strong>Reverberação (T):</strong> {form.t || 0.6} s</div>
              <div><strong>Absorção (A):</strong> {resultado?.detalhes?.absorcao_equivalente || '—'} m²</div>
            </div>
          </div>

          {/* Método e Fontes */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              3. Metodologia de Cálculo e Fontes Rastreáveis
            </h3>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div><strong>Método Aplicado:</strong> {resultado?.metodo?.nome || 'Previsão Acústica Normalizada'}</div>
              {resultado?.metodo?.equacao && <div><strong>Equação:</strong> <code>{resultado.metodo.equacao}</code></div>}
              {resultado?.fontes && resultado.fontes.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  <strong>Fontes Documentadas:</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {resultado.fontes.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Limitações Técnicas (Princípio 11) */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '11px', color: '#64748b' }}>
            <strong style={{ color: '#0f172a' }}>Limitações Técnicas e Escopo do Relatório:</strong>
            <ul style={{ margin: '4px 0 0 16px', padding: 0, lineHeight: '1.5' }}>
              {resultado?.limitacoes && resultado.limitacoes.length > 0 ? (
                resultado.limitacoes.map((lim, i) => <li key={i}>{lim}</li>)
              ) : (
                <li>Este relatório apresenta estimativa de desempenho acústico para fins de projeto e não substitui ensaio acústico in situ ou laudo pericial formal.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
