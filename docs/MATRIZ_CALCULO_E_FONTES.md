# Matriz de Cálculo, Rastreabilidade de Fontes e Arquitetura de Dados
## Calculadora AcousticBuild — Versão Corrigida

Este documento descreve detalhadamente a formulação matemática, o catálogo de sistemas documentados, a modelagem relacional e os endpoints da API da Calculadora AcousticBuild.

> Para a lista completa de fontes — separadas por papel (critério, método e dado), com o
> que cada uma define e onde é usada no código — veja [`FONTES.md`](FONTES.md).

---

## 1. Princípios Invioláveis de Implementação

1. **Interface Simples**: O usuário interage por meio de seleções cotidianas e opções guiadas.
2. **Processamento Técnico Rigoroso**: O backend concentra a matemática e normas (ISO 12354-1/2, ISO 16283-1/2, ISO 717-1/2, NBR 15575).
3. **Composição Real**: Elementos são modelados em camadas físicas sequenciais (revestimento, núcleo, manta, contrapiso, etc.).
4. **Permissão de Dados Incompletos**: Opção *"Não sei"* aceita sem quebrar o fluxo.
5. **Dado Desconhecido não é Inventado**: `null` representa desconhecido e **nunca** é convertido em zero ou estimativa forçada.
6. **Material não é Sistema**: Materiais possuem apenas grandezas físicas ($\rho$, dimensões); o sistema construtivo possui o desempenho acústico ensaiado ($R_w$, $L_{n,w}$).
7. **$R_w$ não é $R$**: Distinção categórica. $R_w$ é um número único ponderado de laboratório; $R$ é uma curva ou índice pontual.
8. **Estimativa não é Medição**: Cada resultado é classificado por badge de confiabilidade: *Ensaio de Laboratório*, *Medição in situ*, *Estimativa Teórica* ou *Dado Documentado*.
9. **Rastreabilidade de Fontes**: Todo valor acústico do catálogo referencia ensaios do IPT, Catálogo ProAcústica ou normas ABNT.
10. **Norma Define Método e Critério**: Os critérios de conformidade da NBR 15575 são vinculados aos cenários selecionados.
11. **Transparência de Limitações**: O sistema expõe as premissas físicas e adverte quando faltam dados de flanco ou dados de ensaio.
12. **Sem Aproximação Arbitrária**: Sistemas ligeiramente diferentes não herdam desempenho acústico uns dos outros sem correspondência comprovada.

---

## 2. Modelagem Relacional do Banco de Dados

O banco de dados SQLite (`backend/acoust.db`) é normalizado em 6 tabelas canônicas:

```
  ┌───────────────┐        ┌──────────────────────┐
  │   materiais   │───────<│  variacoes_material  │
  └───────┬───────┘        └──────────────────────┘
          │ 1
          │
          │ N
  ┌───────┴───────────────┐        ┌──────────────────────┐
  │    camadas_sistema    │>───────│ sistemas_construtivos│
  └───────────────────────┘        └──────────┬───────────┘
                                              │ 1
                                              │
                                              │ N
  ┌───────────────────────┐        ┌──────────┴───────────┐
  │    dados_frequencia   │>───────│    dados_acusticos   │
  └───────────────────────┘        └──────────────────────┘
```

### 2.1 `materiais`
Armazena insumos com propriedades físicas documentadas:
- `id`: Chave primária
- `nome`: Descrição do material (ex.: *"Bloco cerâmico de vedação"*)
- `categoria`: *"alvenaria"*, *"revestimento"*, *"concreto"*, *"sistema_leve"*, *"isolamento"*, *"piso"*
- `densidade`: $\rho$ em kg/m³
- `fonte`: Documento de referência da densidade (ex.: ABNT NBR 15220-2)

### 2.2 `variacoes_material`
Dimensões específicas para o mesmo insumo:
- `espessura`: metros (ex.: 0.14 m)
- `massa_superficial`: kg/m² quando documentada tabelada

