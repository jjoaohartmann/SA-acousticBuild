# 🎤 Guia de Apresentação — AcousticBuild

Como apresentar a plataforma numa banca ou feira científica sem cair nos dois erros
opostos: virar demonstração de software sem ciência, ou virar seminário de acústica sem
mostrar o produto.

---

## 1. A tese

Toda apresentação científica precisa de **uma frase** que possa ser defendida ou atacada.
A do AcousticBuild não é "fizemos uma calculadora acústica". É esta:

> **Uma ferramenta de previsão acústica é mais útil quando declara o que não sabe do que
> quando responde sempre.**

Isso é uma afirmação forte, testável e contra-intuitiva — exatamente o que uma banca
procura. E é verdade no código: quando a composição tem camada resiliente e não há ensaio,
a plataforma **recusa** o cálculo e explica o que falta, em vez de aplicar a lei da massa
onde ela não vale.

Tudo o mais — as telas, o PDF, o vídeo de fundo — é a **implementação** dessa tese. Se a
banca sair lembrando de uma coisa só, que seja esta.

### Por que essa tese é científica e não só "uma escolha de design"

Porque tem consequência verificável. A lei da massa descreve um elemento que vibra como
um corpo só. Um drywall com lã mineral é um sistema **massa-mola-massa**: o comportamento
é outro, e aplicar a lei da massa ali produz um número plausível e errado. Um número
plausível e errado é pior do que nenhum, porque carrega autoridade que não tem — e alguém
projeta uma parede com ele.

---

## 2. A estrutura de 12 minutos

Se você tiver mais tempo, expanda a seção 3. Se tiver menos, corte a 6.

| # | Bloco | Tempo | O que acontece |
|---|---|:---:|---|
| 1 | **Problema** | 1 min | Por que ruído entre apartamentos é um problema de saúde, não de conforto |
| 2 | **Lacuna** | 1 min | O que já existe e por que não resolve |
| 3 | **Fundamentação** | 3 min | A física e as normas |
| 4 | **Demonstração** | 3 min | A plataforma rodando — roteiro na seção 4 |
| 5 | **O diferencial** | 2 min | A recusa: mostrar o caso `sem_dado` |
| 6 | **Limites e continuação** | 1 min | O que não fizemos e o que vem depois |
| 7 | **Fechamento** | 1 min | Voltar à tese |

### Bloco 1 — Problema (1 min)

Comece por gente, não por decibel. Ruído de vizinhança afeta sono, cognição e saúde
cardiovascular — é o enquadramento das diretrizes da OMS (2018). No Brasil, a NBR 15575
tornou o desempenho acústico **obrigatório** desde 2013.

Uma frase que funciona: *"A norma existe há mais de dez anos. O problema é que quem
projeta só descobre se atendeu depois da obra pronta, quando consertar custa dez vezes
mais."*

### Bloco 2 — Lacuna (1 min)

Seja honesto: softwares profissionais de acústica existem. O que a plataforma oferece de
diferente:

- roda no navegador, sem instalação e sem licença;
- é escrita em linguagem de leigo, com todo termo técnico explicado na própria tela;
- e — o ponto central — **declara a procedência de cada número**.

Não diga "não existe nada parecido". Uma banca derruba isso em dez segundos e você perde
credibilidade no resto da apresentação.

### Bloco 3 — Fundamentação (3 min)

Este é o bloco que separa projeto científico de trabalho de programação. Três ideias,
nesta ordem:

**a) Sabine — o ambiente participa do resultado.**
$$A = \frac{0{,}16 \cdot V}{T}$$
A mesma parede isola diferente em salas diferentes. Isso surpreende quase todo mundo e é
um bom gancho.

**b) Duas grandezas com sentidos opostos.**

| | $D_{nT,w}$ (aéreo) | $L'_{nT,w}$ (impacto) |
|---|---|---|
| O que é | atenuação | nível de ruído |
| Melhor quando | **maior** | **menor** |
| A norma fixa | um **mínimo** | um **máximo** |

Este é o ponto onde mais gente erra, e onde a plataforma teve três sinais invertidos que
foram corrigidos. **Conte isso.** Mostrar que você encontrou e corrigiu um erro no próprio
trabalho vale mais do que fingir que nunca houve erro — é assim que ciência funciona.

