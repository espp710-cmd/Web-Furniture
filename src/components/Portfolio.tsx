import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { motion } from 'motion/react';
import { ArrowLeftRight } from 'lucide-react';

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  return (
    <section id="portofolio" className="py-24 bg-brand-beige/30 border-y border-brand-beige/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="font-sans text-[10px] tracking-[0.25em] text-brand-gold uppercase font-bold block mb-3">
            Portfolio Kredibilitas
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-dark mb-4">
            Spaces of Serenity
          </h2>
          <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
            Saksikan transformasi ruang biasa menjadi mahakarya estetis modern klasik. Geser slider interaktif kami untuk melihat hasil pengerjaan tim curator kami.
          </p>
        </div>

        {/* Project Grid */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.05
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id} 
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                }
              }}
              className="bg-white p-6 rounded-sm border border-brand-beige/80 shadow-sm flex flex-col space-y-6"
            >
              {/* Interactive Before-After Slider Component */}
              <BeforeAfterSlider 
                before={project.beforeImage} 
                after={project.afterImage} 
                name={project.name}
              />

              {/* Description */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] tracking-widest uppercase text-brand-brown font-bold">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-brand-gold font-semibold font-sans">
                    <span>Selesai</span>
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-brand-dark">{project.name}</h3>
                <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface SliderProps {
  before: string;
  after: string;
  name: string;
}

function BeforeAfterSlider({ before, after, name }: SliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      className="relative aspect-[16/10] w-full overflow-hidden select-none cursor-ew-resize rounded-sm border border-brand-beige"
    >
      {/* After Image (Full Background) */}
      <img 
        src={after} 
        alt={`${name} After`} 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <span className="absolute bottom-4 right-4 bg-brand-dark/70 backdrop-blur-sm text-white font-sans text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 z-10">
        Hasil Akhir
      </span>

      {/* Before Image (Cropped Overlay) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={before} 
          alt={`${name} Before`} 
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current?.getBoundingClientRect().width }}
        />
      </div>
      <span className="absolute bottom-4 left-4 bg-brand-brown/80 backdrop-blur-sm text-white font-sans text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 z-10">
        Sebelum
      </span>

      {/* Slider Bar Handle */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-brand-gold z-20 cursor-ew-resize flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute w-8 h-8 rounded-full bg-brand-gold text-brand-dark border border-white flex items-center justify-center shadow-md">
          <ArrowLeftRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
