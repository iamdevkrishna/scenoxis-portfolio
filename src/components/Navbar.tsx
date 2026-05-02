import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Studio', href: '#portfolio' },
    { name: 'Showreels', href: '#showreels' },
    { name: 'Services', href: '#services' },
  ];

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-5xl z-50 px-6" id="navbar">
      <div className="glass-morphism rounded-full h-16 flex items-center justify-between px-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Logo & Name */}
        <div className="flex items-center gap-4 pl-4 group cursor-pointer" id="nav-logo">
          <img 
            src="/logos/Scenoxis Logo.png" 
            alt="Scenoxis Prime Logo" 
            className="w-12 h-12 object-contain filter drop-shadow-[0_0_20px_rgba(0,245,255,0.8)] group-hover:drop-shadow-[0_0_35px_rgba(0,245,255,1)] group-hover:scale-105 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <span className="text-white font-display font-black tracking-widest text-lg md:text-xl uppercase hidden sm:block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">SCENOXIS</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10" id="nav-desktop-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white/40 hover:text-white transition-all duration-300 text-[11px] font-bold uppercase tracking-[0.2em] relative group"
              id={`nav-link-${link.name.toLowerCase()}`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-cyan transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="pr-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-brand-cyan transition-all shadow-xl shadow-white/5"
            id="nav-cta"
          >
            Work With Us
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white mr-4" onClick={() => setIsOpen(!isOpen)} id="nav-mobile-toggle">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 bg-brand-surface border border-white/10 rounded-3xl p-6 shadow-2xl"
          id="nav-mobile-menu"
        >
          <div className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-brand-cyan text-sm font-bold uppercase transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-white/5" />
            <button 
              onClick={() => {
                setIsOpen(false);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-black py-3 rounded-full font-black uppercase text-xs hover:bg-brand-cyan transition-colors"
            >
              Book a Call
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
