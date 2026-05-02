import { motion } from 'motion/react';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-32 px-6 overflow-x-clip" id="hero">
      {/* Light Leaks */}
      <div className="light-leak top-[-10%] left-[-10%] w-[60vw]" />
      <div className="light-leak bottom-[-10%] right-[-10%] w-[50vw] opacity-30" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Editorial Content */}
        <div className="text-left z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8 opacity-60"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.6em]">Scenoxis Creative Studio</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white to-transparent" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-[4.5rem] 2xl:text-7xl font-display font-black leading-[0.9] mb-10 uppercase tracking-tight whitespace-nowrap">
            <motion.span 
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="block text-gradient-fade pb-1"
            >
              Visuals
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block text-brand-cyan py-1 drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]"
            >
              That Demand
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="block text-gradient-fade pt-1"
            >
              Attention.
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-base md:text-lg text-white/40 max-w-xl leading-relaxed font-medium mb-16"
          >
            Award-winning video editing and motion design for creators who refuse to be ignored. We don't just edit; we engineer engagement through cinematic storytelling.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center gap-8"
          >
            <motion.button 
              whileHover={{ scale: 1.05, background: "#fff", color: "#000" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-12 py-5 border border-white/20 rounded-sm font-black uppercase text-xs tracking-[0.3em] transition-all"
            >
              Start Project
            </motion.button>
            <button 
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-4 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em] group"
            >
              <span>View Showcase</span>
              <div className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-brand-cyan transition-all" />
            </button>
          </motion.div>
        </div>

        {/* Right Side: Media Card / Visual Hook */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="relative hidden lg:block"
        >
          {/* Offer Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: -5 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="absolute -top-8 -left-8 z-30 glass-morphism border border-brand-cyan/40 px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,245,255,0.15)] group-hover:rotate-0 transition-transform duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute -inset-10 bg-brand-cyan/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity pointer-events-none" />
            <div className="relative z-10 flex flex-col">
              <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 inline-block shrink-0 bg-brand-cyan rounded-full animate-pulse shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
                Limited Offer
              </span>
              <span className="text-xl font-display font-black uppercase text-white leading-none tracking-tight">Claim 1 Free <br/> Trial Edit</span>
            </div>
          </motion.div>

          {/* Technical UI Floater 1 */}
          <div className="absolute top-10 -right-24 z-20 glass-morphism px-4 py-3 rounded-lg border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">Rendering_Status</span>
              <span className="text-xs font-mono text-white">4K • ProRes 4444</span>
            </div>
          </div>

          <div className="aspect-[4/3] max-h-[600px] glass-morphism rounded-3xl overflow-hidden relative group border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <img 
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2000&auto=format&fit=crop" 
              alt="Studio Hook" 
              className="w-full h-full object-cover opacity-60 grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-10 left-10 right-10 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-[2px] bg-brand-cyan" />
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold">Showreel '26</span>
              </div>
              <h3 className="text-4xl font-display font-black uppercase tracking-tighter mb-4 text-white">Cinematic Cuts</h3>
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest mb-1">Format</span>
                  <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">9:16 / 16:9</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest mb-1">Grading</span>
                  <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">REC.709</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100 cursor-pointer">
              <div onClick={() => document.getElementById('showreels')?.scrollIntoView({ behavior: 'smooth' })} className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 hover:scale-110 transition-transform">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <Play fill="currentColor" size={24} className="ml-1" />
                </div>
              </div>
            </div>
            
            {/* Corner UI */}
            <div className="absolute top-6 left-6 flex gap-1">
              <div className="w-1 h-3 bg-brand-cyan" />
              <div className="w-1 h-3 bg-white/20" />
              <div className="w-1 h-3 bg-white/20" />
            </div>
            <div className="absolute top-6 right-6 text-[10px] font-mono text-white/30 uppercase">
              REC
            </div>
          </div>

          {/* Decorative Floaties */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-cyan/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
}
