---
tipo: banco
area: auth
status: ativo
tokens: baixo
fonte:
  - supabase/migrations/0001_create_users.sql
atualizado: 2026-06-13
tags: [exemplo, schema]
---

> [!example] EXEMPLO — apague ao clonar o template
> Tabela fictícia que demonstra o formato de uma nota de banco.

> [!tldr] TL;DR
> Tabela `users`: identidade e credenciais. PK `id` (uuid). `email` é único. Senha guardada como hash (`password_hash`), nunca em texto. RLS liga cada linha ao próprio dono.

# Tabela: `users` (exemplo)

## Colunas (essenciais)
| Coluna | Tipo | Nota |
|---|---|---|
| `id` | uuid | PK |
| `email` | text | UNIQUE, lowercase |
| `password_hash` | text | bcrypt; nunca expor |
| `last_login_at` | timestamptz | atualizado por [[exemplo-auth-login]] |
| `created_at` | timestamptz | default now() |

## Relações
- Referenciada por: `sessions`, `profiles` (exemplos).

## Índices / constraints relevantes
- `UNIQUE(email)` — base da autenticação e da dívida [[exemplo-validacao-fragil]].

## Observações
- RLS ativa: `auth.uid() = id`. Soft-delete não implementado (ver dívidas).
