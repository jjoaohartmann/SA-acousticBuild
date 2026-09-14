import styles from '../style/SourcesStrip.module.css';

const FONTES = [
  'ABNT NBR 15575',
  'ABNT NBR 10152',
  'ISO 16283-1/2',
  'ISO 717-1/2',
  'ISO 12354-1/2',
  'ISO 3382-2',
  'ISO 12999-1',
  'ANSI/ASA S12.60',
  'WHO Environmental Noise Guidelines',
];

export default function SourcesStrip() {
  return (
    <section className={styles.strip} aria-label="Base normativa e científica">
      <p className={styles.label}>
        Metodologia fundamentada em normas técnicas e literatura científica reconhecida
      </p>
      <div className={styles.badgeRow}>
        {FONTES.map((fonte) => (
          <span key={fonte} className={styles.badge}>{fonte}</span>
        ))}
      </div>

      <svg
        className={styles.wave}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 40 C 240 90, 480 0, 720 30 C 960 60, 1200 10, 1440 40 L1440 80 L0 80 Z"
          fill="var(--white)"
        />
      </svg>
    </section>
  );
}
