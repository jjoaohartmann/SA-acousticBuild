import { useState } from 'react';
import { IconInfo, IconCalculator, IconChevronDown } from '../IconSet';
import styles from '../../style/Calculator.module.css';

export default function Step1Input({ form, setForm, onAdvanced }) {
  const [showOpcionais, setShowOpcionais] = useState(false);
  const set = (chave) => (e) => setForm((p) => ({ ...p, [chave]: e.target.value }));

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Dados de entrada</h2>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.labelInline}>Tipo de cálculo <IconInfo size={16} color="#8aa2d0" /></label>
          <select className={styles.select} value={form.tipo || ''} onChange={set('tipo')}>
            <option value="" disabled>DnT ou LnT</option>
            <option value="dnt">DnT</option>
            <option value="lnt">LnT</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Ambiente emissor <IconInfo size={16} color="#8aa2d0" /></label>
          <input className={styles.input} type="text" placeholder="(nome do ambiente)" value={form.emissor || ''} onChange={set('emissor')} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Ambiente Receptor <IconInfo size={16} color="#8aa2d0" /></label>
          <input className={styles.input} type="text" placeholder="(nome do ambiente)" value={form.receptor || ''} onChange={set('receptor')} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Elemento de separação <IconInfo size={16} color="#8aa2d0" /></label>
          <select className={styles.select} value={form.elemento || ''} onChange={set('elemento')}>
            <option value="" disabled>(estrutura/objeto separador)</option>
            <option value="parede">Parede</option>
            <option value="laje">Laje</option>
            <option value="piso">Piso</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Área do elemento (m²) <IconInfo size={16} color="#8aa2d0" /></label>
          <div className={styles.inputUnit}>
            <input className={styles.input} type="number" step="any" placeholder="(exemplo: 15,55)" value={form.area ?? ''} onChange={set('area')} />
            <span className={styles.unit}>m²</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Índice de redução sonoro R (db) <IconInfo size={13} color="#8aa2d0" /></label>
          <div className={styles.inputUnit}>
            <input className={styles.input} type="number" step="any" placeholder="(exemplo: 52)" value={form.r ?? ''} onChange={set('r')} />
            <span className={styles.unit}>db</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Volume do ambiente receptor (m³) <IconInfo size={13} color="#8aa2d0" /></label>
          <div className={styles.inputUnit}>
            <input className={styles.input} type="number" step="any" placeholder="(exemplo: 75,5)" value={form.volume ?? ''} onChange={set('volume')} />
            <span className={styles.unit}>m³</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.labelInline}>Tempo de reverberação T (s) <IconInfo size={13} color="#8aa2d0" /></label>
          <div className={styles.inputUnit}>
            <input className={styles.input} type="number" step="any" placeholder="(exemplo: 0,6)" value={form.t ?? ''} onChange={set('t')} />
            <span className={styles.unit}>s</span>
          </div>
        </div>
      </div>

      <button type="button" className={styles.accordion} onClick={() => setShowOpcionais((v) => !v)}>
        <span>Parâmetros opcionais</span>
        <IconChevronDown size={18} color="#2F6FFF" />
      </button>

      <div className={styles.cardActions}>
        <button type="button" className={styles.primaryBtn} onClick={onAdvanced}>
          Avançar para os cálculos →
        </button>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoIconBox}>
          <IconCalculator size={26} color="#FFFFFF" />
        </div>
        <div className={styles.infoText}>
          <h3 className={styles.infoTitle}>Sobre os cálculos</h3>
          <p className={styles.infoDesc}>
            Os cálculos são realizados conforme as normas EN 12354-1 e 12354-2 para prefição de desempenho acústico em edificações.
          </p>
        </div>
        <a href="https://pt.wikipedia.org/wiki/ISO_12354" target="_blank" rel="noreferrer" className={styles.outlineBtn}>
          Saiba mais sobre as normas
        </a>
      </div>
    </div>
  );
}