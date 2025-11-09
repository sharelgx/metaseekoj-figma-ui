import React from 'react';
import { motion } from 'motion/react';

interface ContentSlideProps {
  title: string;
  layout?: 'single' | 'split' | 'sidebar';
  theme?: 'light' | 'dark' | 'gradient';
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function ContentSlide({
  title,
  layout = 'single',
  theme = 'light',
  children,
  sidebar
}: ContentSlideProps) {
  const themes = {
    light: 'bg-white text-slate-900',
    dark: 'bg-slate-900 text-white',
    gradient: 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900'
  };

  return (
    <div className={`w-full h-full ${themes[theme]} p-4 sm:p-8 md:p-12 lg:p-16 overflow-auto`}>
      {/* Title - Responsive */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8 lg:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="w-16 sm:w-20 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full" />
      </motion.div>

      {/* Content Layout */}
      {layout === 'single' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-full lg:max-w-5xl"
        >
          {children}
        </motion.div>
      )}

      {layout === 'split' && (
        <div className="grid grid-cols-2 gap-12 h-[calc(100%-120px)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {sidebar}
          </motion.div>
        </div>
      )}

      {layout === 'sidebar' && (
        <div className="grid grid-cols-[2fr,1fr] gap-12 h-[calc(100%-120px)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6"
          >
            {sidebar}
          </motion.div>
        </div>
      )}
    </div>
  );
}
