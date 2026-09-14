# 🔌 API — AcousticBuild

Referência dos endpoints do back-end FastAPI. A documentação interativa gerada
automaticamente fica em `/docs` (Swagger) e `/redoc` com o servidor no ar.

Fórmulas e critérios: [`MATRIZ_CALCULO_E_FONTES.md`](MATRIZ_CALCULO_E_FONTES.md).
Fontes: [`FONTES.md`](FONTES.md).

---

## 📍 Base URL

```
http://127.0.0.1:8000
```

No front-end o endereço vem de `VITE_API_URL`, com esse valor como padrão de
desenvolvimento (`frontend/src/services/api.js`).

---

## 🗺️ Mapa dos endpoints

| Método | Rota | Auth | Para quê |
|---|---|:---:|---|
| `GET` | `/` | — | Health check |
| `POST` | `/auth/register` | — | Criar conta |
| `POST` | `/auth/login` | — | Obter token JWT |
| `POST` | `/auth/esqueci-senha` | — | Pedir link de redefinição de senha |
| `POST` | `/auth/redefinir-senha` | — | Criar senha nova com o link |
| `GET` | `/auth/me` | 🔒 | Ler os dados da conta |
| `PUT` | `/auth/me` | 🔒 | Editar nome, e-mail e/ou senha |
| `GET` | `/materiais` | — | Catálogo de materiais |
| `GET` | `/materiais/{material_id}` | — | Um material e suas variações |
| `GET` | `/sistemas` | — | Catálogo de sistemas construtivos |
| `GET` | `/sistemas/{codigo}` | — | Composição e ensaio de um sistema |
| `POST` | `/sistemas/montar` | — | Montar composição por camadas |
| `GET` | `/acustica/cenarios` | — | Cenários e limites da NBR 15575 |
| `POST` | `/acustica/calcular` | — | Executar o cálculo acústico |
| `POST` | `/acustica/salvar` | 🔒 | Salvar simulação no histórico |
| `GET` | `/acustica/simulacoes` | 🔒 | Listar o histórico do usuário |

🔒 = exige `Authorization: Bearer <token>`.

---

## 🔐 Autenticação

### `POST /auth/register`

```json
{ "name": "Fulano de Tal", "email": "fulano@exemplo.com", "password": "senha123" }
```

A senha tem **mínimo de 6 caracteres** (validado por Pydantic). Resposta `201`:

```json
{ "id": 1, "name": "Fulano de Tal", "email": "fulano@exemplo.com", "created_at": "2026-09-13T20:00:00" }
```

| Código | Quando |
|---|---|
| `201` | Conta criada |
| `409` | E-mail já cadastrado |
| `422` | Senha curta demais ou e-mail inválido |

### `POST /auth/login`

```json
{ "email": "fulano@exemplo.com", "password": "senha123" }
```

Resposta `200` com o token e o usuário:

```json
{ "access_token": "eyJhbGciOi...", "token_type": "bearer",
  "user": { "id": 1, "name": "Fulano de Tal", "email": "fulano@exemplo.com" } }
```

O token é um JWT HS256 com `sub` (e-mail), `user_id` e `exp` (24 horas).

### `GET /auth/me`

Devolve o usuário autenticado. `401` se o token estiver ausente, expirado ou inválido.

### `PUT /auth/me`

Todos os campos são opcionais — envie só o que mudou:

```json
{ "name": "Novo Nome", "email": "novo@exemplo.com", "password": "novasenha" }
```

Como o e-mail faz parte do payload do JWT, a resposta **reemite o token**; o front-end
precisa substituir o que está guardado:

```json
{ "access_token": "novo.token.aqui", "token_type": "bearer", "user": { "...": "..." } }
```

`409` se o novo e-mail já pertencer a outra conta.

### `POST /auth/esqueci-senha`

```json
{ "email": "fulano@exemplo.com" }
```

Responde **sempre** `200` com a mesma mensagem, exista ou não a conta — senão o
formulário serviria para descobrir quais e-mails estão cadastrados:

```json
{ "detail": "Se existir uma conta com este e-mail, enviamos um link para redefinir a senha. Ele vale por 30 minutos." }
```

O link **nunca** volta na resposta. Se voltasse, bastaria saber o e-mail de alguém para
trocar a senha dessa pessoa. Ele é entregue:

- **por e-mail**, quando `SMTP_HOST` está configurado;
- **no terminal do back-end**, quando não está (desenvolvimento local).

Regras do link: vale 30 minutos, serve uma vez só, pedir um novo cancela os anteriores,
e no máximo 3 pedidos por conta a cada 15 minutos (o excedente é ignorado sem mudar a
resposta). No banco fica apenas o hash SHA-256 do token.

### `POST /auth/redefinir-senha`

```json
{ "token": "<token do link>", "nova_senha": "senhanova123" }
```

