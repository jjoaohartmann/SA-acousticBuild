import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';
import styles from '../style/Register.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.panel}>
        <div className={styles.panelContent}>
                  <Logo width={320} light={true} />
        
                  <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '40px', fontSize: '1rem', lineHeight: '1.6' }}>
      Cadastre-se para acessar nossos serviços e ficar por dentro das novidades                </p>
                </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>Criar conta</h2>
          <p className={styles.formSubtitle}>Preencha os dados para começar</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome completo</label>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <p className={styles.switchText}>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.link}>Entrar</Link>
          </p>
        </div>
      </div>

    </div>
  );
}