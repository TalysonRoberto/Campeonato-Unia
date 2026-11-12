---
tipo: arquitetura
area: auth
camada: backend
status: ativo
tokens: baixo
fonte:
  - src/auth/login.ts
  - supabase/functions/post-auth-login/index.ts
atualizado: 2026-06-13
tags: [exemplo]
---

> [!example] EXEMPLO — apague ao clonar o template
> Nota fictícia que demonstra o formato de uma nota de arquitetura e alimenta os painéis Bases.

> [!tldr] TL;DR
> Endpoint de login: valida credenciais, emite JWT e grava o último acesso. Idempotente; rate-limit de 5/min por IP. Não cria usuário — isso é responsabilidade do fluxo de signup.

# Login (exemplo)

## Responsabilidade
Autenticar um usuário existente e devolver um token de sessão. **Não** faz cadastro nem reset de senha.

## Como funciona (essencial)
1. Recebe `{ email, senha }`.
2. Busca o usuário (ver [[exemplo-tabela-users]]), compara o hash.
3. Em sucesso, emite JWT e atualiza `last_login_at`.
4. Em falha, retorna 401 genérico (sem vazar se o e-mail existe).

## Interface / contrato
- **Entrada:** `POST { email: string, senha: string }`
- **Saída:** `200 { token, user }` · `401 { error }` · `429` (rate-limit)

## Dependências e relações
- Tabela: [[exemplo-tabela-users]]
- Dívida conhecida: [[exemplo-validacao-fragil]]

## Gotchas
- O 401 é intencionalmente genérico — ver aprendizado [[2026-06-13-exemplo-enumeracao-de-email]].
