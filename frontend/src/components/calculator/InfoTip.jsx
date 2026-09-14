import { useState, useRef, useEffect } from 'react';
import { GLOSSARIO } from './glossario';
import styles from '../../style/InfoTip.module.css';

// Glossário sem jargão: cada termo tem uma frase direta + uma referência concreta.
export default function InfoTip({ termo, children }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  const item = GLOSSARIO[termo];

  useEffect(() => {
    if (!aberto) return undefined;
    const fechar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false); };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [aberto]);

  if (!item && !children) return null;

  return (
    <span className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.botao}
        onClick={() => setAberto(!aberto)}
        aria-label={`O que significa ${item?.titulo || termo}`}
        aria-expanded={aberto}
      >
        i
      </button>

      {aberto && (
        <span className={styles.balao} role="tooltip">
          {item && <strong className={styles.balaoTitulo}>{item.titulo}</strong>}
          {item && <span className={styles.balaoTexto}>{item.texto}</span>}
          {item?.ancora && <span className={styles.balaoAncora}>{item.ancora}</span>}
          {children}
        </span>
      )}
    </span>
  );
}
