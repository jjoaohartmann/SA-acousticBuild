# 🔗 API — Documentação dos Endpoints

Documentação completa da API backend do AcousticBuild.

---

## 📍 Base URL

```
http://localhost:8000
```

Documentação interativa (Swagger): `http://localhost:8000/docs`

---

## 📋 Endpoints

### Health Check

```
GET /
```

Retorna se a API está funcionando.

**Resposta:**
```json
{
  "message": "AcousticBuild API está no ar! 🚀"
}
```

---

### Cadastro de Usuário

```
POST /auth/register
```

Cria um novo usuário no sistema.

**Body (JSON):**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ | Nome completo do usuário |
| `email` | string | ✅ | E-mail válido |
| `password` | string | ✅ | Senha (mínimo 6 caracteres) |

**Exemplo:**
```json
{
  "name": "Gabriela Senna",
  "email": "gabriela.s@email.com",
  "password": "minha-senha-123"
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "name": "Gabriela Senna",
  "email": "gabriela.s@email.com",
  "created_at": "2026-07-07T14:00:00"
}
```

**Erro (409 Conflict):**
```json
{
  "detail": "Este e-mail já está cadastrado."
}
```

---

### Login

```
POST /auth/login
```

Autentica o usuário e retorna um token JWT.

**Body (JSON):**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | ✅ | E-mail cadastrado |
| `password` | string | ✅ | Senha do usuário |

**Exemplo:**
```json
{
  "email": "gabriela.s@email.com",
  "password": "minha-senha-123"
}
```

**Resposta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Gabriela Senna",
    "email": "gabriela.s@email.com",
    "created_at": "2026-07-07T14:00:00"
  }
}
```

**Erro (401 Unauthorized):**
```json
{
  "detail": "E-mail ou senha incorretos."
}
```

---

## 🔐 Autenticação JWT

O token JWT é retornado no login e deve ser enviado no header `Authorization` para rotas protegidas (futuras):

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Configuração do Token:**

| Propriedade | Valor |
|-------------|-------|
| Algoritmo | HS256 |
| Expiração | 24 horas |
| Secret Key | `acousticbuild-super-secret-key-troque-em-producao` |

> ⚠️ A secret key atual é apenas para desenvolvimento. Em produção, utilize uma variável de ambiente.

---

## 📦 Schemas (Pydantic)

### UserCreate
```python
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
```

### UserLogin
```python
class UserLogin(BaseModel):
    email: EmailStr
    password: str
```

### UserResponse
```python
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
```

### Token
```python
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
```

---

## 🗄️ Modelo do Banco

### User (SQLite)

| Coluna | Tipo | Restrições |
|--------|------|------------|
| id | Integer | PK, auto increment |
| name | String | NOT NULL |
| email | String | UNIQUE, NOT NULL, indexed |
| password | String | NOT NULL (hash bcrypt) |
| created_at | DateTime | DEFAULT now() |

---

## 🛡️ Segurança

- **Senhas**: hash com bcrypt via `passlib`
- **Tokens**: JWT com `python-jose`
- **CORS**: liberado apenas para `http://localhost:5173` (frontend)