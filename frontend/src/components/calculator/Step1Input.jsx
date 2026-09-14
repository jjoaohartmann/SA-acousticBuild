import { useState, useEffect, useMemo, useRef } from 'react';
import { getSistemas } from '../../services/api';
import LayerComposer from './LayerComposer';
import SystemInfoCard from './SystemInfoCard';
import styles from '../../style/Calculator.module.css';

export default function Step1Input({ form, setForm, onAdvanced }) {
  const [elemento, setElemento] = useState(form.elemento || 'parede'); // 'parede' | 'piso_laje'
  // Parede é sempre ruído aéreo; Piso/Laje é sempre ruído de impacto
  const tipoRuido = elemento === 'parede' ? 'aereo' : 'impacto';
  const [caminho, setCaminho] = useState(form.caminho || 'simplificado'); // 'simplificado' | 'personalizado'

  // Estados do Caminho Simplificado (Perguntas Guiadas)
  const [tipoParede, setTipoParede] = useState(form.tipoParede || 'ceramica');
  const [espessuraParede, setEspessuraParede] = useState(form.espessuraParede || '14');
  const [tipoPiso, setTipoPiso] = useState(form.tipoPiso || 'concreto_maciço');
  const [espessuraPiso, setEspessuraPiso] = useState(form.espessuraPiso || '14');

  // Catálogo de sistemas do backend
  const [sistemas, setSistemas] = useState([]);

  useEffect(() => {
    getSistemas(elemento)
      .then((res) => {
        setSistemas(res.data);
      })
      .catch((err) => console.error('Erro ao buscar sistemas:', err));
  }, [elemento]);

  // Qual sistema do catálogo corresponde às escolhas guiadas.
  // É valor DERIVADO das seleções — calculado no render, não guardado em estado.
  const sistemaSelecionado = useMemo(() => {
    if (caminho !== 'simplificado' || sistemas.length === 0) return null;

    let codigoAlvo = null;
    if (elemento === 'parede') {
      if (tipoParede === 'ceramica') {
        if (espessuraParede === '19') codigoAlvo = 'PAR-CER-019';
        else codigoAlvo = 'PAR-CER-014'; // 14 cm e "não sei"
      } else if (tipoParede === 'concreto') {
        codigoAlvo = espessuraParede === '15' ? 'PAR-CON-015' : 'PAR-CON-010';
      } else if (tipoParede === 'drywall') {
        codigoAlvo = 'PAR-DRY-073';
      }
    } else if (tipoPiso === 'flutuante') {
      codigoAlvo = 'LAJ-FLU-014';
    } else if (tipoPiso === 'vinilico') {
      codigoAlvo = 'LAJ-VIN-014';
    } else {
      codigoAlvo = espessuraPiso === '10' ? 'LAJ-MAC-010' : 'LAJ-MAC-014';
    }

    return sistemas.find((s) => s.codigo === codigoAlvo) || null;
  }, [caminho, sistemas, elemento, tipoParede, espessuraParede, tipoPiso, espessuraPiso]);

  // Sincroniza o sistema derivado com o formulário do wizard (estado do pai).
  // O ref evita reenviar o mesmo sistema a cada render.
  const ultimoSincronizado = useRef(null);
  useEffect(() => {
    if (!sistemaSelecionado) return;
    if (ultimoSincronizado.current === sistemaSelecionado.codigo) return;
    ultimoSincronizado.current = sistemaSelecionado.codigo;

    setForm((prev) => ({
      ...prev,
      elemento,
      tipo: tipoRuido,
      cenario: elemento === 'parede' ? 'parede_entre_unidades' : 'laje_entre_unidades',
      caminho,
      sistema_codigo: sistemaSelecionado.codigo,
      sistema_id: sistemaSelecionado.id,
      sistemaNome: sistemaSelecionado.nome,
      camadas: null,
      dadosAcusticos: sistemaSelecionado.dados_acusticos,
      r: sistemaSelecionado.dados_acusticos.find((d) => d.tipo_ruido === 'aereo')?.rw || prev.r,
    }));
  }, [sistemaSelecionado, elemento, tipoRuido, caminho, setForm]);

  const mudarElemento = (novo) => {
    setElemento(novo);
    const novoTipoRuido = novo === 'parede' ? 'aereo' : 'impacto';
    const novoCenario = novo === 'parede' ? 'parede_entre_unidades' : 'laje_entre_unidades';
    setForm((p) => ({
      ...p,
      elemento: novo,
      tipo: novoTipoRuido,
      cenario: novoCenario,
    }));
  };

  const handleCompositionChange = (comp) => {
    setForm((prev) => ({
      ...prev,
      elemento,
      tipo: tipoRuido,
      cenario: elemento === 'parede' ? 'parede_entre_unidades' : 'laje_entre_unidades',
      caminho: 'personalizado',
      camadas: comp.camadas,
      sistema_codigo: comp.sistemaCorrespondente?.codigo || null,
      sistema_id: comp.sistemaCorrespondente?.id || null,
      sistemaNome: comp.sistemaCorrespondente?.nome || 'Composição Personalizada',
      propriedadesFisicas: comp.propriedades,
      dadosAcusticos: comp.dadosAcusticos,
      fontes: comp.fontes,
      limitacoes: comp.limitacoes,
      r: comp.dadosAcusticos?.find((d) => d.tipo_ruido === 'aereo')?.rw || null,
    }));
  };

  const handleAvancar = () => {
    onAdvanced();
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Passo 1: Definição do Elemento Construtivo</h2>

      {/* Seleção Inicial: Parede vs Piso/Laje */}
      <div style={{ marginBottom: '20px' }}>
        <label className={styles.labelInline} style={{ marginBottom: '8px', display: 'block' }}>
          O que você quer analisar?
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <button
            type="button"
            className={`${styles.selectionBtn} ${elemento === 'parede' ? styles.selectionBtnActive : ''}`}
            onClick={() => mudarElemento('parede')}
          >
            <span>Parede e Vedação Vertical</span>
          </button>

          <button
            type="button"
            className={`${styles.selectionBtn} ${elemento === 'piso_laje' ? styles.selectionBtnActive : ''}`}
            onClick={() => mudarElemento('piso_laje')}
          >
            <span>Piso e Laje Entre Pavimentos</span>
          </button>
        </div>
      </div>

      {/* Indicador Contextual Discreto do Tipo de Análise Aplicada */}
      <div
        style={{
          marginBottom: '22px',
          padding: '11px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <span>Análise acústica correspondente: </span>
          <strong style={{ color: '#93c5fd' }}>
            {elemento === 'parede'
              ? 'Isolamento ao Ruído Aéreo (DnT,w)'
              : 'Nível de Ruído de Impacto (L\'nT,w)'}
          </strong>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)' }}>
          {elemento === 'parede'
            ? 'Vozes, televisão e sons aéreos'
            : 'Passos, saltos e quedas de objetos'}
        </span>
      </div>

      {/* Dois Caminhos de Entrada */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
          <button
            type="button"
            className={`${styles.selectionBtn} ${caminho === 'simplificado' ? styles.selectionBtnActive : ''}`}
            onClick={() => setCaminho('simplificado')}
            style={{ fontSize: '0.88rem', padding: '12px 14px' }}
          >
            Escolher uma Opção Pronta (Simplificado)
          </button>

          <button
            type="button"
            className={`${styles.selectionBtn} ${caminho === 'personalizado' ? styles.selectionBtnActive : ''}`}
            onClick={() => setCaminho('personalizado')}
            style={{ fontSize: '0.88rem', padding: '12px 14px' }}
          >
            Informar Materiais e Camadas (Personalizado)
          </button>
        </div>

        {/* Mensagem de Orientação sem emojis */}
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(30, 58, 138, 0.15)',
            borderLeft: '3px solid #3b82f6',
            borderRadius: '6px',
            fontSize: '0.82rem',
            lineHeight: '1.45',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '20px',
          }}
        >
          <strong style={{ color: '#ffffff' }}>Nota sobre dados incompletos:</strong> Não tem certeza dos materiais? Escolha a opção mais próxima ou informe apenas o que você conhece. A calculadora respeita dados desconhecidos sem arbitrar valores sem fundamento.
        </div>

        {/* CAMINHO A: SIMPLIFICADO */}
        {caminho === 'simplificado' && (
          <div>
            {elemento === 'parede' ? (
              <div style={{ display: 'grid', gridTemplateColumns: tipoParede === 'drywall' ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
                    Qual o tipo construtivo da parede?
                  </label>
                  <select
                    className={styles.select}
                    value={tipoParede}
                    onChange={(e) => {
                      const novo = e.target.value;
                      setTipoParede(novo);
                      // Resetar espessura para a primeira opção válida do novo tipo
                      if (novo === 'ceramica') setEspessuraParede('14');
                      else if (novo === 'concreto') setEspessuraParede('10');
                      else setEspessuraParede('nao_sei');
                    }}
                  >
                    <option value="ceramica">Alvenaria cerâmica (bloco furado com argamassa)</option>
                    <option value="concreto">Concreto armado maciço</option>
                    <option value="drywall">Drywall (gesso acartonado com lã de vidro)</option>
                    <option value="outra">Outro tipo</option>
                    <option value="nao_sei">Não sei</option>
                  </select>
                </div>

                {tipoParede !== 'drywall' && tipoParede !== 'outra' && tipoParede !== 'nao_sei' && (
                  <div>
                    <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
                      Qual a espessura da parede?
                    </label>
                    <select
                      className={styles.select}
                      value={espessuraParede}
                      onChange={(e) => setEspessuraParede(e.target.value)}
                    >
                      {tipoParede === 'ceramica' && (
                        <>
                          <option value="14">14 cm (espessura usual com revestimento)</option>
                          <option value="19">19 cm (bloco maior, alto isolamento)</option>
                          <option value="nao_sei">Não sei</option>
                        </>
                      )}
                      {tipoParede === 'concreto' && (
                        <>
                          <option value="10">10 cm (concreto maciço)</option>
                          <option value="15">15 cm (concreto maciço pesado)</option>
                          <option value="nao_sei">Não sei</option>
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
                    Qual a estrutura do piso ou laje?
                  </label>
                  <select
                    className={styles.select}
                    value={tipoPiso}
                    onChange={(e) => setTipoPiso(e.target.value)}
                  >
                    <option value="concreto_maciço">Laje maciça de concreto nua (sem atenuador)</option>
                    <option value="flutuante">Laje com piso flutuante (manta acústica e contrapiso)</option>
                    <option value="vinilico">Laje com contrapiso e piso vinílico colado</option>
                    <option value="nao_sei">Não sei</option>
                  </select>
                </div>

                <div>
                  <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
                    Qual a espessura da laje?
                  </label>
                  <select
                    className={styles.select}
                    value={espessuraPiso}
                    onChange={(e) => setEspessuraPiso(e.target.value)}
                  >
                    <option value="10">10 cm</option>
                    <option value="14">14 cm (padrão residencial)</option>
                    <option value="nao_sei">Não sei</option>
                  </select>
                </div>
              </div>
            )}

            {/* Informações do Sistema Selecionado */}
            {sistemaSelecionado && (
              <SystemInfoCard
                sistema={sistemaSelecionado}
                dadosAcusticos={sistemaSelecionado.dados_acusticos}
                fontes={sistemaSelecionado.dados_acusticos?.map((d) => d.fonte)}
                modo="documentado"
              />
            )}
          </div>
        )}

        {/* CAMINHO B: PERSONALIZADO */}
        {caminho === 'personalizado' && (
          <LayerComposer
            onCompositionChange={handleCompositionChange}
            initialLayers={form.camadas}
          />
        )}
      </div>

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleAvancar}
        >
          <span>Avançar para Parâmetros do Ambiente</span>
        </button>
      </div>
    </div>
  );
}