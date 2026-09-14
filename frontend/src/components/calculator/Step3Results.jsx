import { useState } from 'react';
import PdfReportGenerator from './PdfReportGenerator';
import NoiseGauge from './NoiseGauge';
import InfoTip from './InfoTip';
import {
  IconWaveform, IconChartUp, IconCircleCheck,
  IconCircleX, IconInfo, IconBulb,
} from '../IconSet';
import calcStyles from '../../style/Calculator.module.css';
import styles from '../../style/Step3Results.module.css';

const fmt = (valor, casas = 1) =>
  typeof valor === 'number' ? valor.toFixed(casas).replace('.', ',') : '—';

export default function Step3Results({ resultado, user, salvarSimulacao, saved, form = {} }) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  if (!resultado) return null;

  const tipo = resultado.tipo || 'aereo';
  const isImpacto = tipo === 'impacto' || tipo === 'lnt';
  const principal = resultado.indicador_principal;
  const secundario = resultado.indicador_secundario;
  const criterios = resultado.criterios || {};
  const detalhes = resultado.detalhes || {};
  const fontes = resultado.fontes || [];
  const limitacoes = resultado.limitacoes || [];
  const composicao = resultado.composicao || [];
  const propriedades = resultado.propriedades_fisicas || {};
  const sugestoes = resultado.sugestoes || [];
  const reverb = resultado.reverberacao_avaliacao;
  const conforto = resultado.conforto;

  const atende = resultado.status_atendimento === 'ATENDE' || resultado.classificacao === 'atende';
  const semDado = resultado.confiabilidade === 'sem_dado' || !principal;

  // Card 1 — o motor de sistemas não devolve L2, então cai para a absorção equivalente
  const nivelBruto = isImpacto ? detalhes.li : detalhes.l2_previsto;
  const temNivel = typeof nivelBruto === 'number';
  const card1 = temNivel
    ? {
        label: isImpacto
          ? 'Nível de pressão sonora de impacto (Li)'
          : 'Nível de pressão sonora no ambiente receptor (L₂)',
        valor: `${fmt(nivelBruto)} dB`,
        hint: isImpacto
          ? 'Medido com máquina de percussão padronizada'
          : 'Previsto no ambiente receptor',
      }
    : {
        label: 'Absorção sonora equivalente (A)',
        valor: `${fmt(detalhes.absorcao_equivalente)} m²`,
        hint: 'Calculada pela fórmula de Sabine: A = 0,16 · V / T',
      };

  // Card 2 — indicador secundário; o motor de sistemas devolve o índice dentro de detalhes
  const rFallback = typeof detalhes.rw === 'number' ? detalhes.rw : detalhes.r;
  const card2 = typeof secundario?.valor === 'number'
    ? {
        nome: secundario.nome,
        valor: `${fmt(secundario.valor)} ${secundario.unidade}`,
        hint: secundario.descricao,
      }
    : {
        nome: typeof detalhes.rw === 'number' ? 'Rw' : 'R',
        valor: typeof rFallback === 'number' ? `${fmt(rFallback)} dB` : '—',
        hint: 'Índice de redução sonora do elemento construtivo',
      };

  const limiteTexto = criterios.referencia
    ? `Critério NBR 15575: ${isImpacto ? '≤' : '≥'} ${fmt(criterios.referencia, 0)} dB`
    : 'Critério sob consulta';

  return (
    <div className={styles.wrapper}>
      {/* ===== Resultados ===== */}
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h2 className={styles.panelTitle}>Resultados da previsão acústica</h2>
            <p className={styles.panelSub}>
              {criterios.cenario || (isImpacto ? 'Avaliação de ruído de impacto' : 'Avaliação de isolamento ao ruído aéreo')}
            </p>
          </div>
          <PdfReportGenerator resultado={resultado} form={form} user={user} />
        </div>

        {semDado ? (
          <div className={styles.semDado}>
            <h3>Não vamos inventar um número para essa combinação</h3>
            <p>
              Não existe ensaio de laboratório publicado para essa combinação exata de camadas.
              Conseguimos calcular a espessura e a massa dela, mas isolamento acústico
              <strong> não se deduz da massa</strong> quando há mais de uma camada: o resultado
              depende de como as camadas vibram juntas, e isso só o ensaio mede.
            </p>
            <p>
              Muita calculadora entrega um número mesmo assim. Preferimos dizer que não sabemos —
              um valor inventado aqui vira decisão errada na obra.
            </p>

            <div className={styles.saidas}>
              <strong className={styles.saidasTitulo}>Como seguir daqui:</strong>
              <ol className={styles.saidasLista}>
                <li>
                  <strong>Tem o catálogo do fabricante?</strong> Volte ao passo 2 e informe o
                  Rw do produto no campo de medição. O cálculo roda na hora.
                </li>
                <li>
                  <strong>Não tem o dado?</strong> Volte ao passo 1 e escolha
                  &ldquo;Opção Pronta&rdquo;: são 10 sistemas com ensaio documentado e fonte
                  rastreável.
                </li>
                <li>
                  <strong>Precisa exatamente dessa combinação?</strong> Só um ensaio in situ
                  (ISO 16283-1) resolve — e aí você informa o valor medido aqui.
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <>
          {/* ===== PROTAGONISTA: quanto de ruído chega (escala "menos é melhor") ===== */}
          {conforto ? (
            <div className={`${styles.hero} ${styles['hero_' + conforto.status]}`}>
              <div className={styles.heroTopo}>
                <div>
                  <span className={styles.heroLabel}>
                    Quanto de ruído chega {conforto.ambiente
                      ? `${conforto.artigo || 'no'} ${conforto.ambiente.toLowerCase()}`
                      : 'no ambiente'}
                    <InfoTip termo={isImpacto ? 'LnT' : 'L2'} />
                  </span>
                  <div className={styles.heroValorLinha}>
                    <span className={styles.heroValor}>{fmt(conforto.nivel_estimado, 0)}</span>
                    <span className={styles.heroUnidade}>dB</span>
                  </div>
                  <span className={styles.heroCotidiano}>≈ {conforto.comparacao_cotidiano}</span>
                </div>
                <span className={styles.heroBadge}>
                  {conforto.status === 'confortavel' ? 'CONFORTÁVEL'
                    : conforto.status === 'aceitavel' ? 'ACIMA DO IDEAL' : 'DESCONFORTÁVEL'}
                </span>
              </div>

              <NoiseGauge
                valor={conforto.nivel_estimado}
                recomendado={conforto.recomendado}
                min={conforto.escala?.min ?? 20}
                max={conforto.escala?.max ?? 70}
              />

              <p className={styles.heroResumo}>{conforto.resumo}</p>
              <p className={styles.heroNota}>{conforto.observacao}</p>
            </div>
          ) : (
            <div className={styles.hero}>
              <span className={styles.heroLabel}>{card1.label}</span>
              <div className={styles.heroValorLinha}>
                <span className={styles.heroValor}>{card1.valor}</span>
              </div>
              <span className={styles.heroCotidiano}>{card1.hint}</span>
            </div>
          )}

          {/* Caminho do som: mostra ONDE cada indicador entra na história */}
          <div className={styles.caminho}>
            <h3 className={styles.caminhoTitulo}>Como esse número foi parar aí</h3>
            <div className={styles.caminhoPassos}>
              <div className={styles.passo}>
                <span className={styles.passoOrdem}>1</span>
                <span className={styles.passoTexto}>
                  {isImpacto ? 'Alguém pisa forte no andar de cima' : 'Barulho no ambiente vizinho'}
                </span>
                <span className={styles.passoValor}>
                  {isImpacto ? `${fmt(detalhes.li, 0)} dB` : `${fmt(detalhes.l1 ?? 85, 0)} dB`}
                </span>
              </div>

              <span className={styles.passoSeta}>→</span>

              <div className={styles.passo}>
                <span className={styles.passoOrdem}>2</span>
                <span className={styles.passoTexto}>
                  {isImpacto ? 'A laje absorve parte do impacto' : 'A parede barra parte do som'}
                </span>
                <span className={styles.passoValor}>
                  &minus;{card2.valor}
                </span>
              </div>

              <span className={styles.passoSeta}>→</span>

              <div className={styles.passo}>
                <span className={styles.passoOrdem}>3</span>
                <span className={styles.passoTexto}>
                  {isImpacto ? 'Chega no vizinho de baixo' : 'Sobra no seu ambiente'}
                </span>
                <span className={`${styles.passoValor} ${styles.passoValorFinal}`}>
                  {conforto ? `${fmt(conforto.nivel_estimado, 0)} dB` : '—'}
                </span>
              </div>
            </div>

            <p className={styles.caminhoNota}>
              O <strong>{principal?.nome}</strong> ({fmt(principal?.valor)} dB) mede o passo 2 já
              considerando o tamanho e o acabamento do seu ambiente — por isso ele difere do valor
              de catálogo. É esse número que a NBR 15575 fiscaliza.
            </p>
          </div>

          <h3 className={styles.subTitulo}>Indicadores normativos (ABNT NBR 15575)</h3>

          <div className={styles.grid}>
            {/* Indicador secundário (R ou L'n) */}
            <div className={styles.resultCard}>
              <div className={styles.resultTop}>
                <span className={styles.resultIcon}><IconWaveform size={22} color="#2F6FFF" /></span>
                <span className={styles.resultLabel}>
                  {isImpacto ? 'Impacto que a laje deixa passar' : 'O quanto a parede bloqueia'} ({card2.nome})
                  <InfoTip termo={card2.nome === 'Rw' ? 'Rw' : 'R'} />
                </span>
              </div>
              <span className={styles.resultValue}>{card2.valor}</span>
              <span className={styles.resultHint}>{card2.hint}</span>
            </div>

            {/* 3 — Indicador principal (DnT ou L'nT) */}
            <div className={styles.resultCard}>
              <div className={styles.resultTop}>
                <span className={styles.resultIcon}><IconChartUp size={22} color="#2F6FFF" /></span>
                <span className={styles.resultLabel}>
                  {isImpacto ? 'Barulho de passos que chega embaixo' : 'Isolamento real na obra'} ({principal?.nome})
                  <InfoTip termo={isImpacto ? 'LnT' : (principal?.nome === 'DnT,w' ? 'DnT,w' : 'DnT')} />
                </span>
              </div>
              <span className={styles.resultValue}>{fmt(principal?.valor)} {principal?.unidade}</span>
              <span className={styles.resultHint}>{limiteTexto}</span>
            </div>

            {/* 4 — Classificação normativa */}
            <div className={`${styles.resultCard} ${styles.cardVeredito} ${atende ? styles.statusOk : styles.statusFail}`}>
              <div className={styles.resultTop}>
                <span className={styles.resultIcon}>
                  {atende
                    ? <IconCircleCheck size={22} color="#4ADE80" />
                    : <IconCircleX size={22} color="#F87171" />}
                </span>
                <span className={styles.resultLabel}>Classificação de desempenho (NBR 15575)</span>
              </div>
              <span className={styles.veredictoTexto}>
                <span className={styles.resultValue}>{atende ? 'ATENDE' : 'NÃO ATENDE'}</span>
                <span className={styles.resultHint}>
                  {resultado.nivel_normativo && resultado.nivel_normativo !== 'nao_atende'
                    ? `Nível ${resultado.nivel_normativo}`
                    : 'Abaixo do patamar mínimo exigido'}
                </span>
              </span>
            </div>
          </div>
          </>
        )}
      </div>

      {/* ===== Interpretação + Recomendações ===== */}
      {!semDado && (
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoHead}>
              <span className={styles.infoIcon}><IconInfo size={20} color="#2F6FFF" /></span>
              <h3 className={styles.infoTitle}>Interpretação dos resultados</h3>
            </div>
            {resultado.motivo && <p className={styles.infoText}>{resultado.motivo}</p>}
            <p className={styles.infoText}>
              <strong>Origem do valor:</strong> {resultado.origem || 'Cálculo analítico normativo'}
            </p>
            {reverb?.diagnostico && (
              <p className={styles.infoText}>
                <strong>Tempo de reverberação:</strong> {reverb.diagnostico}
              </p>
            )}
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoHead}>
              <span className={styles.infoIcon}><IconBulb size={20} color="#2F6FFF" /></span>
              <h3 className={styles.infoTitle}>Recomendações</h3>
            </div>
            {sugestoes.length > 0 ? (
              <ul className={styles.recList}>
                {sugestoes.map((s, i) => (
                  <li key={i}>
                    <span className={styles.recBullet}>•</span>
                    <span>
                      <span className={styles.recTitulo}>{s.recomendacao || s}</span>
                      {s.motivo && <span className={styles.recMotivo}>{s.motivo}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.infoText}>
                O sistema atende ao critério avaliado. Nenhuma intervenção corretiva é necessária
                para este cenário.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===== Aviso normativo ===== */}
      <div className={styles.disclaimer}>
        <IconInfo size={20} color="#7DA6FF" />
        <p className={styles.disclaimerText}>
          Os resultados são estimativas técnicas calculadas conforme as normas ISO 12354-1 e
          12354-2 e classificadas pela ABNT NBR 15575, a partir dos dados informados. Não
          substituem ensaio acústico in situ nem laudo emitido por profissional habilitado.
        </p>
      </div>

      {/* ===== Detalhamento técnico ===== */}
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.detailsToggle}
          onClick={() => setDetalhesAbertos(!detalhesAbertos)}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: detalhesAbertos ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {detalhesAbertos ? 'Ocultar memória de cálculo' : 'Ver memória de cálculo e fontes'}
        </button>

        {detalhesAbertos && (
          <div className={styles.detailsBox}>
            <div className={styles.detailsBlock}>
              <h4>Modelo e equação</h4>
              <div>{resultado.metodo?.nome || 'ISO 12354 / ISO 16283'}</div>
              {resultado.metodo?.equacao && (
                <div className={styles.formula}>{resultado.metodo.equacao}</div>
              )}
            </div>

            <div className={styles.detailsBlock}>
              <h4>Parâmetros geométricos e físicos</h4>
              <div className={styles.detailsGrid}>
                {!isImpacto && <div>Área separadora (S): <strong>{detalhes.s ?? form.area ?? '—'} m²</strong></div>}
                <div>Volume receptor (V): <strong>{detalhes.v ?? form.volume ?? '—'} m³</strong></div>
                <div>Tempo de reverberação (T): <strong>{detalhes.t ?? form.t ?? '—'} s</strong></div>
                <div>Absorção Sabine (A): <strong>{detalhes.absorcao_equivalente ?? '—'} m²</strong></div>
                {propriedades.espessura_total_cm && (
                  <div>Espessura total: <strong>{propriedades.espessura_total_cm} cm</strong></div>
                )}
                {propriedades.massa_superficial_kg_m2 && (
                  <div>Massa superficial (m&apos;): <strong>{propriedades.massa_superficial_kg_m2} kg/m²</strong></div>
                )}
              </div>
            </div>

            {composicao.length > 0 && (
              <div className={styles.detailsBlock}>
                <h4>Composição das camadas</h4>
                <ul className={styles.detailsList}>
                  {composicao.map((c, i) => (
                    <li key={i}>
                      Camada {c.ordem || i + 1}: {c.material_nome || c.material} — {c.espessura_cm} cm
                      {c.densidade ? ` (densidade: ${c.densidade} kg/m³)` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {fontes.length > 0 && (
              <div className={styles.detailsBlock}>
                <h4>Fontes dos dados acústicos</h4>
                <ul className={styles.detailsList}>
                  {fontes.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            <div className={styles.detailsBlock}>
              <h4>Limitações do método</h4>
              <ul className={styles.detailsList}>
                {limitacoes.map((lim, i) => <li key={i}>{lim}</li>)}
                <li>Estimativa técnica: não substitui ensaio acústico in situ com laudo pericial.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ===== Salvar ===== */}
      {salvarSimulacao && (
        <div className={styles.actions}>
          {user ? (
            <button
              type="button"
              className={calcStyles.secondaryBtn}
              onClick={salvarSimulacao}
              disabled={saved}
            >
              {saved ? 'Simulação salva no histórico' : 'Salvar no meu histórico'}
            </button>
          ) : (
            <span className={styles.hintLogin}>
              Faça login para salvar esta simulação no seu perfil.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
