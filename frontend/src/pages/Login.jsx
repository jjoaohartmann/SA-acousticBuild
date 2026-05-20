import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg || 'Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.formSide}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Bem-vindo de volta!</h2>
          <p style={styles.formSubtitle}>Entre com suas credenciais para continuar</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mail</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Senha</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p style={styles.switchText}>
            Não tem uma conta?{' '}
            <Link to="/register" style={styles.link}>Cadastrar-se</Link>
          </p>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelContent}>
          <h1 style={styles.panelTitle}>AcousticBuild</h1>
          <p style={styles.panelSubtitle}>
            Sua plataforma completa para gestão de projetos acústicos.
          </p>
          <div style={styles.panelDecoration} />
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
  },
  formSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    padding: '40px',
  },
  formBox: {
    width: '100%',
    maxWidth: '400px',
  },
  formTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  formSubtitle: {
    color: '#64748b',
    marginBottom: '32px',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    background: 'white',
  },
  button: {
    padding: '13px',
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '20px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#64748b',
    fontSize: '0.9rem',
  },
  link: {
    color: '#1a73e8',
    fontWeight: '600',
    textDecoration: 'none',
  },
  panel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  panelContent: {
    color: 'white',
    maxWidth: '360px',
  },
  panelTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  panelSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.85,
    lineHeight: '1.6',
    marginBottom: '40px',
  },
  panelDecoration: {
    width: '60px',
    height: '4px',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '2px',
  },
};