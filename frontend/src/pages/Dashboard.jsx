import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../style/Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>AcousticBuild</h1>
        <div className={styles.headerRight}>
          <span className={styles.welcomeText}>Olá, {user?.name}!</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Login realizado com sucesso!</h2>
          <p className={styles.cardText}>
            Você está autenticado como <strong>{user?.email}</strong>.
          </p>
          <p className={styles.cardText}>
            A aplicação está funcionando perfeitamente(até então).
          </p>
        </div>
      </main>
    </div>
  );
}
