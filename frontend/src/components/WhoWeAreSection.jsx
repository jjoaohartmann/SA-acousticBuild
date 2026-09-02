import { IconRecycle, IconCircleCheck, IconBulb, IconPersonCircle } from './IconSet';
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
            Somos estudantes e pesquisadores que tem como missão levar inovação para o mercado de planejamento arquitetônico através de 
            um sistema de fácil acesso, ser referência na previsão acústica e incentivar uma maior preocupação por parte das 
            empresas em relação à acústica do lugar que estão construindo.
          </p>
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
    </section>
  );
}
