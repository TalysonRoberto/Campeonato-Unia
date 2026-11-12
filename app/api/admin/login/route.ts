import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AdminModel from '@/models/Admin';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { senha } = await request.json();

    if (!senha) {
      return NextResponse.json({ erro: 'Senha obrigatória' }, { status: 400 });
    }

    // Cria admin padrão se não existir
    let admin = await AdminModel.findOne({ usuario: 'admin' });
    if (!admin) {
      admin = await AdminModel.create({ usuario: 'admin', senha: 'unia2026' });
    }

    if (admin.senha !== senha) {
      return NextResponse.json({ erro: 'Senha incorreta' }, { status: 401 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao verificar login' }, { status: 500 });
  }
}
