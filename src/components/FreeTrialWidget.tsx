import { motion } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function FreeTrialWidget() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      className="fixed bottom-6 right-6 z-[100] max-w-sm hidden md:block"
    >
      <div className="relative group cursor-pointer">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full group-hover:bg-brand-cyan/30 transition-all duration-500" />
        
        <div className="relative glass-morphism border border-white/20 p-4 rounded-2xl flex items-center gap-4 bg-black/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="absolute -top-2 -right-2 bg-neutral-800 border border-white/10 rounded-full p-1 text-white/50 hover:text-white transition-colors z-10"
          >
            <X size={12} />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-brand-cyan flex items-center justify-center shrink-0">
            <Sparkles className="text-black" size={20} />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white uppercase tracking-widest">New Clients Only</span>
            <span className="text-[10px] text-white/60 mt-1 max-w-[180px] leading-relaxed">
              We'll edit your first short-form video for free. See the Scenoxis difference.
            </span>
          </div>
          
          <div className="absolute inset-0 border border-brand-cyan/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
