import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Heart, ShieldAlert } from 'lucide-react';
import { LandingSettings } from '../types';

interface HeaderProps {
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminMode: boolean;
  onExitAdmin: () => void;
  scrollToSection: (id: string) => void;
  settings?: LandingSettings;
}

export default function Header({
  wishlistCount,
  onOpenWishlist,
  onOpenAdmin,
  isAdminMode,
  onExitAdmin,
  scrollToSection,
  settings
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-beige/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
          className="flex items-center gap-3 select-none text-left"
        >
          {settings?.logoImage ? (
            <img src={settings.logoImage} alt="Logo" className="h-10 max-w-[150px] object-contain rounded-sm" />
          ) : (
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-dark">Dinar</span>
              <span className="font-sans text-[9px] tracking-[0.3em] text-brand-brown uppercase -mt-1 font-semibold">Furniture</span>
            </div>
          )}
        </a>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-10 font-sans text-xs tracking-wider uppercase font-semibold text-brand-dark/80">
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
            className="hover:text-brand-brown transition-colors cursor-pointer"
          >
            Beranda
          </a>
          <a 
            href="#katalog" 
            onClick={(e) => { e.preventDefault(); handleNavClick('katalog'); }}
            className="hover:text-brand-brown transition-colors cursor-pointer"
          >
            Katalog
          </a>
          <a 
            href="#portofolio" 
            onClick={(e) => { e.preventDefault(); handleNavClick('portofolio'); }}
            className="hover:text-brand-brown transition-colors cursor-pointer"
          >
            Portofolio
          </a>
          <a 
            href="#kontak" 
            onClick={(e) => { e.preventDefault(); handleNavClick('kontak'); }}
            className="hover:text-brand-brown transition-colors cursor-pointer"
          >
            Kontak
          </a>
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Wishlist Button */}
          <button 
            onClick={onOpenWishlist}
            className="relative p-2 text-brand-dark hover:text-brand-gold transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-brand-cream">
                {wishlistCount}
              </span>
            )}
          </button>

        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-4">
          <button 
            onClick={onOpenWishlist}
            className="relative p-2 text-brand-dark hover:text-brand-gold transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-brand-dark"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-brand-cream border-b border-brand-beige absolute top-20 left-0 right-0 px-6 py-8 flex flex-col space-y-6 shadow-lg z-30 font-sans"
          >
            <a 
              href="#hero" 
              onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
              className="text-sm font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-brown"
            >
              Beranda
            </a>
            <a 
              href="#katalog" 
              onClick={(e) => { e.preventDefault(); handleNavClick('katalog'); }}
              className="text-sm font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-brown"
            >
              Katalog
            </a>
            <a 
              href="#portofolio" 
              onClick={(e) => { e.preventDefault(); handleNavClick('portofolio'); }}
              className="text-sm font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-brown"
            >
              Portofolio
            </a>
            <a 
              href="#kontak" 
              onClick={(e) => { e.preventDefault(); handleNavClick('kontak'); }}
              className="text-sm font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-brown"
            >
              Kontak
            </a>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
