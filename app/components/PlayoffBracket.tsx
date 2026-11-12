import Image from 'next/image';

interface TimeData {
  id: string;
  nome: string;
  logo: string;
  cor: string;
}

interface PartidaData {
  id?: string;
  timeA?: string;
  timeB?: string;
  vencedor?: string | null;
  placarA?: number;
  placarB?: number;
  status?: string;
}

interface ChaveamentoData {
  formato: 'top3' | 'top4';
  semifinais: { id: string; nome: string; timeA: TimeData; timeB: TimeData; partida?: PartidaData }[];
  final?: { timeA: TimeData | null; timeB: TimeData | null; partida?: PartidaData } | null;
  disputaTerceiro?: { timeA: TimeData | null; timeB: TimeData | null; partida?: PartidaData } | null;
}

function TimeBox({ time, placeholder, vencedorId }: { time?: TimeData | null; placeholder?: string; vencedorId?: string | null }) {
  const ganhou = time && vencedorId && time.id === vencedorId;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 min-w-[180px] border border-white/10 bg-white/5 ${ganhou ? 'ring-1 ring-yellow-400/50' : ''}`}>
      {time ? (
        <>
          <div className="w-1 h-8 rounded-sm" style={{ backgroundColor: time.cor }} />
          <Image src={time.logo} alt={time.nome} width={28} height={28} className="w-7 h-7 object-contain" />
          <span className={`font-rajdhani font-bold truncate ${ganhou ? 'text-yellow-400' : 'text-white'}`}>{time.nome}</span>
        </>
      ) : (
        <span className="font-rajdhani font-bold text-gray-500">{placeholder || 'A definir'}</span>
      )}
    </div>
  );
}

function MatchColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <h4 className="text-valorant-red font-rajdhani font-bold text-lg text-center tracking-wider">{title}</h4>
      {children}
    </div>
  );
}

export default function PlayoffBracket({ chaveamento }: { chaveamento: ChaveamentoData }) {
  const finalVencedor = chaveamento.final?.partida?.vencedor;
  const terceiroVencedor = chaveamento.disputaTerceiro?.partida?.vencedor;

  // Determina colocação final baseada nos resultados
  const colocacao: { posicao: number; time?: TimeData | null; label: string }[] = [];

  if (chaveamento.formato === 'top3') {
    const sf = chaveamento.semifinais[0];
    const final = chaveamento.final;
    const campeao = finalVencedor ? (final?.timeA?.id === finalVencedor ? final.timeA : final?.timeB) : null;
    const vice = finalVencedor ? (final?.timeA?.id === finalVencedor ? final?.timeB : final?.timeA) : null;
    const quarto = sf.timeA;
    const terceiro = sf.timeB?.id === sf.partida?.vencedor ? sf.timeA : sf.timeB;

    colocacao.push({ posicao: 1, time: campeao, label: 'Campeão' });
    colocacao.push({ posicao: 2, time: vice, label: 'Vice' });
    colocacao.push({ posicao: 3, time: terceiro, label: '3º Lugar' });
  } else {
    const sf1 = chaveamento.semifinais[0];
    const sf2 = chaveamento.semifinais[1];
    const final = chaveamento.final;
    const terceiro = chaveamento.disputaTerceiro;

    const campeao = finalVencedor ? (final?.timeA?.id === finalVencedor ? final.timeA : final?.timeB) : null;
    const vice = finalVencedor ? (final?.timeA?.id === finalVencedor ? final?.timeB : final?.timeA) : null;
    const terceiroColocado = terceiroVencedor ? (terceiro?.timeA?.id === terceiroVencedor ? terceiro.timeA : terceiro?.timeB) : null;
    const quartoColocado = terceiroVencedor ? (terceiro?.timeA?.id === terceiroVencedor ? terceiro?.timeB : terceiro?.timeA) : null;

    colocacao.push({ posicao: 1, time: campeao, label: 'Campeão' });
    colocacao.push({ posicao: 2, time: vice, label: 'Vice' });
    colocacao.push({ posicao: 3, time: terceiroColocado, label: '3º Lugar' });
    colocacao.push({ posicao: 4, time: quartoColocado, label: '4º Lugar' });
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[1100px] flex items-center justify-center gap-12">
        {/* Semifinais */}
        <MatchColumn title="Semifinais">
          <div className="flex flex-col gap-4">
            {chaveamento.semifinais.map(sf => (
              <div key={sf.id} className="flex flex-col gap-1">
                <TimeBox time={sf.timeA} vencedorId={sf.partida?.vencedor} />
                <TimeBox time={sf.timeB} vencedorId={sf.partida?.vencedor} />
              </div>
            ))}
          </div>
        </MatchColumn>

        {/* Final */}
        <MatchColumn title="Final">
          <div className="flex flex-col gap-1">
            <TimeBox time={chaveamento.final?.timeA || null} placeholder="Vencedor SF" vencedorId={finalVencedor} />
            <TimeBox time={chaveamento.final?.timeB || null} placeholder="Vencedor SF" vencedorId={finalVencedor} />
          </div>
        </MatchColumn>

        {/* Vencedor */}
        <div className="flex flex-col gap-8">
          <h4 className="text-yellow-400 font-rajdhani font-bold text-lg text-center tracking-wider">Vencedor</h4>
          <div className="flex flex-col gap-1">
            <TimeBox time={colocacao[0]?.time} placeholder="A definir" />
          </div>
        </div>

        {/* Disputa 3º */}
        {chaveamento.formato === 'top4' && (
          <MatchColumn title="3º de final">
            <div className="flex flex-col gap-1">
              <TimeBox time={chaveamento.disputaTerceiro?.timeA || null} placeholder="Perdedor SF" vencedorId={terceiroVencedor} />
              <TimeBox time={chaveamento.disputaTerceiro?.timeB || null} placeholder="Perdedor SF" vencedorId={terceiroVencedor} />
            </div>
          </MatchColumn>
        )}

        {/* Colocação */}
        <div className="flex flex-col gap-8">
          <h4 className="text-valorant-red font-rajdhani font-bold text-lg text-center tracking-wider">Colocação</h4>
          <div className="flex flex-col gap-2">
            {colocacao.map(item => (
              <div key={item.posicao} className="flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 min-w-[160px]">
                <span className="font-rajdhani font-bold text-valorant-red w-6">#{item.posicao}</span>
                {item.time ? (
                  <>
                    <div className="w-1 h-6 rounded-sm" style={{ backgroundColor: item.time.cor }} />
                    <span className="font-rajdhani font-bold truncate">{item.time.nome}</span>
                  </>
                ) : (
                  <span className="font-rajdhani font-bold text-gray-500">A definir</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
