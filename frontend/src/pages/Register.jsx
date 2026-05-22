import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';
import '../style/Register.modules.css';

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
    <div style={styles.container}>

      <div style={styles.panel}>
        <div style={styles.panelContent}>
                  <Logo width={320} light={true} />
        
                  <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '40px', fontSize: '1rem', lineHeight: '1.6' }}>
      Cadastre-se para acessar nossos serviços e ficar por dentro das novidades                </p>
                </div>
      </div>

      <div style={styles.formSide}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Criar conta</h2>
          <p style={styles.formSubtitle}>Preencha os dados para começar</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome completo</label>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <p style={styles.switchText}>
            Já tem uma conta?{' '}
            <Link to="/login" style={styles.link}>Entrar</Link>
          </p>
        </div>
      </div>

    </div>
  );
}