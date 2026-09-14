import { IconChevronDown } from './IconSet';
import { scrollToSection } from '../utils/scroll';
import styles from '../style/HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.textSide}>
          <h1 className={styles.title}>
            Precisão <span className={styles.highlight}>acústica</span> para<br />
            melhores edificações.
          </h1>
          <p className={styles.subtitle}>
            Plataforma que prevê e otimiza o desempenho acústico de edificações,
            garantindo mais qualidade sonora desde o planejamento.
          </p>
        </div>
      </div>


      <div
        className={styles.scrollIndicator}
        role="button"
        tabIndex={0}
        aria-label="Rolar para baixo"
        onClick={() => scrollToSection('o-que-somos')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToSection('o-que-somos');
          }
        }}
      >
        <IconChevronDown size={32} color="#FFFFFF" />
      </div>
    </section>
  );
}
