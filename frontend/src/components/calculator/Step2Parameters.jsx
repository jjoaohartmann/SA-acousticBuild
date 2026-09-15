import { useState, useEffect } from 'react';
import { getCenarios } from '../../services/api';
import styles from '../../style/Calculator.module.css';

// ABNT NBR 10152:2017, Tabela 1 — nível de conforto recomendado por ambiente.
// Eixo independente do cenário da NBR 15575 (que define a exigência legal).
const AMBIENTES_10152 = [
  { chave: 'dormitorio', nome: 'Dormitório', recomendado: 35 },
  { chave: 'sala_estar', nome: 'Sala de estar', recomendado: 40 },
  { chave: 'sala_aula', nome: 'Sala de aula', recomendado: 40 },
  { chave: 'biblioteca', nome: 'Biblioteca (área de leitura)', recomendado: 35 },
  { chave: 'enfermaria', nome: 'Enfermaria / quarto hospitalar', recomendado: 35 },
  { chave: 'escritorio', nome: 'Escritório individual', recomendado: 40 },
];

// Palpite inicial a partir do cenário — o usuário pode trocar
const SUGESTAO_POR_CENARIO = {
  parede_entre_unidades: 'dormitorio',
  parede_dormitorio_area_comum: 'dormitorio',
  sala_aula_educacional: 'sala_aula',
  generico: 'sala_estar',
  laje_entre_unidades: 'dormitorio',
  laje_coletiva_dormitorio: 'dormitorio',
  laje_escolar_educacional: 'sala_aula',
};

