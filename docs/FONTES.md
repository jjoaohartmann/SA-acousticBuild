# 📚 Fontes e Referências

Toda grandeza acústica exibida pela plataforma vem de uma destas fontes. Nenhuma foi
estimada sem rótulo, e nenhuma foi herdada de "sistema parecido".

Este documento existe para responder a uma pergunta de avaliador: **"de onde veio esse
número?"** — para qualquer número da tela.

---

## 1. Como ler esta lista

As fontes cumprem três papéis diferentes, e confundi-los é o erro mais comum:

| Papel | O que a fonte define | Exemplo |
|---|---|---|
| **Critério** | O que é aprovado ou reprovado | ABNT NBR 15575 — o veredito ATENDE / NÃO ATENDE |
| **Método** | Como o número é calculado ou medido | ISO 12354, ISO 16283, ISO 717 |
| **Dado** | O valor de entrada de um material ou sistema | Relatório de ensaio do IPT, catálogo ProAcústica |

A plataforma julga pela **norma brasileira**. As normas ISO e EN entram como método de
cálculo, de medição e de ponderação — não como critério de conformidade.

---

## 2. Critério normativo (o que aprova ou reprova)

### ABNT NBR 15575 — Edificações habitacionais: desempenho

A referência legal do veredito. Duas partes são usadas:

| Parte | Assunto | Indicador | Sentido |
|---|---|---|---|
| **15575-4** | Sistemas de vedação vertical interna e externa | $D_{nT,w}$ | **mínimo** — maior é melhor |
| **15575-3** | Sistemas de piso | $L'_{nT,w}$ | **máximo** — menor é melhor |

Cada parte define três patamares: **mínimo (M)**, **intermediário (I)** e **superior (S)**.
Os valores estão parametrizados por cenário em [`backend/criteria.py`](../backend/criteria.py):

| Cenário | Tipo | Mínimo | Intermediário | Superior |
|---|---|---|---|---|
| Parede entre unidades autônomas | aéreo | 45 dB | 50 dB | 55 dB |
| Parede entre dormitório e área comum de trânsito | aéreo | 40 dB | 45 dB | 50 dB |
| Salas de aula / ambientes de ensino | aéreo | 45 dB | 50 dB | 55 dB |
| Laje/piso entre unidades autônomas | impacto | 55 dB | 50 dB | 45 dB |
| Laje entre área de uso coletivo e dormitório | impacto | 50 dB | 45 dB | 40 dB |
| Piso entre salas de aula | impacto | 55 dB | 50 dB | 45 dB |

> Repare que nos cenários de impacto os limites **decrescem** do mínimo para o superior.
> Não é erro de digitação: é a consequência de $L'_{nT,w}$ ser um nível de ruído, e não
> uma atenuação.

O Anexo A da **ABNT NBR 15575-3:2013** (Tabelas A.1 e A.2) também é usado como fonte de
dado, para as lajes maciças do catálogo.

### ABNT NBR 10152:2017 (versão corrigida 2020) — Níveis de pressão sonora em ambientes internos

Usada como **referência de conforto**, num eixo separado e explicitamente declarado como
orientativo. Implementada em [`backend/conforto.py`](../backend/conforto.py):

| Ambiente | Recomendado |
|---|---|
| Dormitório | até 35 dB |
| Enfermaria / quarto hospitalar | até 35 dB |
| Biblioteca (área de leitura) | até 35 dB |
| Sala de estar | até 40 dB |
| Sala de aula | até 40 dB |
| Escritório individual | até 40 dB |

**Por que "orientativa":** a NBR 10152 trata do nível de ruído de fundo ($L_{Aeq}$) do
ambiente como um todo. A plataforma calcula o ruído que atravessa **um** elemento
construtivo. Comparar os dois ajuda o leigo a entender a ordem de grandeza, mas não
constitui verificação formal da NBR 10152 — e a interface diz isso, na tela, junto do
resultado.

### ANSI/ASA S12.60-2010/Part 1 — Acoustical Performance Criteria for Schools

Fonte do teto de **0,60 s** de tempo de reverberação, válido para salas de aula com até
283 m³.

