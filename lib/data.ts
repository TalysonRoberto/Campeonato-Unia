import fs from 'fs';
import path from 'path';
import { connectToDatabase, hasDatabaseConnection } from './mongodb';
import TimeModel from '@/models/Time';
import PartidaModel from '@/models/Partida';
import TorneioModel from '@/models/Torneio';
import AdminModel from '@/models/Admin';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'dados.json');

function inicializarArquivoJson(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const dadosIniciais: Dados = {
      torneio: {
        nome: 'Campeonato Unia',
        faseAtual: 'grupos',
        status: 'Em andamento',
        dataInicio: null,
        dataFim: null
      },
      times: [],
      partidas: [],
      configuracoes: {
        pontosVitoria: 50,
        formatoJogos: 'MD3'
      }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(dadosIniciais, null, 2));
  }
}

function carregarDadosJson(): Dados {
  inicializarArquivoJson();
  const dados: Dados = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  dados.times.forEach(time => {
    if (!time.cor) time.cor = CORES_TIME[0].valor;
  });
  return dados;
}

function salvarDadosJson(dados: Dados): void {
  inicializarArquivoJson();
  fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2), 'utf8');
}

export interface Time {
  id: string;
  nome: string;
  jogadores: string[];
  logo: string;
  logoId?: string | null;
  cor: string;
  vitorias: number;
  derrotas: number;
  pontos: number;
  mapasGanhos: number;
  mapasPerdidos: number;
}

export interface Partida {
  id: string;
  timeA: string;
  timeB: string;
  data: string | null;
  horario: string | null;
  transmissao: string;
  fase: string;
  status: 'agendada' | 'ao_vivo' | 'finalizada';
  placarA: number;
  placarB: number;
  mapas: string[];
  estatisticas: any;
  vencedor: string | null;
}

export interface Torneio {
  nome: string;
  faseAtual: 'grupos' | 'playoffs';
  status: string;
  dataInicio: string | null;
  dataFim: string | null;
}

export interface Dados {
  torneio: Torneio;
  times: Time[];
  partidas: Partida[];
  configuracoes: {
    pontosVitoria: number;
    formatoJogos: string;
  };
}

export const CORES_TIME = [
  { nome: 'Teal', valor: '#14b8a6' },
  { nome: 'Roxo', valor: '#a855f7' },
  { nome: 'Amarelo', valor: '#facc15' },
  { nome: 'Verde', valor: '#22c55e' },
  { nome: 'Vermelho', valor: '#ef4444' },
  { nome: 'Azul', valor: '#3b82f6' },
  { nome: 'Laranja', valor: '#f97316' },
  { nome: 'Rosa', valor: '#ec4899' },
  { nome: 'Ciano', valor: '#06b6d4' },
  { nome: 'Índigo', valor: '#6366f1' },
  { nome: 'Lima', valor: '#84cc16' },
  { nome: 'Coral', valor: '#f43f5e' }
] as const;

function docToTime(doc: any): Time {
  return {
    id: doc._id.toString(),
    nome: doc.nome,
    jogadores: doc.jogadores || [],
    logo: doc.logo || '/img/logo.png',
    logoId: doc.logoId || null,
    cor: doc.cor || CORES_TIME[0].valor,
    vitorias: doc.vitorias || 0,
    derrotas: doc.derrotas || 0,
    pontos: doc.pontos || 0,
    mapasGanhos: doc.mapasGanhos || 0,
    mapasPerdidos: doc.mapasPerdidos || 0
  };
}

function docToPartida(doc: any): Partida {
  return {
    id: doc._id.toString(),
    timeA: doc.timeA,
    timeB: doc.timeB,
    data: doc.data || null,
    horario: doc.horario || null,
    transmissao: doc.transmissao || '',
    fase: doc.fase || 'grupos',
    status: doc.status || 'agendada',
    placarA: doc.placarA || 0,
    placarB: doc.placarB || 0,
    mapas: doc.mapas || [],
    estatisticas: doc.estatisticas || null,
    vencedor: doc.vencedor || null
  };
}

