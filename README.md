# 🏗️ AcousticBuild

**Plataforma de Previsões Acústicas** — Projeto de SA (Situação de Aprendizagem) do curso técnico integrado com a Iniciação Científica de Matemática.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688)

---

## 📋 Sobre o Projeto

O **AcousticBuild** é uma aplicação web full-stack que estima o desempenho acústico de
sistemas construtivos e diz se ele atende às normas brasileiras. A plataforma oferece:

- 🧮 **Calculadora acústica** em 3 passos — ruído aéreo (paredes) e de impacto (pisos)
- 📚 **Catálogo construtivo** com sistemas de ensaio documentado e fontes rastreáveis
- 🧱 **Composição por camadas** para elementos que não estão no catálogo
- ⚖️ **Duplo julgamento**: exigência legal (ABNT NBR 15575) e conforto (ABNT NBR 10152)
- 🏷️ **Rótulo de confiabilidade** em cada resultado — ensaio, medição ou estimativa
- 📄 **Relatório técnico em PDF** com a memória de cálculo
- 🌐 **Landing page** institucional, página do projeto e da equipe
- 🔐 **Contas com JWT**, perfil editável e histórico de simulações
- 📱 **Design responsivo** e linguagem acessível a quem não é da área

### Um princípio acima dos outros

Quando não há dado confiável para um cálculo, a plataforma **recusa o resultado e explica
o que falta** — em vez de devolver um número inventado. Todo valor exibido carrega a
origem: ensaio de laboratório, medição do usuário ou estimativa teórica.

---

## 🎨 Identidade Visual

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul-marinho escuro | `#001A41` | Fundo do Hero, "Quem somos", Sidebar |
| Azul-marinho fechado | `#011B3F` | Footer |
| Azul destaque | `#1E5EFF` | Botões, ícones, destaques no texto |
| Cinza claro | `#EDEDED` | Fundo da seção "O que somos" |
| Branco | `#FFFFFF` | Fundo dos cards, textos claros |
| Gradiente perfil | `#FEFEFE → #CADBFA` | Fundo da página de perfil |

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | ^19.2 | Biblioteca UI |
| Vite | ^8.0 | Bundler e dev server |
| React Router DOM | ^7.15 | Roteamento SPA |
| Axios | ^1.16 | HTTP client |
| CSS Modules | — | Estilização com escopo |

### Backend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Python | 3.x | Linguagem |
| FastAPI | ^0.136 | Framework web |
| SQLAlchemy | ^2.0 | ORM |
| SQLite | — | Banco de dados |
| JWT (python-jose) | ^3.5 | Autenticação |
| Bcrypt (passlib) | ^1.7 | Hash de senhas |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **Python** (3.10 ou superior)
- **Git**

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/jjoaohartmann/SA-acousticBuild.git
cd SA-acousticBuild
```

### 2️⃣ Backend — Servidor FastAPI

```bash
# Acessar a pasta do backend
cd backend

# (Opcional) Criar e ativar ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Popular o catálogo construtivo (só na primeira vez)
python seed.py

# Iniciar o servidor (http://localhost:8000)
uvicorn main:app --reload
```

> ⚠️ Sem rodar o `seed.py` o catálogo fica vazio e a calculadora não tem sistemas para
> oferecer no passo 1.

API disponível em: **http://localhost:8000**
Documentação Swagger: **http://localhost:8000/docs**

### 3️⃣ Frontend — React + Vite

Abra um **novo terminal** e execute:

```bash
# Acessar a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:5173)
npm run dev
```

> ⚠️ O frontend depende do backend rodando em `http://localhost:8000`.

---

## 📂 Estrutura do Projeto

```
SA-acousticBuild/
├── backend/
│   ├── main.py              # FastAPI, CORS, registro dos routers
│   ├── database.py          # SQLAlchemy + SQLite
│   ├── models.py            # Modelos ORM (usuários, catálogo, simulações)
│   ├── schemas.py           # Schemas Pydantic
│   ├── auth.py              # Hash bcrypt e JWT
│   ├── routers.py           # /auth/register, /login, /me, /esqueci-senha, /redefinir-senha
│   ├── recuperacao.py       # Links de redefinição de senha (uso único)
│   ├── catalogo.py          # /materiais, /sistemas, /sistemas/montar
│   ├── acustica.py          # /acustica/calcular, /cenarios, histórico
│   ├── engine.py            # Motor de cálculo e matriz de confiabilidade
│   ├── formulas.py          # Fórmulas e validação das faixas físicas
│   ├── criteria.py          # Critérios da NBR 15575 e reverberação
│   ├── conforto.py          # Camada de conforto da NBR 10152
│   ├── suggestions.py       # Recomendações a partir do resultado
│   ├── formatar.py          # Números com vírgula decimal (pt-BR)
│   ├── seed.py              # Popula o catálogo construtivo
│   ├── tests/               # Suíte pytest (31 testes)
│   └── requirements.txt     # Dependências Python
│
├── frontend/
│   ├── public/              # Arquivos estáticos
│   └── src/
│       ├── assets/          # Imagens e recursos
│       ├── components/      # Componentes React (ver docs/COMPONENTS.md)
│       │   ├── calculator/       # Assistente de cálculo em 3 passos
│       │   ├── ScrollVideoBackground.jsx  # Vídeo controlado pela rolagem
│       │   ├── Header.jsx · Sidebar.jsx · Footer.jsx · Logo.jsx
│       │   ├── HeroSection.jsx · SourcesStrip.jsx
│       │   ├── WhatWeAreSection.jsx · WhoWeAreSection.jsx
│       │   ├── ProductSection.jsx · AccessCalculatorButton.jsx
│       │   ├── Reveal.jsx · ScrollToHash.jsx
│       │   └── IconSet.jsx       # Biblioteca de ícones SVG
│       ├── context/         # AuthProvider e useAuth
│       ├── hooks/           # useAcousticCalculator, useInView
│       ├── pages/           # Home, Calculator, About, Support, Login,
│       │                    # Register, UserProfile, MySimulations,
│       │                    # Terms, Privacy
│       ├── services/
│       │   └── api.js           # Axios config
│       ├── style/               # CSS Modules
│       ├── App.jsx              # Rotas principais
│       ├── main.jsx             # Entry point
│       └── index.css            # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/                    # Documentação adicional
│   ├── FONTES.md            # Todas as fontes, por papel (critério/método/dado)
│   ├── MATRIZ_CALCULO_E_FONTES.md  # Fórmulas, catálogo e confiabilidade
│   ├── API.md               # Endpoints da API
│   ├── COMPONENTS.md        # Catálogo de componentes
│   ├── HOME_PAGE.md         # Landing page detalhada
│   ├── USER_PROFILE.md      # Perfil do usuário
│   └── PALETTE.md           # Guia de identidade visual
│
└── README.md
```

