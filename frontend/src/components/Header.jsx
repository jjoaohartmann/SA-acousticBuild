import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconHamburger } from './IconSet';
import styles from '../style/Header.module.css';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <button className={styles.hamburger} onClick={onMenuClick} aria-label="Menu">
        <IconHamburger size={24} color="#FFFFFF" />
      </button>

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
