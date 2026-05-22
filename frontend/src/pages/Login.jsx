import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../style/Login.modules.css';

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
          <Logo width={320} light={true} />

          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '40px', fontSize: '1rem', lineHeight: '1.6' }}>
             Entre com suas informações pessoais para acessar nossos serviços.
        </p>
        </div>
      </div>

    </div>
  );
}