---
tipo: divida
area: auth
status: ativo
tokens: baixo
fonte:
  - src/auth/login.ts
prioridade: media
esforco: P
situacao: aberta
atualizado: 2026-06-13
tags: [exemplo, divida-tecnica]
---

> [!example] EXEMPLO — apague ao clonar o template
> Dívida fictícia que demonstra o formato e alimenta o painel de dívidas abertas.

> [!tldr] TL;DR
> A validação de e-mail no login usa um regex frágil que aceita endereços inválidos. Provisório para não travar o MVP. Risco baixo-médio; troca por validação de biblioteca é esforço P.

# Validação de e-mail frágil no login (exemplo)

## O problema
O regex de e-mail em `login.ts` foi escrito às pressas e aceita formatos inválidos (ex.: `a@@b`). Mantido para entregar o MVP no prazo.

## Risco de não tratar
Dados sujos na tabela [[exemplo-tabela-users]] e divergência com a validação do frontend.

## Como pagar
Substituir por validação de biblioteca (ex.: `zod` no backend), alinhada com o frontend. Esforço **P**.

## Relacionado
- Afeta: [[exemplo-auth-login]], [[exemplo-tabela-users]]
