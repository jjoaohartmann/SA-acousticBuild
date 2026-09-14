import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { IconEnvelope, IconLock } from '../components/IconSet';
import styles from '../style/Login.module.css';

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
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg || 'Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Início</Link>

      {/* Lado claro — formulário */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Entrar</h1>


          <p className={styles.formHint}>Entre com o seu email:</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>
                <IconEnvelope size={20} color="#1E5EFF" />
              </span>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="email"
                aria-label="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>
                <IconLock size={20} color="#1E5EFF" />
              </span>
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="senha"
                aria-label="Senha"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <div className={styles.forgotRow}>
              <Link to="/esqueci-senha" className={styles.textLink}>Esqueci minha senha</Link>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      {/* Lado escuro — boas-vindas */}
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Logo width={300} />
          <h2 className={styles.panelTitle}>Bem-vindo(a) de volta!</h2>
          <p className={styles.panelText}>
            Entre com suas informações pessoais para acessar nossos serviços
          </p>
          <Link to="/register" className={styles.panelLink}>É meu primeiro acesso</Link>
        </div>
      </div>
    </div>
  );
}