| Código | Quando |
|---|---|
| `200` | Senha trocada; todos os outros links pendentes da conta são cancelados |
| `400` | Link inválido, expirado, já usado ou cancelado — sem dizer qual dos quatro |
| `422` | Senha com menos de 6 caracteres (o link continua valendo) |

### Variáveis de ambiente do e-mail

| Variável | Padrão | Uso |
|---|---|---|
| `SMTP_HOST` | — | Servidor SMTP. Sem ela, o link vai para o terminal |
| `SMTP_PORT` | `587` | Porta (STARTTLS) |
| `SMTP_USER` / `SMTP_PASSWORD` | — | Credenciais do servidor |
| `SMTP_FROM` | `SMTP_USER` | Remetente |
| `FRONTEND_URL` | `http://localhost:5173` | Endereço usado para montar o link |

---

## 📚 Catálogo construtivo

### `GET /materiais?categoria=<opcional>`
Lista os materiais com densidade e propriedades físicas documentadas.

### `GET /materiais/{material_id}`
Detalhes de um material e suas variações dimensionais. `404` se não existir.

### `GET /sistemas?tipo_elemento=<parede|piso_laje>`
Lista os sistemas construtivos do catálogo.

### `GET /sistemas/{codigo}`
Composição em camadas, dados de ensaio e fontes rastreáveis. Ex.: `PAR-CER-014`.

### `POST /sistemas/montar`
Monta uma composição personalizada e devolve espessura total, massa superficial e — se
houver correspondência exata no catálogo — o ensaio documentado.

```json
{ "camadas": [ { "material_id": 3, "espessura": 0.14 }, { "material_id": 1, "espessura": 0.015 } ] }
```

`422` se nenhuma camada for informada ou se as propriedades não puderem ser resolvidas.

---

## 🧮 Cálculo acústico

### `GET /acustica/cenarios`
Retorna a tabela de cenários da NBR 15575 com os limites mínimo, intermediário e
superior de cada um — é o que alimenta o seletor "Exigência legal" da calculadora.

### `POST /acustica/calcular`

```json
{
  "tipo_analise": "aereo",
  "cenario": "parede_entre_unidades",
  "ambiente_receptor_tipo": "dormitorio",
  "sistema_codigo": "PAR-CER-014",
  "area_elemento": 15,
  "volume_receptor": 36,
  "reverberacao": 0.6,
  "l1": 85
}
```

Campos principais:

| Campo | Obrigatório | Observação |
|---|:---:|---|
| `tipo_analise` | sim | `aereo` ou `impacto` |
| `cenario` | sim | Eixo da **exigência legal** (NBR 15575) |
| `ambiente_receptor_tipo` | não | Eixo do **conforto** (NBR 10152); independente do cenário |
| `area_elemento`, `volume_receptor`, `reverberacao` | sim | Geometria do ambiente receptor |
| `sistema_codigo` / `sistema_id` / `camadas` | um deles | Como o elemento é descrito |
| `l1`, `l2` | não | Medição in situ de ruído aéreo |
| `reducao_sonora` | não | Valor de $R$ conhecido pelo usuário |
| `nivel_impacto` / `li` | não | Medição com máquina de impacto |

A resposta traz o indicador principal, o julgamento da NBR 15575, a leitura de conforto
da NBR 10152, a avaliação de reverberação, as sugestões, a composição, as fontes, as
limitações e o rótulo de confiabilidade. Quando nenhum caminho de cálculo é confiável, o
motor devolve `indicador_principal: null` com o motivo — **não** um número inventado.

`422` com `detail` explicando o problema quando: o `sistema_codigo` não existe, algum
valor está fora das faixas físicas aceitas (S ≤ 500 m², V ≤ 10 000 m³, T entre 0,1 e 5 s,
R ≤ 80 dB, níveis entre 20 e 140 dB) ou `L2 > L1`.

### `POST /acustica/salvar` 🔒
Grava `tipo_analise`, `dados_entrada` e `resultado` no histórico do usuário.

### `GET /acustica/simulacoes` 🔒
Lista as simulações salvas, da mais recente para a mais antiga.

---

## 🗄️ Banco de dados

SQLite em `backend/acoust.db` (ignorado pelo Git). Tabelas: `users`, `simulacoes`,
`materiais`, `variacoes_material`, `sistemas_construtivos`, `camadas_sistema`,
`dados_acusticos` e `dados_frequencia`.

Popule o catálogo com:

```bash
python backend/seed.py
```

---

## 🛡️ Segurança

- Senhas com hash **bcrypt** — nunca em texto puro.
- Sessão por **JWT HS256**, validade de 24 horas.
- Recuperação de senha por link de uso único, com só o hash guardado no banco.
- CORS liberado para o dev server do Vite.
- Rotas de histórico e de conta filtram sempre pelo usuário do token.
