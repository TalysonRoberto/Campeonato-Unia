---
tipo: decisao
area: cofre
status: ativo
tokens: baixo
fonte: []
decisao: aceita
data: 2026-06-13
atualizado: 2026-06-13
tags: [adr, tokens, processo]
---

> [!tldr] TL;DR
> Adotamos um cofre Obsidian versionado como **camada de contexto comprimida** para reduzir o custo em tokens de trabalhar com LLMs sobre o projeto: o agente lê notas densas em vez de reler o código a cada sessão.

# ADR-001 — Adotar cofre de contexto para economia de token

## Contexto
Trabalhar com o Claude Code num projeto implica, a cada sessão, carregar contexto do código. Reler arquivos é o maior consumidor de tokens e se repete sessão após sessão, mesmo quando o entendimento não mudou.

## Decisão
Manter um cofre Obsidian (este template) com resumos densos de arquitetura, banco, decisões, aprendizados e dívidas. O protocolo em [[CLAUDE]] obriga o agente a: ler o cofre primeiro, subir a escada de custo (TL;DR → nota → código) e devolver ao cofre o que aprendeu ao ler código.

## Alternativas consideradas
- **Reler o código sempre** — simples, mas caro e repetitivo. Custo não cai com o tempo.
- **CLAUDE.md único e gigante** — não escala; vira nota monolítica `tokens: alto` que se lê inteira sempre.
- **Wiki/Notion separado** — perde a navegação por grafo, os wiki-links e fica fora do alcance do agente local.

## Consequências
- ✅ Custo por sessão cai conforme o cofre absorve o entendimento (economia composta).
- ✅ Onboarding (humano e agente) mais rápido.
- ⚠️ Exige disciplina: notas desatualizadas enganam. Mitigado pelo status `desatualizado` + painel de revisão.
- ⚠️ Custo de manutenção do cofre — aceito como menor que o custo recorrente de reler código.

## Relacionado
- Padrão completo: [[padrao-do-cofre]]
- Protocolo de uso: [[como-usar-com-claude]]