**c) A lei da massa e onde ela para de valer.**
$$R \approx 20\log_{10}(m' \cdot f) - 47 \;\Rightarrow\; R_{500\,\text{Hz}} \approx 20\log_{10}(m') + 6{,}98$$
Vale para o elemento monolítico. Não vale para massa-mola-massa. É daqui que sai a tese.

### Bloco 4 — Demonstração (3 min)

Roteiro fechado na seção 4. Não improvise: demo improvisada em feira sempre acha o
caminho do bug.

### Bloco 5 — O diferencial (2 min)

O clímax. Monte uma parede com lã mineral e sem ensaio, e deixe a plataforma recusar.
Depois leia em voz alta o que ela responde. É o momento mais forte da apresentação porque
é o oposto do que o avaliador espera de um projeto de estudante.

### Bloco 6 — Limites e continuação (1 min)

Diga antes que perguntem:

- não modela transmissão por flancos — só direta;
- não substitui laudo;
- trabalha com números únicos ponderados, não por banda de frequência;
- **não tem validação experimental própria** — não fizemos campanha de medição para
  comparar previsão com realidade.

E então: *"É exatamente essa a continuação natural do trabalho."* Isso transforma a maior
fraqueza do projeto em trabalho futuro — que é o lugar certo dela.

### Bloco 7 — Fechamento (1 min)

Volte à tese. Literalmente a mesma frase do começo. Repetição fecha o arco e é o que a
banca leva embora.

---

## 3. O roteiro da demonstração

Decore este caminho. Ele foi escolhido para mostrar o máximo em três minutos.

**Preparação (antes de começar):**
- backend e frontend rodando, `seed.py` já executado;
- uma aba já aberta em `/calculadora` (não perca tempo navegando);
- **tenha um vídeo ou GIF gravado da demo como reserva.** Wi-Fi de feira cai.

---

**Passo 1 — o caso que dá certo, mas reprova (90 s)**

1. Parede → Alvenaria cerâmica → 14 cm.
2. Aponte o selo **"Dado Documentado em Ensaio"** e o relatório do IPT citado logo abaixo.
   *"Esse 40 dB não é chute nosso, é ensaio de laboratório, e o número do relatório está
   na tela."*
3. Avançar. No passo 2, mostre os **dois eixos**:
   - Exigência legal (NBR 15575): *"quanto a parede precisa barrar"*;
   - Referência de conforto (NBR 10152): *"quanto de ruído é aceitável no cômodo"*.
   *"São perguntas diferentes. Quase toda ferramenta mistura as duas."*
4. Calcular.

**O que mostrar no resultado, nesta ordem:**

- **O número grande primeiro**: "47 dB chegam no dormitório ≈ conversa em voz baixa".
  *"Um leigo entende isso. 'DnT,w = 38,9 dB' ele não entende."*
- **A régua colorida** com a marca do limite recomendado.
- **A cadeia dos três passos**: 85 dB do lado de lá → a parede barra 40 → sobram 47.
- **O veredito NÃO ATENDE**, e por quê: 38,9 dB contra os 45 exigidos.
- **As recomendações**, que mudam com o resultado: *"faltam 6,1 dB — frestas e vedação
  perimetral costumam responder por essa diferença."*
- Abra **"Ver memória de cálculo e fontes"**: *"todo o rastro está aqui, para quem é da
  área conferir."*

---

**Passo 2 — a recusa (60 s)** ← o momento mais importante

Este passo tem duas partes, e a força está na comparação entre elas. **Siga as espessuras
exatamente como estão aqui** — elas foram escolhidas para produzir os dois comportamentos.

**2a. Primeiro, o caso que a plataforma reconhece:**

1. Nova simulação → **"Informar Materiais e Camadas"**.
2. Monte: placa de gesso 12,5 mm + **lã de vidro 50 mm** + placa de gesso 12,5 mm.
3. Calcular. Ela **responde**: DnT,w = 41,9 dB, rotulado como `ensaio_laboratorio`.

> *"Essa composição bate exatamente com um sistema ensaiado do catálogo — o drywall 73/48.
> Então ela usa o valor de ensaio, e mostra qual."*

**2b. Agora mude um número só:**

