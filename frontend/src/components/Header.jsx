import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconHamburger } from './IconSet';
import Logo from './Logo';
import styles from '../style/Header.module.css';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.left}>
        <button className={styles.hamburger} onClick={onMenuClick} aria-label="Menu">
          <IconHamburger size={24} color="#FFFFFF" />
        </button>
        <Logo width={170} className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        {user ? (
          <>
            <span className={styles.welcomeText}>Olá, {user.name?.split(' ')[0]}</span>
            <Link to="/profile" className={styles.btnPrimary}>Meu Perfil</Link>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.btnOutline}>Entrar</Link>
            <Link to="/register" className={styles.btnPrimary}>Cadastrar</Link>
          </>
        )}
      </nav>
    </header>
  );
}
