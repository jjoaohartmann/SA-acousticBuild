import { IconBuilding, IconChartUp, IconShieldCheck, IconChevronDown } from './IconSet';
import { scrollToSection } from '../utils/scroll';
import Reveal from './Reveal';
import styles from '../style/WhatWeAreSection.module.css';

const cards = [
  {
    icon: IconBuilding,
    title: 'Rastreabilidade',
    text: 'Cada número vem com a origem declarada: ensaio de laboratório, valor medido em campo ou estimativa teórica. Você sempre sabe em que está pisando.'
  },
  {
    icon: IconChartUp,
    title: 'Eficiência',
    text: 'Agilidade e automação no desenvolvimento e otimização dos seus projetos, ainda na fase de planejamento.'
  },
  {
    icon: IconShieldCheck,
    title: 'Base normativa',
    text: 'Critérios da ABNT NBR 15575 e NBR 10152, com índices e métodos das ISO 717, ISO 16283 e EN 12354.'
  }
];

export default function WhatWeAreSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Reveal>
          <span className={styles.label}>O que somos</span>
          <h2 className={styles.title}>
            Soluções acústicas para <span className={styles.highlight}>seu projeto</span>.
          </h2>
          <p className={styles.description}>
            A AcousticBuild oferece uma ferramenta especializada para prever, analisar
            e otimizar o desempenho acústico em diferentes edificações.
          </p>
        </Reveal>

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={index} delay={index * 100}>
                <div className={styles.card}>
                  <div className={styles.iconBox}>
                    <Icon size={32} color="#1E5EFF" />
                  </div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardText}>{card.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div
        className={styles.scrollIndicator}
        role="button"
        tabIndex={0}
        aria-label="Rolar para baixo"
        onClick={() => scrollToSection('quem-somos')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToSection('quem-somos');
          }
        }}
      >
        <IconChevronDown size={32} color="#FFFFFF" />
      </div>
    </section>
  );
}
