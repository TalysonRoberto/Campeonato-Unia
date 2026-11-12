'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TimeInfo {
  id?: string;
  nome: string;
  logo: string;
  cor?: string;
}

interface PartidaInfo {
  timeA: TimeInfo;
  timeB: TimeInfo;
  placarA: number;
  placarB: number;
  status: string;
  fase: string;
  data?: string | null;
  horario?: string | null;
}

function extrairVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface YouTubeModalButtonProps {
  url: string;
  partida?: PartidaInfo;
  label?: string;
  className?: string;
}

export default function YouTubeModalButton({ url, partida, label = 'ASSISTIR', className = '' }: YouTubeModalButtonProps) {
  const [aberto, setAberto] = useState(false);
  const videoId = extrairVideoId(url);

  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [aberto]);

  if (!videoId) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  const statusLabel = partida?.status === 'ao_vivo' ? 'AO VIVO' : partida?.status === 'finalizada' ? 'FINALIZADA' : 'AGENDADA';
  const statusClass = partida?.status === 'ao_vivo' ? 'bg-red-600 text-white animate-pulse' : partida?.status === 'finalizada' ? 'bg-white/10 text-gray-300' : 'bg-valorant-red/20 text-valorant-red';

  return (
    <>
      <button onClick={() => setAberto(true)} className={className}>
        {label}
      </button>
      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 overflow-hidden"
          onClick={() => setAberto(false)}
        >
          <div
            className="w-full max-w-[1400px] h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-4">
                <span className="font-rajdhani font-bold text-2xl tracking-wider text-white">TRANSMISSÃO</span>
                <span className={`px-3 py-1 text-xs font-rajdhani font-bold tracking-wider ${statusClass}`}>
                  {statusLabel}
                </span>
              </div>
              <button
                onClick={() => setAberto(false)}
                className="text-white/70 hover:text-white text-3xl font-bold leading-none px-2"
                aria-label="Fechar"
              >
                &times;
              </button>
            </div>

            {/* Info da partida */}
            {partida && (
              <div className="flex items-center justify-between gap-4 mb-4 px-4 py-3 border border-white/10 bg-white/5 shrink-0">
                <div className="flex items-center gap-3 flex-1 justify-center">
                  {partida.timeA.cor && <div className="w-1.5 h-8 rounded-sm" style={{ backgroundColor: partida.timeA.cor }} />}
                  <Image src={partida.timeA.logo} alt={partida.timeA.nome} width={40} height={40} className="w-10 h-10 object-contain" />
                  <span className="font-rajdhani font-bold text-lg hidden sm:inline">{partida.timeA.nome}</span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-3xl font-rajdhani font-bold text-white">
                    {partida.status !== 'agendada' ? `${partida.placarA} - ${partida.placarB}` : 'VS'}
                  </span>
                  <span className="text-gray-400 text-xs font-rajdhani uppercase">{partida.fase}</span>
                </div>
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <span className="font-rajdhani font-bold text-lg hidden sm:inline">{partida.timeB.nome}</span>
                  <Image src={partida.timeB.logo} alt={partida.timeB.nome} width={40} height={40} className="w-10 h-10 object-contain" />
                  {partida.timeB.cor && <div className="w-1.5 h-8 rounded-sm" style={{ backgroundColor: partida.timeB.cor }} />}
                </div>
              </div>
            )}

            {/* Vídeo */}
            <div className="relative w-full flex-1 min-h-0 border border-white/10 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
