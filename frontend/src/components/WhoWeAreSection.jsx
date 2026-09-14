import { Link } from 'react-router-dom';
import { IconRecycle, IconCircleCheck, IconBulb, IconPersonCircle, IconChevronDown } from './IconSet';
import { scrollToSection } from '../utils/scroll';
import Reveal from './Reveal';
import styles from '../style/WhoWeAreSection.module.css';

const values = [
  { icon: IconRecycle, title: 'Sustentabilidade', text: 'Bem-estar e saúde.' },
  { icon: IconCircleCheck, title: '100%', text: 'Foco em qualidade' },
  { icon: IconBulb, title: 'Inovação', text: 'Tecnologia e conhecimento a favor do seu projeto' },
  { icon: IconPersonCircle, title: 'Foco', text: 'Conforto acústico' }
];

export default function WhoWeAreSection() {
  return (
    <section className={styles.section}>
      <div className={styles.backgroundDots} />

      <div className={styles.container}>
        <Reveal className={styles.textSide}>
          <span className={styles.label}>Quem somos</span>
          <h2 className={styles.title}>
            Engenharia que constrói o <span className={styles.highlight}>silêncio</span>.
          </h2>
          <p className={styles.description}>
            Somos estudantes e pesquisadores que têm como missão levar inovação para o mercado de planejamento arquitetônico através de
            um sistema de fácil acesso, ser referência na previsão acústica e incentivar uma maior preocupação por parte das
            empresas em relação à acústica do lugar que estão construindo.
          </p>
          <Link to="/sobre" className={styles.btnOutline}>Saiba mais sobre nós →</Link>
        </Reveal>

        <div className={styles.gridSide}>
          <div className={styles.valuesGrid}>
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={index} delay={index * 100}>
                  <div className={styles.valueCard}>
                    <div className={styles.valueIconBox}>
                      <Icon size={36} color="#1E5EFF" />
                    </div>
                    <div>
                      <h4 className={styles.valueTitle}>{item.title}</h4>
                      <p className={styles.valueText}>{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={styles.scrollIndicator}
        role="button"
        tabIndex={0}
        aria-label="Rolar para baixo"
        onClick={() => scrollToSection('produto')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToSection('produto');
          }
        }}
      >
        <IconChevronDown size={32} color="#FFFFFF" />
      </div>
    </section>
  );
}
