import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1a73e8',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  welcomeText: {
    color: '#475569',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    padding: '8px 20px',
    background: 'transparent',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  main: {
    padding: '60px 40px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
  },
  cardText: {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '8px',
  },
};