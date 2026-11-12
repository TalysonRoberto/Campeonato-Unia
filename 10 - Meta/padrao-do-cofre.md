---
tipo: meta
area: cofre
status: ativo
tokens: medio
fonte: []
atualizado: 2026-06-13
tags: [meta, padrao, tokens]
---

> [!tldr] TL;DR
> Este cofre é uma **camada de contexto comprimida** para economizar tokens com LLMs. Estrutura enxuta (`00–10`), frontmatter padronizado, TL;DR obrigatório e painéis Bases dinâmicos. O agente lê o cofre antes do código e devolve aprendizado ao cofre — custo por sessão cai com o tempo.

# O Padrão do Cofre de Contexto

## Por que existe
Reler código é o maior custo recorrente em tokens ao trabalhar com LLMs. Decisão fundadora: [[ADR-001-cofre-de-contexto]].

## As 3 ideias centrais
1. **Divulgação progressiva** — escada de custo: `TL;DR → nota → fonte (código) → grep`. Pare no degrau mais barato que resolve.
2. **Nota antes de código** — info em nota `ativo` é canônica; só vá ao código se a nota faltar/estiver `desatualizado`.
3. **Economia composta** — leu código caro? Devolva como nota barata. A próxima sessão não paga de novo.

## Estrutura (enxuta, context-first)
| Pasta | Papel | `tipo` |
|---|---|---|
| `00 - Contexto/` | Entrada: mapa, visão geral, glossário, painéis | `contexto` |
| `01 - Arquitetura/` | Componentes/módulos/endpoints/fluxos (flat, por `camada`+`area`) | `arquitetura` |
| `02 - Banco de Dados/` | Tabelas e schema | `banco` |
| `03 - Decisões/` | ADRs | `decisao` |
| `04 - Aprendizados/<ano>/` | Gotchas e descobertas não-óbvias | `aprendizado` |
| `05 - Dívidas Técnicas/` | Débito conhecido e adiado | `divida` |
| `09 - Templates/` | Modelos de nota | `template` |
| `10 - Meta/` | Sobre o padrão | `meta` |

> Por que enxuto e não 00–10 completo (PRs, changelog, infra separados)? Cada pasta a mais é contexto a manter. Aqui o frontmatter (`area`, `camada`, `tipo`) faz o fatiamento que pastas profundas fariam — com menos custo de manutenção. PRs/changelog não são o objetivo; o objetivo é o **estado atual** do sistema.

## Por que existe a pasta de Dívidas Técnicas
Para o agente **não re-analisar** algo que já se sabe provisório/quebrado. Uma dívida documentada é mais barata que re-descobrir o problema toda sessão. As dívidas abertas aparecem automaticamente no painel de [[_INDICE]].

## Frontmatter e ciclo de vida
Schema completo em [[CLAUDE]]. Ciclo de uma nota:
`rascunho` → `ativo` → (código muda) `desatualizado` → (alguém conserta) `ativo` → (some do escopo) `arquivado`.

O painel **Revisar (desatualizadas)** existe justamente para drenar a fila de `desatualizado`.

## Ao clonar para um projeto novo
1. Apague as notas **`EXEMPLO`** (`01`, `02`, `04`, `05`).
2. Preencha [[visao-geral]] e [[glossario]].
3. Aponte os `fonte:` para os caminhos reais.
4. Comece a registrar arquitetura/decisões/dívidas conforme trabalha.

## Veja também
- [[como-usar-com-claude]] — protocolo operacional
- [[CLAUDE]] — regras para o agente
