# Recoop API — Backend de notícias (NestJS + DDD)

API que alimenta o blog do site da Recoop. Feita em NestJS, seguindo
arquitetura DDD (Domain-Driven Design) em 4 camadas:

```
src/
  domain/          -> regras de negócio puras (entidades, value objects, interfaces de repositório)
                      Não conhece Prisma, HTTP nem nenhum detalhe técnico.
  application/      -> casos de uso (orquestram o domínio: criar notícia, publicar, etc.)
  infra/            -> detalhes técnicos: Prisma (banco), JWT/Passport (login),
                        módulos do Nest que conectam tudo
  interface/http/   -> controllers, DTOs de entrada (validação) e presenters de saída
```

Banco de dados: **SQLite** (arquivo local `dev.db`, não precisa instalar
nenhum servidor de banco). Se um dia precisar migrar para PostgreSQL,
basta trocar o `provider` no `prisma/schema.prisma` e a `DATABASE_URL`.

## 1. Instalar e configurar

```powershell
cd C:\Users\User\Projetos\recoop-backend
npm install
```

Copie `.env.example` para `.env` (já vem pronto no zip) e **troque**:
- `JWT_SECRET` — qualquer texto longo e aleatório
- `ADMIN_EMAIL` e `ADMIN_PASSWORD` — o login que você vai usar para entrar em `/admin`
- `CORS_ORIGIN` — endereço do site Next.js (`http://localhost:3000` em dev)

## 2. Criar o banco e o usuário admin

```powershell
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

O `seed` cria o usuário admin (com a senha do `.env`, já criptografada)
e 3 notícias de exemplo (as mesmas que já apareciam no blog do site),
já publicadas.

## 3. Rodar a API

```powershell
npm run start:dev
```

A API sobe em `http://localhost:3333/api`.

## Rotas disponíveis

### Públicas (usadas pelo blog do site)
- `GET /api/news` — lista notícias publicadas
- `GET /api/news/:slug` — uma notícia publicada específica

### Autenticação
- `POST /api/auth/login` — `{ "email": "...", "password": "..." }` → retorna `accessToken`
- `GET /api/auth/me` — checa se o token ainda é válido (requer header `Authorization: Bearer <token>`)

### Admin (todas exigem `Authorization: Bearer <token>`)
- `GET /api/admin/news` — lista TODAS as notícias (publicadas e rascunho)
- `POST /api/admin/news` — cria notícia (rascunho) — `{ title, tag, excerpt, content }`
- `PATCH /api/admin/news/:id` — edita campos (todos opcionais)
- `POST /api/admin/news/:id/publish` — publica (aparece no site)
- `POST /api/admin/news/:id/unpublish` — volta pra rascunho (some do site)
- `DELETE /api/admin/news/:id` — exclui

## Testando rápido pelo terminal

```powershell
# login
curl -X POST http://localhost:3333/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@recoop.com.br\",\"password\":\"troque-esta-senha-123\"}"

# criar notícia (troque SEU_TOKEN pelo accessToken retornado acima)
curl -X POST http://localhost:3333/api/admin/news -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d "{\"title\":\"Nova noticia de teste\",\"tag\":\"Geral\",\"excerpt\":\"Resumo curto\",\"content\":\"Texto completo da noticia\"}"
```

## Deploy

Pode subir esse backend na Railway, Render ou Fly.io (gratuitos para
projetos pequenos). Para produção de verdade, troque o SQLite por
PostgreSQL (a Railway já oferece um banco gerenciado). Depois é só
apontar `NEXT_PUBLIC_API_URL` no projeto Next.js para a URL pública
da API.

## Observação sobre o ambiente de desenvolvimento

Ao rodar `npx prisma generate` e `npx prisma migrate dev` pela
primeira vez, o Prisma baixa um pequeno binário (o "motor" do banco).
Isso precisa de acesso normal à internet — funciona sem problema no
seu PC.
