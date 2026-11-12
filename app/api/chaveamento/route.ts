import { NextRequest, NextResponse } from 'next/server';
import { carregarDados, getChaveamento, gerarPlayoffsSeNecessario } from '@/lib/data';

export async function GET() {
  try {
    const chaveamento = await getChaveamento();
    return NextResponse.json(chaveamento);
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao buscar chaveamento' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await carregarDados();

    if (dados.times.length < 4) {
      return NextResponse.json({ erro: 'É necessário pelo menos 4 times para gerar playoffs' }, { status: 400 });
    }

    const gerado = await gerarPlayoffsSeNecessario(dados);
    if (!gerado) {
      return NextResponse.json({ erro: 'A fase de grupos ainda não foi finalizada ou os playoffs já foram gerados' }, { status: 400 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao gerar playoffs' }, { status: 500 });
  }
}
