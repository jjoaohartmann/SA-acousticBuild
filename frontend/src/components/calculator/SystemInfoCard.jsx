

import { fmtNum } from './caminhoDoSom';

export default function SystemInfoCard({
  sistema,
  propriedadesFisicas,
  dadosAcusticos = [],
  fontes = [],
  modo = 'documentado', // 'documentado' | 'personalizado'
}) {
  const espessuraCm =
    propriedadesFisicas?.espessura_total_cm ??
    // 7,3 cm não pode virar "7 cm" — a espessura é dado técnico
    (sistema?.espessura_total ? Number((sistema.espessura_total * 100).toFixed(1)) : null);

  const massaTotal =
    propriedadesFisicas?.massa_superficial_total ??
    sistema?.massa_superficial_total ??
    null;

  const possuiDadoDocumentado = dadosAcusticos && dadosAcusticos.length > 0;

  return (
    <div
      style={{
        background: '#101E42',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginTop: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#2F6FFF',
            }}
          >
            {modo === 'documentado' ? 'Sistema Documentado' : 'Composição Analisada'}
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#FFFFFF' }}>
            {sistema?.nome || (modo === 'personalizado' ? 'Composição Personalizada de Camadas' : 'Sistema Não Selecionado')}
          </h3>
          {sistema?.codigo && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '2px 8px',
                background: 'rgba(47, 111, 255, 0.2)',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: '#8ab4f8',
                fontFamily: 'monospace',
              }}
            >
              Código: {sistema.codigo}
            </span>
          )}
        </div>

        {/* Badge de Status Documental */}
        <div>
          {possuiDadoDocumentado ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 14px',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '999px',
                color: '#4ade80',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.2px',
              }}
            >
              Dado Documentado em Ensaio
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 14px',
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                borderRadius: '999px',
                color: '#fde047',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.2px',
              }}
            >
              Sem Ensaio Documentado
            </span>
          )}
        </div>
      </div>

      {/* Propriedades Físicas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>Espessura Total</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
            {espessuraCm !== null && espessuraCm !== undefined ? `${fmtNum(espessuraCm)} cm` : 'Não informada'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>Massa Superficial (m')</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
            {massaTotal !== null && massaTotal !== undefined ? (
              `${fmtNum(massaTotal)} kg/m²`
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#f39c12', fontWeight: 500 }}>
                Não determinada (faltam densidades)
              </span>
            )}
          </div>
        </div>

        {possuiDadoDocumentado && dadosAcusticos[0]?.rw && (
          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>Índice Rw de Laboratório</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2F6FFF' }}>
              {dadosAcusticos[0].rw} dB
            </div>
          </div>
        )}

        {possuiDadoDocumentado && dadosAcusticos[0]?.ln_w && (
          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>Nível Ln,w de Laboratório</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2F6FFF' }}>
              {dadosAcusticos[0].ln_w} dB
            </div>
          </div>
        )}
      </div>

      {/* Fontes Técnicas ou Aviso de Limitação */}
      <div style={{ marginTop: '14px', fontSize: '0.82rem', lineHeight: '1.4' }}>
        {possuiDadoDocumentado ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
            <strong style={{ color: '#FFFFFF' }}>Fonte do ensaio: </strong>
            {fontes[0] || dadosAcusticos[0]?.fonte}
            {dadosAcusticos[0]?.norma_ensaio && (
              <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                Norma: {dadosAcusticos[0].norma_ensaio}
              </span>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(243, 156, 18, 0.1)',
              borderLeft: '3px solid #f39c12',
              borderRadius: '4px',
              color: '#f1c40f',
            }}
          >
            <strong>Aviso de transparência:</strong> não há ensaio de laboratório documentado para esta composição. Se todas as camadas forem rígidas e coladas, o isolamento será <strong>estimado</strong> pela lei da massa e rotulado como tal. Se houver camada resiliente (lã, manta), o cálculo exigirá um valor medido — a plataforma não inventa o número.
          </div>
        )}
      </div>
    </div>
  );
}
