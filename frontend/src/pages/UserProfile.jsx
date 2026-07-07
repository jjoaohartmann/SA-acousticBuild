import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconPerson, IconEnvelope, IconLock, IconPencil, IconInfo, IconLogout } from '../components/IconSet';
import styles from '../style/UserProfile.module.css';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('view'); // 'view' | 'edit'

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Tela de Visualização
  if (view === 'view') {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>← Home</Link>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <IconPerson size={48} color="#001A41" />
          </div>
          <h2 className={styles.userName}>{user?.name || 'Usuário'}</h2>
          <p className={styles.userEmail}>{user?.email || 'email@exemplo.com'}</p>

          <div className={styles.menuList}>
            <button className={styles.menuItem} onClick={() => setView('edit')}>
              <IconPencil size={22} color="#001A41" />
              <span>EDITAR INFORMAÇÕES</span>
            </button>
            <button className={styles.menuItem}>
              <IconInfo size={22} color="#001A41" />
              <span>SUPORTE</span>
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              <IconLogout size={22} color="#001A41" />
              <span>SAIR</span>
            </button>
          </div>
        </div>
        <p className={styles.copyright}>Copyright © 2025 AcousticBuild. Todos os direitos reservados.</p>
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

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <IconPerson size={20} color="#001A41" />
            </span>
            <input 
              type="text" 
              className={styles.input} 
              defaultValue={user?.name || ''} 
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
              defaultValue={user?.email || ''} 
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
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button className={styles.updateBtn}>ATUALIZAR</button>
      </div>
      <p className={styles.copyright}>Copyright © 2025 AcousticBuild. Todos os direitos reservados.</p>
    </div>
  );
}