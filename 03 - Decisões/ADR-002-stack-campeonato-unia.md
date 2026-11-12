---
tipo: decisao
area: campeonato
status: ativo
tokens: baixo
fonte: []
decisao: aceita
data: 2026-11-03
atualizado: 2026-11-03
tags: [adr, stack, valorant, nextjs]
---

> [!tldr] TL;DR
> Reformulamos o sistema para Next.js 16 + React 19 + TypeScript, mantendo a persistência em JSON. A escolha prioriza uma base moderna, SSR na landing page e SPA-like no admin, sem abrir mão da simplicidade do armazenamento em arquivo.

# ADR-002 — Stack do Campeonato Unia

## Contexto
O sistema nasceu como Node.js + Express + HTML estático. O usuário pediu para reformular em Next.js, aproveitando o ecossistema React moderno.

## Decisão
- **Framework:** Next.js 16 com App Router.
- **Frontend:** React 19, TypeScript, Tailwind CSS.
- **Backend:** API Routes do Next.js (`app/api/**/route.ts`).
- **Persistência:** arquivo JSON (`data/dados.json`), sem banco de dados.
- **Renderização:**
  - Landing page como Server Component (`app/page.tsx`) para SSR dos dados.
  - Painel admin como Client Component (`app/admin/page.tsx`) para interatividade.

## Alternativas consideradas
- **Manter Express + HTML:** funcionava, mas perdia benefícios de componentização e SSR.
- **Next.js Pages Router:** mais maduro, mas App Router é o caminho atual do framework.
- **Adicionar banco de dados (SQLite/Postgres):** overkill para volume baixo e operação single-user.

## Consequências
- ✅ Base moderna e escalável com React/TypeScript.
- ✅ Landing page com SSR e dados sempre atualizados.
- ✅ Componentização facilita manutenção futura.
- ⚠️ Overhead maior que uma página estática simples.
- ⚠️ Login admin continua client-side com senha hardcoded — não seguro para ambiente público.
- ⚠️ Integração com API do VALORANT (HenrikDev/Riot) não implementada; entrada de resultados é manual.

## Relacionado
- Arquitetura: [[campeonato-unia]]
- Persistência: [[dados-json]]
