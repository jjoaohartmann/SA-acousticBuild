import styles from '../../style/CalculatorStepHeader.module.css';

const STEPS = ['Dados de entrada', 'Cálculos', 'Resultados'];

export default function CalculatorStepHeader({ step }) {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Calculadora <span className={styles.highlight}>acústica</span>
        </h1>
        <p className={styles.subtitle}>
          Descubra quanto barulho atravessa uma parede ou um piso e se isso atende
          à ABNT NBR 15575 — a norma brasileira de desempenho das edificações.
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