4. Volte e troque a lã de **50 mm para 75 mm**. Mais nada.
5. Calcular.
6. A plataforma **recusa** e explica: composição com camada resiliente, sem ensaio
   documentado — exige valor medido.

Leia a explicação em voz alta e diga:

> *"Mudamos 25 milímetros de lã. Agora não existe ensaio para essa parede. Ela poderia ter
> aplicado a lei da massa e cuspido um número — pareceria certo. Estaria errado, porque
> isso é um sistema massa-mola-massa e a lei da massa não descreve esse comportamento.
> Ela também não foi buscar o sistema 'parecido' de 50 mm, que estava ali do lado.
> Preferimos que ela diga o que não sabe."*

7. Mostre as **três saídas** que ela oferece em vez de travar.

> **Por que essa dupla é melhor que a recusa sozinha:** provar que a ferramenta *sabe*
> responder torna a recusa uma decisão, não uma limitação. E mostra a regra de
> correspondência exata funcionando — ela não herda desempenho de sistema parecido.

**Variação, se sobrar tempo:** monte a mesma parede só com camadas rígidas (argamassa +
bloco de concreto + argamassa). Aí ela **estima** pela lei da massa e rotula o resultado
como `estimativa_teorica` — o terceiro comportamento. Três composições, três respostas
diferentes, cada uma com o rótulo certo.

---

**Passo 3 — o fechamento técnico (30 s)**

Baixe o PDF. *"O relatório sai com a memória de cálculo, as fontes e as limitações — não
só o número."*

---

## 4. As perguntas que vão fazer

Prepare estas. São as prováveis.

**"Isso substitui um laudo acústico?"**
Não, e a plataforma diz isso na própria tela. É estimativa de projeto, para decidir antes
da obra. A conformidade com a NBR 15575 só se comprova por medição em campo pela ISO
16283, feita por profissional habilitado.

**"Vocês validaram os resultados com medição real?"**
Não. Os dados de entrada vêm de ensaios documentados (IPT, ProAcústica, Anexo A da NBR
15575-3) e o modelo de previsão é o da ISO 12354, mas não fizemos campanha experimental
para aferir as previsões. É a principal limitação e a continuação natural do trabalho.
**Responda assim, direto.** Tentar inflar aqui é o jeito mais rápido de perder a banca.

