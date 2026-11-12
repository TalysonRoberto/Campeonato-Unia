# CLAUDE.md — Protocolo do Cofre de Contexto

> Instruções para o **Claude Code** operar neste cofre Obsidian.
> Este cofre **não é documentação decorativa**: ele é uma **camada de contexto comprimida** cujo objetivo único é **economizar tokens**. Você lê o cofre (denso, resumido, navegável) em vez de reler o código-fonte (verboso, caro) a cada sessão.

---

## 🎯 A regra que explica todas as outras

> **Antes de abrir código-fonte, pergunte: "isso já está numa nota `status: ativo`?"**
> Se sim, use a nota. Só vá ao código quando a nota não bastar — e, quando isso acontecer, **atualize a nota** para que a próxima sessão não pague o mesmo custo.

Isso é **economia composta**: cada vez que você lê código caro, o conhecimento volta pro cofre como nota barata. Com o tempo, o cofre absorve o entendimento do projeto e as sessões ficam progressivamente mais baratas.

---

## 🔑 Protocolo de leitura (divulgação progressiva)

Sempre suba a "escada de custo" do degrau mais barato pro mais caro, parando assim que tiver o suficiente:

1. **`00 - Contexto/_INDICE.md`** — o mapa. **Leia isto primeiro, toda sessão.** Ele diz onde mora cada coisa.
2. **TL;DRs** — todo nota começa com um callout `> [!tldr]`. Leia só o TL;DR. Muitas vezes basta.
3. **Nota inteira** — só se o TL;DR não responder.
4. **Arquivos em `fonte:`** — o frontmatter de cada nota lista os arquivos de código que ela resume. Só abra o código real se a nota estiver incompleta ou `desatualizado`.
5. **Busca/grep no código** — último recurso. Se chegou aqui, a nota correspondente provavelmente precisa ser criada ou atualizada.

❌ **Não comece uma tarefa grepando o repositório inteiro.** Comece pelo `_INDICE.md`.

---

## ✍️ Protocolo de escrita (manter o cofre barato)

Quando você cria ou edita uma nota:

- **TL;DR obrigatório no topo**, ≤ 3 linhas, com a conclusão — não um teaser. Quem ler só o TL;DR tem que sair sabendo o essencial.
- **Densidade > completude.** Resuma, não transcreva. Uma nota que reproduz 200 linhas de código não economiza token nenhum. Aponte para o código em `fonte:` e descreva o que importa.
- **Frontmatter completo** (ver schema abaixo). Sem frontmatter, a nota some dos painéis Bases e vira peso morto.
- **Marque o custo** em `tokens:` (`baixo`/`medio`/`alto`). Nota `alto` é candidata a ser quebrada em notas menores.
- **Atualize `atualizado:`** sempre que mexer no conteúdo.
- **Se leu código porque a nota estava desatualizada → conserte a nota** e volte `status: ativo`. Esse passo não é opcional; é o que faz o sistema funcionar.

---

## 🧱 Schema de frontmatter (todas as notas)

```yaml
---
tipo: contexto | arquitetura | banco | decisao | aprendizado | divida | template | meta
area: <slug-da-area-do-sistema>      # ex: auth, chat, billing, kanban
status: ativo | rascunho | desatualizado | arquivado
tokens: baixo | medio | alto         # custo aproximado de ler a nota inteira
fonte:                               # arquivos/globs de código que esta nota resume
  - src/auth/login.ts
atualizado: 2026-06-13               # AAAA-MM-DD
tags: []
---
```

Campos extras por tipo:

| `tipo` | Campos adicionais |
|---|---|
| `arquitetura` | `camada: frontend \| backend \| fullstack \| infra` |
| `decisao` (ADR) | `decisao: proposta \| aceita \| substituída \| descontinuada` · `data: AAAA-MM-DD` |
| `divida` | `prioridade: alta \| media \| baixa` · `esforco: P \| M \| G` · `situacao: aberta \| mitigando \| resolvida \| aceita` |

> `status` é sempre o estado **da nota** (está atual?). `decisao` e `situacao` são o estado **do conteúdo** (a decisão/dívida em si). Não confunda os dois.

