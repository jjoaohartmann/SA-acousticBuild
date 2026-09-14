import { Link } from 'react-router-dom';
import logoSrc from '../assets/logo-acousticbuild.png';
import styles from '../style/Logo.module.css';

export default function Logo({ width = 220, to = '/', className = '', onClick }) {
  const image = (
    <img
      src={logoSrc}
      alt="AcousticBuild — Previsão Acústica"
      className={styles.image}
      style={{ width }}
    />
  );

  if (!to) {
    return <span className={`${styles.wrap} ${className}`}>{image}</span>;
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${styles.wrap} ${styles.link} ${className}`}
      aria-label="AcousticBuild — ir para a página inicial"
    >
      {image}
    </Link>
  );
}
