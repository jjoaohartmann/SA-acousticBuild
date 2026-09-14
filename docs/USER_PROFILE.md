# 👤 Perfil do Usuário

A página de perfil do usuário é uma **rota protegida** (`/profile`) que só pode ser acessada por usuários autenticados.

---

## 🔐 Fluxo de Acesso

```
Usuário não logado → redirecionado para /login
Usuário logado → acessa /profile
```

A proteção é feita pelo componente `PrivateRoute` no `App.jsx`:

```jsx
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
}
```

---

## 📐 Estrutura da Página

A página possui **duas telas** controladas pelo estado `view`:

### Tela 1 — Visualização de Perfil

```
┌──────────────────────────────┐
│ ← Home                       │
│                              │
│          (avatar)            │
│                              │
│       Gabriela Senna         │
│   gabriela.s@email.com       │
│                              │
│   ✏️ EDITAR INFORMAÇÕES      │
│   ℹ️ SUPORTE                 │
│   🚪 SAIR                    │
│                              │
│  Copyright © 2026            │
└──────────────────────────────┘
```

- **Avatar**: círculo com ícone de pessoa, borda azul-marinho
- **Nome**: texto do usuário logado (centralizado, bold)
- **E-mail**: texto cinza, menor
- **4 opções** de menu com ícones:
  1. 📊 **MINHAS SIMULAÇÕES** → vai para `/minhas-simulacoes`
  2. ✏️ **EDITAR INFORMAÇÕES** → alterna para a tela de edição
  3. ℹ️ **SUPORTE** → vai para `/suporte`
  4. 🚪 **SAIR** → faz logout e redireciona para a Home

### Tela 2 — Editar Perfil

```
┌──────────────────────────────┐
│ ← Home                       │
│                              │
│        EDITAR PERFIL         │
│                              │
│        (avatar + ✏️)         │
│                              │
│   👤 [Nome completo    ]     │
│   ✉️ [E-mail           ]     │
│   🔒 [••••••••         ]     │
│                              │
│       [ ATUALIZAR ]          │
│                              │
│  Copyright © 2026            │
└──────────────────────────────┘
```

- **Título**: "EDITAR PERFIL" (uppercase, letter-spacing)
- **Avatar** com badge de edição (lápis) no canto inferior direito
- **3 campos** com ícones:
  - 👤 Pessoa → Nome completo
  - ✉️ Envelope → E-mail
  - 🔒 Cadeado → Senha (mascarada)
- **Botão "ATUALIZAR"**: fundo azul-marinho escuro, uppercase

---

## 📁 Arquivos Envolvidos

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/UserProfile.jsx` | Página principal com ambas as telas |
| `src/style/UserProfile.module.css` | Estilos da página |
| `src/context/AuthProvider.jsx` | Guarda usuário e token |
| `src/context/AuthContext.js` | `useAuth()` |
| `backend/routers.py` | `GET /auth/me` e `PUT /auth/me` |

---

## 🎨 Design

- **Fundo**: gradiente vertical branco → azul claro (`#FEFEFE → #CADBFA`)
- **Inputs**: fundo branco, borda arredondada (pill shape), ícone à esquerda
- **Botão**: azul-marinho escuro, bordas arredondadas, hover escurece
- **Link "← Home"**: posicionado no canto superior esquerdo

---

## 🔄 Funcionalidades

| Ação | Comportamento |
|------|---------------|
| ← Home | Redireciona para `/` (landing page) |
| MINHAS SIMULAÇÕES | Abre `/minhas-simulacoes` |
| EDITAR INFORMAÇÕES | Alterna para o modo de edição |
| SUPORTE | Abre `/suporte` |
| SAIR | Limpa os dados do usuário e redireciona para `/` |
| ATUALIZAR | `PUT /auth/me` com os campos alterados |

### O que acontece no ATUALIZAR

Os três campos são opcionais: só o que foi preenchido é enviado. Como o e-mail faz parte
do payload do JWT, o back-end **reemite o token** e o front-end substitui o que está
guardado — sem isso, mudar de e-mail derrubaria a sessão. O back-end recusa (`400`) um
e-mail que já pertença a outra conta.

> Esta tela já foi puramente decorativa. Hoje o botão grava de verdade.
| ATUALIZAR | Placeholder (sem integração com API ainda) |