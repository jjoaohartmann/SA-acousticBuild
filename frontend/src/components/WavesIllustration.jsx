export default function WavesIllustration({ width = 400 }) {
  return (
    <svg
      viewBox="0 0 400 350"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* PRÉDIO - wireframe */}
      <g stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none">
        {/* Corpo principal */}
        <rect x="100" y="50" width="120" height="200" rx="2"/>
        {/* Linhas horizontais do prédio */}
        <line x1="100" y1="90" x2="220" y2="90"/>
        <line x1="100" y1="130" x2="220" y2="130"/>
        <line x1="100" y1="170" x2="220" y2="170"/>
        <line x1="100" y1="210" x2="220" y2="210"/>
        {/* Linhas verticais */}
        <line x1="140" y1="50" x2="140" y2="250"/>
        <line x1="180" y1="50" x2="180" y2="250"/>
        {/* Janelas */}
        <rect x="110" y="60" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="150" y="60" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="190" y="60" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="110" y="100" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="150" y="100" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="190" y="100" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="110" y="140" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="150" y="140" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="190" y="140" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="110" y="180" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="150" y="180" width="22" height="22" rx="1" opacity="0.5"/>
        <rect x="190" y="180" width="22" height="22" rx="1" opacity="0.5"/>
        {/* Porta */}
        <rect x="150" y="220" width="20" height="30" rx="1" opacity="0.6"/>
        {/* Topo do prédio */}
        <rect x="95" y="45" width="130" height="8" rx="2"/>
        {/* Antena */}
        <line x1="160" y1="45" x2="160" y2="20" opacity="0.4"/>
        <circle cx="160" cy="18" r="3" opacity="0.4"/>
        {/* Prédio menor ao lado */}
        <rect x="230" y="100" width="70" height="150" rx="2" opacity="0.6"/>
        <line x1="230" y1="130" x2="300" y2="130" opacity="0.6"/>
        <line x1="230" y1="160" x2="300" y2="160" opacity="0.6"/>
        <line x1="230" y1="190" x2="300" y2="190" opacity="0.6"/>
        <line x1="265" y1="100" x2="265" y2="250" opacity="0.6"/>
        <rect x="240" y="110" width="18" height="15" rx="1" opacity="0.3"/>
        <rect x="275" y="110" width="18" height="15" rx="1" opacity="0.3"/>
        <rect x="240" y="140" width="18" height="15" rx="1" opacity="0.3"/>
        <rect x="275" y="140" width="18" height="15" rx="1" opacity="0.3"/>
        <rect x="240" y="170" width="18" height="15" rx="1" opacity="0.3"/>
        <rect x="275" y="170" width="18" height="15" rx="1" opacity="0.3"/>
      </g>

      {/* ONDAS SONORAS (parte inferior) */}
      <g fill="none" strokeWidth="2">
        <path d="M50 280 Q80 260, 110 280 Q140 300, 170 280 Q200 260, 230 280 Q260 300, 290 280 Q320 260, 350 280" 
              stroke="rgba(30, 94, 255, 0.4)" strokeLinecap="round"/>
        <path d="M40 295 Q75 272, 110 295 Q145 318, 180 295 Q215 272, 250 295 Q285 318, 320 295 Q355 272, 370 295" 
              stroke="rgba(30, 94, 255, 0.3)" strokeLinecap="round"/>
        <path d="M30 310 Q70 285, 110 310 Q150 335, 190 310 Q230 285, 270 310 Q310 335, 350 310 Q370 295, 380 310" 
              stroke="rgba(30, 94, 255, 0.2)" strokeLinecap="round"/>
      </g>

      {/* Partículas decorativas */}
      <circle cx="330" cy="80" r="2" fill="rgba(255,255,255,0.15)"/>
      <circle cx="350" cy="120" r="1.5" fill="rgba(255,255,255,0.12)"/>
      <circle cx="310" cy="150" r="1.8" fill="rgba(255,255,255,0.1)"/>
      <circle cx="80" cy="70" r="2" fill="rgba(255,255,255,0.15)"/>
      <circle cx="60" cy="130" r="1.5" fill="rgba(255,255,255,0.12)"/>
      <circle cx="90" cy="200" r="1.8" fill="rgba(255,255,255,0.1)"/>
      <circle cx="340" cy="200" r="1.2" fill="rgba(255,255,255,0.08)"/>
      <circle cx="70" cy="30" r="1" fill="rgba(255,255,255,0.1)"/>
    </svg>
  );
}