**Escopo respeitado:** a norma só é citada quando o ambiente receptor selecionado é uma
sala de aula. Para dormitórios e demais ambientes, a mesma faixa de 0,40–0,60 s é
apresentada como referência de conforto para a fala, com a ressalva de que a NBR 15575
não fixa limite de reverberação para eles. Antes desta revisão, a norma era invocada para
qualquer ambiente — uma aplicação fora do escopo dela.

### WHO — Environmental Noise Guidelines for the European Region (2018)

Organização Mundial da Saúde, Escritório Regional para a Europa, Copenhague.
Embasa o enquadramento do ruído como questão de saúde — sono, cognição, incômodo — e
sustenta a premissa de que a escala de conforto corre sempre no sentido "menos decibéis é
melhor". Não é usada como critério numérico de conformidade.

---

## 3. Método (como o número é obtido)

### ISO 12354-1:2017 e ISO 12354-2:2017 (EN 12354)
*Building acoustics — Estimation of acoustic performance of buildings from the performance
of elements.* Partes 1 (ruído aéreo) e 2 (ruído de impacto).

Modelo de previsão de desempenho em campo a partir do desempenho dos elementos. É o que
permite sair do $R_w$ de laboratório e chegar ao $D_{nT,w}$ do ambiente real.

**Limitação assumida:** a plataforma implementa apenas a **transmissão direta**. A
transmissão por flancos (marginal) não é modelada, e o resultado declara isso entre as
limitações técnicas. Em obra real, os flancos podem reduzir o desempenho efetivo.

A ISO 12354-1 também fornece a faixa de validade usada na validação de entrada: área do
elemento até 500 m².

### ISO 16283-1 e ISO 16283-2:2020
*Acoustics — Field measurement of sound insulation in buildings and of building elements.*

Procedimento de medição em campo. Define as grandezas padronizadas $D_{nT}$ e $L'_{nT}$ e
o tempo de reverberação de referência $T_0 = 0{,}5$ s. É o caminho usado quando o usuário
informa medições próprias de $L_1$, $L_2$ ou $L_i$.

### ISO 717-1:2020 e ISO 717-2:2020
*Acoustics — Rating of sound insulation in buildings and of building elements.*

Define os números únicos ponderados $R_w$, $D_{nT,w}$, $L_{n,w}$ e $L'_{nT,w}$, e a área de
absorção de referência $A_0 = 10$ m². A banda de 500 Hz usada na lei da massa vem daqui.

### ABNT NBR ISO 10140-2 e 10140-3
*Medição em laboratório do isolamento acústico de elementos de construção.* Partes 2
(ruído aéreo) e 3 (ruído de impacto).

Norma sob a qual foram realizados os ensaios dos sistemas do catálogo. Aparece no campo
`norma_ensaio` de cada registro de dado acústico.

### ISO 3382-2:2008
*Acoustics — Measurement of room acoustic parameters — Part 2: Reverberation time in
ordinary rooms.* Procedimento de medição do tempo de reverberação $T$, que o usuário
informa no passo 2.

### ISO 12999-1:2020
*Acoustics — Determination and application of measurement uncertainties in building
acoustics.* Sustenta o tratamento de incerteza: por que a plataforma apresenta os
resultados como **estimativa de projeto** e não como laudo.

### ABNT NBR 15220-2 — Desempenho térmico de edificações: métodos de cálculo

Fonte das **densidades** ($\rho$) dos materiais do catálogo. É uma norma de desempenho
térmico, mas o Anexo B traz a tabela de propriedades físicas de materiais de construção
usada aqui apenas para massa específica — não para nada acústico.

### ABNT NBR 14715 — Chapas de gesso para drywall
Propriedades físicas das chapas de gesso acartonado.

### ABNT NBR 6118 — Projeto de estruturas de concreto
Massa específica do concreto estrutural de densidade normal.

---

## 4. Literatura científica

