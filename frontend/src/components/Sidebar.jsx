import { Link } from 'react-router-dom';
import { 
  IconWaveform, IconBuilding, IconPersonCircle, IconChartBars,
  IconHome, IconZigzag, IconDocument, IconHelp, IconShieldCheck,
  IconLogout
} from './IconSet';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import styles from '../style/Sidebar.module.css';

// As âncoras levam "/" na frente porque a sidebar também abre fora da Home.
// Cada item aponta para o que a plataforma realmente faz — nenhum rótulo
// promete uma ferramenta que não existe.
const navItems = [
  { section: 'Navegação', items: [
    { icon: IconBuilding, label: 'O que somos?', href: '/#o-que-somos' },
    { icon: IconPersonCircle, label: 'Quem somos?', href: '/#quem-somos' },
    { icon: IconPersonCircle, label: 'Sobre nós', to: '/sobre' },
    { icon: IconChartBars, label: 'Produto', href: '/#produto' },
  ]},
  { section: 'Ferramentas', items: [
    { icon: IconHome, label: 'Ruído aéreo (paredes)', to: '/calculadora?tipo=aereo' },
    { icon: IconZigzag, label: 'Ruído de impacto (pisos)', to: '/calculadora?tipo=impacto' },
    { icon: IconWaveform, label: 'Minhas simulações', to: '/minhas-simulacoes' },
    { icon: IconDocument, label: 'Metodologia e fontes', to: '/sobre#metodologia' },
  ]},
  { section: 'Suporte', items: [
    { icon: IconHelp, label: 'Central de Ajuda', to: '/suporte' },
    { icon: IconShieldCheck, label: 'Termos de Uso', to: '/termos' },
    { icon: IconShieldCheck, label: 'Privacidade', to: '/privacidade' },
  ]},
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Topo - Logo */}
        <div className={styles.logoArea}>
          <Logo width={190} onClick={onClose} />
        </div>

        {/* Navegação */}
        <nav className={styles.nav}>
          {navItems.map((group, gi) => (
            <div key={gi} className={styles.navGroup}>
              <span className={styles.navGroupLabel}>{group.section}</span>
              <ul className={styles.navList}>
                {group.items.map((item, ii) => {
                  const Icon = item.icon;
                  return (
                    <li key={ii}>
                      {item.to ? (
                        <Link
                          to={item.to}
                          className={styles.navLink}
                          onClick={onClose}
                        >
                          <span className={styles.navIcon}>
                            <Icon size={20} color="rgba(255,255,255,0.7)" />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className={styles.navLink}
                          onClick={onClose}
                        >
                          <span className={styles.navIcon}>
                            <Icon size={20} color="rgba(255,255,255,0.7)" />
                          </span>
                          <span>{item.label}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Quem já entrou não precisa ver "Entrar" — vê a própria conta */}
        <div className={styles.sidebarFooter}>
          <Link
            to={user ? '/profile' : '/login'}
            className={styles.sidebarLoginLink}
            onClick={onClose}
          >
            <span className={styles.navIcon}>
              {user
                ? <IconPersonCircle size={20} color="rgba(255,255,255,0.7)" />
                : <IconLogout size={20} color="rgba(255,255,255,0.7)" />}
            </span>
            <span>{user ? `Minha conta — ${user.name?.split(' ')[0] || ''}` : 'Entrar'}</span>
          </Link>
          <p className={styles.copyright}>2026 AcousticBuild. Todos os direitos reservados. ©</p>
        </div>
      </aside>
    </>
  );
}
