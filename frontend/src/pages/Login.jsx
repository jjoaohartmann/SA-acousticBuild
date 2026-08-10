import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
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
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg || 'Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <Link to="/" className={styles.backLink}>Início</Link>

      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>Bem-vindo de volta!</h2>
          <p className={styles.formSubtitle}>Entre com suas credenciais para continuar</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Senha</label>
              <input
                className={styles.input}
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
              className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className={styles.switchText}>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.link}>Cadastrar-se</Link>
          </p>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Logo width={320} light={true} />

          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '40px', fontSize: '1rem', lineHeight: '1.6' }}>
             Entre com suas informações pessoais para acessar nossos serviços.
        </p>
        </div>
      </div>

    </div>
  );
}