---
tipo: meta
area: cofre
status: ativo
tokens: baixo
fonte: []
atualizado: 2026-06-13
tags: [meta, fluxo, claude]
---

> [!tldr] TL;DR
> Fluxo prático de cada sessão: o agente lê [[_INDICE]] → resolve pela nota mais barata que basta → só vai ao código quando preciso → ao terminar, atualiza/cria notas (arquitetura, aprendizado, dívida). O protocolo formal está em [[CLAUDE]].

# Como usar este cofre com o Claude Code

## No começo da sessão
1. Aponte o Claude Code para a pasta do projeto **e** para este cofre (ou tenha o cofre dentro do projeto).
2. O agente lê o [[CLAUDE]] da raiz e o [[_INDICE]] automaticamente.
3. Para uma tarefa específica, peça: _"antes de mexer, leia as notas relevantes do cofre"_.

## Durante a tarefa (escada de custo)
| Degrau | Quando parar aqui |
|---|---|
| TL;DR da nota | A resposta já está nas 3 linhas |
| Nota inteira | Precisa de detalhe, mas a nota cobre |
| Arquivos em `fonte:` | A nota não basta ou está `desatualizado` |
| Grep no código | Não existe nota — **crie uma depois** |

## Ao terminar (devolver ao cofre)
Pergunte ao agente para fechar o ciclo:
- Mudou comportamento de um módulo? → atualize a nota em [[01 - Arquitetura]] e o `atualizado:`.
- Teve que ler código porque a nota faltava/estava velha? → crie/conserte a nota e volte `status: ativo`.
- Descobriu um gotcha? → nota em [[04 - Aprendizados]].
- Deixou algo provisório? → registre em [[05 - Dívidas Técnicas]].

## Frases úteis para o agente
- "Atualize o cofre com o que aprendeu nesta tarefa."
- "Esta nota está desatualizada? Marque `status: desatualizado` e diga por quê."
- "Antes de grepar, há nota cobrindo isso no cofre?"

## Sinais de que o cofre está saudável
- O painel **Revisar (desatualizadas)** fica curto.
- Tarefas novas raramente exigem grep amplo no código.
- Dívidas e aprendizados crescem em vez de serem re-descobertos.