export default function Step2Parameters({ form, setForm, onCalculate }) {
  const [errorLocal, setErrorLocal] = useState('');
  const [cenariosDisponiveis, setCenariosDisponiveis] = useState({});
  const [usarMedicaoManual, setUsarMedicaoManual] = useState(
    Boolean(form.l2 || form.possuiMedicaoL2 || form.li)
  );

  const tipoAtual = form.elemento === 'piso_laje' ? 'impacto' : 'aereo';

  useEffect(() => {
    getCenarios()
      .then((res) => setCenariosDisponiveis(res.data))
      .catch((err) => console.error('Erro ao buscar cenários:', err));
  }, []);

  const setChave = (chave) => (e) => {
    setErrorLocal('');
    setForm((p) => ({ ...p, [chave]: e.target.value }));
  };

  const num = (v) => (v !== undefined && v !== null && v !== '' ? Number(v) : NaN);

  // Parâmetros do ambiente
  const S = num(form.area || 15.0);
  const V = num(form.volume || 36.0);
  const T = num(form.t || 0.6);
  const A = !Number.isNaN(V) && !Number.isNaN(T) && T > 0 ? (0.16 * V) / T : null;

  const cenariosTipo = cenariosDisponiveis[tipoAtual] || {};

  const cenarioAtual = form.cenario || (tipoAtual === 'impacto' ? 'laje_entre_unidades' : 'parede_entre_unidades');
  const ambienteSugerido = SUGESTAO_POR_CENARIO[cenarioAtual] || 'sala_estar';

  const handleExecutar = () => {
    if (Number.isNaN(V) || V <= 0) {
      setErrorLocal('Informe o Volume do receptor (V) maior que zero.');
      return;
    }
    if (Number.isNaN(T) || T <= 0) {
      setErrorLocal('Informe o Tempo de reverberação (T) maior que zero.');
      return;
    }
    if (Number.isNaN(S) || S <= 0) {
      setErrorLocal('Informe a Área do elemento separador (S) maior que zero.');
      return;
    }

    if (usarMedicaoManual) {
      if (tipoAtual === 'aereo') {
        const L1 = num(form.l1 ?? '');
        const L2 = num(form.l2 ?? '');
        if (Number.isNaN(L1) || L1 <= 0) {
          setErrorLocal('Informe o nível do emissor (L\u2081) maior que zero.');
          return;
        }
        if (Number.isNaN(L2) || L2 <= 0) {
          setErrorLocal('Informe o nível medido no receptor (L\u2082) maior que zero.');
          return;
        }
        // Garantir que os valores estejam no form para o payload
        setForm((p) => ({ ...p, l1: L1, l2: L2, possuiMedicaoL2: true }));
      } else {
        const Li = num(form.li ?? '');
        if (Number.isNaN(Li) || Li <= 0) {
          setErrorLocal('Informe o nível de impacto (Li) medido pela máquina de percussão.');
          return;
        }
        setForm((p) => ({ ...p, li: Li }));
      }
    }

    setErrorLocal('');
    onCalculate();
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Passo 2: Parâmetros do Ambiente e Critério Normativo</h2>

      {/* Resumo do Sistema Escolhido no Passo 1 */}
      <div
        style={{
          background: 'rgba(47, 111, 255, 0.1)',
          border: '1px solid rgba(47, 111, 255, 0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: '#8ab4f8', textTransform: 'uppercase', fontWeight: 700 }}>
            Elemento Selecionado no Passo 1
          </span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
            {form.sistemaNome || (form.elemento === 'piso_laje' ? 'Piso / Laje' : 'Parede')}
            {form.sistema_codigo && ` (${form.sistema_codigo})`}
          </div>
        </div>

        {form.r && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Dado Acústico Documentado</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2ecc71' }}>
              Rw = {form.r} dB
            </div>
          </div>
        )}
      </div>

      {/* Fonte de ruído — antes era 85 dB fixo e invisível para o usuário */}
      {tipoAtual === 'aereo' && (
        <div className={styles.eixo} style={{ marginBottom: '24px' }}>
          <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
            Quanto de barulho existe no ambiente vizinho? (L₁)
          </label>
          <div className={styles.fieldRowDouble}>
            <select
              className={styles.select}
              value={String(form.l1 ?? 85)}
              onChange={setChave('l1')}
            >
              <option value="60">Conversa normal — 60 dB</option>
              <option value="70">TV ou música em volume alto — 70 dB</option>
              <option value="85">Conversa alta, festa, som ligado — 85 dB (padrão)</option>
              <option value="95">Festa com som potente — 95 dB</option>
            </select>
            <div className={styles.inputUnit}>
              <input
                className={styles.input}
                type="number"
                min="30"
                max="120"
                value={form.l1 ?? 85}
                onChange={setChave('l1')}
              />
              <span className={styles.unit}>dB</span>
            </div>
          </div>
          <span className={styles.eixoAjuda}>
            Esse valor <strong>não muda</strong> o veredito da NBR 15575 — ele se cancela na conta
            do isolamento. Ele só define <strong>quanto de ruído sobra</strong> do seu lado, que é
            a leitura de conforto.
          </span>
        </div>
      )}

      {/* Dois eixos independentes: exigência legal x referência de conforto */}
      <div className={styles.doisEixos}>
        {/* EIXO 1 — exigência legal */}
        <div className={styles.eixo}>
          <span className={styles.eixoTag}>Exigência legal</span>
          <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
            Cenário de desempenho (ABNT NBR 15575)
          </label>
          <select
            className={styles.select}
            value={form.cenario || (tipoAtual === 'impacto' ? 'laje_entre_unidades' : 'parede_entre_unidades')}
            onChange={setChave('cenario')}
          >
            {Object.entries(cenariosTipo).map(([chave, item]) => (
              <option key={chave} value={chave}>
                {item.nome}
                {tipoAtual === 'aereo'
                  ? ` — precisa bloquear ${item.minimo} dB ou mais`
                  : ` — o ruído embaixo precisa ficar em ${item.minimo} dB ou menos`}
              </option>
            ))}
            {Object.keys(cenariosTipo).length === 0 && (
              <option value={tipoAtual === 'impacto' ? 'laje_entre_unidades' : 'parede_entre_unidades'}>
                {tipoAtual === 'impacto'
                  ? 'Laje entre unidades autônomas — ruído embaixo em 55 dB ou menos'
                  : 'Parede entre unidades autônomas — precisa bloquear 45 dB ou mais'}
              </option>
            )}
          </select>
          <span className={styles.eixoAjuda}>
            {tipoAtual === 'aereo' ? (
              <>
                Atenção: esses dB são <strong>o quanto a parede tem que barrar</strong>, não o
                barulho que sobra no quarto. Bloquear mais é melhor. É o veredito ATENDE / NÃO ATENDE.
              </>
            ) : (
              <>
                Aqui os dB são <strong>o barulho que chega no vizinho de baixo</strong>. Quanto
                menos, melhor. É o veredito ATENDE / NÃO ATENDE.
              </>
            )}
          </span>
        </div>

        {/* EIXO 2 — referência de conforto */}
        <div className={styles.eixo}>
          <span className={`${styles.eixoTag} ${styles.eixoTagConforto}`}>Referência de conforto</span>
          <label className={styles.labelInline} style={{ marginBottom: '6px' }}>
            Ambiente que recebe o ruído (ABNT NBR 10152)
          </label>
          <select
            className={styles.select}
            value={form.ambiente_receptor_tipo || ambienteSugerido}
            onChange={setChave('ambiente_receptor_tipo')}
          >
            {AMBIENTES_10152.map((a) => (
              <option key={a.chave} value={a.chave}>
                {a.nome} (recomendado: até {a.recomendado} dB)
              </option>
            ))}
          </select>
          <span className={styles.eixoAjuda}>
            Define quanto ruído é <strong>confortável</strong> nesse ambiente. Não altera o
            veredito legal — serve para interpretar o resultado.
          </span>
        </div>
      </div>

      {/* Geometria e Propriedades da Sala Receptora */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className={styles.field}>
          <label className={styles.labelInline}>Área do Elemento Separador (S)</label>
          <div className={styles.inputUnit}>
            <input
              className={styles.input}
              type="number"
              min="0.1"
              step="0.5"
              placeholder="Ex: 15"
              value={form.area ?? 15.0}
              onChange={setChave('area')}
            />
            <span className={styles.unit}>m²</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Volume da Sala Receptora (V)</label>
          <div className={styles.inputUnit}>
            <input
              className={styles.input}
              type="number"
              min="1"
              step="1"
              placeholder="Ex: 36"
              value={form.volume ?? 36.0}
              onChange={setChave('volume')}
            />
            <span className={styles.unit}>m³</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Tempo de Reverberação (T)</label>
          <div className={styles.inputUnit}>
            <input
              className={styles.input}
              type="number"
              min="0.1"
              step="0.05"
              placeholder="Ex: 0.6"
              value={form.t ?? 0.6}
              onChange={setChave('t')}
            />
            <span className={styles.unit}>s</span>
          </div>
        </div>
      </div>

      {/* Painel da Área de Absorção de Sabine Calculada */}
      <div
        style={{
          background: '#070E22',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Absorção Sonora de Sabine: <code style={{ color: '#8ab4f8' }}>A = 0,16 · V / T</code>
        </span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#2F6FFF' }}>
          A = {A !== null ? `${A.toFixed(2).replace('.', ',')} m²` : '—'}
        </span>
      </div>

      {/* Opção Avançada: Medição Real em Campo / Override Manual */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '18px', marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={usarMedicaoManual}
            onChange={(e) => {
              setUsarMedicaoManual(e.target.checked);
              setForm((p) => ({ ...p, possuiMedicaoL2: e.target.checked }));
            }}
          />
          <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
            Desejo informar uma medição experimental in situ (com sonômetro / decibelímetro)
          </span>
        </label>

        {usarMedicaoManual && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
            }}
          >
            {tipoAtual === 'aereo' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className={styles.field}>
                  <label className={styles.labelInline}>Nível Sonoro no Emissor (L₁)</label>
                  <div className={styles.inputUnit}>
                    <input
                      className={styles.input}
                      type="number"
                      step="any"
                      placeholder="Ex: 85"
                      value={form.l1 ?? ''}
                      onChange={setChave('l1')}
                    />
                    <span className={styles.unit}>dB</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.labelInline}>Nível Medido no Receptor (L₂)</label>
                  <div className={styles.inputUnit}>
                    <input
                      className={styles.input}
                      type="number"
                      step="any"
                      placeholder="Ex: 42"
                      value={form.l2 ?? ''}
                      onChange={setChave('l2')}
                    />
                    <span className={styles.unit}>dB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.field}>
                <label className={styles.labelInline}>Nível de Impacto no Receptor (Li)</label>
                <div className={styles.inputUnit}>
                  <input
                    className={styles.input}
                    type="number"
                    step="any"
                    placeholder="Ex: 60"
                    value={form.li ?? ''}
                    onChange={setChave('li')}
                  />
                  <span className={styles.unit}>dB</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  Nível medido com a máquina de percussão padronizada (Tapping Machine).
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {errorLocal && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(231, 76, 60, 0.15)',
            border: '1px solid #e74c3c',
            borderRadius: '8px',
            color: '#ff7675',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}
        >
          {errorLocal}
        </div>
      )}

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleExecutar}
        >
          Calcular Desempenho Acústico e Normativo
        </button>
      </div>
    </div>
  );
}