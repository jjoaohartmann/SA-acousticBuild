import { Link } from 'react-router-dom';
import { IconWaveform, IconSpeakerWave, IconBriefcase, IconChartBars } from './IconSet';
import Reveal from './Reveal';
import styles from '../style/ProductSection.module.css';

const FEATURES = [
  {
    icon: IconWaveform,
    title: 'Isolamento Acústico',
    text: 'Cálculos e análise de isolamento acústico entre ambientes.',
  },
  {
    icon: IconSpeakerWave,
    title: 'Absorção Sonora',
    text: 'Avaliação de materiais e desempenho acústico de ambientes.',
  },
  {
    icon: IconBriefcase,
    title: 'Relatório no Planejamento',
    text: 'Análise acústica no planejamento de sistemas construtivos.',
  },
  {
    icon: IconChartBars,
    title: 'Relatórios e Laudos',
    text: 'Geração automática de relatórios técnicos e laudos precisos.',
  },
];

export default function ProductSection() {
  return (
    <section className={styles.section}>
      <Reveal>
        <span className={styles.label}>Produto</span>
        <h2 className={styles.title}>
          Ferramentas completas para engenharia <span className={styles.highlight}>acústica</span>.
        </h2>
      </Reveal>

      <div className={styles.grid}>
        {FEATURES.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 100}>
            <div className={styles.card}>
              <Icon size={48} color="#1E5EFF" />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
              <Link to="/calculadora" className={styles.cardLink}>Saiba mais →</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
