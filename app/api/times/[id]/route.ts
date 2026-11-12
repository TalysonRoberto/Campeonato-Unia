import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import TimeModel from '@/models/Time';
import PartidaModel from '@/models/Partida';
import { uploadImageToGridFS, deleteImageFromGridFS } from '@/lib/gridfs';
import { atualizarEstatisticasTimes } from '@/lib/data';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const formData = await request.formData();
    const nome = formData.get('nome') as string | null;
    const jogadoresRaw = formData.get('jogadores') as string | null;
    const cor = formData.get('cor') as string | null;
    const logoFile = formData.get('logo') as File | null;

    const time = await TimeModel.findById(id);
    if (!time) {
      return NextResponse.json({ erro: 'Time não encontrado' }, { status: 404 });
    }

    if (nome) time.nome = nome;
    if (jogadoresRaw) {
      time.jogadores = jogadoresRaw.split(',').map(j => j.trim()).filter(j => j);
    }
    if (cor) time.cor = cor;

    if (logoFile && logoFile.size > 0) {
      // Remove logo antiga do GridFS se existir
      if (time.logoId) {
        try { await deleteImageFromGridFS(time.logoId); } catch { /* ignora */ }
      }

      const ext = path.extname(logoFile.name) || '.png';
      const fileName = `time-${Date.now()}${ext}`;
      const logoId = await uploadImageToGridFS(logoFile, fileName);
      time.logoId = logoId;
      time.logo = `/api/imagem/${logoId}`;
    }

    await time.save();
    return NextResponse.json(docToTime(time));
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao atualizar time' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const time = await TimeModel.findById(id);
    if (time?.logoId) {
      try { await deleteImageFromGridFS(time.logoId); } catch { /* ignora */ }
    }

    await TimeModel.findByIdAndDelete(id);
    await PartidaModel.deleteMany({ $or: [{ timeA: id }, { timeB: id }] });
    await atualizarEstatisticasTimes();

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao excluir time' }, { status: 500 });
  }
}
