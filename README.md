# 🏗️ AcousticBuild

**Plataforma de ruídos acústicos** — Projeto de SA (Situação de Aprendizagem) do curso técnico integrado com a Iniciação Científica de Matemática.

---

## 📋 Sobre o Projeto

O AcousticBuild é uma aplicação web full-stack que oferece um sistema de autenticação (cadastro e login) de usuários, servindo como base para uma futura plataforma de análise e monitoramento de ruídos acústicos.

### Funcionalidades Atuais

- ✅ Cadastro de novos usuários
- ✅ Login com autenticação JWT
- ✅ Rotas protegidas (dashboard autenticado)
- ✅ Interface responsiva com design moderno

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Versão |
|------------|--------|
| React | ^19.2 |
| Vite | ^8.0 |
| React Router DOM | ^7.15 |
| Axios | ^1.16 |
| CSS Modules | — |

### Backend
| Tecnologia | Versão |
|------------|--------|
| Python | 3.x |
| FastAPI | ^0.136 |
| SQLAlchemy | ^2.0 |
| SQLite | — |
| JWT (python-jose) | ^3.5 |
| Bcrypt (passlib) | ^1.7 |

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

A API estará disponível em: **http://localhost:8000**

Documentação interativa (Swagger): **http://localhost:8000/docs**

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

> ⚠️ O frontend depende do backend rodando em `http://localhost:8000` para funcionar corretamente (login/cadastro).

---

## 📂 Estrutura do Projeto

```
SA-acousticBuild/
├── backend/
│   ├── auth.py          # Hashing de senha e criação de tokens JWT
│   ├── database.py      # Configuração do SQLAlchemy e SQLite
│   ├── main.py          # Instância FastAPI, CORS e rotas
│   ├── models.py        # Modelo ORM do usuário
│   ├── routers.py       # Endpoints de autenticação (/auth/register, /auth/login)
│   ├── schemas.py       # Schemas Pydantic para validação
│   └── requirements.txt # Dependências Python
│
├── frontend/
│   ├── public/          # Arquivos estáticos
│   ├── src/
│   │   ├── assets/      # Imagens e recursos
│   │   ├── components/  # Componentes reutilizáveis (Logo)
│   │   ├── context/     # Contexto de autenticação (AuthContext)
│   │   ├── pages/       # Páginas da aplicação (Login, Register, Dashboard)
│   │   ├── services/    # Configuração do Axios (api.js)
│   │   ├── style/       # Estilos CSS Modules
│   │   ├── App.jsx      # Componente principal com rotas
│   │   ├── main.jsx     # Entry point do React
│   │   └── index.css    # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔗 Endpoints da API

| Método | Rota              | Descrição                     | Autenticação |
|--------|-------------------|-------------------------------|--------------|
| POST   | `/auth/register`  | Cadastrar novo usuário        | ❌ Não       |
| POST   | `/auth/login`     | Login e retorno de token JWT  | ❌ Não       |
| GET    | `/`               | Health check da API           | ❌ Não       |

### Exemplo de requisição — Login

```json
POST /auth/login
{
  "email": "usuario@email.com",
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
    "name": "Usuário Exemplo",
    "email": "usuario@email.com"
  }
}
```

---

## 🎨 Estilização

O projeto utiliza **CSS Modules** para estilização, o que garante:

- ✅ **Escopo de classes** — sem conflitos entre componentes
- ✅ **Manutenção facilitada** — estilos separados dos componentes
- ✅ **Padrão profissional** — mesma abordagem usada em projetos reais

Arquivos de estilo estão em `frontend/src/style/` e são importados nos componentes com:

```jsx
import styles from '../style/NomeDoComponente.module.css';

// Uso no JSX
<div className={styles.container}>...</div>
```

---

## 👥 Autores

Projeto desenvolvido para fins acadêmicos — Curso Técnico + Iniciação Científica de Matemática.

---

## 📄 Licença

Este projeto é de uso educacional.