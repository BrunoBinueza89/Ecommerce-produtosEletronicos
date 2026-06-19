# Ecommerce-produtosEletronicos

## Rodando localmente

Este repositório contém um workspace com 3 aplicações:

- `backendAPI-shopMax`: API Node.js + Express + MySQL
- `frontEnd-shopMax`: storefront do e-commerce em Vite
- `frontEnd-adminPanel`: painel administrativo em Vite

## Pré-requisitos

- `Node.js` 20+
- `npm` 10+
- `MySQL` 8+ rodando localmente

## Estrutura do workspace

Na raiz do projeto existe um `package.json` com `workspaces`, então a instalação das dependências é feita uma única vez na raiz.

## 1. Instalar dependências

Na raiz do projeto:

```powershell
npm install
```

## 2. Criar o arquivo `.env`

O backend lê variáveis a partir de um arquivo `.env` na raiz do repositório, não dentro de `backendAPI-shopMax`.

Crie o arquivo `.env` na raiz com base em `backendAPI-shopMax/.env.example`.

Exemplo mínimo:

```env
PORT=3000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=shopmax
DB_USER=root
DB_PASSWORD=
JWT_SECRET=change-me
TOKEN_EXPIRES_IN=8h
DEFAULT_ADMIN_NAME=ShopMax Root
DEFAULT_ADMIN_EMAIL=admin@shopmax.local
DEFAULT_ADMIN_PASSWORD=Admin@123
CART_ABANDONED_HOURS=24
EMAIL_PROVIDER=simulated
SMTP_FROM=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_TIMEOUT_MS=5000
EMAIL_RETRY_ATTEMPTS=2
INTEGRATIONS_LIVE_ENABLED=false
INTEGRATION_SANDBOX_ENABLED=true
TRACKING_PROVIDER=mock
TRACKING_BASE_URL=
TRACKING_API_TOKEN=
TRACKING_TIMEOUT_MS=5000
TRACKING_RETRY_ATTEMPTS=2
```

## 3. Criar banco e popular dados

Com o MySQL já em execução:

```powershell
npm run db:create --workspace backendAPI-shopMax
npm run db:migrate --workspace backendAPI-shopMax
npm run db:seed --workspace backendAPI-shopMax
```

Se quiser dados extras para testes manuais:

```powershell
npm run db:seed:fake --workspace backendAPI-shopMax
```

Se precisar recriar tudo do zero:

```powershell
npm run db:reset --workspace backendAPI-shopMax
```

## 4. Subir as aplicações

Abra 3 terminais na raiz do projeto.

### Terminal 1 - API

```powershell
npm run dev:api
```

API esperada em:

- `http://127.0.0.1:3000`
- healthcheck: `http://127.0.0.1:3000/api/health`

### Terminal 2 - Loja

```powershell
npm run dev:shop
```

Por padrão, o frontend usa a API em:

- `http://127.0.0.1:3000/api`

Se quiser apontar para outra URL, defina `VITE_API_BASE_URL`.

Exemplo:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:3000/api"
npm run dev:shop
```

### Terminal 3 - Admin

```powershell
npm run dev:admin
```

O painel admin também usa `VITE_API_BASE_URL` se você quiser sobrescrever a API.

## 5. Acessos principais

Depois de subir tudo:

- Loja: URL exibida pelo Vite no terminal do `frontEnd-shopMax`
- Admin: URL exibida pelo Vite no terminal do `frontEnd-adminPanel`
- API health: `http://127.0.0.1:3000/api/health`

Credencial administrativa padrão do seed base:

- usuário: `admin@shopmax.local`
- senha: `Admin@123`

## 6. Validar se o ambiente está saudável

Na raiz:

```powershell
npm run test:all
npm run lint:all
```

Builds dos frontends:

```powershell
npm run build --workspace frontEnd-shopMax
npm run build --workspace frontEnd-adminPanel
```

## Scripts úteis

### Workspace

```powershell
npm run dev:api
npm run dev:shop
npm run dev:admin
npm run test:all
npm run lint:all
npm run test:e2e:browser
```

### Backend

```powershell
npm run start --workspace backendAPI-shopMax
npm run test --workspace backendAPI-shopMax
npm run db:create --workspace backendAPI-shopMax
npm run db:migrate --workspace backendAPI-shopMax
npm run db:seed --workspace backendAPI-shopMax
npm run db:seed:fake --workspace backendAPI-shopMax
npm run db:reset --workspace backendAPI-shopMax
```

## Problemas comuns

### Erro de conexão com MySQL

Revise no `.env`:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

### API sobe, mas frontends não carregam dados

Verifique:

- se a API está respondendo em `http://127.0.0.1:3000/api/health`
- se `VITE_API_BASE_URL` está apontando para a API correta

### Login admin não funciona

Rode novamente o seed base:

```powershell
npm run db:seed --workspace backendAPI-shopMax
```

Ou recrie tudo:

```powershell
npm run db:reset --workspace backendAPI-shopMax
```

## Fluxo recomendado para primeiro setup

```powershell
npm install
Copy-Item backendAPI-shopMax\\.env.example .env
npm run db:create --workspace backendAPI-shopMax
npm run db:migrate --workspace backendAPI-shopMax
npm run db:seed --workspace backendAPI-shopMax
npm run dev:api
```

Em outros dois terminais:

```powershell
npm run dev:shop
```

```powershell
npm run dev:admin
```
