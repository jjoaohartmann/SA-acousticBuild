import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// O React Router não rola até a âncora sozinho: um <Link to="/sobre#metodologia">
// troca a rota e para no topo. Este componente completa o trabalho — e, sem hash,
// devolve a página ao topo, porque manter a rolagem anterior ao trocar de página
// fazia o usuário cair no meio do conteúdo novo.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return undefined;
    }
    // A seção pode ainda não ter montado no primeiro paint.
    const id = decodeURIComponent(hash.slice(1));
    const tentar = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return Boolean(el);
    };
    if (tentar()) return undefined;
    const timer = setTimeout(tentar, 120);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
