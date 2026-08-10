import { IconRecycle, IconCircleCheck, IconBulb, IconPersonCircle, IconChevronDown } from './IconSet';
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
        <div className={styles.textSide}>
          <span className={styles.label}>Quem somos</span>
          <h2 className={styles.title}>
            Engenharia que constrói o <span className={styles.highlight}>silêncio</span>.
          </h2>
          <p className={styles.description}>
            Somos uma equipe especializada em engenharia acústica, dedicada a transformar 
            a forma como edificações são projetadas. Combinamos tecnologia avançada com 
            conhecimento técnico para garantir ambientes com qualidade sonora excepcional, 
            promovendo bem-estar e produtividade.
          </p>
          <button className={styles.btnOutline}>Saiba mais sobre nós →</button>
        </div>

        <div className={styles.gridSide}>
          <div className={styles.valuesGrid}>
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={styles.valueCard}>
                  <div className={styles.valueIconBox}>
                    <Icon size={36} color="#1E5EFF" />
                  </div>
                  <div>
                    <h4 className={styles.valueTitle}>{item.title}</h4>
                    <p className={styles.valueText}>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <IconChevronDown size={32} color="#FFFFFF" />
      </div>
    </section>
  );
}
