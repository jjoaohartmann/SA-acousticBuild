import styles from '../../style/NoiseGauge.module.css';

// Régua de conforto: a pessoa lê a POSIÇÃO do marcador, não precisa saber
// se mais dB é melhor ou pior. Escala sempre "menos é melhor" (NBR 10152).
// `rotulo` é o mesmo texto do número em destaque, para o marcador não mostrar
// "55" enquanto o destaque logo acima mostra "55,4".
export default function NoiseGauge({ valor, recomendado, min = 20, max = 70, rotulo }) {
  const faixa = Math.max(max - min, 1);
  const pct = (v) => Math.min(Math.max(((v - min) / faixa) * 100, 0), 100);

  const posValor = pct(valor);
  const posRecomendado = pct(recomendado);
  const posAtencao = pct(recomendado + 5);

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <span className={styles.zonaBoa} style={{ width: `${posRecomendado}%` }} />
        <span
          className={styles.zonaAtencao}
          style={{ left: `${posRecomendado}%`, width: `${Math.max(posAtencao - posRecomendado, 0)}%` }}
        />
        <span
          className={styles.zonaRuim}
          style={{ left: `${posAtencao}%`, width: `${Math.max(100 - posAtencao, 0)}%` }}
        />

        {/* limite recomendado pela NBR 10152 */}
        <span className={styles.limite} style={{ left: `${posRecomendado}%` }} />

        {/* resultado calculado */}
        <span className={styles.marcador} style={{ left: `${posValor}%` }}>
          <span className={styles.marcadorValor}>{rotulo ?? Math.round(valor)} dB</span>
        </span>
      </div>

      <div className={styles.escala}>
        <span>{min} dB</span>
        <span className={styles.escalaLimite} style={{ left: `${posRecomendado}%` }}>
          recomendado: {Math.round(recomendado)} dB
        </span>
        <span>{Math.round(max)} dB</span>
      </div>
    </div>
  );
}
