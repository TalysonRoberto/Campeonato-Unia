---
tipo: contexto
area: projeto
status: ativo
tokens: baixo
fonte:
  - README.md
  - package.json
  - app/layout.tsx
atualizado: 2026-11-03
tags: [overview, stack, campeonato-unia]
---

> [!tldr] TL;DR
> **Campeonato Unia** é um sistema web em Next.js para acompanhar partidas personalizadas de VALORANT entre amigos. Tem uma landing page pública (classificação, agenda, playoffs, histórico/transmissões) e um painel administrativo para cadastrar times, controlar partidas e registrar resultados. Stack: Next.js 16 + React 19 + TypeScript, API Routes, persistência em `data/dados.json`, Tailwind CSS.

# Visão Geral do Projeto

> [!info] Esta é a nota mais lida do cofre. Mantenha-a densa e atual — ela substitui "ler o repositório pra entender o projeto".

## O que é
Sistema de gerenciamento de torneio interno de VALORANT. Permite:
- Cadastrar times com nome, jogadores e logo.
- Agendar partidas (fase de grupos e playoffs) com link de transmissão do YouTube.
- Registrar resultados manualmente (placar MD3).
- Calcular classificação por pontos corridos (vitória = 50 pts).
- Gerar chaveamento de playoffs dinamicamente conforme a quantidade de times.

## Stack
| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript, Tailwind CSS |
| Backend | API Routes do Next.js |
| Banco/Persistência | Arquivo JSON (`data/dados.json`) |
| Infra/Deploy | Local / qualquer host Node.js |

## Como rodar (dev)
```bash
npm install
npm run dev
# Acesse http://localhost:3000 (público) e http://localhost:3000/admin (admin)
```

## Estrutura do código (alto nível)
> Mapa curto repo → área. Aponte para as notas de [[01 - Arquitetura]] em vez de descrever tudo aqui.

- `app/page.tsx` → Landing page pública (Server Component). Ver [[campeonato-unia]].
- `app/admin/page.tsx` → Painel administrativo (Client Component, senha: `unia2026`).
- `app/api/**/route.ts` → API Routes do Next.js.
- `lib/data.ts` → Tipos e funções de persistência JSON. Ver [[dados-json]].
- `data/dados.json` → Persistência de times, partidas e configurações.
- `opencode.json` → Configuração do OpenCode incluindo servidor MCP `kit-mcp`.

## Decisões e dívidas que moldam o projeto
- Decisões: ver [[03 - Decisões]] ([[ADR-001-cofre-de-contexto]], [[ADR-002-stack-campeonato-unia]])
- Dívidas: ver painel em [[_INDICE]]
