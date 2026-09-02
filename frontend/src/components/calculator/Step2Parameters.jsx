import { useState } from 'react';
import { IconInfo, IconChevronDown } from '../IconSet';
import styles from '../../style/Calculator.module.css';

export default function Step2Parameters({ form, setForm, onCalculate }) {
  const [showLegenda, setShowLegenda] = useState(false);
  const set = (chave) => (e) => setForm((p) => ({ ...p, [chave]: e.target.value }));

  // A2 = 0,16 * V2 / T2  (calculado automaticamente, somente leitura)
  const num = (v) => (v === '' || v === undefined || v === null ? NaN : Number(v));
  const V2 = num(form.volume);
  const T2 = num(form.t2);
  const A2 = !Number.isNaN(V2) && !Number.isNaN(T2) && T2 > 0 ? (0.16 * V2) / T2 : null;

  const R = num(form.r);
  const S = num(form.area);
  const L1 = num(form.l1);
  const T1 = num(form.t1);

  // L2 = L1 + 10*log10(T2/T1) + R - 10*log10(S/A2)  (Fórmula do Figma / EN 12354-1)
  let L2 = null;
  if (!Number.isNaN(R) && !Number.isNaN(S) && !Number.isNaN(L1) &&
      !Number.isNaN(T1) && A2 !== null && A2 > 0 && T1 > 0 && S > 0) {
    L2 = L1 + 10 * Math.log10(T2 / T1) + R - 10 * Math.log10(S / A2);
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Parâmetros e cálculos</h2>

      {/* 1. Isolamento da partição */}
      <div className={styles.calcBlock}>
        <span className={styles.blockIndex}>1</span>
        <div className={styles.blockBody}>
          <h3 className={styles.blockTitle}>Isolamento da partição</h3>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.labelInline}>Índice de redução sonora ponderado (R) <IconInfo size={13} color="#8aa2d0" /></label>
              <div className={styles.inputUnit}>
                <input className={styles.readonly} type="text" readOnly value={form.r ?? ''} />
                <span className={styles.unit}>dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Nível no emissor */}
      <div className={styles.calcBlock}>
        <span className={styles.blockIndex}>2</span>
        <div className={styles.blockBody}>
          <h3 className={styles.blockTitle}>Nível de pressão sonora no ambiente emissor</h3>
          <div className={styles.fieldRowDouble}>
            <div className={styles.field}>
              <label className={styles.labelInline}>Nível médio de pressão sonora (L₁) <IconInfo size={13} color="#8aa2d0" /></label>
              <div className={styles.inputUnit}>
                <input className={styles.input} type="number" step="any" placeholder="ex.: 85" value={form.l1 ?? ''} onChange={set('l1')} />
                <span className={styles.unit}>dB</span>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.labelInline}>Tempo de reverberação (T₁) <IconInfo size={13} color="#8aa2d0" /></label>
              <div className={styles.inputUnit}>
                <input className={styles.input} type="number" step="any" placeholder="ex.: 0,6" value={form.t1 ?? ''} onChange={set('t1')} />
                <span className={styles.unit}>s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Absorção equivalente do receptor */}
      <div className={styles.calcBlock}>
        <span className={styles.blockIndex}>3</span>
        <div className={styles.blockBody}>
          <h3 className={styles.blockTitle}>Absorção equivalente do ambiente receptor</h3>
          <div className={styles.fieldRowDouble}>
            <div className={styles.field}>
              <label className={styles.labelInline}>Volume do ambiente receptor (V₂) <IconInfo size={13} color="#8aa2d0" /></label>
              <div className={styles.inputUnit}>
                <input className={styles.input} type="number" step="any" placeholder="ex.: 75,5" value={form.volume ?? ''} onChange={set('volume')} />
                <span className={styles.unit}>m³</span>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.labelInline}>Tempo de reverberação (T₂) <IconInfo size={13} color="#8aa2d0" /></label>
              <div className={styles.inputUnit}>
                <input className={styles.input} type="number" step="any" placeholder="ex.: 0,6" value={form.t2 ?? ''} onChange={set('t2')} />
                <span className={styles.unit}>s</span>
              </div>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.labelInline}>Absorção equivalente (A₂ = 0,16 · V₂ / T₂) <IconInfo size={13} color="#8aa2d0" /></label>
            <div className={styles.inputUnit}>
              <input className={styles.readonly} type="text" readOnly value={A2 === null ? '—' : A2.toFixed(2)} />
              <span className={styles.unit}>m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Nível de pressão no receptor */}
      <div className={styles.calcBlock}>
        <span className={styles.blockIndex}>4</span>
        <div className={styles.blockBody}>
          <h3 className={styles.blockTitle}>Nível de pressão sonora no ambiente receptor</h3>
          <p className={styles.formulaLabel}>Fórmula aplicada (EN 12354-1):</p>

          <div className={styles.formulaBox}>
            <span>L<sub>2</sub> = L<sub>1</sub> + 10 log(T<sub>2</sub>/T<sub>1</sub>) + R − 10 log(S/A<sub>2</sub>)</span>
          </div>

          <button type="button" className={styles.accordion} onClick={() => setShowLegenda((v) => !v)}>
            <span>Legenda detalhada</span>
            <IconChevronDown size={18} color="#2F6FFF" />
          </button>

          <div className={styles.resultCalcRow}>
            <div className={styles.resultCalcBox}>
              <span className={styles.resultCalcLabel}>Resultado previsto do Cálculo:</span>
              <span className={styles.resultCalcValue}>L<sub>2</sub> <strong>{L2 === null ? '—' : L2.toFixed(2)} dB</strong></span>
            </div>
            <button type="button" className={styles.primaryBtn} onClick={() => onCalculate()}>
              Avançar para os resultados →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}