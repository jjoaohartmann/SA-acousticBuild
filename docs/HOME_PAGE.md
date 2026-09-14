# 🏠 Landing Page (Home)

A página inicial é pública e não exige autenticação. Ela apresenta o projeto, mostra em
que ele se baseia e leva à calculadora.

---

## 📐 Estrutura

Montagem em `src/pages/Home.jsx`, de cima para baixo:

```
┌──────────────────────────────────────────────┐
│  ScrollVideoBackground  (vídeo em tela cheia,│
│  fixo atrás de tudo; o tempo do vídeo avança │
│  e retrocede conforme a rolagem da página)   │
├──────────────────────────────────────────────┤
│  Sidebar (oculta) + Header  ☰   [Entrar][Cad]│
├──────────────────────────────────────────────┤
│  HeroSection                                 │
│  "Precisão acústica para melhores            │
│   edificações."                    ▼         │
├──────────────────────────────────────────────┤
│  SourcesStrip                                │
│  ABNT NBR 15575 · NBR 10152 · ISO 16283 ·    │
│  ISO 717 · ISO 12354 · WHO · ANSI/ASA        │
├──────── #o-que-somos ────────────────────────┤
│  WhatWeAreSection                            │
│  Rastreabilidade · Eficiência · Base         │
│  normativa                         ▼         │
├──────── #quem-somos ─────────────────────────┤
│  WhoWeAreSection                             │
│  Missão + 4 cartões de valores     ▼         │
├──────── #produto ────────────────────────────┤
│  ProductSection (4 cartões)                  │
│  AccessCalculatorButton                      │
├──────────────────────────────────────────────┤
│  Footer (5 colunas)                          │
└──────────────────────────────────────────────┘
```

As três âncoras (`#o-que-somos`, `#quem-somos`, `#produto`) são os alvos das setas de
rolagem, do menu lateral e do rodapé. Fora da Home, esses links levam `/` na frente
(`/#produto`), senão não fariam nada.

---

## 🎬 Vídeo de fundo

`ScrollVideoBackground` não dá play no vídeo: ele define `currentTime` a partir da
posição da rolagem. Rolar para baixo avança, rolar para cima retrocede.

- O ponto final do vídeo é o **topo do rodapé**, não o fim do documento — assim a última
  seção não fica presa em um quadro parado.
- A transição usa interpolação (`lerp`) dentro de um `requestAnimationFrame`, para o
  vídeo não "pular" a cada evento de rolagem.
- O arquivo é codificado com quadros-chave densos (`-g 6`), o que torna a busca por
  tempo rápida o bastante para acompanhar a rolagem.
- `hero-poster.jpg` cobre o intervalo até o vídeo carregar.

---

## 🧩 Header

Condicional ao estado de login (`useAuth`):

| Estado | O que aparece |
|---|---|
| Deslogado | [Entrar] e [Cadastrar] |
| Logado | "Olá, {primeiro nome}" e [Meu Perfil] |

O botão ☰ abre a `Sidebar`.

---

## 📁 Arquivos envolvidos

| Arquivo | Papel |
|---|---|
| `pages/Home.jsx` | Montagem das seções |
| `components/ScrollVideoBackground.jsx` | Vídeo controlado pela rolagem |
| `components/HeroSection.jsx` | Chamada principal |
| `components/SourcesStrip.jsx` | Faixa de normas |
| `components/WhatWeAreSection.jsx` | "O que somos" |
| `components/WhoWeAreSection.jsx` | "Quem somos" |
| `components/ProductSection.jsx` | Cartões do produto |
| `components/AccessCalculatorButton.jsx` | Chamada para a calculadora |
| `components/Header.jsx` · `Sidebar.jsx` · `Footer.jsx` | Estrutura comum a todas as páginas |
| `components/Reveal.jsx` + `hooks/useInView.js` | Animação de entrada das seções |
| `public/hero-background.mp4` | Vídeo de fundo |
| `assets/hero-poster.jpg` | Quadro de espera |

Cada componente tem seu CSS Module de mesmo nome em `src/style/`.

---

## ✍️ Nota sobre os textos

Os textos da Home descrevem apenas o que a plataforma faz de fato. Em particular, ela
**não** afirma ter validação por pesquisa de campo, e cita a ABNT como referência legal —
as normas ISO e EN entram como método de cálculo e de medição, não como critério de
conformidade.
