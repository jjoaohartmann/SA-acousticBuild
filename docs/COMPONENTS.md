# 🧩 Catálogo de Componentes

Todos os componentes React do front-end, agrupados por função. Cada um tem seu CSS
Module de mesmo nome em `src/style/`.

---

## 🗺️ Páginas (`src/pages/`)

| Página | Rota | Autenticada | O que faz |
|---|---|:---:|---|
| `Home.jsx` | `/` | — | Landing page: vídeo de fundo, hero, seções institucionais e produto |
| `About.jsx` | `/sobre` | — | O projeto, as equipes de 2026 e 2025 e a metodologia (`#metodologia`) |
| `Calculator.jsx` | `/calculadora` | — | Hospeda o assistente de cálculo em 3 passos |
| `MySimulations.jsx` | `/minhas-simulacoes` | 🔒 | Histórico de simulações salvas |
| `Support.jsx` | `/suporte` | — | Canais de contato e perguntas frequentes |
| `Login.jsx` | `/login` | — | Entrada na conta |
| `Register.jsx` | `/register` | — | Criação de conta |
| `EsqueciSenha.jsx` | `/esqueci-senha` | — | Pedido do link de redefinição; resposta igual exista ou não a conta |
| `RedefinirSenha.jsx` | `/redefinir-senha?token=…` | — | Senha nova a partir do link; tira o token da URL assim que o lê |
| `UserProfile.jsx` | `/profile` | 🔒 | Dados da conta e edição de perfil |
| `Terms.jsx` | `/termos` | — | Termos de uso |
| `Privacy.jsx` | `/privacidade` | — | Política de privacidade |

Qualquer URL desconhecida é redirecionada para `/` (`App.jsx`).

---

## 🏗️ Estrutura e navegação

| Componente | Props | Descrição |
|---|---|---|
| `Logo` | `width`, `to`, `className`, `onClick` | Logotipo; por padrão é um link para a Home. `to={null}` desativa o link |
| `Header` | `onMenuClick` | Barra superior. Deslogado mostra [Entrar]/[Cadastrar]; logado, "Olá, Nome" e [Meu Perfil] |
| `Sidebar` | `isOpen`, `onClose` | Menu lateral com Navegação, Ferramentas e Suporte. O rodapé do menu reflete o estado de login |
| `Footer` | — | Cinco colunas + inscrição de novidades (abre um e-mail pronto; não há serviço de newsletter) |
| `ScrollToHash` | — | Rola até a âncora ao trocar de rota e volta ao topo quando não há hash |
| `IconSet` | `size`, `color` | 30 ícones SVG exportados nomeadamente (`IconHome`, `IconCalculator`, …) |

---

## 🏠 Seções da Home

| Componente | Descrição |
|---|---|
| `ScrollVideoBackground` | Vídeo de fundo em tela cheia cujo tempo é controlado pela rolagem da página. Props: `src`, `poster` |
| `HeroSection` | Título, chamada e seta de rolagem |
| `SourcesStrip` | Faixa com as normas e diretrizes que embasam a metodologia |
| `WhatWeAreSection` | "O que somos" — rastreabilidade, eficiência e base normativa |
| `WhoWeAreSection` | "Quem somos" — missão e valores |
| `ProductSection` | Cartões das quatro frentes do produto |
| `AccessCalculatorButton` | Chamada final para a calculadora |
| `Reveal` | Envelope de animação: revela o conteúdo ao entrar na viewport. Props: `children`, `delay`, `className` |

---

## 🧮 Calculadora (`src/components/calculator/`)

| Componente | Props | Descrição |
|---|---|---|
| `CalculatorWizard` | `tipoInicial` | Orquestra os três passos e monta o payload do cálculo |
| `CalculatorStepHeader` | `step` | Título da página e trilha 1 → 2 → 3 |
| `Step1Input` | `form`, `setForm`, `onAdvanced` | Escolha do elemento: opção pronta do catálogo ou composição por camadas |
| `LayerComposer` | `onCompositionChange`, `initialLayers` | Montagem de um elemento camada a camada |
| `SystemInfoCard` | `sistema`, `propriedadesFisicas`, `dadosAcusticos`, `fontes`, `modo` | Ficha do sistema com selo de "ensaio documentado" ou aviso de transparência |
| `Step2Parameters` | `form`, `setForm`, `onCalculate` | Ruído da fonte (L₁), os dois eixos normativos e a geometria do ambiente |
| `Step3Results` | `resultado`, `user`, `salvarSimulacao`, `saved`, `form` | Resultado: destaque do nível recebido, cadeia de cálculo, indicadores, interpretação e recomendações |
| `NoiseGauge` | `valor`, `recomendado`, `min`, `max` | Régua verde/âmbar/vermelha com a marca do limite recomendado |
| `InfoTip` | `termo`, `children` | Ícone (i) que abre a explicação do termo em linguagem comum |
| `PdfReportGenerator` | `resultado`, `form`, `user` | Relatório em PDF. As bibliotecas só são carregadas no clique |

`glossario.js` guarda os 12 verbetes usados pelo `InfoTip`.

---

## 🔗 Contexto, hooks e serviços

| Arquivo | Descrição |
|---|---|
| `context/AuthProvider.jsx` | Guarda usuário e token, persiste no `localStorage` |
| `context/AuthContext.js` | `useAuth()` — acesso ao usuário e às ações de login/logout |
| `hooks/useAcousticCalculator.js` | Chama a API de cálculo e a de salvar simulação |
| `hooks/useInView.js` | Detecta entrada na viewport (base do `Reveal`) |
| `services/api.js` | Instância do axios com `VITE_API_URL` e injeção do token |
| `utils/scroll.js` | `scrollToSection(id)` — rolagem suave até uma seção |

---

## 🎨 Convenções

- **CSS Modules** para tudo: `Componente.jsx` ↔ `style/Componente.module.css`.
- **Sem estilos globais novos**: `index.css` cuida apenas de reset e tipografia base.
- **Nomes em português** nas variáveis de domínio (`resultado`, `cenário`, `camadas`) e em
  inglês nas de infraestrutura React (`props`, `state`, `ref`).
- Textos voltados a leigos: todo termo técnico da interface tem um `InfoTip` ao lado.
