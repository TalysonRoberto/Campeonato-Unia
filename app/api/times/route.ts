import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import TimeModel from '@/models/Time';
import { uploadImageToGridFS } from '@/lib/gridfs';

function docToTime(doc: any) {
  return {
    id: doc._id.toString(),
    nome: doc.nome,
    jogadores: doc.jogadores || [],
    logo: doc.logo || '/img/logo.png',
    logoId: doc.logoId || null,
    cor: doc.cor || '#14b8a6',
    vitorias: doc.vitorias || 0,
    derrotas: doc.derrotas || 0,
    pontos: doc.pontos || 0,
    mapasGanhos: doc.mapasGanhos || 0,
    mapasPerdidos: doc.mapasPerdidos || 0
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const times = await TimeModel.find().lean();
    return NextResponse.json(times.map(docToTime));
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao buscar times' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const nome = formData.get('nome') as string;
    const jogadoresRaw = formData.get('jogadores') as string;
    const cor = formData.get('cor') as string;
    const logoFile = formData.get('logo') as File | null;

    if (!nome || !jogadoresRaw) {
      return NextResponse.json({ erro: 'Nome e jogadores são obrigatórios' }, { status: 400 });
    }

    const jogadores = jogadoresRaw.split(',').map(j => j.trim()).filter(j => j);

    let logoPath = '/img/logo.png';
    let logoId = null;

    if (logoFile && logoFile.size > 0) {
      const ext = path.extname(logoFile.name) || '.png';
      const fileName = `time-${Date.now()}${ext}`;
      logoId = await uploadImageToGridFS(logoFile, fileName);
      logoPath = `/api/imagem/${logoId}`;
    }

    const time = await TimeModel.create({
      nome,
      jogadores,
      logo: logoPath,
      logoId,
      cor: cor || '#14b8a6',
      vitorias: 0,
      derrotas: 0,
      pontos: 0,
      mapasGanhos: 0,
      mapasPerdidos: 0
    });

    return NextResponse.json(docToTime(time), { status: 201 });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao criar time' }, { status: 500 });
  }
}
