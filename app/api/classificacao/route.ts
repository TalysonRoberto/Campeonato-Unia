import { NextResponse } from 'next/server';
import { getClassificacao } from '@/lib/data';

export async function GET() {
  try {
    const classificacao = await getClassificacao();
    return NextResponse.json(classificacao);
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao buscar classificação' }, { status: 500 });
  }
}
