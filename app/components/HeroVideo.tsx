'use client';

import { useState, useRef } from 'react';

export default function HeroVideo() {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="relative w-full max-w-md lg:max-w-lg aspect-video rounded-lg overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,70,85,0.15)] bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls={isHovered}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
