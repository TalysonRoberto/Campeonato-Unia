import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import TimeModel from '../models/Time';
import PartidaModel from '../models/Partida';
import TorneioModel from '../models/Torneio';
import AdminModel from '../models/Admin';

async function migrar() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não definida');
  }

  console.log('Conectando ao MongoDB...');
  await mongoose.connect(uri);
  console.log('Conectado com sucesso!');

  const dataPath = path.join(process.cwd(), 'data', 'dados.json');

  if (!fs.existsSync(dataPath)) {
    console.log('Arquivo data/dados.json não encontrado. Nada para migrar.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Limpa coleções
  console.log('Limpando coleções...');
  await TimeModel.deleteMany({});
  await PartidaModel.deleteMany({});
  await TorneioModel.deleteMany({});

  // Migra torneio
  console.log('Migrando torneio...');
  await TorneioModel.create({
    nome: dados.torneio?.nome || 'Campeonato Unia',
    faseAtual: dados.torneio?.faseAtual || 'grupos',
    status: dados.torneio?.status || 'Em andamento',
    dataInicio: dados.torneio?.dataInicio || null,
    dataFim: dados.torneio?.dataFim || null,
    configuracoes: dados.configuracoes || { pontosVitoria: 50, formatoJogos: 'MD3' }
  });

  // Migra times
  console.log('Migrando times...');
  const timeMap = new Map<string, string>();
  for (const time of dados.times || []) {
    const criado = await TimeModel.create({
      nome: time.nome,
      jogadores: time.jogadores || [],
      logo: time.logo || '/img/logo.png',
      cor: time.cor || '#14b8a6',
      vitorias: time.vitorias || 0,
      derrotas: time.derrotas || 0,
      pontos: time.pontos || 0,
      mapasGanhos: time.mapasGanhos || 0,
      mapasPerdidos: time.mapasPerdidos || 0
    });
    timeMap.set(time.id, criado._id.toString());
  }

  // Migra partidas convertendo ids antigos para novos
  console.log('Migrando partidas...');
  for (const partida of dados.partidas || []) {
    await PartidaModel.create({
      timeA: timeMap.get(partida.timeA) || partida.timeA,
      timeB: timeMap.get(partida.timeB) || partida.timeB,
      data: partida.data || null,
      horario: partida.horario || null,
      transmissao: partida.transmissao || '',
      fase: partida.fase || 'grupos',
      status: partida.status || 'agendada',
      placarA: partida.placarA || 0,
      placarB: partida.placarB || 0,
      mapas: partida.mapas || [],
      estatisticas: partida.estatisticas || null,
      vencedor: partida.vencedor ? (timeMap.get(partida.vencedor) || partida.vencedor) : null
    });
  }

  // Cria admin padrão se não existir
  console.log('Criando admin padrão...');
  const adminExiste = await AdminModel.findOne({ usuario: 'admin' });
  if (!adminExiste) {
    await AdminModel.create({ usuario: 'admin', senha: 'unia2026' });
  }

  console.log('Migração concluída!');
  console.log(`Times migrados: ${dados.times?.length || 0}`);
  console.log(`Partidas migradas: ${dados.partidas?.length || 0}`);

  await mongoose.disconnect();
  process.exit(0);
}

migrar().catch(erro => {
  console.error('Erro na migração:', erro);
  process.exit(1);
});
