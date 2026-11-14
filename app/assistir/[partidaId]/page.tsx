import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { carregarDados } from '@/lib/data';

export const dynamic = 'force-dynamic';

type StreamingInfo =
  | { plataforma: 'youtube'; id: string; tipo: 'video' | 'live' }
  | { plataforma: 'twitch'; id: string; tipo: 'channel' | 'video' };

function detectarStreaming(url: string): StreamingInfo | null {
  if (!url) return null;

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/)
    || url.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return { plataforma: 'youtube', id: youtubeMatch[1], tipo: 'video' };
  }

  // Twitch
  const twitchChannelMatch = url.match(/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]{4,25})(?:\/)?$/);
  if (twitchChannelMatch) {
    return { plataforma: 'twitch', id: twitchChannelMatch[1], tipo: 'channel' };
  }

  const twitchVideoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)/);
  if (twitchVideoMatch) {
    return { plataforma: 'twitch', id: twitchVideoMatch[1], tipo: 'video' };
  }

  return null;
}

function getTimePorId(id: string, times: any[]) {
  return times.find(t => t.id === id) || { nome: 'Time não encontrado', logo: '/img/logo.png', cor: '#ffffff' };
}

function buildVideoUrl(info: StreamingInfo, embedDomain: string): string {
  if (info.plataforma === 'youtube') {
    return `https://www.youtube.com/embed/${info.id}`;
  }

  if (info.plataforma === 'twitch') {
    const params = new URLSearchParams();
    if (info.tipo === 'channel') {
      params.set('channel', info.id);
    } else {
      params.set('video', `v${info.id}`);
    }
    params.set('parent', embedDomain);
    params.set('autoplay', 'true');
    params.set('muted', 'false');
    return `https://player.twitch.tv/?${params.toString()}`;
  }

  return '';
}

function buildChatUrl(info: StreamingInfo, embedDomain: string): string | null {
  if (info.plataforma === 'youtube') {
    return `https://www.youtube.com/live_chat?v=${info.id}&embed_domain=${embedDomain}`;
  }

  if (info.plataforma === 'twitch' && info.tipo === 'channel') {
    return `https://www.twitch.tv/embed/${info.id}/chat?parent=${embedDomain}&darkpopout`;
  }

  return null;
}

interface PageProps {
  params: Promise<{ partidaId: string }>;
}

