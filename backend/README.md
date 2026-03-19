# CHApp Backend

Backend inicial para autenticação com PostgreSQL + Prisma + JWT.

## Endpoints implementados

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (Bearer token)
- `GET /health`

## Requisitos

- Node 20+
- Docker (opcional, recomendado para PostgreSQL local)

## Setup

1. Copie `backend/.env.example` para `backend/.env`.
2. Gere um `JWT_SECRET` forte. Exemplo:
   - `openssl rand -hex 32`
2. Suba o banco:
   - `cd backend`
   - `docker compose up -d`
3. Instale dependências:
   - `npm install`
4. Gere client Prisma:
   - `npm run prisma:generate`
5. Crie esquema no banco:
   - `npm run prisma:push`
6. Inicie API:
   - `npm run dev`

API local padrão: `http://localhost:3333`

## JWT secret

Exemplo para gerar uma chave forte:

```bash
openssl rand -hex 32
```

Depois use o valor gerado em `backend/.env`:

```env
JWT_SECRET="seu-valor-gerado"
```

## Contrato de resposta (auth)

`POST /auth/login` e `POST /auth/register` retornam:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Nome",
    "email": "email@dominio.com",
    "updatedAt": "2026-03-18T00:00:00.000Z"
  }
}
```

## Cadastro atual

O backend aceita cadastro com `POST /auth/register`.

O app mobile agora tambem consegue criar conta pela tela de autenticacao, desde que `EXPO_PUBLIC_API_BASE_URL` esteja apontando para a API correta.
