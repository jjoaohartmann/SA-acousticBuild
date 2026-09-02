import { Link } from 'react-router-dom';
import {
  IconDownload, IconChartBars, IconWaveform, IconShieldCheck,
  IconStar, IconInfo, IconBulb, IconCircleCheck, IconCircleX,
} from '../IconSet';
import styles from '../../style/Calculator.module.css';

export default function Step3Results({ resultado, user, salvarSimulacao, saved }) {
  if (!resultado) return null;

  const principal = resultado.indicador_principal;          // L2
  const secundario = resultado.indicador_secundario;        // R'
  const criterios = resultado.criterios || {};
  const atende = resultado.classificacao === 'atende';

  const l2 = principal?.valor;
  const r = secundario?.valor;
  const limite = criterios.referencia;
  const abaixoDe = l2 != null ? Math.abs(l2) : null;

  const interpretacao = (
    <>
      O nível de pressão sonora previsto no ambiente receptor é de{' '}
      <strong className={styles.varBlue}>{l2 != null ? l2.toFixed(2) : '—'}dB</strong>. De acordo com a NBR 15575,
      para este tipo de ambiente <em className={styles.varBlue}>{resultado.tipo || 'aéreo'}</em>,
      o valor máximo permitido é de{' '}
      <strong className={styles.varBlue}>{limite != null ? limite : '—'} dB</strong>.
    </>
  );

  return (
    <div className={styles.card}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.cardTitle}>Resultados da previsão acústica</h2>
        <button type="button" className={styles.downloadBtn}>
          <IconDownload size={18} color="#FFFFFF" /> Baixar Relatório
        </button>
      </div>

      <div className={styles.resultsGrid}>
        <div className={styles.resultTile}>
          <div className={styles.tileIcon}><IconWaveform size={26} color="#FFFFFF" /></div>
          <span className={styles.tileValue}>{l2 != null ? l2.toFixed(2) : '—'} dB</span>
          <span className={styles.tileLabel}>Nível de pressão sonora no ambiente receptor (L₂)</span>
          <span className={styles.tileCaption}>Previsto</span>
        </div>

        <div className={styles.resultTile}>
          <div className={styles.tileIcon}><IconChartBars size={26} color="#FFFFFF" /></div>
          <span className={styles.tileValue}>{r != null ? r.toFixed(2) : '—'} dB</span>
          <span className={styles.tileLabel}>Isolamento da partição (R)</span>
          <span className={styles.tileCaption}>Índice de redução sonora</span>
        </div>

        <div className={styles.resultTile}>
          <div className={styles.tileIcon}><IconShieldCheck size={26} color="#FFFFFF" /></div>
          <span className={`${styles.tileValue} ${styles.tileGreen}`}>
            {limite != null ? `${limite.toFixed(0)} dB` : '—'}
          </span>
          <span className={styles.tileLabel}>Diferença para o critério (NBR 15575)</span>
          <span className={styles.tileCaption}>(Acima ou não do mínimo exigido)</span>
        </div>

        <div className={styles.resultTile}>
          <div className={styles.tileIcon}><IconStar size={26} color="#FFFFFF" /></div>
          <span className={`${styles.tileValue} ${styles.tileGreen}`}>{atende ? 'passou' : 'min'}</span>
          <span className={styles.tileLabel}>Classificação de desempenho (NBR 15575)</span>
          <span className={styles.tileCaption}>(Atende ou não ao desempenho mín[imo])</span>
        </div>
      </div>

      <div className={styles.resultsLower}>
        <div className={styles.interpretBlock}>
          <div className={styles.blockHead}><IconInfo size={18} color="#FFFFFF" /> <h3>Interpretação dos Resultados</h3></div>
          <p className={styles.interpretText}>{interpretacao}</p>
          <p className={styles.veredict}>
            {atende ? (
              <><IconCircleCheck size={18} color="#22C55E" /> O resultado está <strong>{abaixoDe != null ? abaixoDe.toFixed(2) : '—'}</strong> dB abaixo do limite permitido, atendendo ao desempenho mínimo exigido pela norma.</>
            ) : (
              <><IconCircleX size={18} color="#F43F5E" /> O resultado está <strong>{abaixoDe != null ? abaixoDe.toFixed(2) : '—'}</strong> dB acima do limite permitido, não atendendo ao desempenho mínimo exigido pela norma.</>
            )}
          </p>
        </div>

        <div className={styles.recoBlock}>
          <div className={styles.blockHead}><IconBulb size={18} color="#FFFFFF" /> <h3>Recomendações</h3></div>
          <p className={styles.recoText}>
            Para melhorar ainda mais o desempenho acústico da edificação, considere as seguintes ações:
          </p>
          <ul className={styles.recoList}>
            <li>Utilize materiais com maior índice de redução sonora (R).</li>
            <li>Aumente o tempo de reverberação com elementos absorventes.</li>
            <li>Verifique possíveis frestas acústicas na ligação entre ambientes.</li>
            <li>Considere soluções de isolamento adicionais, se necessário.</li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBand}>
        <IconInfo size={16} color="#8aa2d0" />
        <span>
          Os resultados apresentados são baseados nas informações fornecidas e nas fórmulas da norma EN 12354.
          Para maior precisão, recomenda-se a validação com medições em campo.
        </span>
      </div>

      <div className={styles.resultsActions}>
        {user ? (
          <button type="button" className={styles.saveBtn} onClick={salvarSimulacao} disabled={saved}>
            {saved ? 'Simulação salva!' : 'Salvar esta simulação'}
          </button>
        ) : (
          <p className={styles.saveHint}>
            <Link to="/login">Faça login</Link> para salvar o histórico das suas simulações.
          </p>
        )}
      </div>
    </div>
  );
}