import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';

interface HeroSlideProps {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  tags?: string[];
  background?: 'gradient' | 'dots' | 'mesh';
}

export function HeroSlide({
  title,
  subtitle,
  author,
  date,
  tags,
  background = 'gradient'
}: HeroSlideProps) {
  const backgrounds = {
    gradient: 'bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600',
    dots: 'bg-slate-900',
    mesh: 'bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900'
  };

  return (
    <div className={`w-full h-full ${backgrounds[background]} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      {background === 'dots' && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      )}

      {background === 'mesh' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
      )}

      {/* Content - Responsive */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {tags && (
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6 justify-center">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm md:text-base"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight px-4">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-6 md:mb-8 max-w-4xl px-4">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-white/60 text-sm sm:text-base md:text-lg lg:text-xl">
            {author && <span>{author}</span>}
            {author && date && <span className="hidden sm:inline">•</span>}
            {date && <span>{date}</span>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
