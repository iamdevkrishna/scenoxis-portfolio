import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowUpRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToVideos } from '../data/store';

/* 
  HOW TO ADD YOUR OWN VIDEOS TO THE WORK SECTION:
  1. Add your .mp4 files to the /public folder, or use YouTube embed URLs.
  2. In the ALL_PROJECTS array below, update the 'video' or 'embedUrl' property.
  3. Ensure 'format' matches the video ratio. Use '16:9' for horizontal, '9:16' for vertical.
*/
const ALL_PROJECTS: any[] = [];

function StackCarousel({ projects }: { projects: typeof ALL_PROJECTS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Reset index when categories change
  useEffect(() => {
    setCurrentIndex(0);
    setPlayingId(null);
  }, [projects]);

  if (projects.length === 0) return (
     <div className="w-full py-32 text-center font-mono text-white/40 uppercase tracking-widest text-sm">
        Processing files... No edits found in this category.
     </div>
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setPlayingId(null);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    setPlayingId(null);
  };

  // Support swipe
  const handleDragEnd = (_e: any, { offset, velocity }: any) => {
    if (playingId) return; // Disable drag if playing iframe to avoid interference
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -100) {
      nextSlide();
    } else if (swipe > 100) {
      prevSlide();
    }
  };

  return (
    <div className="w-full relative py-10 md:py-20 flex flex-col items-center">
      
      {/* 3D Stack Container */}
      <div className="relative w-full max-w-[1200px] h-[500px] md:h-[650px] flex items-center justify-center perspective-[1200px] sm:perspective-[2000px]">
        <AnimatePresence mode="popLayout">
          {projects.map((project, idx) => {
            // Determine position in the stack relative to current index
            let offset = idx - currentIndex;
            
            // Handle looping math for seamless effect
            const halfLength = Math.floor(projects.length / 2);
            if (offset > halfLength) offset -= projects.length;
            if (offset < -halfLength) offset += projects.length;

            const isActive = offset === 0;
            const isPlaying = playingId === project.id;
            const isVisible = Math.abs(offset) <= 2; // Only show +- 2 items to save rendering
            
            const getEmbedSrc = (url: string, active: boolean) => {
              if (active) return url;
              const separator = url.includes('?') ? '&' : '?';
              return `${url}${separator}autoplay=1&mute=1&controls=0&loop=1&playlist=${url.split('/').pop()?.split('?')[0]}`;
            };

            if (!isVisible) return null;

            // Visual calculations based on position
            const zIndex = 10 - Math.abs(offset);
            const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.1;
            const yPos = offset * 30; // Stack downwards slightly
            const xPos = offset * (window.innerWidth > 768 ? 150 : 80); // Spread horizontally
            const opacity = isActive ? 1 : 1 - Math.abs(offset) * 0.4;
            const blur = isActive ? 0 : Math.abs(offset) * 4;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  scale,
                  y: yPos,
                  x: xPos,
                  zIndex,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag={isActive && !isPlaying ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={isActive ? handleDragEnd : undefined}
                className={`absolute flex items-center justify-center rounded-[2rem] overflow-hidden glass shadow-2xl border ${isActive ? 'border-brand-cyan/40 shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-none'}
                  ${!isPlaying && isActive ? 'cursor-grab active:cursor-grabbing' : ''}
                  ${project.format === '9:16' ? 'w-[280px] sm:w-[320px] aspect-[9/16]' : 'w-[90vw] md:w-[65vw] max-w-4xl aspect-video'}
                `}
                onClick={() => {
                  if (isActive && !isPlaying) {
                    setPlayingId(project.id);
                  }
                  else if (offset === 1) nextSlide();
                  else if (offset === -1) prevSlide();
                }}
              >
                {/* Embedded Video Player */}
                {project.embedUrl ? (
                  <div className="absolute inset-0 w-full h-full bg-black z-0">
                    <iframe 
                      src={getEmbedSrc(project.embedUrl, isPlaying)} 
                      className={`w-full h-full border-0 ${isPlaying ? 'pointer-events-auto relative z-50' : 'pointer-events-none scale-125 opacity-70 grayscale transition-all duration-1000' } ${isActive ? 'grayscale-0 opacity-100' : ''}`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video 
                    src={project.video}
                    poster={project.poster}
                    autoPlay
                    loop
                    muted={!isPlaying}
                    controls={isPlaying}
                    playsInline
                    className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'pointer-events-auto relative z-50' : 'pointer-events-none'} ${isActive ? 'opacity-90 saturate-100 filter-none' : 'opacity-40 saturate-0'}`}
                  />
                )}
                
                {!isPlaying && (
                  <>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/10 to-transparent opacity-90 transition-opacity pointer-events-none" />
                    
                    {/* Center Play UI - Only on active */}
                    {isActive && (
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none scale-90 hover:scale-100">
                         <div className="w-20 h-20 rounded-full bg-brand-cyan/20 backdrop-blur-md flex items-center justify-center border border-brand-cyan/50 text-brand-cyan shadow-[0_0_30px_rgba(0,245,255,0.4)]">
                           <Play fill="currentColor" size={32} className="ml-1" />
                         </div>
                       </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-6 left-6 flex gap-2 pointer-events-none">
                      <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-mono uppercase tracking-widest border transition-colors ${isActive ? 'bg-brand-cyan/10 border-brand-cyan/50 text-brand-cyan' : 'bg-black/50 border-white/10 text-white/50'}`}>
                        {project.category}
                      </span>
                    </div>

                    {/* Bottom Info */}
                    <div className={`absolute bottom-0 left-0 right-0 p-8 pb-10 transform transition-transform duration-500 pointer-events-none ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className={`text-[10px] font-mono uppercase tracking-[0.3em] block mb-2 drop-shadow-md ${isActive ? 'text-brand-cyan' : 'text-white/40'}`}>
                            {project.client}
                          </span>
                          <h3 className={`font-display font-black uppercase tracking-tighter leading-none transition-colors ${project.format === '9:16' ? 'text-3xl' : 'text-3xl md:text-5xl'} ${isActive ? 'text-white' : 'text-white/40'}`}>
                            {project.title}
                          </h3>
                        </div>
                        {isActive && (
                          <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/40 text-white backdrop-blur-sm -rotate-45">
                            <ArrowUpRight size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Stack Controls */}
      <div className="flex items-center gap-6 mt-8 z-20">
         <button 
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
         >
           <ChevronLeft size={24} />
         </button>
         
         {/* Dots */}
         <div className="flex gap-2">
            {projects.map((_, idx) => (
               <button 
                 key={idx}
                 onClick={() => setCurrentIndex(idx)}
                 className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-brand-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]' : 'bg-white/20 hover:bg-white/50'}`}
                 aria-label={`Go to slide ${idx + 1}`}
               />
            ))}
         </div>

         <button 
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black hover:border-brand-cyan transition-all duration-300"
         >
           <ChevronRight size={24} />
         </button>
      </div>
    </div>
  );
}

export default function WorkSection() {
  const [activeTab, setActiveTab] = useState('All');
  const [allProjects, setAllProjects] = useState(ALL_PROJECTS);

  useEffect(() => {
    const unsubscribe = subscribeToVideos('work', (custom) => {
      setAllProjects([...ALL_PROJECTS, ...custom] as any);
    });
    return () => unsubscribe();
  }, []);

  // Compute available categories dynamically based on actual projects
  const uniqueCategories = Array.from(new Set(allProjects.map(p => p.category).filter(Boolean)));
  const categoriesToUse = ['All', ...uniqueCategories.sort()];

  const filteredProjects = activeTab === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === activeTab);

  return (
    <section className="py-32 relative bg-brand-dark" id="portfolio">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.6em] mb-4 block">Archive</span>
            <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
              Selected <span className="text-white/40">Work</span>
            </h2>
          </div>
          
          <div className="flex flex-col w-full md:w-auto">
            {/* Filter Tabs using scroll for mobile */}
            <div className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full max-w-[100vw] md:max-w-2xl gap-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categoriesToUse.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`snap-center shrink-0 px-6 py-2.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 border ${
                    activeTab === category 
                      ? 'bg-brand-cyan text-black border-brand-cyan shadow-[0_0_15px_rgba(0,245,255,0.3)]' 
                      : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StackCarousel projects={filteredProjects} />
      
    </section>
  );
}
