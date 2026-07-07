# 🧩 Catálogo de Componentes

Catálogo completo de todos os componentes React do frontend.

---

## 📁 Lista de Componentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Logo | `Logo.jsx` | Logotipo AcousticBuild com onda sonora SVG |
| Header | `Header.jsx` | Header condicional (logado/não logado) |
| HeroSection | `HeroSection.jsx` | Seção principal da Home |
| WhatWeAreSection | `WhatWeAreSection.jsx` | Seção "O que somos" |
| WhoWeAreSection | `WhoWeAreSection.jsx` | Seção "Quem somos" |
| Footer | `Footer.jsx` | Footer com 5 colunas |
| Sidebar | `Sidebar.jsx` | Menu lateral de navegação |
| IconSet | `IconSet.jsx` | Biblioteca de ícones SVG |
| WavesIllustration | `WavesIllustration.jsx` | Ilustração do prédio com ondas |

---

## 🏷️ Logo

**Arquivo:** `src/components/Logo.jsx`

Componente do logotipo da AcousticBuild com:
- Onda sonora em SVG (barras de áudio estilizadas)
- Nome "AcousticBuild" em bold
- Subtítulo "Previsões Acústicas" em uppercase

**Props:**

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `width` | number | `220` | Largura do componente |
| `light` | boolean | `false` | Modo claro (fundo escuro) |

---

## 🧭 Header

**Arquivo:** `src/components/Header.jsx`

Header fixo no topo da página com navegação condicional.

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `onMenuClick` | function | Callback ao clicar no hamburguer |

**Comportamento:**
- Usuário não logado: exibe botões [Entrar] e [Cadastrar]
- Usuário logado: exibe "Olá, Nome" e [Meu Perfil]

---

## 🎯 HeroSection

**Arquivo:** `src/components/HeroSection.jsx`

Seção hero da landing page com:
- Título com destaque em azul na palavra "acústica"
- Parágrafo descritivo
- Ilustração do WavesIllustration
- Seta de scroll animada

---

## 📊 WhatWeAreSection

**Arquivo:** `src/components/WhatWeAreSection.jsx`

Seção "O que somos" com:
- Label descritivo
- Título com destaque em "seu projeto"
- 3 cards (Precisão, Eficiência, Confiabilidade)

**Estrutura dos cards:**

```js
const cards = [
  {
    icon: IconBuilding,      // Componente do ícone
    title: 'Precisão',       // Título do card
    text: 'Descrição...'     // Texto descritivo
  },
  // ...
]
```

---

## 👥 WhoWeAreSection

**Arquivo:** `src/components/WhoWeAreSection.jsx`

Seção "Quem somos" com:
- Label em azul
- Título com destaque em "silêncio"
- Texto justificado descritivo
- Botão "Saiba mais →"
- Grid 2×2 de valores (Sustentabilidade, 100%, Inovação, Foco)
- Fundo com padrão de pontos decorativos

---

## 📝 Footer

**Arquivo:** `src/components/Footer.jsx`

Footer com 5 colunas em grid:
1. **Marca**: Logo + descrição + ícones sociais
2. **Navegação**: Links âncora para seções
3. **Produto**: Links para ferramentas
4. **Suporte**: Links de ajuda
5. **Newsletter**: Input de e-mail + botão de envio

---

## 📱 Sidebar

**Arquivo:** `src/components/Sidebar.jsx`

Menu lateral que abre com animação slide.

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isOpen` | boolean | Controla visibilidade |
| `onClose` | function | Callback ao fechar |

**Seções:**
- **Navegação**: O que somos?, Quem somos?, Produto
- **Ferramentas**: Isolamento Acústico, Absorção Sonora, Relatórios
- **Suporte**: Central de Ajuda, Termos de Uso

**Funcionalidades:**
- Overlay escuro ao fundo
- Fecha ao clicar no overlay ou em links âncora
- Link "Entrar" no rodapé

---

## 🎨 IconSet

**Arquivo:** `src/components/IconSet.jsx`

Biblioteca de 25+ ícones SVG exportados como componentes React.

**Ícones disponíveis:**

| Nome | Descrição | Cor padrão |
|------|-----------|------------|
| `IconHamburger` | Menu hamburguer ☰ | Branco |
| `IconBuilding` | Prédio | Azul #1E5EFF |
| `IconChartUp` | Gráfico ascendente | Azul #1E5EFF |
| `IconShieldCheck` | Escudo com check | Azul #1E5EFF |
| `IconRecycle` | Reciclagem | Azul #1E5EFF |
| `IconCircleCheck` | Check em círculo | Azul #1E5EFF |
| `IconBulb` | Lâmpada | Azul #1E5EFF |
| `IconPersonCircle` | Pessoa em círculo | Azul #1E5EFF |
| `IconChartBars` | Gráfico de barras | Branco |
| `IconHome` | Casa | Branco |
| `IconZigzag` | Zigue-zague (ondas) | Branco |
| `IconDocument` | Documento | Branco |
| `IconWaveform` | Onda sonora | Branco |
| `IconHelp` | Interrogação | Branco |
| `IconPerson` | Pessoa | Azul marinho |
| `IconEnvelope` | Envelope | Azul marinho |
| `IconLock` | Cadeado | Azul marinho |
| `IconPencil` | Lápis | Azul marinho |
| `IconInfo` | Informação | Azul marinho |
| `IconLogout` | Sair | Azul marinho |
| `IconChevronDown` | Seta para baixo | Branco |
| `IconChevronDownDark` | Seta para baixo | Cinza |
| `IconSend` | Avião de papel | Branco |
| `IconInstagram` | Instagram | Branco |
| `IconMail` | E-mail (círculo) | Branco |
| `IconGrid` | Grade/Grid | Azul marinho |

**Uso:**

```jsx
import { IconBuilding, IconChartUp } from './IconSet';

// Tamanho e cor personalizáveis
<IconBuilding size={32} color="#1E5EFF" />
<IconChartUp size={24} color="#333333" />
```

---

## 🏢 WavesIllustration

**Arquivo:** `src/components/WavesIllustration.jsx`

Ilustração SVG de um prédio wireframe com ondas sonoras na base.

**Props:**

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `width` | number | `400` | Largura da ilustração |

**Elementos:**
- Prédio principal com janelas e porta
- Prédio menor ao lado
- Antena no topo
- 3 camadas de ondas sonoras na base (tons de azul)
- Partículas decorativas flutuantes