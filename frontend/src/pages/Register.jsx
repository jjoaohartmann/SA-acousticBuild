import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';
import { IconPerson, IconEnvelope, IconLock } from '../components/IconSet';
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
      <Link to="/" className={styles.backLink}>← Início</Link>

      {/* Lado escuro — convite */}
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Logo width={300} />
          <h2 className={styles.panelTitle}>Você conhece a AcousticBuild?</h2>
          <p className={styles.panelText}>
            Cadastre-se para acessar nossos serviços e ficar por dentro das novidades
          </p>
          <Link to="/login" className={styles.panelLink}>Já sou cliente</Link>
        </div>
      </div>

      {/* Lado claro — formulário */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Criar conta</h1>


          <p className={styles.formHint}>Registre-se com o seu email:</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>
                <IconPerson size={20} color="#1E5EFF" />
              </span>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="nome"
                aria-label="Nome completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="senha (mínimo 6 caracteres)"
                aria-label="Senha (mínimo 6 caracteres)"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
