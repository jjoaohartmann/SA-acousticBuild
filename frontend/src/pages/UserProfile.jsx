import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { IconPerson, IconEnvelope, IconLock, IconPencil, IconInfo, IconLogout, IconWaveform } from '../components/IconSet';
import styles from '../style/UserProfile.module.css';

export default function UserProfile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('view'); // 'view' | 'edit'

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { tipo: 'ok' | 'erro', texto }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {};
    if (form.name.trim() && form.name.trim() !== user?.name) payload.name = form.name.trim();
    if (form.email.trim() && form.email.trim() !== user?.email) payload.email = form.email.trim();
    if (form.password) payload.password = form.password;

    if (Object.keys(payload).length === 0) {
      setSaving(false);
      setFeedback({ tipo: 'erro', texto: 'Nenhuma alteração para salvar.' });
      return;
    }

    try {
      const { data } = await api.put('/auth/me', payload);
      login(data.user, data.access_token);
      setForm((atual) => ({ ...atual, password: '' }));
      setFeedback({ tipo: 'ok', texto: 'Informações atualizadas com sucesso.' });
    } catch (err) {
      const detalhe = err.response?.data?.detail;
      setFeedback({
        tipo: 'erro',
        texto: typeof detalhe === 'string' ? detalhe : 'Não foi possível atualizar suas informações.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Tela de Visualização
  if (view === 'view') {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>Início</Link>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <IconPerson size={48} color="#001A41" />
          </div>
          <h2 className={styles.userName}>{user?.name || 'Usuário'}</h2>
          <p className={styles.userEmail}>{user?.email || 'email@exemplo.com'}</p>

          <div className={styles.menuList}>
            <button className={styles.menuItem} onClick={() => navigate('/minhas-simulacoes')}>
              <IconWaveform size={22} color="#001A41" />
              <span>MINHAS SIMULAÇÕES</span>
            </button>
            <button className={styles.menuItem} onClick={() => setView('edit')}>
              <IconPencil size={22} color="#001A41" />
              <span>EDITAR INFORMAÇÕES</span>
            </button>
            <button className={styles.menuItem} onClick={() => navigate('/suporte')}>
              <IconInfo size={22} color="#001A41" />
              <span>SUPORTE</span>
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              <IconLogout size={22} color="#001A41" />
              <span>SAIR</span>
            </button>
          </div>
        </div>
        <p className={styles.copyright}>Copyright © 2026 AcousticBuild. Todos os direitos reservados.</p>
      </div>
    );
  }

  // Tela de Edição
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Home</Link>
      <div className={styles.profileCard}>
        <h1 className={styles.editTitle}>EDITAR PERFIL</h1>

        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <IconPerson size={48} color="#001A41" />
          </div>
          <div className={styles.editBadge}>
            <IconPencil size={16} color="#FFFFFF" />
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <IconPerson size={20} color="#001A41" />
            </span>
            <input
              type="text"
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <IconEnvelope size={20} color="#001A41" />
            </span>
            <input
              type="email"
              className={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="E-mail"
            />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <IconLock size={20} color="#001A41" />
            </span>
            <input
              type="password"
              className={styles.input}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Nova senha (deixe em branco para manter)"
              minLength={6}
            />
          </div>

          {feedback && (
            <p className={feedback.tipo === 'ok' ? styles.feedbackOk : styles.feedbackErro}>
              {feedback.texto}
            </p>
          )}

          <button type="submit" className={styles.updateBtn} disabled={saving}>
            {saving ? 'SALVANDO...' : 'ATUALIZAR'}
          </button>
        </form>
      </div>
      <p className={styles.copyright}>Copyright © 2026 AcousticBuild. Todos os direitos reservados.</p>
    </div>
  );
}