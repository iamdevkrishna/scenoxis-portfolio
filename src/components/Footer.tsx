import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch("https://formsubmit.co/ajax/scenoxisofficial@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            message,
            _cc: "devyadavofficial02@gmail.com",
            _subject: `New Project Inquiry from ${name}`,
            _template: "table",
            _captcha: "false"
        })
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        // Let the user dismiss it manually or auto close after 10 seconds
        setTimeout(() => setStatus('idle'), 10000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer className="bg-brand-dark pt-32 pb-12 px-10 border-t border-white/5 relative origin-top z-40" id="contact">
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-dark border border-brand-cyan/30 shadow-[0_0_50px_rgba(0,245,255,0.15)] rounded-3xl p-10 max-w-lg w-full text-center relative overflow-hidden"
            >
              <button 
                onClick={() => setStatus('idle')}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-brand-cyan" />
              </div>
              
              <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4">
                Transmission <span className="text-brand-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]">Received</span>
              </h3>
              
              <p className="text-white/60 font-sans text-sm leading-relaxed mb-8">
                Thank you for your inquiry. Your project details have been successfully delivered to our team. We will review your requirements and reach out via email shortly to discuss the next steps.
              </p>
              
              <button 
                onClick={() => setStatus('idle')}
                className="w-full py-4 bg-white text-black font-display font-black uppercase text-sm tracking-widest rounded-xl hover:bg-brand-cyan transition-colors"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Contact CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-32 border-b border-white/5 mb-12">
          <div id="contact-form">
            <h2 className="text-6xl font-display font-black uppercase tracking-tighter mb-6 leading-none">
              Let's Build <br /> Something <span className="text-brand-cyan drop-shadow-[0_0_20px_rgba(0,245,255,0.8)]">Epic.</span>
            </h2>
            <p className="text-white/40 mb-12 max-w-sm text-sm font-medium leading-relaxed">
              Elevating your content experience through cinematic precision. Reach out directly or use the form to start your project inquiry.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="NAME"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === 'loading'}
                  className="bg-transparent border-b border-white/10 py-4 text-sm font-sans placeholder:font-mono placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest focus:border-brand-cyan outline-none transition-colors disabled:opacity-50"
                />
                <input 
                  type="email" 
                  placeholder="EMAIL"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="bg-transparent border-b border-white/10 py-4 text-sm font-sans placeholder:font-mono placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest focus:border-brand-cyan outline-none transition-colors disabled:opacity-50"
                />
              </div>
              <textarea 
                rows={4}
                required
                placeholder="YOUR MESSAGE"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-transparent border-b border-white/10 py-4 text-sm font-sans placeholder:font-mono placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest focus:border-brand-cyan outline-none transition-colors resize-none disabled:opacity-50"
              ></textarea>
              <motion.button 
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'idle' && <>Send Inquiry <ArrowRight size={14} /></>}
                {status === 'loading' && <><Loader2 size={14} className="animate-spin" /> Sending...</>}
                {status === 'success' && <><CheckCircle2 size={14} className="text-green-500" /> Inquiry Sent</>}
                {status === 'error' && <span className="text-red-500">Failed. Please email us directly.</span>}
              </motion.button>
            </form>
          </div>

          <div className="flex flex-col justify-center space-y-16 lg:pl-20">
             <div>
                <h4 className="text-[10px] font-mono text-white/30 mb-4 uppercase tracking-[0.3em]">Direct Inquiry</h4>
                <a href="mailto:scenoxisofficial@gmail.com" className="text-2xl md:text-4xl font-display font-bold hover:text-brand-cyan transition-colors underline underline-offset-8 decoration-white/5 hover:decoration-brand-cyan/30 break-all">
                  scenoxisofficial@gmail.com
                </a>
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-white/30 mb-6 uppercase tracking-[0.3em]">Digital Presence</h4>
                <div className="flex gap-10">
                  <a href="https://www.instagram.com/scenoxis/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors relative group">
                    Instagram
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                  <a href="https://www.youtube.com/@scenoxis" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors relative group">
                    YouTube
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                </div>
              </div>
          </div>
        </div>

        {/* Bottom Bar matching Design HTML */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] text-center">
          <div className="flex items-center gap-4">
            <img 
              src="/logos/Scenoxis Logo.png" 
              alt="Scenoxis Logo" 
              className="w-6 h-6 object-contain filter opacity-50 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <span>EST. 2025 / SCENOXIS</span>
          </div>
          <div className="flex gap-4 md:gap-12 flex-col sm:flex-row">
             <span>Available for global projects</span>
             <span>Based in Prayagraj, India & Remote</span>
          </div>
          <div>© 2026 SCENOXIS</div>
        </div>
      </div>
    </footer>
  );
}
