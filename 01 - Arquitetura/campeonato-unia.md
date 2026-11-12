---
tipo: arquitetura
area: campeonato
status: ativo
tokens: medio
fonte:
  - app/page.tsx
  - app/admin/page.tsx
  - app/api/**/route.ts
  - lib/data.ts
camada: fullstack
atualizado: 2026-11-03
tags: [nextjs, app-router, api-routes, react]
---

> [!tldr] TL;DR
> Sistema em Next.js 16 com App Router. Landing page é um Server Component que busca dados no servidor. Painel admin é um Client Component com estado local e fetch para as API Routes. Regras de negócio ficam em `lib/data.ts` e são consumidas pelas rotas da API.

# Campeonato Unia — Arquitetura

## Camadas
```
┌─────────────────────────────────────┐
│         Landing Page (SSR)          │  app/page.tsx (Server Component)
├─────────────────────────────────────┤
│         Painel Admin (CSR)          │  app/admin/page.tsx (Client Component)
├─────────────────────────────────────┤
│           API Routes                │  app/api/**/route.ts
├─────────────────────────────────────┤
│    Regras + Persistência JSON       │  lib/data.ts + data/dados.json
└─────────────────────────────────────┘
```

## Rotas da API
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/torneio` | Configurações/status do torneio |
| PUT | `/api/torneio` | Atualiza torneio |
| GET/POST | `/api/times` | Lista / cria times (multipart para logo) |
| PUT/DELETE | `/api/times/[id]` | Atualiza / remove time |
| GET/POST | `/api/partidas` | Lista / cria partidas |
| PUT/DELETE | `/api/partidas/[id]` | Atualiza / remove partida |
| GET | `/api/classificacao` | Classificação calculada |
| GET | `/api/chaveamento` | Chaveamento de playoffs |
| POST | `/api/chaveamento/gerar` | Gera playoffs automaticamente |

## Regras de negócio
- **Pontuação:** vitória = 50 pts; derrota = 0 pts.
- **Classificação:** ordenada por pontos, depois vitórias, depois derrotas.
- **Playoffs dinâmicos:**
  - 4 times: 2º vs 3º na semifinal; 1º vai direto à final.
  - +4 times: 1º vs 3º e 2º vs 4º nas semifinais; final e disputa de 3º.

## Frontend
- **Público:** Server Component (`app/page.tsx`) com busca de dados em tempo de build/request.
- **Admin:** Client Component (`app/admin/page.tsx`) com React hooks, login client-side (senha fixa `unia2026`) e formulários que chamam as API Routes.

## Segurança
- Login do admin é apenas client-side (sessionStorage + senha hardcoded). Não é seguro para produção pública sem autenticação real.
- Upload de imagens limitado a tipos de imagem e salvo em `public/img/times/`.

## Gotchas
- A landing page usa `export const dynamic = 'force-dynamic'` para sempre buscar dados atualizados.
- O arquivo `data/dados.json` é lido/escrito a cada request; não há cache.
- A geração de playoffs remove partidas antigas de playoffs e cria novas.
