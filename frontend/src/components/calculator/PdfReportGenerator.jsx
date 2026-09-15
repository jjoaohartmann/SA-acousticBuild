import { useRef, useState } from 'react';
import { fmtDb, fmtNum, montarCaminho } from './caminhoDoSom';

export default function PdfReportGenerator({ resultado, form, user }) {
  const reportRef = useRef(null);
  const [gerando, setGerando] = useState(false);

  const conforto = resultado?.conforto;
  const detalhes = resultado?.detalhes || {};
  const sugestoes = resultado?.sugestoes || [];
  const fmt = (v, c = 1) => fmtDb(v, c) ?? '—';
  const n = (v) => fmtNum(v) ?? '—';
  const criterios = resultado?.criterios;
  const statusAtende = resultado?.status_atendimento === 'ATENDE' || resultado?.classificacao === 'atende';
  // A mesma leitura de três passos da tela: o PDF não pode contar outra história.
  const caminho = resultado ? montarCaminho(resultado) : null;
  const isImpacto = caminho?.tipo === 'impacto';

  const gerarPdf = async () => {
    if (!reportRef.current) return;
    setGerando(true);
    try {
      // jsPDF + html2canvas somam ~1 MB. Carregar só no clique tira esse peso
      // do carregamento inicial de todas as páginas do site.
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);
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

      {/* Template do relatório: existe só para o html2canvas fotografar.
          aria-hidden evita que leitores de tela leiam o relatório inteiro
          duas vezes — ele já está na página, em forma de resultado. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
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
                {conforto
                  ? `Quanto de ruído chega ${conforto.artigo || 'no'} ${conforto.ambiente.toLowerCase()}`
                  : 'Ruído que chega no ambiente receptor'}
              </span>
              <div style={{ fontSize: '34px', fontWeight: 800, color: statusAtende ? '#15803d' : '#b91c1c', margin: '4px 0' }}>
                {caminho?.destaque ? `${caminho.destaque} dB` : '—'}
              </div>
              {conforto && (
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  ≈ {conforto.comparacao_cotidiano} · NBR 10152 recomenda até {fmt(conforto.recomendado, 0)} dB
                </div>
              )}
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
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
                  Exigência: {isImpacto ? '≤' : '≥'} {fmt(criterios.referencia, 0)} dB
                </div>
              )}
            </div>
          </div>

          {/* Caminho do som — mesma leitura da tela */}
          {caminho?.completo && (
            <div style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
                1. Como esse número foi obtido
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', fontSize: '12px' }}>
                {caminho.passos.map((p, i) => (
                  <div key={p.texto} style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ color: '#64748b', marginBottom: '4px' }}>{i + 1}. {p.texto}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{p.sinal}{p.valor} dB</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: '#475569', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                {caminho.nota}
              </p>
            </div>
          )}

          {/* Recomendações — mesmas da tela */}
          {sugestoes.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
                2. Recomendações técnicas
              </h3>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6 }}>
                {sugestoes.map((s, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>
                    <strong>{s.recomendacao || s}</strong>
                    {s.motivo && <div style={{ color: '#64748b', fontSize: '11px' }}>{s.motivo}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sistema Construtivo e Camadas */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              3. Composição do Elemento Construtivo
            </h3>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div><strong>Elemento:</strong> {form.elemento === 'piso_laje' ? 'Piso / Laje' : 'Parede de Vedação'}</div>
              {form.sistemaNome && <div><strong>Sistema Documentado:</strong> {form.sistemaNome} {form.sistema_codigo && `(${form.sistema_codigo})`}</div>}
              {resultado?.propriedades_fisicas?.espessura_total_cm && (
                <div><strong>Espessura Total:</strong> {n(resultado.propriedades_fisicas.espessura_total_cm)} cm</div>
              )}
              {resultado?.propriedades_fisicas?.massa_superficial_kg_m2 && (
                <div><strong>Massa Superficial (m'):</strong> {n(resultado.propriedades_fisicas.massa_superficial_kg_m2)} kg/m²</div>
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
                      <td style={{ padding: '6px', textAlign: 'right' }}>{n(c.espessura_cm)}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{n(c.densidade)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Dados do Ambiente Receptor */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              4. Parâmetros do Ambiente Receptor
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
              <div><strong>Área (S):</strong> {n(detalhes.s ?? form.area)} m²</div>
              <div><strong>Volume (V):</strong> {n(detalhes.v ?? form.volume)} m³</div>
              <div><strong>Reverberação (T):</strong> {n(detalhes.t ?? form.t)} s</div>
              <div><strong>Absorção (A):</strong> {n(detalhes.absorcao_equivalente)} m²</div>
            </div>
          </div>

          {/* Método e Fontes */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#2F6FFF', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              5. Metodologia de Cálculo e Fontes Rastreáveis
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