### 2.3 `sistemas_construtivos`
Composição completa de um elemento de vedação:
- `codigo`: Identificador mnemônico único (ex.: `PAR-CER-014`, `LAJ-FLU-014`)
- `tipo_elemento`: *"parede"* ou *"piso_laje"*
- `espessura_total`: soma física das camadas (m)
- `massa_superficial_total`: soma ponderada $\sum (\rho_i \cdot e_i)$ (kg/m²)

### 2.4 `camadas_sistema`
Associação posicional ordenada de cada estrato:
- `ordem`: 1, 2, 3...
- `espessura`: espessura da camada em metros
- `posicao`: *"face_interna"*, *"nucleo"*, *"camada_resiliente"*, etc.

### 2.5 `dados_acusticos`
Ensaios e dados laboratoriais associados exclusivamente ao sistema:
- `tipo_ruido`: *"aereo"* ou *"impacto"*
- `rw`: Índice ponderado de redução sonora de laboratório (dB)
- `ln_w`: Nível ponderado de pressão sonora de impacto de laboratório (dB)
- `delta_lw`: Redução de impacto por revestimento atenuador (dB)
- `norma_ensaio`: Ex.: ABNT NBR ISO 10140-2 / ISO 717-1
- `fonte`: Identificação expressa do relatório de ensaio (IPT, ProAcústica)

---

## 3. Catálogo Confiável de Sistemas Cadastrados

| Código | Tipo | Composição | Espessura | Desempenho Acústico | Fonte Documentada |
|---|---|---|---|---|---|
| `PAR-CER-014` | Parede | Argamassa 1,5cm + Bloco cerâmico 14cm + Argamassa 1,5cm | 17 cm | $R_w = 40\text{ dB}$ | IPT Relatório nº 1 035 812-205 |
| `PAR-CER-019` | Parede | Argamassa 1,5cm + Bloco cerâmico 19cm + Argamassa 1,5cm | 22 cm | $R_w = 44\text{ dB}$ | Catálogo ProAcústica ALV-CER-02 |
| `PAR-CON-010` | Parede | Concreto armado maciço 10 cm | 10 cm | $R_w = 45\text{ dB}$ | IPT Relatório nº 994 210 |
| `PAR-CON-015` | Parede | Concreto armado maciço 15 cm | 15 cm | $R_w = 49\text{ dB}$ | IPT Relatório nº 1 012 344-205 |
| `PAR-DRY-073` | Parede | Drywall 73/48 (1 placa ST 12,5mm + lã de vidro 50mm + 1 placa ST) | 7,3 cm | $R_w = 43\text{ dB}$ | Manual Knauf / IBRACON 2019 |
| `PAR-DRY-098` | Parede | Drywall 98/48 (2 placas ST 12,5mm + lã de vidro 50mm + 2 placas ST) | 9,8 cm | $R_w = 51\text{ dB}$ | Placo do Brasil / IPT nº 1 042 115 |
| `LAJ-MAC-010` | Piso/Laje | Laje maciça de concreto 10 cm (sem atenuador) | 10 cm | $R_w = 45\text{ dB}$, $L_{n,w} = 80\text{ dB}$ | ABNT NBR 15575-3 Anexo A |
| `LAJ-MAC-014` | Piso/Laje | Laje maciça de concreto 14 cm (sem atenuador) | 14 cm | $R_w = 49\text{ dB}$, $L_{n,w} = 76\text{ dB}$ | ABNT NBR 15575-3 Anexo A |
| `LAJ-FLU-014` | Piso/Laje | Laje 14cm + Manta acústica PE 5mm + Contrapiso armado 5cm | 19,5 cm | $R_w = 52\text{ dB}$, $L_{n,w} = 56\text{ dB}$ ($\Delta L_w = 20\text{ dB}$) | Catálogo ProAcústica FLU-01 / IBRACON |
| `LAJ-VIN-014` | Piso/Laje | Laje 14cm + Contrapiso 3cm + Piso vinílico colado 2mm | 17,2 cm | $R_w = 50\text{ dB}$, $L_{n,w} = 68\text{ dB}$ ($\Delta L_w = 8\text{ dB}$) | Ficha Tarkett Brasil / IPT nº 1 028 411 |