**GERGES, Samir N. Y.** *Ruído: fundamentos e controle.* Florianópolis.
Referência de língua portuguesa para os fundamentos: lei da massa, frequência crítica,
percepção logarítmica do som e a regra prática de que ~10 dB de diferença correspondem à
sensação de metade (ou dobro) do volume — usada em
[`backend/conforto.py`](../backend/conforto.py) para traduzir decibéis em linguagem comum.

**TROCHIDIS, A.; PAPANIKOLAOU, A.** (1984). Transmissão sonora por frestas e aberturas.
Fundamenta as recomendações de vedação perimetral e tratamento de frestas: por que uma
fresta pequena derruba desproporcionalmente o isolamento de uma parede boa.

**ASAKURA, T. et al.** (2009). Transmissão por aberturas tipo fresta e redução por
materiais porosos.
Fundamenta as recomendações de preenchimento de cavidade e uso de materiais porosos.

> ⚠️ **Para a equipe:** estas três referências estão citadas no projeto em forma
> abreviada. Antes de submeter artigo ou relatório, complete os dados bibliográficos
> (editora e ano da edição consultada de Gerges; periódico, volume, páginas e DOI dos dois
> artigos) no padrão ABNT NBR 6023. Não preencha de memória — confira na fonte.

---

## 5. Dado: catálogo de sistemas construtivos

Dez sistemas com desempenho acústico documentado. Nenhum valor foi estimado; todos vêm de
ensaio ou de tabela normativa.

| Código | Sistema | Desempenho | Fonte do dado |
|---|---|---|---|
| `PAR-CER-014` | Alvenaria bloco cerâmico 14 cm + argamassa 1,5 cm | $R_w$ = 40 dB | IPT, Relatório de Ensaio nº 1 035 812-205 |
| `PAR-CER-019` | Alvenaria bloco cerâmico 19 cm + argamassa 1,5 cm | $R_w$ = 44 dB | Catálogo ProAcústica, Ficha ALV-CER-02 |
| `PAR-CON-010` | Parede de concreto maciço 10 cm | $R_w$ = 45 dB | IPT, Relatório de Ensaio nº 994 210 |
| `PAR-CON-015` | Parede de concreto maciço 15 cm | $R_w$ = 49 dB | IPT, Relatório Técnico nº 1 012 344-205 |
| `PAR-DRY-073` | Drywall 73/48 — 1 placa ST 12,5 mm/face + lã 50 mm | $R_w$ = 43 dB | Manual Knauf Drywall / Relatório IBRACON 2019 |
| `PAR-DRY-098` | Drywall 98/48 — 2 placas ST 12,5 mm/face + lã 50 mm | $R_w$ = 51 dB | Placo do Brasil / IPT nº 1 042 115 |
| `LAJ-MAC-010` | Laje maciça 10 cm, sem atenuador | $R_w$ = 45 dB · $L_{n,w}$ = 80 dB | ABNT NBR 15575-3:2013, Anexo A, Tabelas A.1 e A.2 |
| `LAJ-MAC-014` | Laje maciça 14 cm, sem atenuador | $R_w$ = 49 dB · $L_{n,w}$ = 76 dB | ABNT NBR 15575-3:2013, Anexo A, Tabelas A.1 e A.2 |
| `LAJ-FLU-014` | Laje 14 cm + manta 5 mm + contrapiso 5 cm | $R_w$ = 52 dB · $L_{n,w}$ = 56 dB ($\Delta L_w$ = 20 dB) | ProAcústica, Ficha FLU-01 / Ensaio IBRACON |
| `LAJ-VIN-014` | Laje 14 cm + contrapiso 3 cm + vinílico 2 mm | $R_w$ = 50 dB · $L_{n,w}$ = 68 dB ($\Delta L_w$ = 8 dB) | Ficha Técnica Tarkett Brasil / IPT nº 1 028 411 |

Cada laje tem dois registros de dado acústico — um para ruído aéreo ($R_w$, Tabela A.1) e
outro para ruído de impacto ($L_{n,w}$, Tabela A.2) — porque são fenômenos distintos,
julgados por partes diferentes da norma.

Tudo isso está em [`backend/seed.py`](../backend/seed.py), com os campos `fonte` e
`norma_ensaio` gravados em cada registro — é o que a interface exibe no cartão do sistema.

