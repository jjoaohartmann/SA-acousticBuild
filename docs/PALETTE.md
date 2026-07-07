# 🎨 Guia de Identidade Visual

Guia completo da identidade visual do AcousticBuild contendo paleta de cores, tipografia e diretrizes de design.

---

## 🟦 Paleta de Cores

### Cores Primárias

| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| Azul-marinho escuro | `#001A41` | `rgb(0, 26, 65)` | Fundo do Hero, "Quem somos", Sidebar, botão "ATUALIZAR" |
| Azul-marinho fechado | `#011B3F` | `rgb(1, 27, 63)` | Footer |
| Azul destaque | `#1E5EFF` | `rgb(30, 94, 255)` | Botão "Cadastrar", ícones, destaques no texto |

### Cores Neutras

| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| Branco | `#FFFFFF` | `rgb(255, 255, 255)` | Fundo dos cards, textos claros |
| Cinza claro | `#EDEDED` | `rgb(237, 237, 237)` | Fundo da seção "O que somos" |
| Cinza borda | `#e2e8f0` | `rgb(226, 232, 240)` | Bordas de inputs e cards |
| Cinza texto | `#64748b` | `rgb(100, 116, 139)` | Textos secundários |

### Gradientes

| Gradiente | Cores | Uso |
|-----------|-------|-----|
| Perfil do usuário | `#FEFEFE → #CADBFA` | Fundo da página de perfil |

### Cores de Estado

| Estado | Cor | Hex | Uso |
|--------|-----|-----|-----|
| Erro | Vermelho | `#dc2626` | Mensagens de erro |
| Erro bg | Vermelho claro | `#fef2f2` | Fundo de alerta de erro |
| Erro borda | Vermelho médio | `#fca5a5` | Borda de alerta de erro |

---

## 📝 Tipografia

### Font Family

```
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Hierarquia de Textos

| Elemento | Tamanho | Peso | Cor | Uso |
|----------|---------|------|-----|-----|
| Título Hero | `3rem` (48px) | 800 (ExtraBold) | `#FFFFFF` | Título principal da Home |
| Título seção | `2.5rem` (40px) | 800 (ExtraBold) | `#1e293b` ou `#FFFFFF` | Títulos "O que somos" e "Quem somos" |
| Subtítulo | `1.1rem` | 400 (Regular) | `rgba(255,255,255,0.65)` | Texto abaixo do título hero |
| Descrição seção | `1.05rem` | 400 (Regular) | `#475569` | Texto explicativo |
| Card título | `1.2rem` | 700 (Bold) | `#1e293b` | Título dos cards |
| Card texto | `0.9rem` | 400 (Regular) | `#64748b` | Texto dos cards |
| Label seção | `0.8rem` | 600 (SemiBold) | `#475569` ou `#1E5EFF` | Labels uppercase |
| Botão texto | `0.95rem` | 500-600 | `#FFFFFF` | Botões de ação |
| Link | `0.9rem` | 600 | `#1a73e8` | Links de navegação |
| Copyright | `0.75rem` | 400 | `#94a3b8` | Texto de rodapé |

---

## 🎯 Botões

### Botão Primário (Azul)
```
┌──────────────────────┐
│      Cadastrar        │  ← texto branco, 0.95rem, weight 600
│  background: #1E5EFF │
│  border-radius: 80px │
│  padding: 11px 28px   │
│  hover: #1650e0       │
└──────────────────────┘
```

### Botão Outline
```
┌──────────────────────┐
│       Entrar          │  ← texto branco, 0.95rem, weight 500
│  background: transparent│
│  border: 1.5px solid rgba(255,255,255,0.4) │
│  border-radius: 80px │
│  padding: 10px 28px   │
│  hover: borda mais clara │
└──────────────────────┘
```

### Botão Azul Escuro (Perfil)
```
┌──────────────────────┐
│      ATUALIZAR        │  ← texto branco, 0.85rem, weight 700, uppercase
│  background: #001A41 │
│  border-radius: 50px │
│  padding: 14px        │
│  letter-spacing: 2px  │
│  hover: #002b6a       │
└──────────────────────┘
```

---

## 📐 Inputs

### Input Padrão
```
┌──────────────────────────────────┐
│ 👤  Nome completo               │
│ background: #FFFFFF              │
│ border: 1.5px solid #e2e8f0      │
│ border-radius: 50px (pill shape) │
│ padding: 12px 16px               │
│ icon à esquerda: 20px            │
└──────────────────────────────────┘
```

### Input de Newsletter
```
┌──────────────────────────────────┐
│  seu e-mail                    ✈️ │
│ background: rgba(255,255,255,0.1)│
│ border: none                     │
│ border-radius: 8px               │
│ placeholder: rgba(255,255,255,0.35) │
└──────────────────────────────────┘
```

---

## 🃏 Cards

### Card da Seção "O que somos"
```
┌──────────────────────────────┐
│  ┌──────────────┐            │
│  │    🏢 ícone  │            │  ← ícone em box 64x64
│  └──────────────┘            │     border-radius: 14px
│                              │     borda: #e2e8f0
│  Precisão                    │  ← título bold
│                              │
│  Descrição do card...        │  ← texto cinza
│                              │
│  background: #FFFFFF          │
│  border: 1px solid #e2e8f0   │
│  border-radius: 16px         │
│  padding: 40px 30px          │
│  hover: translateY(-4px)     │
└──────────────────────────────┘
```

---

## 📱 Responsividade

### Breakpoints

| Dispositivo | Largura | Comportamento |
|-------------|---------|---------------|
| Desktop | > 968px | Layout completo |
| Tablet | 768px - 968px | Grid cards 1 coluna, hero empilhado |
| Mobile | < 768px | Padding reduzido, fonte menor |

### Header (Mobile)
```
.header {
  padding: 16px 20px;  /* Reduzido de 40px */
}
.btnOutline, .btnPrimary {
  padding: 8px 18px;   /* Reduzido */
  font-size: 0.85rem;
}
```

### Grid de Cards (Mobile)
```css
.cardsGrid {
  grid-template-columns: 1fr;  /* Empilhado */
  gap: 20px;
}
.title {
  font-size: 1.8rem;  /* Reduzido de 2.5rem */
}
```

---

## 🌟 Efeitos e Animações

### Hover em Cards
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
```

### Seta de Scroll
```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(10px); }
  60% { transform: translateY(5px); }
}
```

### Sidebar Overlay
```css
.overlay {
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}
```

### Sidebar Slide
```css
.sidebar {
  left: -320px;           /* Escondido */
  transition: left 0.3s ease;
}
.sidebar.open {
  left: 0;                /* Visível */
}
```

### Fundo Pontilhado ("Quem somos")
```css
.backgroundDots {
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 30px 30px;
}
```

---

## 🖼️ Ícones

- **Estilo**: Linha fina (stroke-width: 1.5px a 2px)
- **Cores**: Azul destaque `#1E5EFF`, Branco `#FFFFFF`, Azul marinho `#001A41`
- **Tamanhos**: 20px (menus), 24px (geral), 28-32px (cards), 48px (avatar)
- **Formato**: SVG inline via componentes React