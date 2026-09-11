# Matriz de Cálculo, Rastreabilidade de Fontes e Arquitetura de Dados
## Calculadora AcousticBuild — Versão Corrigida

Este documento descreve detalhadamente a formulação matemática, o catálogo de sistemas documentados, a modelagem relacional e os endpoints da API da Calculadora AcousticBuild.

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
Conforme modelo simplificado da ISO 12354-1 / ISO 717-1 para transmissão direta:
$$D_{nT,w} \approx R_w + 10\log_{10}\left(\frac{T}{T_0}\right) - 10\log_{10}\left(\frac{A}{S}\right) \quad [\text{dB}]$$
Com $T_0 = 0,5\text{ s}$.

### 4.3 Isolamento Aéreo: Medição in situ com Fonte e Receptor ($L_1, L_2$)
$$D_{nT} = (L_1 - L_2) + 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
$$R' = (L_1 - L_2) + 10\log_{10}\left(\frac{S}{A}\right) \quad [\text{dB}]$$

### 4.4 Ruído de Impacto: Previsão de Campo $L'_{nT,w}$ a partir de $L_{n,w}$
Conforme ISO 12354-2 / ISO 717-2:
$$L'_{nT,w} \approx L_{n,w} - 10\log_{10}\left(\frac{A}{A_0}\right) + 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
Com $A_0 = 10,0\text{ m}^2$ e $T_0 = 0,5\text{ s}$.

### 4.5 Ruído de Impacto: Medição in situ com Tapping Machine ($L_i$)
$$L'_{nT} = L_i - 10\log_{10}\left(\frac{T}{T_0}\right) \quad [\text{dB}]$$
$$L'_n = L_i + 10\log_{10}\left(\frac{A}{A_0}\right) \quad [\text{dB}]$$

### 4.6 Modelo Teórico Analítico (Lei da Massa para Parede Simples)
Aplicado exclusivamente a elementos homogêneos de camada única sem ensaio cadastrado:
$$R_{w,\text{estimado}} \approx 20\log_{10}(m') + 10 \quad [\text{dB}]$$

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
