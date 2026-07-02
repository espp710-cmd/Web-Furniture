import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
  logoImage?: string;
}

export default function Splash({ onComplete, logoImage }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // graceful fade
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream"
    >
      {/* Background soft ambient glows */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%]" />

      <div className="flex flex-col items-center space-y-10 max-w-lg w-full px-6 relative z-10">
        {/* Logo Container with Ambient Depth */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="w-56 h-56 md:w-64 md:h-64 relative flex flex-col items-center justify-center bg-white rounded-full shadow-[0_30px_60px_-15px_rgba(107,79,58,0.12)] border border-brand-beige p-6"
        >
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border border-brand-gold/30 animate-pulse" />

          {logoImage ? (
            <img 
              src={logoImage} 
              alt="Logo" 
              className="max-h-24 max-w-[180px] object-contain mb-2" 
            />
          ) : (
            <>
              {/* Golden crown emblem or sparkle */}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="text-brand-gold mb-2"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>

              <span className="font-serif text-3xl font-medium tracking-tight text-brand-dark">Dinar</span>
              <span className="font-sans text-xs tracking-[0.25em] text-brand-brown uppercase font-semibold mt-1">Furniture</span>
            </>
          )}
          
          <div className="absolute bottom-6 font-sans text-[10px] tracking-widest text-brand-gold font-medium uppercase">
            Est. 2024
          </div>
        </motion.div>

        {/* Loading Indicator Group */}
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Custom Sleek Progress Bar */}
          <div className="w-48 h-[2px] bg-brand-beige relative overflow-hidden rounded-full">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-brand-brown"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            className="flex flex-col items-center space-y-1"
          >
            <span className="font-serif italic text-brand-dark text-lg">Crafting Architectural Serenity</span>
            <span className="font-sans text-[10px] tracking-[0.2em] text-brand-brown uppercase font-medium mt-1">
              {progress < 100 ? 'Initializing Experience' : 'Welcome to Dinar'} ({progress}%)
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