**"De onde vem esse 6,98 da lei da massa?"**
De $R = 20\log_{10}(m'f) - 47$ avaliada em 500 Hz, banda de referência da ISO 717-1.
$20\log_{10}(500) - 47 = 6{,}98$. No código a constante está escrita como a própria conta,
justamente para não poder divergir da fórmula.

**"Por que a NBR 10152 é só 'orientativa'?"**
Porque ela trata do nível de ruído de fundo ($L_{Aeq}$) do ambiente inteiro, e nós
calculamos o ruído que atravessa **um** elemento. A comparação ajuda a entender a ordem de
grandeza, mas não é verificação formal daquela norma. Está escrito na tela, junto do
resultado.

**"E a transmissão por flancos?"**
Não modelada — só transmissão direta. Está declarado nas limitações de todo resultado. Em
obra real os flancos podem reduzir o desempenho efetivo.

**"Qual foi a maior dificuldade?"**
Boa pergunta para ser sincero: garantir que a ferramenta fosse compreensível para leigos
**sem** ficar imprecisa. A saída foi separar as camadas — o número em linguagem comum na
frente, o rigor técnico acessível logo atrás, num acordeão.

**"O que vocês mudariam?"**
Validação experimental; análise por banda de frequência em vez de números únicos; e o
cálculo inverso — "qual $R$ eu preciso para atender neste ambiente?".

---

## 5. O pôster

Um pôster é lido em 20 segundos por alguém andando. Hierarquia:

```
┌───────────────────────────────────────────────────────┐
│  ACOUSTICBUILD                                        │
│  A tese, em uma frase, em corpo grande                │
├──────────────────┬────────────────────────────────────┤
│ PROBLEMA         │  A IMAGEM DOMINANTE:               │
│ 3 linhas         │  a cadeia dos três passos          │
│                  │  85 dB → −40 dB → 47 dB            │
│ MÉTODO           │  (é o que faz a pessoa parar)      │
│ as 3 fórmulas    ├────────────────────────────────────┤
│ + a matriz de    │  A RECUSA                          │
│ confiabilidade   │  print da tela recusando o cálculo │
│                  │  + uma frase explicando por quê    │
├──────────────────┴────────────────────────────────────┤
│  LIMITAÇÕES          │  FONTES (as principais)  │ QR  │
└───────────────────────────────────────────────────────┘
```

Regras que valem mais que o layout:

- **A imagem dominante é a cadeia dos três passos**, não um print da tela cheia. Print de
  interface não se lê de longe.
- **Seção de limitações visível**, não escondida no rodapé. Avaliador experiente procura
  por ela; se não achar, desconfia do resto.
- **QR code** para a plataforma rodando. Se não houver deploy, para o repositório.
- Fontes principais no pôster; a lista completa fica em [`FONTES.md`](FONTES.md).

---

## 6. O artigo / relatório

Se houver texto escrito, esta é a estrutura, e onde buscar cada conteúdo:

| Seção | Conteúdo | Já está em |
|---|---|---|
| Introdução | Ruído como problema de saúde; a NBR 15575 desde 2013 | — |
| Referencial teórico | Sabine, as duas grandezas, lei da massa e seu limite | [`MATRIZ_CALCULO_E_FONTES.md`](MATRIZ_CALCULO_E_FONTES.md) §4 |
| Metodologia | Arquitetura, modelagem do banco, matriz de confiabilidade | [`MATRIZ_CALCULO_E_FONTES.md`](MATRIZ_CALCULO_E_FONTES.md) §2, §7 |
| Resultados | As telas, os casos de teste, o comportamento na recusa | [`COMPONENTS.md`](COMPONENTS.md) |
| Discussão | Por que a recusa é a contribuição; comparação com o que existe | seção 1 deste guia |
| Limitações | Flancos, validação, bandas de frequência | [`FONTES.md`](FONTES.md) §8 |
| Trabalhos futuros | Validação experimental, bandas, cálculo inverso | seção 4 deste guia |
| Referências | Padrão ABNT NBR 6023 | [`FONTES.md`](FONTES.md) |

> ⚠️ Antes de submeter: complete os dados bibliográficos das três referências de
> literatura marcadas em [`FONTES.md`](FONTES.md) §4. Confira na fonte — não preencha de
> memória.

---

## 7. Divisão da equipe

Três pessoas, três papéis, sem sobreposição:

| Papel | Responde por |
|---|---|
| **Narrativa** | Blocos 1, 2 e 7. Abre e fecha. É quem segura o ritmo |
| **Fundamentação** | Bloco 3 e as perguntas de física e norma |
| **Demonstração** | Blocos 4 e 5. Mãos no teclado, caminho decorado |

Todos precisam saber responder à pergunta da validação experimental, porque ela pode vir
de qualquer avaliador a qualquer momento — e a resposta tem que ser a mesma vinda dos três.

---

## 8. Checklist do dia

**Técnico**
- [ ] `python seed.py` rodado e catálogo populado
- [ ] Backend e frontend no ar; uma calculada de teste feita
- [ ] Aba já aberta em `/calculadora`
- [ ] **Vídeo/GIF da demo gravado** — o plano B para quando o Wi-Fi cair
- [ ] PDF de exemplo já gerado e salvo
- [ ] Notebook na tomada

**Conteúdo**
- [ ] A tese decorada, palavra por palavra
- [ ] O caminho da demo decorado (os dois passos)
- [ ] As sete perguntas da seção 4 ensaiadas em voz alta
- [ ] Limitações que vocês vão declarar **antes** de perguntarem

**Postura**
- [ ] Ninguém diz "é 100% preciso" — a plataforma inteira foi construída contra isso
- [ ] Ninguém diz "não existe nada parecido"
- [ ] Se não souber: *"não sei, mas sei onde verificar"* — e mostre a seção de fontes

---

## 9. O erro a não cometer

A tentação, na frente de um avaliador, é vender a ferramenta como mais capaz do que ela é.
Não faça isso — e não por moral, por estratégia: **o projeto inteiro é construído sobre
declarar limites.** Uma equipe que exagera na apresentação contradiz a própria tese na
frente da banca, e não há recuperação depois disso.

A honestidade aqui não é humildade. É coerência com o argumento.