async function getTorneioDoc() {
  let torneio = await TorneioModel.findOne();
  if (!torneio) {
    torneio = await TorneioModel.create({
      nome: 'Campeonato Unia',
      faseAtual: 'grupos',
      status: 'Em andamento',
      dataInicio: null,
      dataFim: null,
      configuracoes: { pontosVitoria: 50, formatoJogos: 'MD3' }
    });
  }
  return torneio;
}

export async function carregarDados(): Promise<Dados> {
  if (!hasDatabaseConnection()) {
    return carregarDadosJson();
  }

  await connectToDatabase();

  const torneioDoc = await getTorneioDoc();
  const timesDocs = await TimeModel.find().lean();
  const partidasDocs = await PartidaModel.find().lean();

  return {
    torneio: {
      nome: torneioDoc.nome,
      faseAtual: torneioDoc.faseAtual,
      status: torneioDoc.status,
      dataInicio: torneioDoc.dataInicio,
      dataFim: torneioDoc.dataFim
    },
    times: timesDocs.map(docToTime),
    partidas: partidasDocs.map(docToPartida),
    configuracoes: torneioDoc.configuracoes || { pontosVitoria: 50, formatoJogos: 'MD3' }
  };
}

export async function salvarDados(dados: Dados): Promise<void> {
  if (!hasDatabaseConnection()) {
    salvarDadosJson(dados);
    return;
  }

  await connectToDatabase();

  const torneioDoc = await getTorneioDoc();
  torneioDoc.nome = dados.torneio.nome;
  torneioDoc.faseAtual = dados.torneio.faseAtual;
  torneioDoc.status = dados.torneio.status;
  torneioDoc.dataInicio = dados.torneio.dataInicio;
  torneioDoc.dataFim = dados.torneio.dataFim;
  torneioDoc.configuracoes = dados.configuracoes;
  await torneioDoc.save();
}

export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export async function atualizarEstatisticasTimes(dados?: Dados): Promise<void> {
  const data = dados || await carregarDados();

  for (const time of data.times) {
    time.vitorias = 0;
    time.derrotas = 0;
    time.pontos = 0;
    time.mapasGanhos = 0;
    time.mapasPerdidos = 0;
  }

  for (const partida of data.partidas) {
    if (partida.fase !== 'grupos' || partida.status !== 'finalizada' || !partida.vencedor) continue;

    const timeA = data.times.find(t => t.id === partida.timeA);
    const timeB = data.times.find(t => t.id === partida.timeB);
    if (!timeA || !timeB) continue;

    const pontosVitoria = data.configuracoes?.pontosVitoria || 50;

    const vencedor = data.times.find(t => t.id === partida.vencedor);
    const perdedor = partida.vencedor === partida.timeA ? timeB : timeA;

    if (vencedor) {
      vencedor.vitorias += 1;
      vencedor.pontos += pontosVitoria;
    }
    if (perdedor) {
      perdedor.derrotas += 1;
    }

    timeA.mapasGanhos += partida.placarA;
    timeA.mapasPerdidos += partida.placarB;
    timeB.mapasGanhos += partida.placarB;
    timeB.mapasPerdidos += partida.placarA;
  }

  // Persiste no banco ou no JSON
  if (hasDatabaseConnection()) {
    for (const time of data.times) {
      await TimeModel.findByIdAndUpdate(time.id, {
        vitorias: time.vitorias,
        derrotas: time.derrotas,
        pontos: time.pontos,
        mapasGanhos: time.mapasGanhos,
        mapasPerdidos: time.mapasPerdidos
      });
    }
  } else if (!dados) {
    salvarDadosJson(data);
  }
}

export async function getClassificacao(): Promise<(Time & { posicao: number; saldoMapas: number })[]> {
  const dados = await carregarDados();
  await atualizarEstatisticasTimes(dados);

  return dados.times
    .map(time => ({ ...time, saldoMapas: time.mapasGanhos - time.mapasPerdidos }))
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldoMapas !== a.saldoMapas) return b.saldoMapas - a.saldoMapas;
      if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
      return a.derrotas - b.derrotas;
    })
    .map((time, index) => ({ ...time, posicao: index + 1 }));
}

