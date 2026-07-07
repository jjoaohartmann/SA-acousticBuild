import { Link } from 'react-router-dom';
import { 
  IconWaveform, IconBuilding, IconPersonCircle, IconChartBars,
  IconHome, IconZigzag, IconDocument, IconHelp, IconShieldCheck,
  IconLogout
} from './IconSet';
import styles from '../style/Sidebar.module.css';

const navItems = [
  { section: 'Navegação', items: [
    { icon: IconBuilding, label: 'O que somos?', href: '#o-que-somos' },
    { icon: IconPersonCircle, label: 'Quem somos?', href: '#quem-somos' },
    { icon: IconChartBars, label: 'Produto', href: '#produto' },
  ]},
  { section: 'Ferramentas', items: [
    { icon: IconHome, label: 'Isolamento Acústico', href: '#' },
    { icon: IconZigzag, label: 'Absorção Sonora', href: '#' },
    { icon: IconDocument, label: 'Relatório no Planejamento', href: '#' },
    { icon: IconWaveform, label: 'Relatório e Laudos', href: '#' },
  ]},
  { section: 'Suporte', items: [
    { icon: IconHelp, label: 'Central de Ajuda', href: '#' },
    { icon: IconShieldCheck, label: 'Termos de Uso', href: '#' },
  ]},
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Topo - Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoRow}>
            <IconWaveform size={28} color="#FFFFFF" />
            <div>
              <h2 className={styles.logoName}>AcousticBuild</h2>
              <span className={styles.logoSub}>Previsão Acústica</span>
            </div>
          </div>
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
                      <a 
                        href={item.href} 
                        className={styles.navLink}
                        onClick={item.href.startsWith('#') ? onClose : undefined}
                      >
                        <span className={styles.navIcon}>
                          <Icon size={20} color="rgba(255,255,255,0.7)" />
                        </span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Login/Logout no final */}
        <div className={styles.sidebarFooter}>
          <Link to="/login" className={styles.sidebarLoginLink} onClick={onClose}>
            <span className={styles.navIcon}>
              <IconLogout size={20} color="rgba(255,255,255,0.7)" />
            </span>
            <span>Entrar</span>
          </Link>
          <p className={styles.copyright}>2026 AcousticBuild. Todos os direitos reservados. ©</p>
        </div>
      </aside>
    </>
  );
}
