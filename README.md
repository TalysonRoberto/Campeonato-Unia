# 🏆 Campeonato Unia

Sistema web em **Next.js** para acompanhar partidas personalizadas de VALORANT entre amigos, com landing page pública e painel administrativo.

## ✨ Funcionalidades

- **Landing Page Pública**
  - Visualização dos times inscritos
  - Tabela de classificação com pontos corridos
  - Agenda de jogos
  - Chaveamento de playoffs
  - Histórico de partidas e transmissões do YouTube

- **Painel Administrativo**
  - Cadastro de times (nome, jogadores, logo)
  - Agendamento de partidas
  - Link de transmissão do YouTube
  - Registro manual de resultados (MD3)
  - Geração automática de playoffs
  - Controle de fase do torneio

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse:
- Landing page: http://localhost:3000
- Painel admin: http://localhost:3000/admin
  - Senha: `unia2026`

## 🛠️ Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** API Routes do Next.js
- **Persistência:** Arquivo JSON (`data/dados.json`)
- **Tema:** Inspirado no universo VALORANT

## 📁 Estrutura

```
├── app/
│   ├── layout.tsx              # Layout global com fontes
│   ├── globals.css             # Estilos globais e tema
│   ├── page.tsx                # Landing page pública
│   ├── admin/
│   │   └── page.tsx            # Painel administrativo
│   └── api/
│       ├── times/
│       │   ├── route.ts        # GET/POST times
│       │   └── [id]/
│       │       └── route.ts    # PUT/DELETE time
│       ├── partidas/
│       │   ├── route.ts        # GET/POST partidas
│       │   └── [id]/
│       │       └── route.ts    # PUT/DELETE partida
│       ├── classificacao/
│       │   └── route.ts        # Classificação calculada
│       ├── chaveamento/
│       │   └── route.ts        # Chaveamento e geração de playoffs
│       └── torneio/
│           └── route.ts        # Configurações do torneio
├── lib/
│   └── data.ts                 # Tipos e funções de persistência
├── data/
│   └── dados.json              # Banco de dados JSON
├── public/
│   └── img/
│       └── logo.png            # Logo do torneio
├── components/                 # Componentes React (futuro)
├── opencode.json               # Configuração do OpenCode
└── CLAUDE.md                   # Protocolo do cofre de contexto
```

## 📝 Licença

MIT
