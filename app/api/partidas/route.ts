import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PartidaModel from '@/models/Partida';

function docToPartida(doc: any) {
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

export async function GET() {
  try {
    await connectToDatabase();
    const partidas = await PartidaModel.find().lean();
    return NextResponse.json(partidas.map(docToPartida));
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao buscar partidas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { timeA, timeB, data, horario, transmissao, fase } = body;

    if (!timeA || !timeB || timeA === timeB) {
      return NextResponse.json({ erro: 'Selecione dois times diferentes' }, { status: 400 });
    }

    const partida = await PartidaModel.create({
      timeA,
      timeB,
      data: data || null,
      horario: horario || null,
      transmissao: transmissao || '',
      fase: fase || 'grupos',
      status: 'agendada',
      placarA: 0,
      placarB: 0,
      mapas: [],
      estatisticas: null,
      vencedor: null
    });

    return NextResponse.json(docToPartida(partida), { status: 201 });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao criar partida' }, { status: 500 });
  }
}