export function faseDeGruposFinalizada(dados: Dados): boolean {
  const partidasGrupos = dados.partidas.filter(p => p.fase === 'grupos');
  if (partidasGrupos.length === 0) return false;
  return partidasGrupos.every(p => p.status === 'finalizada');
}

export async function gerarPlayoffsSeNecessario(dados: Dados): Promise<boolean> {
  if (!faseDeGruposFinalizada(dados)) return false;
  if (dados.times.length < 4) return false;

  const partidasPlayoffs = dados.partidas.filter(p => p.fase !== 'grupos');
  if (partidasPlayoffs.length > 0) return false;

  await atualizarEstatisticasTimes(dados);

  const classificacao = [...dados.times].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    const saldoA = a.mapasGanhos - a.mapasPerdidos;
    const saldoB = b.mapasGanhos - b.mapasPerdidos;
    if (saldoB !== saldoA) return saldoB - saldoA;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    return a.derrotas - b.derrotas;
  });

  dados.torneio.faseAtual = 'playoffs';
  await salvarDados(dados);

  if (dados.times.length === 4) {
    await PartidaModel.create({
      timeA: classificacao[1].id,
      timeB: classificacao[2].id,
      data: null,
      horario: null,
      transmissao: '',
      fase: 'semifinal',
      status: 'agendada',
      placarA: 0,
      placarB: 0,
      mapas: [],
      estatisticas: null,
      vencedor: null
    });
  } else {
    await PartidaModel.create({
      timeA: classificacao[0].id,
      timeB: classificacao[2].id,
      data: null,
      horario: null,
      transmissao: '',
      fase: 'semifinal1',
      status: 'agendada',
      placarA: 0,
      placarB: 0,
      mapas: [],
      estatisticas: null,
      vencedor: null
    });
    await PartidaModel.create({
      timeA: classificacao[1].id,
      timeB: classificacao[3].id,
      data: null,
      horario: null,
      transmissao: '',
      fase: 'semifinal2',
      status: 'agendada',
      placarA: 0,
      placarB: 0,
      mapas: [],
      estatisticas: null,
      vencedor: null
    });
  }

  return true;
}

export async function gerarFinalEDisputaTerceiro(dados: Dados): Promise<boolean> {
  const partidasPlayoffs = dados.partidas.filter(p => p.fase !== 'grupos');

  const semifinal = partidasPlayoffs.find(p => p.fase === 'semifinal');
  if (semifinal && semifinal.status === 'finalizada' && semifinal.vencedor) {
    const finalExistente = partidasPlayoffs.find(p => p.fase === 'final');
    if (!finalExistente) {
      await atualizarEstatisticasTimes(dados);

      const classificacao = [...dados.times].sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        const saldoA = a.mapasGanhos - a.mapasPerdidos;
        const saldoB = b.mapasGanhos - b.mapasPerdidos;
        if (saldoB !== saldoA) return saldoB - saldoA;
        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
        return a.derrotas - b.derrotas;
      });

      await PartidaModel.create({
        timeA: classificacao[0].id,
        timeB: semifinal.vencedor,
        data: null,
        horario: null,
        transmissao: '',
        fase: 'final',
        status: 'agendada',
        placarA: 0,
        placarB: 0,
        mapas: [],
        estatisticas: null,
        vencedor: null
      });
      return true;
    }
  }

  const sf1 = partidasPlayoffs.find(p => p.fase === 'semifinal1');
  const sf2 = partidasPlayoffs.find(p => p.fase === 'semifinal2');

  if (sf1?.status === 'finalizada' && sf1.vencedor &&
      sf2?.status === 'finalizada' && sf2.vencedor) {
    const finalExistente = partidasPlayoffs.find(p => p.fase === 'final');
    const terceiroExistente = partidasPlayoffs.find(p => p.fase === 'terceiro');

    if (!finalExistente) {
      await PartidaModel.create({
        timeA: sf1.vencedor,
        timeB: sf2.vencedor,
        data: null,
        horario: null,
        transmissao: '',
        fase: 'final',
        status: 'agendada',
        placarA: 0,
        placarB: 0,
        mapas: [],
        estatisticas: null,
        vencedor: null
      });
    }

    if (!terceiroExistente && sf1.timeA && sf1.timeB && sf2.timeA && sf2.timeB) {
      const perdedorSF1 = sf1.vencedor === sf1.timeA ? sf1.timeB : sf1.timeA;
      const perdedorSF2 = sf2.vencedor === sf2.timeA ? sf2.timeB : sf2.timeA;

      await PartidaModel.create({
        timeA: perdedorSF1,
        timeB: perdedorSF2,
        data: null,
        horario: null,
        transmissao: '',
        fase: 'terceiro',
        status: 'agendada',
        placarA: 0,
        placarB: 0,
        mapas: [],
        estatisticas: null,
        vencedor: null
      });
    }

    return true;
  }

  return false;
}

