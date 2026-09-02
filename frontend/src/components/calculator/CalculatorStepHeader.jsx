import styles from '../../style/CalculatorStepHeader.module.css';

const STEPS = ['Dados de entrada', 'Cálculos', 'Resultados'];

export default function CalculatorStepHeader({ step }) {
  return (
    <div className={styles.header}>
      {/* Decoração de fundo: prédio wireframe + grid 3D */}
      <div className={styles.gridDecor} aria-hidden="true" />
      <div className={styles.buildingDecor} aria-hidden="true">
        <svg viewBox="0 0 200 220" className={styles.buildingSvg}>
          <g stroke="rgba(47,111,255,0.7)" strokeWidth="1.4" fill="none">
            <rect x="55" y="30" width="55" height="150" rx="2"/>
            <line x1="55" y1="60" x2="110" y2="60"/>
            <line x1="55" y1="90" x2="110" y2="90"/>
            <line x1="55" y1="120" x2="110" y2="120"/>
            <line x1="83" y1="30" x2="83" y2="110"/>
            <rect x="28" y="90" width="40" height="55" rx="2" opacity="0.5"/>
          </g>
        </svg>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Calculadora <span className={styles.highlight}>acústica</span>
        </h1>
        <p className={styles.subtitle}>
          Preveja os níveis de ruído em sua edificação de acordo com a norma EN 12354
        </p>

        {/* Stepper */}
        <div className={styles.stepper}>
          {STEPS.map((label, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isCurrent = n === step;
            return (
              <div key={label} className={styles.stepItem}>
                <span className={`${styles.stepCircle} ${isDone ? styles.done : ''} ${isCurrent ? styles.current : ''}`}>
                  {isDone ? '✓' : n}
                </span>
                <span className={`${styles.stepLabel} ${isCurrent ? styles.stepLabelCurrent : ''}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}