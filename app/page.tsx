import Link from 'next/link';
import Image from 'next/image';
import { carregarDados, getClassificacao, getChaveamento, faseDeGruposFinalizada } from '@/lib/data';
import PlayoffBracket from './components/PlayoffBracket';

export const dynamic = 'force-dynamic';

function getTimePorId(id: string, times: any[]) {
  return times.find(t => t.id === id) || { nome: 'Time não encontrado', logo: '/img/logo.png' };
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ao_vivo') {
    return <span className="px-3 py-1 bg-red-600 text-white text-xs font-rajdhani font-bold tracking-wider animate-pulse">AO VIVO</span>;
  }
  if (status === 'finalizada') {
    return <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-rajdhani font-bold tracking-wider">FINALIZADA</span>;
  }
  return <span className="px-3 py-1 bg-valorant-red/20 text-valorant-red text-xs font-rajdhani font-bold tracking-wider">AGENDADA</span>;
}

export default async function HomePage() {
  const dados = await carregarDados();
  const classificacao = await getClassificacao();
  const chaveamento = await getChaveamento();
  const partidasFinalizadas = dados.partidas.filter(p => p.status === 'finalizada');

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-valorant-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-valorant-purple/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-valorant-red/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-valorant-darker/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/img/logo.png" alt="Campeonato Unia" width={48} height={48} className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,70,85,0.5)]" />
            <span className="font-rajdhani font-bold text-xl tracking-wider text-white hidden sm:block">
              CAMPEONATO <span className="text-valorant-red">UNIA</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-rajdhani font-semibold tracking-wide text-sm">
            <a href="#times" className="text-white/70 hover:text-white transition-colors">TIMES</a>
            <a href="#classificacao" className="text-white/70 hover:text-white transition-colors">CLASSIFICAÇÃO</a>
            <a href="#agenda" className="text-white/70 hover:text-white transition-colors">AGENDA</a>
            <a href="#playoffs" className="text-white/70 hover:text-white transition-colors">PLAYOFFS</a>
            <a href="#historico" className="text-white/70 hover:text-white transition-colors">HISTÓRICO</a>
          </div>
          <Link href="/admin" className="px-5 py-2 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold text-sm tracking-wider clip-button transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,70,85,0.5)]">
            ADMIN
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 min-h-[calc(100vh-80px)] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 mb-6 border border-valorant-red/60 bg-valorant-red/10">
                <span className="text-valorant-red font-rajdhani font-bold text-xs tracking-[0.2em]">TORNEIO DE VALORANT</span>
              </div>
              <h1 className="font-rajdhani font-bold text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] mb-6 tracking-tight">
                CAMPEONATO<br />
                <span className="text-valorant-red">UNIA</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Acompanhe partidas épicas, estatísticas detalhadas, transmissões ao vivo e o chaveamento dos playoffs do nosso campeonato interno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#classificacao" className="px-8 py-3.5 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold text-sm tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,70,85,0.5)] text-center">
                  VER CLASSIFICAÇÃO
                </a>
                <a href="#agenda" className="px-8 py-3.5 border border-white/30 hover:border-valorant-red hover:text-valorant-red text-white font-rajdhani font-bold text-sm tracking-wider transition-all duration-300 text-center">
                  AGENDA DE JOGOS
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 flex items-center justify-center">
              <Image
                src="/img/logo.png"
                alt="Campeonato Unia"
                width={520}
                height={520}
                className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-[0_0_60px_rgba(255,70,85,0.25)] animate-float"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <section className="relative z-10 py-8 border-y border-white/10 bg-valorant-darker/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2 hover:bg-valorant-red/5 hover:border-valorant-red/30 transition-all">
              <span className="text-gray-400 text-xs font-rajdhani tracking-wider">FASE ATUAL</span>
              <span className="text-2xl font-rajdhani font-bold text-white">{dados.torneio.faseAtual === 'grupos' ? 'FASE DE GRUPOS' : 'PLAYOFFS'}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2 hover:bg-valorant-red/5 hover:border-valorant-red/30 transition-all">
              <span className="text-gray-400 text-xs font-rajdhani tracking-wider">TIMES</span>
              <span className="text-2xl font-rajdhani font-bold text-valorant-red">{dados.times.length}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2 hover:bg-valorant-red/5 hover:border-valorant-red/30 transition-all">
              <span className="text-gray-400 text-xs font-rajdhani tracking-wider">PARTIDAS</span>
              <span className="text-2xl font-rajdhani font-bold text-white">{dados.partidas.length}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2 hover:bg-valorant-red/5 hover:border-valorant-red/30 transition-all">
              <span className="text-gray-400 text-xs font-rajdhani tracking-wider">STATUS</span>
              <span className="text-2xl font-rajdhani font-bold text-valorant-purple">{dados.torneio.status.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Times */}
      <section id="times" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl mb-2">TIMES <span className="text-valorant-red">INSCRITOS</span></h2>
            <div className="h-1 w-24 bg-valorant-red" />
          </div>
          {dados.times.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl font-rajdhani">Nenhum time inscrito ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dados.times.map((time, index) => (
                <div key={time.id} className="bg-white/5 border border-white/10 p-6 hover:-translate-y-2 hover:border-valorant-red/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(255,70,85,0.1)] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-28 h-28 mb-4 p-4 flex items-center justify-center">
                      <Image src={time.logo} alt={time.nome} width={112} height={112} className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,70,85,0.3)]" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-2xl text-white mb-3">{time.nome}</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {time.jogadores.map((jogador, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-sm font-rajdhani tracking-wide">{jogador}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Classificação */}
      <section id="classificacao" className="relative z-10 py-20 bg-valorant-darker/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl mb-2">TABELA DE <span className="text-valorant-red">CLASSIFICAÇÃO</span></h2>
            <div className="h-1 w-24 bg-valorant-red" />
          </div>
          {!faseDeGruposFinalizada(dados) ? (
            <div className="text-center py-12 text-gray-500 bg-white/5 border border-white/10">
              <p className="text-xl font-rajdhani mb-2">CLASSIFICAÇÃO INDISPONÍVEL</p>
              <p>A classificação será exibida após o término de todos os jogos da fase de grupos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">POS</th>
                    <th className="text-left bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">TIME</th>
                    <th className="text-center bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">V</th>
                    <th className="text-center bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">E</th>
                    <th className="text-center bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">D</th>
                    <th className="text-center bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">SALDO</th>
                    <th className="text-center bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">PTS</th>
                    <th className="text-center bg-valorant-red/10 px-6 py-4 font-rajdhani font-bold tracking-wider text-valorant-red border-b-2 border-valorant-red">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {classificacao.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        <p className="text-xl font-rajdhani">Nenhuma partida registrada</p>
                      </td>
                    </tr>
                  ) : (
                    classificacao.map((time, index) => {
                      const totalTimes = classificacao.length;
                      let status = '';
                      let statusClass = '';

                      if (totalTimes <= 4) {
                        if (index === 0) { status = 'FINAL'; statusClass = 'text-yellow-400'; }
                        else if (index === 1 || index === 2) { status = 'SEMIFINAL'; statusClass = 'text-valorant-red'; }
                        else { status = 'ELIMINADO'; statusClass = 'text-gray-500'; }
                      } else {
                        status = index < 4 ? 'PLAYOFFS' : 'ELIMINADO';
                        statusClass = index < 4 ? 'text-valorant-red' : 'text-gray-500';
                      }

                      const posClass = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-white';

                      return (
                        <tr key={time.id} className="hover:bg-valorant-red/5 transition-colors border-b border-white/5">
                          <td className={`px-6 py-5 font-rajdhani font-bold text-xl ${posClass}`}>#{time.posicao}</td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-10 rounded-sm" style={{ backgroundColor: time.cor }} />
                              <Image src={time.logo} alt={time.nome} width={40} height={40} className="w-10 h-10 object-contain" />
                              <span className="font-semibold">{time.nome}</span>
                            </div>
                          </td>
                          <td className="text-center px-6 py-5 font-rajdhani font-bold text-lg">{time.vitorias}</td>
                          <td className="text-center px-6 py-5 font-rajdhani font-bold text-lg">{time.empates}</td>
                          <td className="text-center px-6 py-5 font-rajdhani font-bold text-lg">{time.derrotas}</td>
                          <td className="text-center px-6 py-5 font-rajdhani font-bold text-lg">{time.mapasGanhos - time.mapasPerdidos}</td>
                          <td className="text-center px-6 py-5 font-rajdhani font-bold text-xl text-valorant-red">{time.pontos}</td>
                          <td className="text-center px-6 py-5">
                            <span className={`${statusClass} font-rajdhani font-bold text-sm tracking-wider`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl mb-2">AGENDA DE <span className="text-valorant-red">JOGOS</span></h2>
            <div className="h-1 w-24 bg-valorant-red" />
          </div>
          {dados.partidas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl font-rajdhani">Nenhuma partida agendada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...dados.partidas]
                .sort((a, b) => {
                  if (!a.data) return 1;
                  if (!b.data) return -1;
                  return new Date(a.data + 'T' + (a.horario || '00:00')).getTime() - new Date(b.data + 'T' + (b.horario || '00:00')).getTime();
                })
                .map((partida, index) => {
                  const timeA = getTimePorId(partida.timeA, dados.times);
                  const timeB = getTimePorId(partida.timeB, dados.times);
                  const dataFormatada = partida.data ? new Date(partida.data + 'T00:00').toLocaleDateString('pt-BR') : 'A definir';
                  const placar = partida.status === 'finalizada' || partida.status === 'ao_vivo'
                    ? <span className="text-3xl font-rajdhani font-bold text-white">{partida.placarA} - {partida.placarB}</span>
                    : <span className="text-xl font-rajdhani font-bold text-gray-500">VS</span>;

                  return (
                    <div key={partida.id} className="bg-white/5 border border-white/10 p-6 hover:-translate-y-1 hover:border-valorant-red/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm font-rajdhani tracking-wider uppercase">{partida.fase === 'grupos' ? 'FASE DE GRUPOS' : partida.fase}</span>
                        <StatusBadge status={partida.status} />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-center flex-1">
                          <Image src={timeA.logo} alt={timeA.nome} width={64} height={64} className="w-16 h-16 object-contain mb-2" />
                          <span className="font-rajdhani font-bold text-lg text-center">{timeA.nome}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          {placar}
                          <span className="text-gray-500 text-sm font-rajdhani mt-1">MD3</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <Image src={timeB.logo} alt={timeB.nome} width={64} height={64} className="w-16 h-16 object-contain mb-2" />
                          <span className="font-rajdhani font-bold text-lg text-center">{timeB.nome}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-gray-400 text-sm font-rajdhani">{dataFormatada} às {partida.horario || '--:--'}</span>
                        {partida.transmissao && (
                          <Link
                            href={`/assistir/${partida.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-valorant-red hover:text-valorant-red-light font-semibold text-sm transition-colors"
                          >
                            ASSISTIR
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* Playoffs */}
      <section id="playoffs" className="relative z-10 py-20 bg-valorant-darker/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl mb-2">CHAVEAMENTO <span className="text-valorant-red">PLAYOFFS</span></h2>
            <div className="h-1 w-24 bg-valorant-red" />
          </div>
          {!faseDeGruposFinalizada(dados) ? (
            <div className="text-center py-16 text-gray-500 bg-white/5 border border-white/10">
              <p className="text-2xl font-rajdhani mb-2">CHAVEAMENTO INDISPONÍVEL</p>
              <p>O chaveamento de playoffs será exibido após o término da fase de grupos.</p>
            </div>
          ) : chaveamento.timesClassificados < 4 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-2xl font-rajdhani mb-2">CHAVEAMENTO INDISPONÍVEL</p>
              <p>São necessários pelo menos 4 times para exibir os playoffs</p>
            </div>
          ) : (
            <PlayoffBracket chaveamento={chaveamento} />
          )}
        </div>
      </section>

      {/* Histórico */}
      <section id="historico" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl mb-2">HISTÓRICO & <span className="text-valorant-red">TRANSMISSÕES</span></h2>
            <div className="h-1 w-24 bg-valorant-red" />
          </div>
          {partidasFinalizadas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl font-rajdhani">Nenhuma partida finalizada ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...partidasFinalizadas]
                .sort((a, b) => new Date(b.data + 'T' + (b.horario || '00:00')).getTime() - new Date(a.data + 'T' + (a.horario || '00:00')).getTime())
                .map((partida) => {
                  const timeA = getTimePorId(partida.timeA, dados.times);
                  const timeB = getTimePorId(partida.timeB, dados.times);
                  const vencedor = partida.vencedor ? getTimePorId(partida.vencedor, dados.times) : null;
                  const isEmpate = partida.fase === 'grupos' && !partida.vencedor && partida.status === 'finalizada';

                  return (
                    <div key={partida.id} className="bg-white/5 border border-white/10 p-6 hover:-translate-y-1 hover:border-valorant-red/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm font-rajdhani tracking-wider uppercase">{partida.fase}</span>
                        <span className={`font-rajdhani font-bold text-sm ${isEmpate ? 'text-gray-400' : 'text-yellow-400'}`}>
                          {isEmpate ? 'EMPATE' : `VENCEDOR: ${vencedor?.nome}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Image src={timeA.logo} alt={timeA.nome} width={48} height={48} className="w-12 h-12 object-contain" />
                          <div>
                            <p className="font-rajdhani font-bold text-lg">{timeA.nome}</p>
                            <p className={`text-2xl font-rajdhani font-bold ${partida.vencedor === timeA.id ? 'text-valorant-red' : 'text-gray-500'}`}>{partida.placarA}</p>
                          </div>
                        </div>
                        <span className="text-gray-500 font-bold">VS</span>
                        <div className="flex items-center gap-3 flex-1 justify-end text-right">
                          <div>
                            <p className="font-rajdhani font-bold text-lg">{timeB.nome}</p>
                            <p className={`text-2xl font-rajdhani font-bold ${partida.vencedor === timeB.id ? 'text-valorant-red' : 'text-gray-500'}`}>{partida.placarB}</p>
                          </div>
                          <Image src={timeB.logo} alt={timeB.nome} width={48} height={48} className="w-12 h-12 object-contain" />
                        </div>
                      </div>
                      {partida.transmissao && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <Link
                            href={`/assistir/${partida.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-valorant-red hover:text-valorant-red-light font-semibold transition-colors"
                          >
                            ASSISTIR GRAVAÇÃO
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 bg-valorant-darker">
        <div className="container mx-auto px-4 text-center">
          <Image src="/img/logo.png" alt="Campeonato Unia" width={64} height={64} className="h-16 mx-auto mb-4 object-contain opacity-80" />
          <p className="text-gray-500 font-rajdhani tracking-wider">CAMPEONATO UNIA © 2026 - TORNEIO DE VALORANT</p>
        </div>
      </footer>
    </main>
  );
}
