# Deploy do backend (produção)

Roteiro completo para colocar a API no ar. Ordem: Neon (banco) →
Railway ou Render (API) → Vercel (site apontando pra API).

## 1. Banco — Neon (grátis)

1. Crie conta em https://neon.tech (pode entrar com GitHub)
2. Crie um projeto (região: escolha `AWS São Paulo (sa-east-1)` se disponível)
3. Copie a **connection string** (botão "Connect") — algo como:
   `postgresql://usuario:senha@ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require`

## 2. API — Railway (recomendado) ou Render

### Railway (https://railway.app)
1. Login com GitHub → "New Project" → "Deploy from GitHub repo" → escolha o repo `recoop-backend`
2. Em **Settings → Start Command**, coloque: `npm run start:prod`
   (isso aplica as migrations no banco e sobe o servidor)
3. Em **Variables**, adicione:
   - `DATABASE_URL` = a connection string do Neon
   - `JWT_SECRET` = um texto longo aleatório (pode gerar em https://generate-secret.vercel.app/32)
   - `JWT_EXPIRES_IN` = `8h`
   - `CORS_ORIGIN` = `http://localhost:3000,https://recoop-alpha.vercel.app`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` = seu login do /admin
4. Deploy. Ao final, em Settings → Networking → "Generate Domain" pra ganhar
   uma URL pública, ex.: `https://recoop-backend-production.up.railway.app`
5. **Seed (uma vez só):** na aba do serviço, abra o terminal/shell do Railway
   e rode `npm run seed` (cria o usuário admin e as 3 notícias iniciais)

### Render (alternativa, https://render.com)
1. "New" → "Web Service" → conecte o repo `recoop-backend`
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start:prod`
4. Adicione as mesmas variáveis de ambiente acima
5. Para o seed: use o "Shell" do serviço e rode `npm run seed`

## 3. Site — Vercel

No painel da Vercel, projeto `recoop`:
1. Settings → Environment Variables → adicione:
   - `NEXT_PUBLIC_API_URL` = `https://SUA-URL-DO-BACKEND/api`
     (a URL do Railway/Render, com `/api` no final)
2. Redeploy (Deployments → ⋯ → Redeploy)

Pronto: o blog do site passa a puxar as notícias da API, e
`https://recoop-alpha.vercel.app/admin` vira o painel de publicação.

## Teste rápido de que deu certo

- `https://SUA-URL-DO-BACKEND/api/news` no navegador → deve mostrar um JSON com as notícias
- `/admin` no site → login com o e-mail/senha que você definiu → criar uma notícia → Publicar → conferir no site

## Dicas

- Troque `ADMIN_PASSWORD` e `JWT_SECRET` por valores fortes ANTES do deploy.
- Se o navegador acusar erro de CORS no /admin, confira se a URL exata do site
  (com https, sem barra no final) está no `CORS_ORIGIN`.
- O plano free do Neon "hiberna" o banco após inatividade; a primeira
  requisição do dia pode demorar ~1s a mais. Normal.
