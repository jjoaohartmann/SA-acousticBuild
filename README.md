# 🏗️ AcousticBuild

**Plataforma de Previsões Acústicas** — Projeto de SA (Situação de Aprendizagem) do curso técnico integrado com a Iniciação Científica de Matemática.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688)

---

## 📋 Sobre o Projeto

O **AcousticBuild** é uma aplicação web full-stack para prever, analisar e otimizar o desempenho acústico de edificações. A plataforma oferece:

- 🌐 **Landing Page** institucional com apresentação da empresa
- 🔐 **Sistema de autenticação** (cadastro e login) com JWT
- 👤 **Perfil de usuário** com edição de dados
- 📱 **Design responsivo** e moderno

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

# Iniciar o servidor (http://localhost:8000)
uvicorn main:app --reload
```

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
│   ├── auth.py              # Hash de senha e JWT
│   ├── database.py          # SQLAlchemy + SQLite
│   ├── main.py              # FastAPI, CORS, rotas
│   ├── models.py            # Modelo ORM (User)
│   ├── routers.py           # Endpoints /auth/register e /auth/login
│   ├── schemas.py           # Schemas Pydantic
│   └── requirements.txt     # Dependências Python
│
├── frontend/
│   ├── public/              # Arquivos estáticos
│   └── src/
│       ├── assets/          # Imagens e recursos
│       ├── components/      # Componentes React reutilizáveis
│       │   ├── Header.jsx         # Header com navegação condicional
│       │   ├── HeroSection.jsx    # Seção hero da landing page
│       │   ├── WhatWeAreSection.jsx  # Seção "O que somos"
│       │   ├── WhoWeAreSection.jsx   # Seção "Quem somos"
│       │   ├── Footer.jsx        # Footer completo
│       │   ├── Sidebar.jsx       # Sidebar de navegação
│       │   ├── IconSet.jsx       # Biblioteca de ícones SVG
│       │   ├── WavesIllustration.jsx  # Ilustração do prédio
│       │   └── Logo.jsx          # Logo AcousticBuild
│       ├── context/
│       │   └── AuthContext.jsx   # Contexto de autenticação
│       ├── pages/
│       │   ├── Home.jsx         # Landing Page (pública)
│       │   ├── Login.jsx        # Página de login
│       │   ├── Register.jsx     # Página de cadastro
│       │   └── UserProfile.jsx  # Perfil do usuário (protegida)
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
│   ├── HOME_PAGE.md         # Landing Page detalhada
│   ├── USER_PROFILE.md      # Perfil do usuário
│   ├── SIDEBAR.md           # Sidebar e navegação
│   ├── COMPONENTS.md        # Catálogo de componentes
│   ├── API.md               # Endpoints da API
│   └── PALETTE.md           # Guia de identidade visual
│
└── README.md
```

---

## 🔐 Fluxo de Navegação

```
[Usuário não logado]
  /  (Home) → Landing Page pública
  ├── Header: [Entrar] [Cadastrar]
  ├── /login → Página de login
  ├── /register → Página de cadastro
  └── Após login → redireciona para /profile

[Usuário logado]
  /  (Home) → Landing Page
  ├── Header: "Olá, Nome" [Meu Perfil]
  ├── /profile → Perfil do usuário (visualização)
  │   ├── EDITAR INFORMAÇÕES → modo edição
  │   ├── SUPORTE → (placeholder)
  │   └── SAIR → logout + redireciona para Home
  └── Sidebar pode ser aberta pelo menu hamburguer
```

---

## 🔗 Endpoints da API

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/auth/register` | Cadastrar novo usuário | ❌ Não |
| POST | `/auth/login` | Login + token JWT | ❌ Não |
| GET | `/` | Health check da API | ❌ Não |

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

## 📄 Licença

Este projeto é de uso educacional — Curso Técnico + Iniciação Científica de Matemática.

---

## 👥 Autores

Projeto desenvolvido para fins acadêmicos.