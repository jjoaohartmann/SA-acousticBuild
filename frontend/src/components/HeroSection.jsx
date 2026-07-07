import WavesIllustration from './WavesIllustration';
import { IconChevronDown } from './IconSet';
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
        <div className={styles.imageSide}>
          <WavesIllustration width={400} />
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <IconChevronDown size={32} color="#FFFFFF" />
      </div>
    </section>
  );
}