---

## 5.1 Dado: densidade dos materiais

Quando não existe ensaio para a composição, a estimativa pela lei da massa se apoia
**inteiramente** nestas densidades. Por isso cada uma tem fonte obrigatória — não há
material cadastrado sem origem declarada.

| # | Material | $\rho$ (kg/m³) | Fonte |
|---|---|---:|---|
| 1 | Bloco cerâmico de vedação | 1200 | ABNT NBR 15220-2 / Manual da Cerâmica Vermelha |
| 2 | Bloco de concreto vazado | 1400 | ABNT NBR 15220-2 |
| 3 | Argamassa de cimento e areia | 1900 | ABNT NBR 15220-2 |
| 4 | Concreto armado maciço | 2400 | ABNT NBR 6118 / ABNT NBR 15220-2 |
| 5 | Placa de gesso acartonado (drywall) | 800 | ABNT NBR 14715 |
| 6 | Lã de vidro para isolamento acústico | 14 | Catálogo Técnico Saint-Gobain / ISOVER |
| 7 | Manta acústica de polietileno expandido | 30 | Catálogo ProAcústica de Sistemas de Piso |
| 8 | Contrapiso regularizado de argamassa | 2000 | ABNT NBR 15220-2 |
| 9 | Piso vinílico em réguas (colado) | 1300 | Ficha Técnica Tarkett Brasil |
| 10 | Piso cerâmico / porcelanato | 2200 | ABNT NBR 15220-2 |

### Variações dimensionais

