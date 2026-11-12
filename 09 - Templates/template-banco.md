---
tipo: banco
area: <slug-da-area>
status: ativo
tokens: baixo
fonte:
  - supabase/migrations/<arquivo>.sql
atualizado: <AAAA-MM-DD>
tags: [schema]
---

> [!tldr] TL;DR
> <2–3 linhas: o que esta tabela guarda e seu papel no domínio.>

# Tabela: `<nome_da_tabela>`

## Colunas (essenciais)
| Coluna | Tipo | Nota |
|---|---|---|
| `id` | uuid | PK |
| TODO | TODO | TODO |

> Liste o que importa para entender o modelo — não precisa replicar o DDL inteiro; aponte o `fonte:`.

## Relações
- FK → [[outra-tabela]]
- Referenciada por: [[outra-tabela]]

## Índices / constraints relevantes
<Só os que mudam decisões de query/performance.>

## Observações
<RLS, triggers, soft-delete, enums. Gotchas viram [[04 - Aprendizados]].>
