import { Fragment, useState } from 'react';
import PdfReportGenerator from './PdfReportGenerator';
import NoiseGauge from './NoiseGauge';
import InfoTip from './InfoTip';
import { NIVEL_NBR, fmtCriterio, fmtDb, fmtNum, montarCaminho } from './caminhoDoSom';
import {
  IconWaveform, IconChartUp, IconCircleCheck,
  IconCircleX, IconInfo, IconBulb,
} from '../IconSet';
import calcStyles from '../../style/Calculator.module.css';
import styles from '../../style/Step3Results.module.css';

const fmt = (valor, casas = 1) => fmtDb(valor, casas) ?? '—';
const n = (valor) => fmtNum(valor) ?? '—';

// O "valor de catálogo" do elemento. Parede e laje não usam a mesma grandeza:
// a parede bloqueia (R, Rw — maior é melhor); a laje deixa passar impacto
// (Ln,w, L'n — menor é melhor). Usar R para laje deixava o cartão vazio.
function indicadorDeReferencia(resultado, isImpacto) {
  const d = resultado.detalhes || {};
  const sec = resultado.indicador_secundario;
  const confiab = resultado.confiabilidade;

  if (isImpacto) {
    if (Number.isFinite(d.li)) {
      return {
        label: 'Impacto medido no local, normalizado',
        nome: sec?.nome || "L'n",
        valor: sec?.valor,
        hint: sec?.descricao || 'Medição com máquina de impacto, normalizada para 10 m² de absorção',
        termo: 'Ln',
      };
    }
    return {
      label: 'Impacto que a laje deixa passar, em laboratório',
      nome: 'Ln,w',
      valor: d.ln_w,
      hint: confiab === 'documentado'
        ? 'Valor tabelado da NBR 15575-3, Anexo A'
        : 'Ensaio com máquina de impacto padronizada (ISO 10140-3 / ISO 717-2)',
      termo: 'Lnw',
    };
  }

  const valor = Number.isFinite(sec?.valor) ? sec.valor : Number.isFinite(d.rw) ? d.rw : d.r;
  const nome = (sec?.nome || (Number.isFinite(d.rw) ? 'Rw' : 'R')).split(' ')[0];
  const hint = {
    estimativa_teorica: 'Estimado pela lei da massa — não é ensaio',
    informado_usuario: 'Valor informado para o elemento',
    medicao_usuario: sec?.descricao || 'Calculado a partir da medição no local',
    documentado: 'Valor documentado do elemento',
  }[confiab] || 'Valor de laboratório do elemento (catálogo)';

  return {
    label: 'O quanto a parede bloqueia',
    nome,
    valor,
    hint,
    termo: nome.startsWith('Rw') ? 'Rw' : 'R',
  };
}

