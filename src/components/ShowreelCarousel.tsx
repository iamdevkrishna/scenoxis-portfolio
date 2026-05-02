import { motion } from 'motion/react';
import React, { useRef, useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToAllVideos } from '../data/store';

/* 
  HOW TO ADD YOUR OWN VIDEOS:
  1. Upload your .mp4 files directly to the /public folder (e.g. /public/my-video.mp4) or use YouTube embed URLs.
  2. Update the "video" property or "embedUrl" below.
  3. You can also replace the "poster" strings with paths to your thumbnail images.
*/
const SHOWREELS: any[] = [];

export default function ShowreelCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Mouse Drag to Scroll Logic
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);
  const [allShowreels, setAllShowreels] = useState(SHOWREELS);

  useEffect(() => {
    const unsubscribe = subscribeToAllVideos((custom) => {
      const topReels = custom.filter(v => v.type === 'showreel' || v.isTopShowreel);
      setAllShowreels([...SHOWREELS, ...topReels] as any);
    });
    return () => unsubscribe();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? window.innerWidth * 0.5 : window.innerWidth * 0.8;
      const targetScroll = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 10) setDragMoved(true);
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-32 overflow-hidden bg-brand-dark/50 relative z-20 border-t border-white/5" id="showreels">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.6em] mb-4 block">Director's Cut</span>
          <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none relative z-10">
            Top <span className="text-brand-cyan drop-shadow-[0_0_20px_rgba(0,245,255,0.3)]">Showreels</span>
          </h2>
        </div>
        
        <div className="flex flex-col gap-6 items-end">
           <div className="max-w-xs text-white/40 text-sm font-medium text-right relative z-10">
             A curated selection of our highest-impact edits. Explore cinematic sequences engineered for pure engagement. Drag or click arrows to explore.
           </div>
           
           {/* Navigation Controls */}
           <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black hover:border-brand-cyan transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black hover:border-brand-cyan transition-all duration-300"
              >
                <ChevronRight size={24} />
              </button>
           </div>
        </div>
      </div>

      <div className="w-full relative">
        <div className="absolute top-0 bottom-0 left-0 w-8 md:w-20 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 md:w-20 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none" />

        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pl-6 md:pl-12 pr-[20vw] pb-10 pt-4 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'}`}
        >
          {allShowreels.map((reel, idx) => {
            const isPlaying = playingId === reel.id;
            
            const getEmbedSrc = (url: string, active: boolean) => {
              if (active) return url;
              const separator = url.includes('?') ? '&' : '?';
              return `${url}${separator}autoplay=1&mute=1&controls=0&loop=1&playlist=${url.split('/').pop()?.split('?')[0]}`;
            };

            return (
              <div 
                key={reel.id} 
                className={`relative shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] aspect-video rounded-3xl overflow-hidden glass group border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] snap-center hover:border-brand-cyan/40 transition-colors duration-500 ${isPlaying ? 'z-50' : ''}`}
              >
                {/* Embedded Video Player */}
                {reel.embedUrl ? (
                  <div className="absolute inset-0 w-full h-full bg-black z-0">
                    <iframe 
                      src={getEmbedSrc(reel.embedUrl, isPlaying)} 
                      className={`w-full h-full border-0 ${isPlaying ? 'pointer-events-auto relative z-50' : 'pointer-events-none scale-125 opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000'}`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video 
                    src={reel.video}
                    poster={reel.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105 pointer-events-none"
                  />
                )}
                
                {!isPlaying && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
                    
                    {/* Center Play Button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <motion.div 
                        onClick={() => {
                          if (dragMoved) return;
                          setPlayingId(reel.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20 backdrop-blur-lg flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-cyan hover:text-black hover:border-brand-cyan hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] text-white cursor-pointer shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                      >
                        <Play fill="currentColor" size={32} className="translate-x-[2px] pointer-events-none" />
                      </motion.div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 md:p-10 md:pb-12 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                      <div className="flex gap-2 mb-4">
                        {(reel.tags || []).map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-mono uppercase tracking-widest text-white/80 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] block mb-2">{reel.client}</span>
                          <h3 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none text-white">{reel.title}</h3>
                        </div>
                        <div className="text-5xl md:text-6xl font-display font-black text-white/10 leading-none group-hover:text-white/20 transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
