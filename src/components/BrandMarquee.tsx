import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { subscribeToAllBrands, CustomBrand } from '../data/store';

export default function BrandMarquee() {
  const [brands, setBrands] = useState<CustomBrand[]>([]);

  useEffect(() => {
    const unsub = subscribeToAllBrands((data) => {
      setBrands(data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });
    return () => unsub();
  }, []);

  if (brands.length === 0) {
    return null;
  }

  // Duplicate brands to create seamless loop
  // If we only have 1 brand, we duplicate it many times to fill the screen
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <div className="py-20 bg-brand-dark/50 overflow-hidden relative z-10" id="brand-marquee">
      <div className="absolute top-0 bottom-0 left-0 w-20 md:w-32 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-20 md:w-32 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between opacity-50">
        <div className="h-px w-24 bg-brand-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
        <span className="text-[12px] md:text-[14px] font-mono text-brand-cyan uppercase tracking-[0.6em] drop-shadow-[0_0_15px_rgba(0,245,255,0.7)] font-bold text-center">Premium Collaborations</span>
        <div className="h-px w-24 bg-brand-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
      </div>

      <div className="flex w-full overflow-hidden">
        <motion.div 
          className="flex whitespace-nowrap min-w-max items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {duplicatedBrands.map((brand, i) => (
            <div key={`${brand.name}-${i}`} className="flex items-center justify-center px-10 md:px-20 group cursor-default relative">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-16 md:h-24 w-auto object-contain opacity-80 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)] group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-500 relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