export default async function AssistirPage({ params }: PageProps) {
  const { partidaId } = await params;
  const dados = await carregarDados();

  const partida = dados.partidas.find(p => p.id === partidaId);
  if (!partida || !partida.transmissao) {
    notFound();
  }

  const streaming = detectarStreaming(partida.transmissao);
  if (!streaming) {
    notFound();
  }

  const timeA = getTimePorId(partida.timeA, dados.times);
  const timeB = getTimePorId(partida.timeB, dados.times);

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  // Twitch exige o parent sem porta; YouTube aceita com ou sem
  const embedDomain = host.includes('localhost') ? 'localhost' : host.replace(/:\d+$/, '');

  const statusLabel = partida.status === 'ao_vivo' ? 'AO VIVO' : partida.status === 'finalizada' ? 'FINALIZADA' : 'AGENDADA';
  const statusClass = partida.status === 'ao_vivo'
    ? 'bg-red-600 text-white animate-pulse'
    : partida.status === 'finalizada'
      ? 'bg-white/10 text-gray-300'
      : 'bg-valorant-red/20 text-valorant-red';

  const dataFormatada = partida.data
    ? new Date(partida.data + 'T00:00').toLocaleDateString('pt-BR')
    : 'A definir';

  const isAoVivo = partida.status === 'ao_vivo';
  // YouTube: chat só funciona em lives
  // Twitch: chat do canal pode ser exibido mesmo offline
  const mostrarChat =
    (streaming.plataforma === 'youtube' && isAoVivo) ||
    (streaming.plataforma === 'twitch' && streaming.tipo === 'channel');

  // Resultado quando finalizada
  let resultadoTexto = '';
  let resultadoClasse = '';
  if (partida.status === 'finalizada') {
    if (!partida.vencedor) {
      resultadoTexto = 'EMPATE';
      resultadoClasse = 'text-gray-400';
    } else if (partida.vencedor === timeA.id) {
      resultadoTexto = `${timeA.nome} VENCEU`;
      resultadoClasse = 'text-valorant-red';
    } else {
      resultadoTexto = `${timeB.nome} VENCEU`;
      resultadoClasse = 'text-valorant-red';
    }
  }

  const videoUrl = buildVideoUrl(streaming, embedDomain);
  const chatUrl = buildChatUrl(streaming, embedDomain);

  return (
    <main className="relative h-screen flex flex-col bg-valorant-dark text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-valorant-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-valorant-purple/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <nav className="relative z-10 shrink-0 bg-valorant-darker/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/img/logo.png" alt="Campeonato Unia" width={32} height={32} className="h-8 w-auto object-contain" />
            <span className="font-rajdhani font-bold text-base tracking-wider">
              CAMPEONATO <span className="text-valorant-red">UNIA</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-rajdhani font-bold tracking-wider text-gray-400 uppercase">
              {streaming.plataforma}
            </span>
            <span className={`px-3 py-1 text-xs font-rajdhani font-bold tracking-wider ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </nav>

      {/* Match info compacta */}
      <section className="relative z-10 shrink-0 py-3 border-b border-white/10 bg-valorant-darker/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Time A */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
              <span className="font-rajdhani font-bold text-base md:text-xl text-right hidden sm:inline">{timeA.nome}</span>
              <div className="flex items-center gap-1.5">
                {timeA.cor && <div className="w-1 h-8 rounded-sm" style={{ backgroundColor: timeA.cor }} />}
                <Image src={timeA.logo} alt={timeA.nome} width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
            </div>

            {/* Placar */}
            <div className="flex flex-col items-center px-2 md:px-4">
              <div className="flex items-center gap-2 md:gap-3 text-3xl md:text-5xl font-rajdhani font-bold leading-none">
                <span className={partida.vencedor === timeA.id ? 'text-valorant-red' : ''}>{partida.placarA}</span>
                <span className="text-gray-500">-</span>
                <span className={partida.vencedor === timeB.id ? 'text-valorant-red' : ''}>{partida.placarB}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-xs font-rajdhani uppercase">{partida.fase}</span>
                <span className="text-gray-600 text-xs">|</span>
                <span className="text-gray-500 text-xs font-rajdhani">{dataFormatada} {partida.horario}</span>
              </div>
              {partida.status === 'finalizada' && (
                <span className={`font-rajdhani font-bold text-sm tracking-wider mt-0.5 ${resultadoClasse}`}>
                  {resultadoTexto}
                </span>
              )}
            </div>

            {/* Time B */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-start">
              <div className="flex items-center gap-1.5">
                <Image src={timeB.logo} alt={timeB.nome} width={40} height={40} className="w-10 h-10 object-contain" />
                {timeB.cor && <div className="w-1 h-8 rounded-sm" style={{ backgroundColor: timeB.cor }} />}
              </div>
              <span className="font-rajdhani font-bold text-base md:text-xl hidden sm:inline">{timeB.nome}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vídeo + Chat */}
      <section className="relative z-10 flex-1 min-h-0 bg-black flex">
        <div className={`flex-1 h-full ${mostrarChat ? 'w-2/3' : 'w-full'}`}>
          <iframe
            src={videoUrl}
            title="Transmissão da partida"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        {mostrarChat && chatUrl && (
          <div className="w-80 md:w-96 h-full border-l border-white/10 bg-white hidden md:block">
            <iframe
              src={chatUrl}
              title="Chat ao vivo"
              className="w-full h-full"
            />
          </div>
        )}
      </section>
    </main>
  );
}
