---
tipo: contexto
area: cofre
status: ativo
tokens: baixo
fonte: []
atualizado: 2026-06-13
tags: [indice, mapa, entrypoint]
---

> [!tldr] TL;DR
> **Ponto de entrada do cofre. Leia esta nota antes de qualquer tarefa.** Ela mapeia onde mora cada coisa, para você não grepar o código à toa. Suba a escada de custo: TL;DR → nota → `fonte:` (código). Use a nota antes do código; se a nota estiver desatualizada, conserte-a.

# 🗺️ Mapa de Contexto

Este é o índice mestre do cofre. O protocolo completo de uso está em [[CLAUDE]] (raiz) e [[como-usar-com-claude]].

## Por onde começar
- 📌 **Visão geral do projeto** → [[visao-geral]] (stack, propósito, como rodar)
- 📖 **Glossário do domínio** → [[glossario]] (termos que não vale reexplicar toda hora)
- 🧭 **O padrão deste cofre** → [[padrao-do-cofre]]

## Mapa por área
> - **projeto/visão geral** → [[visao-geral]]
> - **campeonato/arquitetura** → [[campeonato-unia]] · decisões: [[ADR-002-stack-campeonato-unia]]
> - **campeonato/persistência** → [[dados-json]]
> - **cofre/processos** → [[CLAUDE]] · decisões: [[ADR-001-cofre-de-contexto]]

---

## 📊 Painéis dinâmicos

As tabelas abaixo se atualizam sozinhas a partir do frontmatter das notas (recurso **Bases**, nativo — sem plugin). Painel completo e openável: [[Painel.base|Abrir Painel]].

### 🔴 Revisar primeiro (notas desatualizadas)
```base
filters:
  and:
    - 'status == "desatualizado"'
views:
  - type: table
    name: "Desatualizadas"
    order:
      - file.name
      - area
      - atualizado
```

### 💸 Dívidas técnicas abertas
```base
filters:
  and:
    - 'tipo == "divida"'
    - 'situacao != "resolvida"'
views:
  - type: table
    name: "Dívidas abertas"
    order:
      - prioridade
      - file.name
      - esforco
```
