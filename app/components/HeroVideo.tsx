'use client';

import { useState, useRef, useEffect } from 'react';

export default function HeroVideo() {
  const [isHovered, setIsHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Tenta tocar com som automaticamente (funciona em alguns contextos, ex: PWA ou sites confiáveis)
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay com som foi bloqueado: volta a muted e aguarda interação
        video.muted = true;
        setMuted(true);
      });
    }

    const unmuteOnInteraction = () => {
      if (video && video.muted) {
        video.muted = false;
        video.volume = 0.3;
        setMuted(false);
        setNeedsInteraction(false);
      }
    };

    window.addEventListener('click', unmuteOnInteraction, { once: true });
    window.addEventListener('keydown', unmuteOnInteraction, { once: true });
    window.addEventListener('touchstart', unmuteOnInteraction, { once: true });

    return () => {
      window.removeEventListener('click', unmuteOnInteraction);
      window.removeEventListener('keydown', unmuteOnInteraction);
      window.removeEventListener('touchstart', unmuteOnInteraction);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) {
      video.volume = 0.3;
      setNeedsInteraction(false);
    }
    setMuted(video.muted);
  };

  return (
    <div
      className="relative w-full max-w-md lg:max-w-2xl xl:max-w-3xl aspect-video rounded-lg overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,70,85,0.15)] bg-black group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        autoPlay
        muted={muted}
        loop
        playsInline
        controls={isHovered}
        className="w-full h-full object-cover"
      />

      {/* Botão de som quando muted */}
      {muted && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/70 hover:bg-valorant-red/90 text-white text-xs font-rajdhani font-bold tracking-wider rounded border border-white/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          {needsInteraction ? 'CLIQUE PARA ATIVAR O SOM' : 'SOM DESATIVADO'}
        </button>
      )}
    </div>
  );
}
