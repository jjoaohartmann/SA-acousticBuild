// src/components/Logo.jsx
export default function Logo({ width = 220, light = false }) {
  const textColor = light ? '#ffffff' : '#1a73e8';
  const subtitleColor = light ? 'rgba(255,255,255,0.7)' : '#64748b';
  const waveColor = light ? '#ffffff' : '#1a73e8';

  return (
    <div style={{ width, textAlign: 'center' }}>
      {/* Onda acústica em SVG */}
      <svg
        viewBox="0 0 220 50"
        width={width}
        height={50}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Barras da onda sonora */}
        {[
          { x: 10,  h: 10 },
          { x: 22,  h: 20 },
          { x: 34,  h: 35 },
          { x: 46,  h: 45 },
          { x: 58,  h: 30 },
          { x: 70,  h: 48 },
          { x: 82,  h: 22 },
          { x: 94,  h: 40 },
          { x: 106, h: 48 },
          { x: 118, h: 28 },
          { x: 130, h: 44 },
          { x: 142, h: 18 },
          { x: 154, h: 36 },
          { x: 166, h: 25 },
          { x: 178, h: 14 },
          { x: 190, h: 8  },
          { x: 202, h: 5  },
        ].map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={(50 - bar.h) / 2}
            width={8}
            height={bar.h}
            rx={4}
            fill={waveColor}
            opacity={0.85}
          />
        ))}
      </svg>

      {/* Nome da empresa */}
      <div style={{
        fontSize: '1.6rem',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        color: textColor,
        marginTop: '8px',
        lineHeight: 1,
      }}>
        AcousticBuild
      </div>

      {/* Subtítulo */}
      <div style={{
        fontSize: '0.65rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: subtitleColor,
        marginTop: '6px',
      }}>
        Previsões Acústicas
      </div>
    </div>
  );
}