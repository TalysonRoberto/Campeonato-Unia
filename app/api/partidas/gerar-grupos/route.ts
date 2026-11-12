import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TimeModel from '@/models/Time';
import PartidaModel from '@/models/Partida';
import TorneioModel from '@/models/Torneio';
import { carregarDados } from '@/lib/data';

export async function POST() {
  try {
    await connectToDatabase();

    const dados = await carregarDados();

    if (dados.times.length < 2) {
      return NextResponse.json({ erro: 'É necessário pelo menos 2 times para gerar a fase de grupos' }, { status: 400 });
    }

    // Remove partidas antigas de grupos
    await PartidaModel.deleteMany({ fase: 'grupos' });

    // Gera todos contra todos
    const novasPartidas = [];
    for (let i = 0; i < dados.times.length; i++) {
      for (let j = i + 1; j < dados.times.length; j++) {
        novasPartidas.push({
          timeA: dados.times[i].id,
          timeB: dados.times[j].id,
          data: null,
          horario: null,
          transmissao: '',
          fase: 'grupos',
          status: 'agendada',
          placarA: 0,
          placarB: 0,
          mapas: [],
          estatisticas: null,
          vencedor: null
        });
      }
    }

    await PartidaModel.insertMany(novasPartidas);

    const torneio = await TorneioModel.findOne();
    if (torneio) {
      torneio.faseAtual = 'grupos';
      await torneio.save();
    }

    return NextResponse.json({ sucesso: true, quantidade: novasPartidas.length });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao gerar fase de grupos' }, { status: 500 });
  }
}