---

## 4. Formulação Matemática e Modelos do Motor

### 4.1 Absorção Equivalente de Sabine
$$A = \frac{0,16 \cdot V}{T} \quad [\text{m}^2]$$
Onde:
- $V$: volume da sala receptora ($\text{m}^3$)
- $T$: tempo de reverberação medido ou estimado ($\text{s}$)

### 4.2 Isolamento Aéreo: Previsão de Campo $D_{nT,w}$ a partir de $R_w$
Conforme modelo simplificado da ISO 12354-1 / ISO 717-1 para transmissão direta.
Parte-se da diferença de nível bruta $D = R - 10\log_{10}(S/A)$ e padroniza-se pelo tempo
de reverberação:
$$D_{nT,w} \approx R_w - 10\log_{10}\left(\frac{S}{A}\right) + 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
Com $T_0 = 0,5\text{ s}$. Como $A$ cresce com o volume e o acabamento da sala, salas
maiores e mais absorventes recebem menos energia — daí o sinal negativo do termo de área.

### 4.3 Isolamento Aéreo: Medição in situ com Fonte e Receptor ($L_1, L_2$)
$$D_{nT} = (L_1 - L_2) + 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
$$R' = (L_1 - L_2) + 10\log_{10}\left(\frac{S}{A}\right) \quad [\text{dB}]$$

### 4.4 Ruído de Impacto: Previsão de Campo $L'_{nT,w}$ a partir de $L_{n,w}$
Conforme ISO 12354-2 / ISO 717-2. O $L_{n,w}$ de laboratório já vem normalizado por
$A_0$; desfaz-se essa normalização para o ambiente real e padroniza-se por $T$:
$$L'_{nT,w} \approx L_{n,w} - 10\log_{10}\left(\frac{A}{A_0}\right) - 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
Com $A_0 = 10,0\text{ m}^2$ e $T_0 = 0,5\text{ s}$.

> **Atenção ao sentido da escala.** $D_{nT}$ é *atenuação*: quanto maior, melhor, e a
> NBR 15575-4 fixa um **mínimo**. Já $L'_{nT}$ é *nível de ruído*: quanto menor, melhor,
> e a NBR 15575-3 fixa um **máximo**. São grandezas de sentidos opostos.

### 4.5 Ruído de Impacto: Medição in situ com Tapping Machine ($L_i$)
$$L'_{nT} = L_i - 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
$$L'_n = L_i + 10\log_{10}\left(\frac{A}{A_0}\right) \quad [\text{dB}]$$

### 4.6 Modelo Teórico Analítico (Lei da Massa para Parede Simples)
Aplicado exclusivamente a elementos que vibram como um corpo só — camada única, ou
várias camadas rígidas e coladas (densidade $\geq 100\text{ kg/m}^3$) — e sem ensaio
cadastrado. Havendo camada resiliente (lã mineral, manta), o conjunto é massa-mola-massa
e a lei da massa **não** o descreve: nesse caso o motor recusa a estimativa e exige um
valor medido.