Alguns materiais têm massa superficial ($m'$) medida diretamente para uma espessura
comercial específica, em vez de calculada por $\rho \times e$. Nesses casos vale o valor
tabelado, com sua própria fonte:

| Material | Variação | $e$ | $m'$ (kg/m²) | Fonte |
|---|---|---:|---:|---|
| Bloco cerâmico | 14 cm | 0,14 m | 110 | ABNT NBR 15220-2 / ProAcústica |
| Bloco cerâmico | 19 cm | 0,19 m | 145 | ABNT NBR 15220-2 / ProAcústica |
| Argamassa | 1,5 cm | 0,015 m | 28,5 | ABNT NBR 15220-2 |
| Concreto armado | 10 cm | 0,10 m | 240 | ABNT NBR 15220-2 |
| Concreto armado | 14 cm | 0,14 m | 336 | ABNT NBR 15220-2 |
| Concreto armado | 15 cm | 0,15 m | 360 | ABNT NBR 15220-2 |
| Placa de gesso | 12,5 mm ST | 0,0125 m | 9,5 | ABNT NBR 14715 |
| Lã de vidro | 50 mm | 0,05 m | 0,7 | Catálogo ISOVER |
| Manta acústica | 5 mm | 0,005 m | 0,15 | Catálogo ProAcústica |
| Contrapiso | 3 cm | 0,03 m | 60 | ABNT NBR 15220-2 |
| Contrapiso | 5 cm | 0,05 m | 100 | ABNT NBR 15220-2 |
| Piso vinílico | 2 mm | 0,002 m | 2,6 | Ficha Técnica Tarkett |

> **Sobre a NBR 15220-2:** é uma norma de *desempenho térmico*. O que se usa dela aqui é
> apenas a tabela de propriedades físicas de materiais de construção do Anexo B — massa
> específica. Nada acústico vem dessa norma. A distinção importa: densidade é propriedade
> física, desempenho acústico é ensaio.

### Onde isso aparece na plataforma

A procedência não fica só no banco de dados:

- ao montar uma composição por camadas, o painel **"De onde vêm as densidades usadas"**
  lista cada material com sua densidade e sua fonte;
- no resultado de uma **estimativa teórica**, as fontes das densidades entram na lista de
  fontes junto com o modelo, porque é sobre elas que o número se apoia;
- cada camada devolvida pela API carrega o campo `fonte_densidade`.

> ⚠️ **Para a equipe:** os números de relatório do IPT identificam ensaios reais, mas a
> plataforma não hospeda cópia deles. Antes de publicar, guarde os PDFs (ou a referência
> completa do catálogo onde foram compilados) para poder exibi-los a um avaliador que
> peça a comprovação.

---

## 6. Regra de ouro: quando a plataforma se recusa a responder

A matriz de confiabilidade, em [`backend/engine.py`](../backend/engine.py), escolhe o
caminho de cálculo nesta ordem:

| Rótulo | Origem | Quando se aplica |
|---|---|---|
| `medicao_usuario` | Medição in situ do usuário | Há $L_1$ e $L_2$, ou $L_i$, medidos |
| `informado_usuario` | Valor de $R$ digitado | O usuário conhece o índice do fabricante |
| `ensaio_laboratorio` | Catálogo com ensaio | O sistema escolhido tem ensaio documentado |
| `documentado` | Tabela normativa | O dado vem de tabela de norma (ex.: lajes da NBR 15575-3, Anexo A), não de ensaio próprio do sistema |
| `estimativa_teorica` | Lei da massa | Elemento monolítico, sem ensaio cadastrado |
| `sem_dado` | — | **Nenhum dos anteriores: o cálculo é recusado** |

A lei da massa só é aplicada a elementos que vibram como **um corpo só** — camada única,
ou várias camadas rígidas e coladas (densidade ≥ 100 kg/m³). Havendo camada resiliente
(lã mineral, manta), o conjunto é um sistema **massa-mola-massa**, cujo comportamento a
lei da massa não descreve — e a plataforma exige um valor medido em vez de estimar.

Essa recusa é deliberada e é o principal argumento científico do projeto: **um número
inventado é pior do que a ausência de número**, porque carrega autoridade que não tem.

---

## 7. Normas citadas — lista consolidada

Para copiar em pôster, artigo ou apresentação:

**Critério**
- ABNT NBR 15575-3:2013 — Edificações habitacionais — Desempenho — Sistemas de pisos
- ABNT NBR 15575-4:2013 — Edificações habitacionais — Desempenho — Vedações verticais
- ABNT NBR 10152:2017 — Acústica — Níveis de pressão sonora em ambientes internos
- ANSI/ASA S12.60-2010/Part 1 — Acoustical Performance Criteria for Schools
- WHO (2018) — Environmental Noise Guidelines for the European Region

**Método**
- ISO 12354-1:2017 / ISO 12354-2:2017 — Estimativa de desempenho a partir dos elementos
- ISO 16283-1 / ISO 16283-2:2020 — Medição de isolamento em campo
- ISO 717-1:2020 / ISO 717-2:2020 — Números únicos ponderados
- ISO 3382-2:2008 — Medição de tempo de reverberação
- ISO 12999-1:2020 — Incerteza de medição em acústica de edificações
- ABNT NBR ISO 10140-2 / 10140-3 — Medição em laboratório

**Propriedades físicas**
- ABNT NBR 15220-2 — Desempenho térmico (tabela de densidades)
- ABNT NBR 14715 — Chapas de gesso para drywall
- ABNT NBR 6118 — Projeto de estruturas de concreto

**Literatura**
- GERGES, S. N. Y. — *Ruído: fundamentos e controle*
- TROCHIDIS, A.; PAPANIKOLAOU, A. (1984)
- ASAKURA, T. et al. (2009)

---

## 8. O que a plataforma explicitamente **não** faz

Declarar os limites é parte do rigor. A ferramenta:

- **não modela transmissão por flancos** — só transmissão direta;
- **não substitui laudo** — a conformidade com a NBR 15575 só se comprova por medição em
  campo, conforme a ISO 16283, feita por profissional habilitado;
- **não analisa por banda de frequência** — trabalha com números únicos ponderados;
- **não possui validação experimental própria** — o projeto não realizou campanha de
  medição para aferir as previsões contra a realidade. Essa é a continuação natural do
  trabalho;
- **não cobre sistemas fora do catálogo sem dado do usuário** — e diz isso, em vez de
  aproximar por semelhança.

Cada uma dessas limitações aparece na própria interface, junto do resultado.
