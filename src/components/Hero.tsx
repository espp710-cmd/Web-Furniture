import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { LandingSettings } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  settings: LandingSettings;
}

export default function Hero({ onExploreClick, settings }: HeroProps) {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center pt-20 transition-all duration-700">
      {/* Background Image with subtle Ken Burns effect */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          alt="Luxury living room featuring Dinar sofa"
          className="w-full h-full object-cover brightness-[0.75]"
          src={settings.heroImage}
        />
        {/* Soft overlay tint matching color system */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-transparent to-brand-dark/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8">
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-xs tracking-[0.3em] text-brand-gold uppercase font-bold"
        >
          {settings.heroBadge || "Curated Modern Classic Design"}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl md:text-6xl text-white drop-shadow-md leading-tight"
        >
          {settings.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-base md:text-lg text-brand-beige max-w-2xl mx-auto drop-shadow-sm leading-relaxed"
        >
          {settings.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-4"
        >
          <button
            onClick={onExploreClick}
            className="group font-sans text-xs tracking-[0.15em] uppercase font-semibold px-8 py-4 bg-brand-brown text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 ease-in-out inline-flex items-center gap-3 border border-brand-gold shadow-lg"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Mouse scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-brand-beige">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase opacity-70">Scroll to Discover</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-brand-gold" />
        </motion.div>
      </div>
    </section>
  );
}