Partindo de $R = 20\log_{10}(m' \cdot f) - 47$, avaliada na banda de referência de 500 Hz:
$$R_{w,\text{estimado}} \approx 20\log_{10}(m') + \big(20\log_{10}(500) - 47\big) = 20\log_{10}(m') + 6{,}98 \quad [\text{dB}]$$
No código a constante é escrita como a própria conta que a origina, para não poder
divergir da fórmula citada. O resultado é rotulado como **estimativa teórica**, nunca
como ensaio.

---

## 5. Endpoints da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/materiais` | Lista materiais com densidades e propriedades documentadas |
| `GET` | `/materiais/{id}` | Detalhes e variações dimensionais de um material |
| `GET` | `/sistemas` | Lista os 10 sistemas construtivos documentados |
| `GET` | `/sistemas/{codigo}` | Composição, camadas e dados de ensaio do sistema |
| `POST` | `/sistemas/montar` | Valida camadas, calcula $e_{\text{total}}$ e $m'$, e busca ensaio exato |
| `POST` | `/acustica/calcular` | Executa o motor com julgamento normativo NBR 15575 |
| `GET` | `/acustica/cenarios` | Retorna cenários e exigências mínimas da NBR 15575 |
| `POST` | `/acustica/salvar` | Grava a simulação no histórico do usuário (autenticado) |
| `GET` | `/acustica/simulacoes` | Lista o histórico de simulações do usuário (autenticado) |
| `POST` | `/auth/register` | Cria conta (senha com mínimo de 6 caracteres) |
| `POST` | `/auth/login` | Devolve o token JWT |
| `GET` | `/auth/me` | Dados da conta autenticada |
| `PUT` | `/auth/me` | Edita nome/e-mail/senha e reemite o token |

---

## 6. Os Dois Eixos de Julgamento

A plataforma responde a **duas perguntas diferentes** sobre o mesmo cálculo, e nunca as
mistura:

| | Exigência legal | Referência de conforto |
|---|---|---|
| Norma | ABNT NBR 15575 (partes 3 e 4) | ABNT NBR 10152 |
| Grandeza julgada | $D_{nT,w}$ (aéreo) ou $L'_{nT,w}$ (impacto) | nível que chega ao receptor, em dB |
| Escolhido pelo usuário como | **cenário** (parede entre unidades, laje…) | **ambiente receptor** (dormitório, sala de aula…) |
| Resultado | veredito **ATENDE / NÃO ATENDE** | leitura **confortável / aceitável / desconfortável** |
| Sentido da escala | depende do indicador (ver 4.4) | sempre "menos decibéis é melhor" |

Os dois eixos são **independentes**: trocar o ambiente de conforto não altera o veredito
legal, e vice-versa. A comparação com a NBR 10152 é declarada como **orientativa** na
própria interface, porque aquela norma trata de nível de ruído de fundo ($L_{Aeq}$) do
ambiente, e não do ruído transmitido por um elemento específico.

### 6.1 Reverberação
A faixa de 0,40 s a 0,60 s só é atribuída à ANSI/ASA S12.60 quando o ambiente receptor é
uma **sala de aula** — escopo real daquela norma. Para os demais ambientes a mesma faixa
é apresentada como referência de conforto para a fala, com a ressalva de que a NBR 15575
não fixa limite de reverberação para eles.

---

## 7. Matriz de Confiabilidade

O motor nunca apresenta um número sem dizer de onde ele veio. A ordem de preferência é:

| Rótulo | Origem | Quando é usado |
|---|---|---|
| `medicao_usuario` | Medição in situ informada pelo usuário | Há $L_1$ e $L_2$, ou $L_i$, medidos com sonômetro |
| `informado_usuario` | Valor de $R$ digitado pelo usuário | O usuário conhece o índice do fabricante |
| `ensaio_laboratorio` | Catálogo com ensaio documentado | O sistema escolhido tem $R_w$/$L_{n,w}$ de ensaio |
| `documentado` | Tabela normativa | O dado vem de tabela de norma (ex.: lajes da NBR 15575-3, Anexo A) |
| `estimativa_teorica` | Lei da massa (item 4.6) | Elemento monolítico e sem ensaio cadastrado |
| `sem_dado` | — | Nenhum caminho acima se aplica: o motor **recusa** o cálculo e explica o que falta |

O último caso é deliberado: um resultado inventado é pior do que a ausência de resultado.
