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
│  Copyright © 2025            │
└──────────────────────────────┘
```

- **Avatar**: círculo com ícone de pessoa, borda azul-marinho
- **Nome**: texto do usuário logado (centralizado, bold)
- **E-mail**: texto cinza, menor
- **3 opções** de menu com ícones:
  1. ✏️ **EDITAR INFORMAÇÕES** → alterna para tela de edição
  2. ℹ️ **SUPORTE** → (placeholder para funcionalidade futura)
  3. 🚪 **SAIR** → faz logout e redireciona para Home

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
│  Copyright © 2025            │
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
| `src/context/AuthContext.jsx` | Contexto de autenticação |

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
| ← Home | Redireciona para `/` (Landing Page) |
| EDITAR INFORMAÇÕES | Alterna para modo edição |
| SUPORTE | Placeholder (sem ação ainda) |
| SAIR | Limpa dados do usuário, redireciona para `/` |
| ATUALIZAR | Placeholder (sem integração com API ainda) |