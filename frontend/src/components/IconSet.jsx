// Componentes de ícones SVG para todo o sistema

export function IconHamburger({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 18H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function IconBuilding({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="8" height="18" rx="1" stroke={color} strokeWidth="1.8"/>
      <rect x="12" y="4" width="8" height="24" rx="1" stroke={color} strokeWidth="1.8"/>
      <rect x="20" y="8" width="8" height="20" rx="1" stroke={color} strokeWidth="1.8"/>
      <rect x="6" y="20" width="4" height="4" rx="0.5" fill={color} opacity="0.3"/>
      <rect x="14" y="14" width="4" height="4" rx="0.5" fill={color} opacity="0.3"/>
      <rect x="22" y="18" width="4" height="4" rx="0.5" fill={color} opacity="0.3"/>
    </svg>
  );
}

export function IconChartUp({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="20" width="4" height="8" rx="0.5" fill={color} opacity="0.5"/>
      <rect x="11" y="14" width="4" height="14" rx="0.5" fill={color} opacity="0.7"/>
      <rect x="18" y="8" width="4" height="20" rx="0.5" fill={color} opacity="0.85"/>
      <rect x="25" y="4" width="4" height="24" rx="0.5" fill={color}/>
    </svg>
  );
}

export function IconShieldCheck({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L6 8V16C6 22.5 10.5 28 16 30C21.5 28 26 22.5 26 16V8L16 4Z" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M12 16L15 19L20 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconRecycle({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12L28 16L24 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12L4 16L8 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6L18 10H14L16 6Z" fill={color} opacity="0.5"/>
      <path d="M16 26L18 22H14L16 26Z" fill={color} opacity="0.5"/>
      <path d="M10 10L14 12V8L10 10Z" fill={color} opacity="0.5"/>
      <path d="M22 10L18 12V8L22 10Z" fill={color} opacity="0.5"/>
      <path d="M10 22L14 20V24L10 22Z" fill={color} opacity="0.5"/>
      <path d="M22 22L18 20V24L22 22Z" fill={color} opacity="0.5"/>
    </svg>
  );
}

export function IconCircleCheck({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M11 16L14.5 19.5L21 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconBulb({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C11 4 7 8 7 13C7 16.5 9 19.5 12 21V24H20V21C23 19.5 25 16.5 25 13C25 8 21 4 16 4Z" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="12" y1="26" x2="20" y2="26" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="13" y1="28" x2="19" y2="28" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconPersonCircle({ size = 32, color = '#1E5EFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.8" fill="none"/>
      <circle cx="16" cy="12" r="3" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M8 25C8 21 12 19 16 19C20 19 24 21 24 25" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconChartBars({ size = 32, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="18" width="4" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="12" y="12" width="4" height="16" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="19" y="8" width="4" height="20" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="26" y="14" width="4" height="14" rx="1" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

export function IconHome({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L12 3L21 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10V20H19V10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconZigzag({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="2,18 7,10 12,16 17,8 22,14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconDocument({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3H15L19 7V21H5V3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12H15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 16H13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWaveform({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="10" width="2" height="4" rx="1" fill={color} opacity="0.5"/>
      <rect x="7" y="6" width="2" height="12" rx="1" fill={color} opacity="0.7"/>
      <rect x="11" y="3" width="2" height="18" rx="1" fill={color}/>
      <rect x="15" y="6" width="2" height="12" rx="1" fill={color} opacity="0.7"/>
      <rect x="19" y="10" width="2" height="4" rx="1" fill={color} opacity="0.5"/>
    </svg>
  );
}

export function IconHelp({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M9 9C9 7.5 10.5 6 12 6C13.5 6 15 7.5 15 9C15 10.5 13.5 11 13.5 12.5V13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.8" fill={color}/>
    </svg>
  );
}

export function IconPerson({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8"/>
      <path d="M4 21C4 17 7.5 15 12 15C16.5 15 20 17 20 21" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconEnvelope({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8"/>
      <polyline points="2,7 12,14 22,7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconLock({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8"/>
      <path d="M8 11V7C8 4.5 9.5 3 12 3C14.5 3 16 4.5 16 7V11" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.2" fill={color}/>
    </svg>
  );
}

export function IconPencil({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="14" y1="6" x2="18" y2="10" stroke={color} strokeWidth="1.8"/>
    </svg>
  );
}

export function IconInfo({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="12" y1="11" x2="12" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="0.8" fill={color}/>
    </svg>
  );
}

export function IconLogout({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 21H5C4 21 3 20 3 19V5C3 4 4 3 5 3H10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <polyline points="15,17 20,12 15,7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="20" y1="12" x2="8" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconChevronDown({ size = 32, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="6,9 12,15 18,9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconChevronDownDark({ size = 32, color = '#64748b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="6,9 12,15 18,9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconSend({ size = 20, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconInstagram({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="17" cy="7" r="1" fill={color}/>
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

export function IconMail({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M7 10L12 14L17 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconGrid({ size = 24, color = '#001A41' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="1.8"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.8"/>
    </svg>
  );
}