---

## 🔐 Fluxo de Navegação

```
[Público — não exige conta]
  /                  Landing page
  /calculadora       Calculadora acústica (3 passos, resultado e PDF)
  /sobre             O projeto, as equipes e a metodologia (#metodologia)
  /suporte           Canais de contato e perguntas frequentes
  /termos            Termos de uso
  /privacidade       Política de privacidade
  /login /register   Entrar ou criar conta
  /esqueci-senha     Pedir link para redefinir a senha
  /redefinir-senha   Criar senha nova a partir do link

[Exige conta]
  /profile             Perfil — ver e editar nome, e-mail e senha (PUT /auth/me)
  /minhas-simulacoes   Histórico de simulações salvas

Qualquer URL desconhecida redireciona para /.
O menu ☰ (Sidebar) e o rodapé estão presentes nas páginas principais.
```

---

## 🔗 Endpoints da API

Referência completa em [`docs/API.md`](docs/API.md).

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Health check da API | ❌ Não |
| POST | `/auth/register` | Cadastrar novo usuário | ❌ Não |
| POST | `/auth/login` | Login + token JWT | ❌ Não |
| POST | `/auth/esqueci-senha` | Pedir link de redefinição | ❌ Não |
| POST | `/auth/redefinir-senha` | Criar senha nova com o link | ❌ Não |
| GET | `/auth/me` | Dados da conta | ✅ Sim |
| PUT | `/auth/me` | Editar nome, e-mail ou senha | ✅ Sim |
| GET | `/materiais` | Catálogo de materiais | ❌ Não |
| GET | `/materiais/{id}` | Material e suas variações | ❌ Não |
| GET | `/sistemas` | Catálogo de sistemas construtivos | ❌ Não |
| GET | `/sistemas/{codigo}` | Composição e ensaio de um sistema | ❌ Não |
| POST | `/sistemas/montar` | Montar composição por camadas | ❌ Não |
| GET | `/acustica/cenarios` | Cenários e limites da NBR 15575 | ❌ Não |
| POST | `/acustica/calcular` | Executar o cálculo acústico | ❌ Não |
| POST | `/acustica/salvar` | Salvar simulação no histórico | ✅ Sim |
| GET | `/acustica/simulacoes` | Listar o histórico do usuário | ✅ Sim |

### Exemplo — Cadastro

```json
POST /auth/register
{
  "name": "Gabriela Senna",
  "email": "gabriela.s@email.com",
  "password": "minha-senha"
}
```

### Exemplo — Login

```json
POST /auth/login
{
  "email": "gabriela.s@email.com",
  "password": "minha-senha"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Gabriela Senna",
    "email": "gabriela.s@email.com",
    "created_at": "2026-07-07T14:00:00"
  }
}
```

---

## 🎨 Estilização

O projeto utiliza **CSS Modules** para estilização:

```jsx
import styles from '../style/NomeDoComponente.module.css';

<div className={styles.container}>...</div>
```

Vantagens:
- ✅ Classes com escopo automático
- ✅ Sem conflitos entre componentes
- ✅ Manutenção facilitada

---

## 📚 Documentação

| Documento | Para quê |
|---|---|
| [`docs/FONTES.md`](docs/FONTES.md) | Todas as fontes usadas, separadas por papel: critério, método e dado |
| [`docs/MATRIZ_CALCULO_E_FONTES.md`](docs/MATRIZ_CALCULO_E_FONTES.md) | Fórmulas, modelagem do banco, catálogo e matriz de confiabilidade |
| [`docs/API.md`](docs/API.md) | Referência dos 14 endpoints |
| [`docs/COMPONENTS.md`](docs/COMPONENTS.md) | Catálogo de componentes React |
| [`docs/HOME_PAGE.md`](docs/HOME_PAGE.md) | Estrutura da landing page |
| [`docs/USER_PROFILE.md`](docs/USER_PROFILE.md) | Telas de perfil e edição |
| [`docs/PALETTE.md`](docs/PALETTE.md) | Identidade visual |

---

## 📄 Licença

Este projeto é de uso educacional — Curso Técnico + Iniciação Científica de Matemática.

---

## 👥 Autores

Projeto desenvolvido para fins acadêmicos.