export async function getChaveamento(): Promise<any> {
  const dados = await carregarDados();
  const classificacao = await getClassificacao();
  const totalTimes = classificacao.length;

  const playoffs: any = {
    formato: totalTimes <= 4 ? 'top3' : 'top4',
    timesClassificados: totalTimes,
    semifinais: [],
    final: null,
    disputaTerceiro: null,
    campeao: null
  };

  const partidasPlayoffs = dados.partidas.filter(p => p.fase !== 'grupos');

  if (totalTimes === 4) {
    const partidaFinal = partidasPlayoffs.find(p => p.fase === 'final');
    playoffs.semifinais = [{
      id: 'sf1',
      nome: 'Semifinal',
      timeA: classificacao[1],
      timeB: classificacao[2],
      partida: partidasPlayoffs.find(p => p.fase === 'semifinal')
    }];
    playoffs.final = {
      id: 'f1',
      nome: 'Final',
      timeA: partidaFinal?.timeA ? classificacao.find(t => t.id === partidaFinal.timeA) || classificacao[0] : classificacao[0],
      timeB: partidaFinal?.timeB ? classificacao.find(t => t.id === partidaFinal.timeB) || null : null,
      partida: partidaFinal
    };
  } else if (totalTimes > 4) {
    const partidaFinal = partidasPlayoffs.find(p => p.fase === 'final');
    const partidaTerceiro = partidasPlayoffs.find(p => p.fase === 'terceiro');

    playoffs.semifinais = [
      {
        id: 'sf1',
        nome: 'Semifinal 1',
        timeA: classificacao[0],
        timeB: classificacao[2],
        partida: partidasPlayoffs.find(p => p.fase === 'semifinal1')
      },
      {
        id: 'sf2',
        nome: 'Semifinal 2',
        timeA: classificacao[1],
        timeB: classificacao[3],
        partida: partidasPlayoffs.find(p => p.fase === 'semifinal2')
      }
    ];
    playoffs.final = {
      id: 'f1',
      nome: 'Final',
      timeA: partidaFinal?.timeB ? classificacao.find(t => t.id === partidaFinal.timeA) || null : null,
      timeB: partidaFinal?.timeB ? classificacao.find(t => t.id === partidaFinal.timeB) || null : null,
      partida: partidaFinal
    };
    playoffs.disputaTerceiro = {
      id: 't1',
      nome: 'Disputa 3º Lugar',
      timeA: partidaTerceiro?.timeA ? classificacao.find(t => t.id === partidaTerceiro.timeA) || null : null,
      timeB: partidaTerceiro?.timeB ? classificacao.find(t => t.id === partidaTerceiro.timeB) || null : null,
      partida: partidaTerceiro
    };
  }

  return playoffs;
}

// Admin
export async function verificarSenhaAdmin(senha: string): Promise<boolean> {
  await connectToDatabase();
  const admin = await AdminModel.findOne({ usuario: 'admin' });
  if (!admin) return senha === 'unia2026';
  return admin.senha === senha;
}

export async function inicializarAdminSeNecessario(): Promise<void> {
  await connectToDatabase();
  const existe = await AdminModel.findOne({ usuario: 'admin' });
  if (!existe) {
    await AdminModel.create({ usuario: 'admin', senha: 'unia2026' });
  }
}
