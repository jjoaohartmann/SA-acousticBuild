// "Como esse número foi parar aí": a leitura em três passos usada pela tela de
// resultados e pelo PDF. Fica num lugar só para as duas não contarem histórias
// diferentes — antes cada uma tinha a sua cópia, e as duas quebravam no piso.
//
// Regra que não pode quebrar: a conta escrita tem que fechar. Passo 1 com o
// ajuste do passo 2 dá exatamente o passo 3, com os números arredondados do
// jeito que aparecem na tela.

const arred = (valor, casas) => {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
};

export const fmtDb = (valor, casas = 1) =>
  Number.isFinite(valor) ? arred(valor, casas).toFixed(casas).replace('.', ',') : null;

// Parâmetros (área, volume, espessura, densidade...) com vírgula e sem zeros
// sobrando: "9,6 m²" e "1,25 cm", nunca "9.6" no meio de um texto em português.
const formatoNum = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, useGrouping: false });
export const fmtNum = (valor) => {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? formatoNum.format(n) : null;
};

// Perto do limite, uma casa decimal pode mentir: 55,39 vira "55" e a tela mostra
// "55 dB · critério ≤ 55 dB · NÃO ATENDE". Quando o arredondamento inverteria o
// veredito, usa duas casas.
export function casasCriterio(valor, limite, operador) {
  if (!Number.isFinite(valor) || !Number.isFinite(limite)) return 1;
  const atende = (v) => (operador === 'max' ? v <= limite : v >= limite);
  return atende(arred(valor, 1)) === atende(valor) ? 1 : 2;
}

export const fmtCriterio = (valor, limite, operador) =>
  fmtDb(valor, casasCriterio(valor, limite, operador));

export const NIVEL_NBR = {
  minimo: 'Nível mínimo (M)',
  intermediario: 'Nível intermediário (I)',
  superior: 'Nível superior (S)',
};

const incompleto = (tipo) => ({ tipo, completo: false, passos: [], nota: '', destaque: null });

function caminhoImpacto(resultado) {
  const d = resultado.detalhes || {};
  const principal = resultado.indicador_principal;
  const limite = resultado.criterios?.referencia;

  const final = Number.isFinite(principal?.valor) ? principal.valor : d.lnt;
  const medido = Number.isFinite(d.li);
  const base = medido ? d.li : d.ln_w;
  if (!Number.isFinite(final) || !Number.isFinite(base)) return incompleto('impacto');

  const casas = casasCriterio(final, limite, 'max');
  const baseR = arred(base, casas);
  const finalR = arred(final, casas);
  const ajuste = arred(finalR - baseR, casas);
  const nomePrincipal = principal?.nome || "L'nT";
  const limiteTexto = Number.isFinite(limite) ? ` (máximo: ${fmtDb(limite, 0)} dB)` : '';

  return {
    tipo: 'impacto',
    completo: true,
    destaque: fmtDb(final, casas),
    passos: [
      {
        texto: medido
          ? 'Nível medido embaixo com a máquina de impacto (Li)'
          : 'Impacto padrão medido em laboratório (Ln,w)',
        valor: fmtDb(baseR, casas),
        sinal: '',
      },
      {
        texto: medido
          ? 'Ajuste pelo eco do cômodo de baixo'
          : 'Ajuste para o tamanho e o acabamento do cômodo de baixo',
        valor: fmtDb(Math.abs(ajuste), casas),
        sinal: ajuste < 0 ? '−' : ajuste > 0 ? '+' : '',
      },
      { texto: 'Chega no vizinho de baixo', valor: fmtDb(finalR, casas), sinal: '', final: true },
    ],
    nota: medido
      ? `O ${nomePrincipal} de ${fmtDb(final, casas)} dB é o próprio passo 3, e é esse número que a NBR 15575 fiscaliza${limiteTexto}. Aqui a leitura é ao contrário da parede: quanto menor, melhor. O Li foi medido no local; o passo 2 só padroniza o valor pelo tempo de reverberação, para poder comparar com a norma.`
      : `O ${nomePrincipal} de ${fmtDb(final, casas)} dB é o próprio passo 3, e é esse número que a NBR 15575 fiscaliza${limiteTexto}. Aqui a leitura é ao contrário da parede: quanto menor, melhor. O Ln,w vem de uma máquina de impacto padronizada batendo na laje em laboratório; o passo 2 converte esse valor para o cômodo real.`,
  };
}

function caminhoAereo(resultado) {
  const d = resultado.detalhes || {};
  const principal = resultado.indicador_principal;
  const secundario = resultado.indicador_secundario;
  const limite = resultado.criterios?.referencia;

  const l1 = d.l1;
  const l2 = Number.isFinite(resultado.nivel_recebido) ? resultado.nivel_recebido : d.l2_previsto;
  if (!Number.isFinite(l1) || !Number.isFinite(l2)) return incompleto('aereo');

  const l1R = arred(l1, 1);
  const l2R = arred(l2, 1);
  const barra = arred(l1R - l2R, 1);
  const valorPrincipal = fmtCriterio(principal?.valor, limite, 'min');
  const limiteTexto = Number.isFinite(limite) ? ` (mínimo: ${fmtDb(limite, 0)} dB)` : '';
  const fecho = `Padronizado pelo tempo de reverberação, esse valor vira o ${principal?.nome || 'DnT'} de ${valorPrincipal} dB, e é ele que a NBR 15575 fiscaliza${limiteTexto}.`;

  let nota;
  if (resultado.confiabilidade === 'medicao_usuario') {
    nota = `Os dois níveis foram medidos no local: a parede barrou ${fmtDb(barra)} dB. ${fecho}`;
  } else {
    const refValor = Number.isFinite(secundario?.valor) ? secundario.valor
      : Number.isFinite(d.rw) ? d.rw : d.r;
    const refNome = (secundario?.nome || (Number.isFinite(d.rw) ? 'Rw' : 'R')).split(' ')[0];
    const abertura = !Number.isFinite(refValor) ? ''
      : resultado.confiabilidade === 'estimativa_teorica'
        ? `Pela lei da massa, a parede tem ${refNome} estimado de ${fmtDb(refValor)} dB (estimativa, não é ensaio). `
        : resultado.confiabilidade === 'informado_usuario'
          ? `O ${refNome} informado da parede é ${fmtDb(refValor)} dB. `
          : `Em laboratório, a parede tem ${refNome} de ${fmtDb(refValor)} dB. `;
    nota = `${abertura}No seu ambiente ela barra ${fmtDb(barra)} dB, porque o tamanho da parede e o acabamento do cômodo mudam o resultado. ${fecho}`;
  }
  if (d.l1_padrao) {
    nota += ` O barulho do vizinho não foi informado e foi considerado ${fmtDb(l1R, 0)} dB.`;
  }

  return {
    tipo: 'aereo',
    completo: true,
    destaque: fmtDb(l2, 1),
    passos: [
      { texto: 'Barulho no ambiente vizinho', valor: fmtDb(l1R), sinal: '' },
      { texto: 'A parede barra parte do som', valor: fmtDb(Math.abs(barra)), sinal: barra >= 0 ? '−' : '+' },
      { texto: 'Sobra no seu ambiente', valor: fmtDb(l2R), sinal: '', final: true },
    ],
    nota,
  };
}

export function montarCaminho(resultado) {
  const tipo = resultado?.tipo === 'impacto' || resultado?.tipo === 'lnt' ? 'impacto' : 'aereo';
  if (!resultado?.indicador_principal) return incompleto(tipo);
  return tipo === 'impacto' ? caminhoImpacto(resultado) : caminhoAereo(resultado);
}
