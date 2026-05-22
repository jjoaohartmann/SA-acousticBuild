import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Dashboard.modules.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>AcousticBuild</h1>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>Olá, {user?.name}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Login realizado com sucesso!</h2>
          <p style={styles.cardText}>
            Você está autenticado como <strong>{user?.email}</strong>.
          </p>
          <p style={styles.cardText}>
            A aplicação está funcionando perfeitamente(até então).
          </p>
        </div>
      </main>
    </div>
  );
}