export default function Step3Results({ resultado, user, salvarSimulacao, saved, form = {} }) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  if (!resultado) return null;

  const tipo = resultado.tipo || 'aereo';
  const isImpacto = tipo === 'impacto' || tipo === 'lnt';
  const operador = isImpacto ? 'max' : 'min';
  const principal = resultado.indicador_principal;
  const criterios = resultado.criterios || {};
  const limite = criterios.referencia;
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

  const caminho = montarCaminho(resultado);
  const referencia = indicadorDeReferencia(resultado, isImpacto);
  const nivelNumero = Number.isFinite(resultado.nivel_recebido)
    ? resultado.nivel_recebido
    : conforto?.nivel_estimado;
  // No piso, o número do destaque É o indicador da norma: ele não pode aparecer
  // arredondado para o lado do veredito oposto.
  const valorDestaque = caminho.destaque
    ?? (isImpacto ? fmtCriterio(nivelNumero, limite, 'max') : fmtDb(nivelNumero, 1))
    ?? '—';

  const limiteTexto = Number.isFinite(limite)
    ? `Critério NBR 15575: ${isImpacto ? '≤' : '≥'} ${fmt(limite, 0)} dB`
    : 'Critério sob consulta';

  const hintVeredito = NIVEL_NBR[resultado.nivel_normativo]
    || (atende ? 'Atende ao critério' : isImpacto ? 'Acima do máximo permitido' : 'Abaixo do mínimo exigido');

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
            {isImpacto ? (
              <p>
                Não existe ensaio publicado para essa laje com esse acabamento. E ruído de impacto
                <strong> não se calcula pela massa</strong>: ele depende de como a laje e o piso
                respondem ao golpe, e isso só a medição mostra.
              </p>
            ) : (
              <p>
                Não existe ensaio publicado para essa combinação exata de camadas. Conseguimos
                calcular a espessura e a massa dela, mas quando há <strong>camada resiliente</strong>
                {' '}(lã, manta) ou material sem densidade conhecida, o isolamento
                <strong> não se deduz da massa</strong>: as camadas vibram de um jeito que só o
                ensaio mede.
              </p>
            )}
            <p>
              Muita calculadora entrega um número mesmo assim. Preferimos dizer que não sabemos —
              um valor inventado aqui vira decisão errada na obra.
            </p>

            <div className={styles.saidas}>
              <strong className={styles.saidasTitulo}>Como seguir daqui:</strong>
              <ol className={styles.saidasLista}>
                <li>
                  <strong>Já mediu no local?</strong> Volte ao passo 2, marque a medição in situ e
                  informe {isImpacto ? 'o Li medido com a máquina de impacto' : 'os níveis L₁ e L₂ medidos'}.
                  O cálculo roda na hora.
                </li>
                <li>
                  <strong>Ainda é projeto?</strong> Volte ao passo 1 e escolha
                  &ldquo;Opção Pronta&rdquo;: {isImpacto ? 'as lajes' : 'as paredes'} do catálogo têm
                  dado documentado e fonte rastreável.
                </li>
                <li>
                  <strong>Precisa exatamente dessa combinação?</strong> Só um ensaio in situ
                  ({isImpacto ? 'ISO 16283-2' : 'ISO 16283-1'}) resolve — e aí você informa o valor
                  medido aqui.
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
                    <span className={styles.heroValor}>{valorDestaque}</span>
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
                valor={nivelNumero}
                rotulo={valorDestaque}
                recomendado={conforto.recomendado}
                min={conforto.escala?.min ?? 20}
                max={conforto.escala?.max ?? 70}
              />

              <p className={styles.heroResumo}>{conforto.resumo}</p>
              <p className={styles.heroNota}>{conforto.observacao}</p>
            </div>
          ) : (
            <div className={styles.hero}>
              <span className={styles.heroLabel}>
                {isImpacto ? 'Barulho de passos que chega embaixo' : 'Ruído que chega no ambiente'}
              </span>
              <div className={styles.heroValorLinha}>
                <span className={styles.heroValor}>{valorDestaque}</span>
                <span className={styles.heroUnidade}>dB</span>
              </div>
            </div>
          )}

          {/* Caminho do som: mostra ONDE cada indicador entra na história */}
          {caminho.completo && (
            <div className={styles.caminho}>
              <h3 className={styles.caminhoTitulo}>Como esse número foi parar aí</h3>
              <div className={styles.caminhoPassos}>
                {caminho.passos.map((passo, i) => (
                  <Fragment key={passo.texto}>
                    {i > 0 && <span className={styles.passoSeta}>→</span>}
                    <div className={styles.passo}>
                      <span className={styles.passoOrdem}>{i + 1}</span>
                      <span className={styles.passoTexto}>{passo.texto}</span>
                      <span className={`${styles.passoValor} ${passo.final ? styles.passoValorFinal : ''}`}>
                        {passo.sinal}{passo.valor} dB
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <p className={styles.caminhoNota}>{caminho.nota}</p>
            </div>
          )}

          <h3 className={styles.subTitulo}>Indicadores normativos (ABNT NBR 15575)</h3>

          <div className={styles.grid}>
            {/* Valor de referência do elemento (R/Rw na parede, Ln,w/L'n na laje) */}
            <div className={styles.resultCard}>
              <div className={styles.resultTop}>
                <span className={styles.resultIcon}><IconWaveform size={22} color="#2F6FFF" /></span>
                <span className={styles.resultLabel}>
                  {referencia.label} ({referencia.nome})
                  <InfoTip termo={referencia.termo} />
                </span>
              </div>
              <span className={styles.resultValue}>
                {Number.isFinite(referencia.valor) ? `${fmt(referencia.valor)} dB` : '—'}
              </span>
              <span className={styles.resultHint}>{referencia.hint}</span>
            </div>

            {/* Indicador que a norma fiscaliza (DnT ou L'nT) */}
            <div className={styles.resultCard}>
              <div className={styles.resultTop}>
                <span className={styles.resultIcon}><IconChartUp size={22} color="#2F6FFF" /></span>
                <span className={styles.resultLabel}>
                  {isImpacto ? 'Barulho de passos que chega embaixo' : 'Isolamento real na obra'} ({principal?.nome})
                  <InfoTip termo={isImpacto ? 'LnT' : (principal?.nome?.startsWith('DnT,w') ? 'DnT,w' : 'DnT')} />
                </span>
              </div>
              <span className={styles.resultValue}>
                {fmtCriterio(principal?.valor, limite, operador) ?? '—'} {principal?.unidade}
              </span>
              <span className={styles.resultHint}>{limiteTexto}</span>
            </div>

            {/* Classificação normativa */}
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
                <span className={styles.resultHint}>{hintVeredito}</span>
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
                {!isImpacto && Number.isFinite(detalhes.l1) && (
                  <div>Barulho no ambiente vizinho (L₁): <strong>{fmt(detalhes.l1, 0)} dB</strong></div>
                )}
                {!isImpacto && <div>Área separadora (S): <strong>{n(detalhes.s ?? form.area)} m²</strong></div>}
                <div>Volume receptor (V): <strong>{n(detalhes.v ?? form.volume)} m³</strong></div>
                <div>Tempo de reverberação (T): <strong>{n(detalhes.t ?? form.t)} s</strong></div>
                <div>Absorção Sabine (A): <strong>{n(detalhes.absorcao_equivalente)} m²</strong></div>
                {propriedades.espessura_total_cm && (
                  <div>Espessura total: <strong>{n(propriedades.espessura_total_cm)} cm</strong></div>
                )}
                {propriedades.massa_superficial_kg_m2 && (
                  <div>Massa superficial (m&apos;): <strong>{n(propriedades.massa_superficial_kg_m2)} kg/m²</strong></div>
                )}
              </div>
            </div>

            {composicao.length > 0 && (
              <div className={styles.detailsBlock}>
                <h4>Composição das camadas</h4>
                <ul className={styles.detailsList}>
                  {composicao.map((c, i) => (
                    <li key={i}>
                      Camada {c.ordem || i + 1}: {c.material_nome || c.material} — {n(c.espessura_cm)} cm
                      {c.densidade ? ` (densidade: ${n(c.densidade)} kg/m³)` : ''}
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
