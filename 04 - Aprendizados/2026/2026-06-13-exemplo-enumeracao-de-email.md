---
tipo: aprendizado
area: auth
status: ativo
tokens: baixo
fonte:
  - src/auth/login.ts
atualizado: 2026-06-13
tags: [exemplo, seguranca, gotcha]
---

> [!example] EXEMPLO — apague ao clonar o template
> Aprendizado fictício que demonstra o formato e alimenta o painel.

> [!tldr] TL;DR
> **Nunca** diferencie "e-mail não existe" de "senha errada" na resposta de login — isso permite enumeração de e-mails. Sempre retorne um 401 genérico.

# 2026-06-13 — Enumeração de e-mail no login (exemplo)

## O que aconteceu
Mensagens de erro distintas ("usuário não encontrado" vs "senha incorreta") deixavam um atacante mapear quais e-mails têm conta.

## Causa raiz
A resposta vazava a existência do registro antes mesmo da checagem de senha.

## Como resolver / evitar
Resposta única e genérica para qualquer falha de autenticação; mesmo tempo de resposta quando possível (comparar hash mesmo se o usuário não existe).

## Relacionado
- Origem: [[exemplo-auth-login]]
