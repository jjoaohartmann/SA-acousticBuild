import { IconWaveform, IconInstagram, IconMail, IconSend } from './IconSet';
import styles from '../style/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Coluna 1 - Logo */}
          <div className={styles.colBrand}>
            <div className={styles.logoRow}>
              <IconWaveform size={28} color="#FFFFFF" />
              <div>
                <h3 className={styles.brandName}>AcousticBuild</h3>
                <span className={styles.brandSub}>Previsão Acústica</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Tecnologia e conhecimento para construir um futuro mais silencioso e eficiente.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <IconInstagram size={20} color="#FFFFFF" />
              </a>
              <a href="#" className={styles.socialLink} aria-label="E-mail">
                <IconMail size={20} color="#FFFFFF" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Navegação */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navegação</h4>
            <ul className={styles.colLinks}>
              <li><a href="#o-que-somos">O que somos</a></li>
              <li><a href="#quem-somos">Quem somos</a></li>
              <li><a href="#produto">Produto</a></li>
            </ul>
          </div>

          {/* Coluna 3 - Produto */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Produto</h4>
            <ul className={styles.colLinks}>
              <li><a href="#">Calculadora</a></li>
              <li><a href="#">Recursos</a></li>
            </ul>
          </div>

          {/* Coluna 4 - Suporte */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Suporte</h4>
            <ul className={styles.colLinks}>
              <li><a href="#">Central de ajuda</a></li>
              <li><a href="#">Fale conosco</a></li>
              <li><a href="#">Termos de uso</a></li>
              <li><a href="#">Privacidade</a></li>
            </ul>
          </div>

          {/* Coluna 5 - Newsletter */}
          <div className={styles.colNewsletter}>
            <h4 className={styles.colTitle}>Receba Novidades</h4>
            <p className={styles.newsletterText}>
              Fique por dentro das nossas atualizações e novidades.
            </p>
            <div className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="seu e-mail" 
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterBtn} aria-label="Enviar">
                <IconSend size={18} color="#FFFFFF" />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 AcousticBuild. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
