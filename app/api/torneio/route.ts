import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TorneioModel from '@/models/Torneio';
import { carregarDados, salvarDados } from '@/lib/data';

export async function GET() {
  try {
    const dados = await carregarDados();
    return NextResponse.json(dados.torneio);
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao buscar torneio' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const dados = await carregarDados();
    dados.torneio = { ...dados.torneio, ...body };
    await salvarDados(dados);
    return NextResponse.json(dados.torneio);
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao atualizar torneio' }, { status: 500 });
  }
}
