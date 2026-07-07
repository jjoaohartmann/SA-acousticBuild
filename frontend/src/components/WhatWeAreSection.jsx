import { IconBuilding, IconChartUp, IconShieldCheck, IconChevronDownDark } from './IconSet';
import styles from '../style/WhatWeAreSection.module.css';

const cards = [
  {
    icon: IconBuilding,
    title: 'Precisão',
    text: 'Cálculos e simulação acústicas com alto nível de precisão, verificado com cálculos e pesquisas de campo.'
  },
  {
    icon: IconChartUp,
    title: 'Eficiência',
    text: 'Agilidade e automação no desenvolvimento e otimização dos seus projetos.'
  },
  {
    icon: IconShieldCheck,
    title: 'Confiabilidade',
    text: 'Resultados confiáveis, verificados com dados de pesquisa de campo e veracidade de normas técnicas europeias.'
  }
];

export default function WhatWeAreSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.label}>O que somos</span>
        <h2 className={styles.title}>
          Soluções acústicas para <span className={styles.highlight}>seu projeto</span>.
        </h2>
        <p className={styles.description}>
          A Acústicbuild oferece uma ferramenta especializada para prever, analisar 
          e otimizar o desempenho acústico em diferentes edificações.
        </p>

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={styles.card}>
                <div className={styles.iconBox}>
                  <Icon size={32} color="#1E5EFF" />
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <IconChevronDownDark size={32} color="#64748b" />
      </div>
    </section>
  );
}
