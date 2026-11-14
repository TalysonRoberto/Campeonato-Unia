import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PartidaModel from '@/models/Partida';
import { carregarDados, atualizarEstatisticasTimes, gerarPlayoffsSeNecessario, gerarFinalEDisputaTerceiro } from '@/lib/data';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const partida = await PartidaModel.findById(id);
    if (!partida) {
      return NextResponse.json({ erro: 'Partida não encontrada' }, { status: 404 });
    }

    const camposPermitidos = ['data', 'horario', 'transmissao', 'fase', 'status', 'placarA', 'placarB', 'mapas', 'estatisticas', 'vencedor', 'timeA', 'timeB'];
    camposPermitidos.forEach(campo => {
      if (body[campo] !== undefined) {
        (partida as any)[campo] = body[campo];
      }
    });

    // Calcula vencedor automaticamente
    if (partida.status === 'finalizada') {
      const placarA = Number(partida.placarA) || 0;
      const placarB = Number(partida.placarB) || 0;

      if (partida.fase === 'grupos') {
        // Fase de grupos: melhor de 2 (2x0 ou 1x1)
        if (placarA === 2 && placarB === 0) {
          partida.vencedor = partida.timeA;
        } else if (placarB === 2 && placarA === 0) {
          partida.vencedor = partida.timeB;
        } else {
          partida.vencedor = null; // empate
        }
      } else {
        // Playoffs: melhor de 3 (primeiro a 2 mapas)
        if (placarA >= 2 && placarA > placarB) {
          partida.vencedor = partida.timeA;
        } else if (placarB >= 2 && placarB > placarA) {
          partida.vencedor = partida.timeB;
        } else {
          partida.vencedor = null;
        }
      }
    }

    await partida.save();

    if (partida.status === 'finalizada') {
      await atualizarEstatisticasTimes();

      const dados = await carregarDados();

      if (partida.fase === 'grupos') {
        await gerarPlayoffsSeNecessario(dados);
      }

      if (['semifinal', 'semifinal1', 'semifinal2'].includes(partida.fase)) {
        await gerarFinalEDisputaTerceiro(dados);
      }
    }

    return NextResponse.json(docToPartida(partida));
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao atualizar partida' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    await PartidaModel.findByIdAndDelete(id);
    await atualizarEstatisticasTimes();

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    return NextResponse.json({ erro: 'Erro ao excluir partida' }, { status: 500 });
  }
}
