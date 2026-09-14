import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconInstagram, IconMail, IconSend } from './IconSet';
import Logo from './Logo';
import styles from '../style/Footer.module.css';

const EMAIL_CONTATO = 'suporte@acousticbuild.com';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Não existe serviço de newsletter por trás disso. Em vez de engolir o
  // e-mail em silêncio, abrimos uma mensagem pronta para o contato do projeto.
  const inscrever = (e) => {
    e.preventDefault();
    if (!email) return;
    const assunto = encodeURIComponent('Quero receber novidades da AcousticBuild');
    const corpo = encodeURIComponent(`Gostaria de acompanhar as atualizações do projeto.\n\nE-mail: ${email}`);
    window.location.href = `mailto:${EMAIL_CONTATO}?subject=${assunto}&body=${corpo}`;
    setEnviado(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Coluna 1 - Logo */}
          <div className={styles.colBrand}>
            <Logo width={200} />
            <p className={styles.brandDesc}>
              Tecnologia e conhecimento para construir um futuro mais silencioso e eficiente.
            </p>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/ic_floripa/" className={styles.socialLink} aria-label="Instagram">
                <IconInstagram size={20} color="#FFFFFF" />
              </a>
              <a href={`mailto:${EMAIL_CONTATO}`} className={styles.socialLink} aria-label="E-mail">
                <IconMail size={20} color="#FFFFFF" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Navegação
              As âncoras levam o caminho "/" na frente porque o rodapé também
              aparece fora da Home — sem isso o link não faz nada nas outras páginas. */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navegação</h4>
            <ul className={styles.colLinks}>
              <li><a href="/#o-que-somos">O que somos</a></li>
              <li><a href="/#quem-somos">Quem somos</a></li>
              <li><Link to="/sobre">Sobre nós</Link></li>
            </ul>
          </div>

          {/* Coluna 3 - Produto */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Produto</h4>
            <ul className={styles.colLinks}>
              <li><Link to="/calculadora">Calculadora</Link></li>
              <li><Link to="/sobre#metodologia">Metodologia</Link></li>
              <li><Link to="/minhas-simulacoes">Minhas simulações</Link></li>
            </ul>
          </div>

          {/* Coluna 4 - Suporte */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Suporte</h4>
            <ul className={styles.colLinks}>
              <li><Link to="/suporte">Central de ajuda</Link></li>
              <li><Link to="/termos">Termos de uso</Link></li>
              <li><Link to="/privacidade">Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 5 - Newsletter */}
          <div className={styles.colNewsletter}>
            <h4 className={styles.colTitle}>Receba Novidades</h4>
            <p className={styles.newsletterText}>
              Fique por dentro das nossas atualizações e novidades.
            </p>
            <form className={styles.newsletterForm} onSubmit={inscrever}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEnviado(false); }}
                placeholder="seu e-mail"
                className={styles.newsletterInput}
                aria-label="Seu e-mail para receber novidades"
              />
              <button type="submit" className={styles.newsletterBtn} aria-label="Enviar">
                <IconSend size={18} color="#FFFFFF" />
              </button>
            </form>
            {enviado && (
              <p className={styles.newsletterOk} role="status">
                Abrimos seu programa de e-mail com a inscrição pronta — é só enviar.
              </p>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 AcousticBuild. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
