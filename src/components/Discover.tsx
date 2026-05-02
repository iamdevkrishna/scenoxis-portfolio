import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { Video, Sparkles, Smartphone, Layers, ArrowUpRight, Activity, Terminal, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { subscribeToSettings, AppSettings } from '../data/store';

export default function Discover() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const unsub = subscribeToSettings((data) => setSettings(data));
    return () => unsub();
  }, []);

  const completedProjects = settings?.completedProjectsCount ?? 200;

  useEffect(() => {
    if (isInView) {
      animate(count, completedProjects, { duration: 2.5, ease: "easeOut" });
    }
  }, [isInView, completedProjects, count]);

  return (
    <section className="py-32 px-6 relative" id="services">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1px] w-12 bg-brand-cyan" />
              <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em]">
                System Architecture
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500 drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">Specialties</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              Precision-engineered post-production. We deploy cutting-edge workflows to transform raw footage into high-retention cinematic assets.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end gap-2 mt-8 md:mt-0"
          >
            <div ref={counterRef} className="text-base md:text-xl font-display text-black uppercase tracking-tight md:tracking-widest px-8 py-5 bg-brand-cyan rounded-full flex items-center gap-3 mb-4 shadow-[0_0_40px_rgba(0,245,255,0.5)] font-black hover:scale-105 transition-transform duration-300">
              <CheckCircle2 size={28} className="text-black" />
              <span><motion.span>{rounded}</motion.span>+ Projects Completed</span>
            </div>
            <div className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest text-left md:text-right hidden md:block">
              Status _ <span className="text-brand-cyan font-bold">Operational</span><br/>
              Capacity _ 100%
            </div>
            <div className="hidden md:flex gap-1.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-brand-cyan animate-pulse shadow-[0_0_10px_rgba(0,245,255,0.8)]' : 'bg-white/10'}`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[650px]">
          
          {/* Card 1: Expert Video Editing (Large, Top Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 0.99 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:col-span-8 md:row-span-1 rounded-3xl p-8 md:p-10 flex flex-col justify-between group relative overflow-hidden bg-black border border-white/10"
          >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-cyan group-hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-500">
                <Video className="text-white group-hover:text-black transition-colors" size={24} />
              </div>
              <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase border border-white/10 px-3 py-1.5 rounded-full group-hover:border-brand-cyan/50 group-hover:text-brand-cyan transition-colors">
                Module_01
              </div>
            </div>
            
            <div className="relative z-10 mt-16 md:mt-0">
              <h3 className="text-3xl md:text-5xl font-display font-black uppercase mb-3 tracking-tight group-hover:text-brand-cyan transition-colors duration-300">
                Expert Video Editing
              </h3>
              <p className="text-white/50 max-w-md text-sm md:text-base leading-relaxed">
                High-end post-production for commercials, documentaries, and narrative storytelling. Every cut is meticulously timed for maximum psychological impact.
              </p>
            </div>
            
            {/* Tech Decoration */}
            <ArrowUpRight className="absolute bottom-8 right-8 text-white/20 group-hover:text-brand-cyan group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500 w-8 h-8 md:w-12 md:h-12" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>

          {/* Card 2: Motion Graphics (Small, Top Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5, scale: 0.99 }}
            className="md:col-span-4 md:row-span-1 rounded-3xl p-8 flex flex-col justify-between group relative overflow-hidden bg-neutral-950 border border-white/5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
            
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 group-hover:scale-150 transition-transform duration-700" />
                <Layers className="text-brand-cyan relative z-10" size={20} />
              </div>
              <Activity className="text-white/20 group-hover:text-brand-cyan transition-colors" size={20} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-black uppercase mb-3">Motion Graphics</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Dynamic 2D/3D sequences, kinetic typography, and bespoke visual effects that command attention.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Color Grading (Small, Bottom Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, scale: 0.99 }}
            className="md:col-span-5 md:row-span-1 rounded-3xl p-8 flex flex-col justify-between group relative overflow-hidden bg-neutral-950 border border-white/5"
          >
            {/* Color spectrum decoration */}
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
            
            <div className="relative z-10 flex flex-col items-start gap-4 mb-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50 group-hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-blue-500/50 group-hover:bg-brand-cyan transition-colors" />
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-colors">
                <Sparkles className="text-white" size={20} />
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-black uppercase mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-cyan transition-all">
                Color Grading
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Cinematic color spaces tailored to evoke specific emotions and solidify your visual brand identity.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Short Form & Viral (Wide, Bottom Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, scale: 0.99 }}
            className="md:col-span-7 md:row-span-1 rounded-3xl p-8 md:p-10 flex flex-col justify-between group relative overflow-hidden bg-black border border-white/10"
          >
            {/* Infinite scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" />
            <div className="absolute inset-0 bg-brand-cyan/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-700 ease-out" />
            
            <div className="relative z-10 flex justify-between items-start">
               <div className="w-14 h-14 border border-brand-cyan/30 bg-brand-cyan/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-cyan group-hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-500">
                 <Smartphone className="text-brand-cyan group-hover:text-black transition-colors" size={24} />
               </div>
               
               <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Viral Optimized</span>
               </div>
            </div>
            
            <div className="relative z-10 mt-12 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-3xl md:text-5xl font-display font-black uppercase mb-3 tracking-tight">
                  UGC & Shorts
                </h3>
                <p className="text-white/50 max-w-sm text-sm md:text-base leading-relaxed">
                  Engineered for the algorithm. Fast-paced, attention-grabbing content tuned for TikTok, Reels, and YouTube Shorts.
                </p>
              </div>
              
              {/* Engagement metrics decoration */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                  <span>RETENTION</span>
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-cyan w-[85%] group-hover:w-[95%] transition-all duration-1000" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                  <span>ENGAGEMENT</span>
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 w-[70%] group-hover:w-[90%] transition-all duration-1000 delay-100" />
                  </div>
                </div>
              </div>
            </div>
            
            <Terminal className="absolute -bottom-8 -right-8 w-40 h-40 text-white/5 group-hover:text-brand-cyan/10 transition-colors duration-500 transform -rotate-12" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
