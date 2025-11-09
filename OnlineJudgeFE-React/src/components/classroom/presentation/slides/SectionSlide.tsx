import React from 'react';
import { motion } from 'motion/react';

interface SectionSlideProps {
  title: string;
  subtitle?: string;
  number?: number;
  color?: 'blue' | 'purple' | 'green' | 'orange';
}

export function SectionSlide({
  title,
  subtitle,
  number,
  color = 'blue'
}: SectionSlideProps) {
  const colors = {
    blue: 'from-blue-600 to-cyan-600',
    purple: 'from-purple-600 to-pink-600',
    green: 'from-emerald-600 to-teal-600',
    orange: 'from-orange-600 to-red-600'
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors[color]} relative overflow-hidden`}>
      {/* Large Number Background */}
      {number && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[600px] font-bold leading-none">
            {number}
          </span>
        </div>
      )}

      {/* Content - Responsive */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {number && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/60 mb-4 md:mb-6"
            >
              Chapter {number}
            </motion.div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight px-4">
            {title}
          </h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 max-w-3xl px-4"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-full" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white/20 rounded-full" />
    </div>
  );
}
