import { useState, useEffect, useRef } from 'react';
import { getMateriais, montarSistema } from '../../services/api';
import SystemInfoCard from './SystemInfoCard';
import { fmtNum } from './caminhoDoSom';

export default function LayerComposer({ onCompositionChange, initialLayers }) {
  const [materiais, setMateriais] = useState([]);
  const [loadingMats, setLoadingMats] = useState(true);
  const [camadas, setCamadas] = useState(
    initialLayers || [
      { material_id: null, espessura_cm: 1.5, posicao: 'revestimento_int' },
      { material_id: null, espessura_cm: 14.0, posicao: 'nucleo' },
      { material_id: null, espessura_cm: 1.5, posicao: 'revestimento_ext' },
    ]
  );
  const [resultadoMontagem, setResultadoMontagem] = useState(null);

  // Materiais distintos em uso, na ordem das camadas — é deles que sai a massa
  // superficial e, sem ensaio, o resultado inteiro.
  const materiaisEmUso = [...new Set(camadas.map((c) => c.material_id).filter(Boolean))]
    .map((id) => materiais.find((m) => m.id === id))
    .filter(Boolean);

  // Guardado em ref para não entrar nas deps do efeito (o pai recria a função a cada render)
  const onCompositionChangeRef = useRef(onCompositionChange);
  useEffect(() => {
    onCompositionChangeRef.current = onCompositionChange;
  }, [onCompositionChange]);

  // Carrega catálogo de materiais
  useEffect(() => {
    getMateriais()
      .then((res) => {
        setMateriais(res.data);
        // Preenche material_ids padrão caso estejam nulos
        if (res.data.length >= 2) {
          const arg = res.data.find((m) => m.categoria === 'revestimento') || res.data[0];
          const cer = res.data.find((m) => m.categoria === 'alvenaria') || res.data[1];
          setCamadas((prev) =>
            prev.map((c, i) => ({
              ...c,
              material_id: c.material_id || (i === 1 ? cer.id : arg.id),
            }))
          );
        }
      })
      .catch((err) => console.error('Erro ao carregar materiais:', err))
      .finally(() => setLoadingMats(false));
  }, []);

  // Recalcula propriedades sempre que as camadas mudarem
  useEffect(() => {
    if (camadas.length === 0) return;
    // Verifica se todos possuem material_id
    const validas = camadas.filter((c) => c.material_id && c.espessura_cm > 0);
    if (validas.length === 0) return;

    const payload = camadas.map((c) => ({
      material_id: Number(c.material_id),
      espessura: Number(c.espessura_cm) / 100.0,
      posicao: c.posicao,
    }));

    montarSistema(payload)
      .then((res) => {
        setResultadoMontagem(res.data);
        if (onCompositionChangeRef.current) {
          onCompositionChangeRef.current({
            camadas: res.data.camadas,
            propriedades: {
              espessura_total_cm: res.data.espessura_total_cm,
              massa_superficial_total: res.data.massa_superficial_total,
            },
            sistemaCorrespondente: res.data.sistema_correspondente,
            dadosAcusticos: res.data.dados_acusticos,
            fontes: res.data.fontes,
            limitacoes: res.data.limitacoes,
          });
        }
      })
      .catch((err) => console.error('Erro ao montar composição:', err))

  }, [camadas]);

  const handleMaterialChange = (index, materialId) => {
    setCamadas((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], material_id: Number(materialId) };
      return copy;
    });
  };

  const handleEspessuraChange = (index, valorCm) => {
    setCamadas((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], espessura_cm: valorCm === '' ? '' : Number(valorCm) };
      return copy;
    });
  };

  const adicionarCamada = () => {
    const padraoId = materiais[0]?.id || 1;
    setCamadas((prev) => [
      ...prev,
      { material_id: padraoId, espessura_cm: 2.0, posicao: 'camada_adicional' },
    ]);
  };

  const removerCamada = (index) => {
    if (camadas.length <= 1) return;
    setCamadas((prev) => prev.filter((_, i) => i !== index));
  };

  const moverCamada = (index, direcao) => {
    const novoIndex = index + direcao;
    if (novoIndex < 0 || novoIndex >= camadas.length) return;
    setCamadas((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[novoIndex];
      copy[novoIndex] = temp;
      return copy;
    });
  };

  // Cores representativas para o preview em corte visual
  const getCorMaterial = (materialId) => {
    const mat = materiais.find((m) => m.id === Number(materialId));
    if (!mat) return '#334155';
    switch (mat.categoria) {
      case 'alvenaria':
        return '#b45309'; // Terracota tijolo
      case 'concreto':
        return '#64748b'; // Cinza concreto
      case 'revestimento':
      case 'argamassa':
        return '#94a3b8'; // Argamassa claro
      case 'sistema_leve':
      case 'gesso':
        return '#e2e8f0'; // Branco gesso
      case 'isolamento':
        return '#f59e0b'; // Amarelo lã de vidro
      case 'piso':
        return '#854d0e'; // Vinílico/madeira
      default:
        return '#475569';
    }
  };

  if (loadingMats) {
    return <div style={{ color: 'rgba(255, 255, 255, 0.6)', padding: '20px' }}>Carregando catálogo de materiais...</div>;
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: '#FFFFFF' }}>
          Camadas do Elemento Construtivo (Face Externa → Face Interna)
        </h4>
        <button
          type="button"
          onClick={adicionarCamada}
          style={{
            background: 'rgba(37, 99, 235, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#93c5fd',
            padding: '7px 16px',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.22)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Adicionar Camada
        </button>
      </div>

      {/* Preview Visual do Corte Estrutural */}
      <div
        style={{
          background: '#070E22',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Corte Esquemático da Seção Transversal:
        </div>
        <div style={{ display: 'flex', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {camadas.map((camada, idx) => {
            const mat = materiais.find((m) => m.id === Number(camada.material_id));
            const esp = Number(camada.espessura_cm) || 1;
            return (
              <div
                key={idx}
                style={{
                  flex: Math.max(esp, 1),
                  backgroundColor: getCorMaterial(camada.material_id),
                  color: ['#e2e8f0', '#94a3b8'].includes(getCorMaterial(camada.material_id)) ? '#0f172a' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  textAlign: 'center',
                  borderRight: idx < camadas.length - 1 ? '1px solid rgba(0,0,0,0.3)' : 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={`${mat?.nome || 'Material'}: ${fmtNum(camada.espessura_cm)} cm`}
              >
                {mat?.nome?.split(' ')[0] || `C${idx + 1}`} ({fmtNum(camada.espessura_cm)} cm)
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Edição das Camadas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {camadas.map((camada, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 120px auto',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: '#101E42',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Indicador de Ordem */}
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#8ab4f8',
              }}
            >
              {index + 1}
            </span>

            {/* Seleção de Material */}
            <div>
              <select
                value={camada.material_id || ''}
                onChange={(e) => handleMaterialChange(index, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: '#0a142c',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              >
                {materiais.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} ({m.densidade ? `${m.densidade} kg/m³` : 'densidade variável'})
                  </option>
                ))}
              </select>
            </div>

            {/* Espessura (cm) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={camada.espessura_cm}
                onChange={(e) => handleEspessuraChange(index, e.target.value)}
                placeholder="cm"
                style={{
                  width: '70px',
                  padding: '8px',
                  background: '#0a142c',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  textAlign: 'right',
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>cm</span>
            </div>

            {/* Ações: Reordenar e Remover */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moverCamada(index, -1)}
                title="Subir camada"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 9px',
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                  opacity: index === 0 ? 0.3 : 1,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
              <button
                type="button"
                disabled={index === camadas.length - 1}
                onClick={() => moverCamada(index, 1)}
                title="Descer camada"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 9px',
                  cursor: index === camadas.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: index === camadas.length - 1 ? 0.3 : 1,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <button
                type="button"
                disabled={camadas.length <= 1}
                onClick={() => removerCamada(index)}
                title="Remover camada"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '6px 9px',
                  cursor: camadas.length <= 1 ? 'not-allowed' : 'pointer',
                  opacity: camadas.length <= 1 ? 0.3 : 1,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Procedência das densidades.
          Quando não há ensaio, a estimativa inteira se apoia nestes números —
          então a origem deles precisa estar à vista, não só no banco. */}
      {materiaisEmUso.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: 'rgba(255, 255, 255, 0.55)',
              marginBottom: '10px',
            }}
          >
            De onde vêm as densidades usadas
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '8px' }}>
            {materiaisEmUso.map((m) => (
              <li
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '14px',
                  flexWrap: 'wrap',
                  fontSize: '0.82rem',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: '#FFFFFF' }}>
                  {m.nome}
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {' '}— {m.densidade ? `${m.densidade} kg/m³` : 'densidade não documentada'}
                  </span>
                </span>
                <span style={{ color: '#8ab4f8', textAlign: 'right' }}>
                  {m.fonte || 'sem fonte declarada'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Card com resultado da validação física e correspondência do sistema */}
      {resultadoMontagem && (
        <SystemInfoCard
          sistema={resultadoMontagem.sistema_correspondente}
          propriedadesFisicas={{
            espessura_total_cm: resultadoMontagem.espessura_total_cm,
            massa_superficial_total: resultadoMontagem.massa_superficial_total,
          }}
          dadosAcusticos={resultadoMontagem.dados_acusticos}
          fontes={resultadoMontagem.fontes}
          limitacoes={resultadoMontagem.limitacoes}
          modo={resultadoMontagem.sistema_correspondente ? 'documentado' : 'personalizado'}
        />
      )}
    </div>
  );
}
