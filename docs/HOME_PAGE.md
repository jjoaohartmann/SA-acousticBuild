# 🏠 Landing Page (Home)

A página inicial do AcousticBuild é uma **landing page pública** que não requer autenticação. Ela apresenta a empresa e seus serviços.

---

## 📐 Estrutura da Página

A página é composta por 4 seções principais, montadas no componente `Home.jsx`:

```
┌──────────────────────────────────────┐
│  HEADER                              │
│  ☰                    [Entrar] [Cad.]│
├──────────────────────────────────────┤
│  HERO SECTION                        │
│                                      │
│  Precisão acústica    ┌──────────┐   │
│  para melhores        │ Ilustração│   │
│  edificações.         │ Prédio   │   │
│                       │ + Ondas  │   │
│  Plataforma que       └──────────┘   │
│  prevê e otimiza...                  │
│              ▼ (scroll)              │
├──────────────────────────────────────┤
│  O QUE SOMOS                         │
│                                      │
│  Soluções acústicas para             │
│  seu projeto.                        │
│                                      │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ Precisão│ │Eficiência│ │Confiab.│ │
│  └─────────┘ └─────────┘ └────────┘ │
│              ▼ (scroll)              │
├──────────────────────────────────────┤
│  QUEM SOMOS                          │
│                                      │
│  Engenharia que constrói o           │
│  silêncio.                          │
│                                      │
│  [Saiba mais →]   ┌──────┐ ┌──────┐ │
│                   │Suste.│ │100%  │ │
│                   └──────┘ └──────┘ │
│                   ┌──────┐ ┌──────┐ │
│                   │Inova.│ │Foco  │ │
│                   └──────┘ └──────┘ │
│              ▼ (scroll)              │
├──────────────────────────────────────┤
│  FOOTER                              │
│  Logo | Naveg. | Prod. | Suporte |  │
│  Newsletter                          │
└──────────────────────────────────────┘
```

---

## 📁 Arquivos Envolvidos

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/pages/Home.jsx` | Página | Monta todos os componentes da Home |
| `src/components/Header.jsx` | Componente | Header com menu hamburguer e botões |
| `src/style/Header.module.css` | Estilo | Estilos do Header |
| `src/components/HeroSection.jsx` | Componente | Seção hero principal |
| `src/style/HeroSection.module.css` | Estilo | Estilos do Hero |
| `src/components/WhatWeAreSection.jsx` | Componente | Seção "O que somos" |
| `src/style/WhatWeAreSection.module.css` | Estilo | Estilos da seção |
| `src/components/WhoWeAreSection.jsx` | Componente | Seção "Quem somos" |
| `src/style/WhoWeAreSection.module.css` | Estilo | Estilos da seção |
| `src/components/Footer.jsx` | Componente | Footer completo |
| `src/style/Footer.module.css` | Estilo | Estilos do Footer |
| `src/components/Sidebar.jsx` | Componente | Sidebar de navegação |
| `src/style/Sidebar.module.css` | Estilo | Estilos da Sidebar |
| `src/components/IconSet.jsx` | Componente | Todos os ícones SVG |
| `src/components/WavesIllustration.jsx` | Componente | Ilustração do prédio |

---

## 🧩 Header

O Header é **condicional**:

### Usuário não logado:
```
☰                              [Entrar] [Cadastrar]
```

- Botão **Entrar**: estilo outline com borda transparente
- Botão **Cadastrar**: fundo azul `#1E5EFF`
- Ambos redirecionam para `/login` e `/register`

### Usuário logado:
```
☰                    Olá, Gabriela  [Meu Perfil]
```

- Exibe o nome do usuário
- Botão "Meu Perfil" redireciona para `/profile`

---

## 🎯 Seção Hero

- **Fundo**: azul-marinho escuro `#001A41`
- **Título**: "Precisão **acústica** para melhores edificações." (palavra "acústica" em azul `#1E5EFF`)
- **Subtítulo**: descrição da plataforma
- **Ilustração**: prédio wireframe com ondas sonoras na base (SVG)
- **Seta de scroll**: animada, indica rolagem para baixo

---

## 📊 Seção "O que somos"

- **Fundo**: branco `#FFFFFF`
- **Label**: "O QUE SOMOS" em cinza com letter-spacing
- **Título**: "Soluções acústicas para **seu projeto**."
- **Descrição**: texto explicativo centralizado
- **3 Cards** lado a lado:
  1. 🏢 **Precisão** — Cálculos e simulação acústicas
  2. 📈 **Eficiência** — Agilidade e automação
  3. 🛡️ **Confiabilidade** — Resultados verificados

Cada card possui:
- Ícone azul dentro de um quadrado com borda
- Título em negrito
- Texto descritivo em cinza

---

## 👥 Seção "Quem somos"

- **Fundo**: azul-marinho escuro `#001A41`
- **Label**: "QUEM SOMOS" em azul `#1E5EFF`
- **Título**: "Engenharia que constrói o **silêncio**."
- **Texto**: descrição da equipe em formato justificado
- **Botão**: "Saiba mais sobre nós →" (outline)
- **Grid 2×2** de valores:
  1. ♻️ **Sustentabilidade** — Bem-estar e saúde
  2. ✅ **100%** — Foco em qualidade
  3. 💡 **Inovação** — Tecnologia a favor do projeto
  4. 👤 **Foco** — Conforto acústico
- **Fundo decorativo**: padrão de pontos conectados (efeito "rede")

---

## 📝 Footer

- **Fundo**: azul-marinho fechado `#011B3F`
- **5 colunas**:
  1. **Logo** + descrição + ícones sociais (Instagram, E-mail)
  2. **Navegação**: O que somos, Quem somos, Produto
  3. **Produto**: Calculadora, Recursos
  4. **Suporte**: Central de ajuda, Fale conosco, Termos de uso, Privacidade
  5. **Newsletter**: Input de e-mail + botão de envio
- **Copyright** no rodapé centralizado

---

## 📱 Sidebar

- Abre ao clicar no ícone ☰ (hamburguer)
- **Fundo**: azul-marinho escuro `#001A41`
- **Logo** no topo com waveform
- **Seções de navegação**:
  - Navegação: O que somos?, Quem somos?, Produto
  - Ferramentas: Isolamento Acústico, Absorção Sonora, Relatórios
  - Suporte: Central de Ajuda, Termos de Uso
- **Link "Entrar"** no final para usuários não logados
- **Overlay** escuro semitransparente ao fundo