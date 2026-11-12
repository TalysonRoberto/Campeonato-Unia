import { NextRequest, NextResponse } from 'next/server';
import { getImageFromGridFS } from '@/lib/gridfs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imagem = await getImageFromGridFS(id);

    if (!imagem) {
      return NextResponse.json({ erro: 'Imagem não encontrada' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(imagem.buffer), {
      headers: {
        'Content-Type': imagem.contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao buscar imagem' }, { status: 500 });
  }
}
