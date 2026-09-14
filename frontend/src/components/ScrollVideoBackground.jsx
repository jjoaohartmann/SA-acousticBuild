import { useEffect, useRef, useState } from 'react';
import heroPoster from '../assets/hero-poster.jpg';
import styles from '../style/ScrollVideoBackground.module.css';

// O vídeo fica fixo cobrindo a tela inteira e é "rebobinado" pelo scroll:
// rolar para baixo avança os quadros, rolar para cima volta.
export default function ScrollVideoBackground({ src = '/hero-background.mp4', poster = heroPoster }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready || failed) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    let frame = 0;
    let current = video.currentTime;
    let snap = true; // primeiro quadro (e volta de aba oculta) vai direto, sem interpolar

    const alvo = () => {
      // O vídeo termina quando o rodapé começa a entrar na tela, e não no fim
      // absoluto da página: o rodapé é opaco e engoliria o final da animação.
      const rodape = document.querySelector('footer');
      const limite = rodape
        ? rodape.getBoundingClientRect().top + window.scrollY - window.innerHeight
        : document.body.scrollHeight - window.innerHeight;

      const scrollable = Math.max(limite, 1);
      const progress = Math.min(window.scrollY / scrollable, 1);
      return progress * (video.duration || 0);
    };

    const tick = () => {
      const target = alvo();

      if (snap) {
        current = target;
        snap = false;
      } else {
        // interpolação suave para o scrub não ficar travado
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.005) current = target;
      }

      if (Number.isFinite(current)) video.currentTime = current;
      frame = requestAnimationFrame(tick);
    };

    // com a aba oculta o navegador congela o rAF, então ao voltar o valor está velho
    const onVisibility = () => { if (!document.hidden) snap = true; };
    document.addEventListener('visibilitychange', onVisibility);

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ready, failed]);

  return (
    <div
      className={styles.backdrop}
      aria-hidden="true"
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      {!failed && (
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}
      <div className={styles.overlay} />
    </div>
  );
}
