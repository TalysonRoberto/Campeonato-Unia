---
tipo: banco
area: campeonato
status: ativo
tokens: baixo
fonte:
  - data/dados.json
  - server.js
atualizado: 2026-11-03
tags: [json, schema, persistencia]
---

> [!tldr] TL;DR
> Persistência em arquivo JSON (`data/dados.json`) com três coleções principais: `torneio`, `times` e `partidas`. O backend lê o arquivo inteiro, processa e sobrescreve. Sem schema relacional — estrutura validada manualmente nas rotas.

# Persistência: `data/dados.json`

## Estrutura
```json
{
  "torneio": {
    "nome": "Campeonato Unia",
    "faseAtual": "grupos",
    "status": "Em andamento",
    "dataInicio": null,
    "dataFim": null
  },
  "times": [],
  "partidas": [],
  "configuracoes": {
    "pontosVitoria": 50,
    "formatoJogos": "MD3"
  }
}
```

## Entidades

### `times`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Gerado automaticamente |
| `nome` | string | Nome do time |
| `jogadores` | string[] | Nicks/tags dos jogadores |
| `logo` | string | Caminho da imagem (`/img/times/...` ou `/img/logo.png`) |
| `vitorias` | number | Contador de vitórias |
| `derrotas` | number | Contador de derrotas |
| `pontos` | number | Pontos acumulados |

### `partidas`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Gerado automaticamente |
| `timeA`, `timeB` | string | IDs dos times |
| `data`, `horario` | string | Data e horário da partida |
| `transmissao` | string | Link do YouTube |
| `fase` | string | `grupos`, `semifinal`, `semifinal1`, `semifinal2`, `terceiro`, `final` |
| `status` | string | `agendada`, `ao_vivo`, `finalizada` |
| `placarA`, `placarB` | number | Placar da série MD3 |
| `vencedor` | string | ID do time vencedor |
| `mapas` | array | Mapas jogados (não implementado na UI) |
| `estatisticas` | object | Dados estatísticos/observações |

## Observações
- O arquivo é lido em toda requisição e sobrescrito em toda escrita.
- Uploads de logos vão para `public/img/times/` e o caminho relativo é salvo no JSON.
- Não há backup automático; recomendado versionar `data/dados.json` no git.