---

## 🗂️ Onde cada coisa mora (estrutura enxuta)

| Pasta | O que vai aqui | `tipo` |
|---|---|---|
| `00 - Contexto/` | Mapa de contexto, visão geral, glossário. Ponto de entrada. | `contexto` |
| `01 - Arquitetura/` | Componentes, módulos, endpoints e fluxos — resumidos, com `fonte:`. Flat; fatiado por `camada` + `area`. | `arquitetura` |
| `02 - Banco de Dados/` | Tabelas e schema, descritos de forma densa. | `banco` |
| `03 - Decisões/` | ADRs — por que as coisas são como são. | `decisao` |
| `04 - Aprendizados/<ano>/` | Gotchas, bugs instrutivos, descobertas não-óbvias. Evita re-descoberta cara. | `aprendizado` |
| `05 - Dívidas Técnicas/` | Débito conhecido e adiado. Para você **não re-analisar** algo que já se sabe quebrado/provisório. | `divida` |
| `09 - Templates/` | Modelos de nota. Copie, preencha, remova o que sobrar. | `template` |
| `10 - Meta/` | O padrão do cofre e como usá-lo. | `meta` |

Convenção de nomes de arquivo: `kebab-case.md` (ou `PascalCase.md` para componentes). **Sem espaços** em nomes de arquivo. Pastas podem ter espaços (ex.: `05 - Dívidas Técnicas`).

---

## 🔗 Linkagem (wiki-links)

- Use `[[nome-do-arquivo]]` (sem `.md`) — navegação bidirecional e grafo.
- Nota de **arquitetura/banco** deve linkar as **decisões** e **dívidas** que a afetam.
- **Aprendizado** e **dívida** devem linkar a nota/arquitetura/incidente de origem.
- Linke generosamente: um `[[link]]` para nota que ainda não existe é um marcador do que falta escrever, não um erro.

---

## 📊 Painéis dinâmicos (Bases, nativo — sem plugin)

`00 - Contexto/Painel.base` mantém, **automaticamente**, as visões que importam:
- **Revisar (desatualizadas)** — notas `status: desatualizado`. Comece o trabalho por aqui.
- **Dívidas abertas** — `tipo: divida` e `situacao != resolvida`, por prioridade.
- **Aprendizados** e **Tudo por área**.

Você não mantém esses índices à mão — eles se atualizam pelo frontmatter. Por isso **frontmatter correto é inegociável**.

---

## 🚫 Não faça

- ❌ Reler o código inteiro quando há nota `ativo` cobrindo o assunto.
- ❌ Criar nota sem frontmatter ou sem TL;DR.
- ❌ Copiar blocos grandes de código pra dentro da nota (não economiza token; aponte em `fonte:`).
- ❌ Ler código por causa de nota `desatualizado` e **não** consertar a nota depois.
- ❌ Inventar decisões/arquitetura que você não confirmou no código ou com o autor.
- ❌ Duplicar conteúdo entre notas — use wiki-links.
- ❌ Commitar segredos (tokens, senhas, `.env`, URLs com credenciais).
- ❌ Criar pastas fora da estrutura `00–10`.

---

## ⚙️ Se este cofre estiver versionado em Git

Nem todo clone deste template fica num repositório. **Só** rode comandos Git se houver um `.git` na raiz:

```bash
git pull --rebase        # antes de editar
# ... criar/editar notas ...
git pull --rebase
git add .
git commit -m "docs(contexto): <o que mudou>"
git push
```

Convenção de commit: `docs(<area>): <verbo no infinitivo>` — ex.: `docs(arquitetura): resume módulo de auth`. Sem `--force` nem `--no-verify` sem ordem explícita.

---

## 🧹 Ao clonar este template para um projeto novo

1. Apague todas as notas marcadas **`EXEMPLO`** (em `01`, `02`, `04`, `05`).
2. Preencha `00 - Contexto/visao-geral.md` e `00 - Contexto/glossario.md` com o projeto real.
3. Aponte os `fonte:` para os caminhos reais do código.
4. Mantenha `03 - Decisões/ADR-001-...` como referência de formato (ou adapte).
