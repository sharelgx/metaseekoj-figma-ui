import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../../../figma/ImageWithFallback';

interface ImageSlideProps {
  title?: string;
  image: string;
  caption?: string;
  layout?: 'full' | 'contained' | 'split';
  content?: React.ReactNode;
}

export function ImageSlide({
  title,
  image,
  caption,
  layout = 'contained',
  content
}: ImageSlideProps) {
  if (layout === 'full') {
    return (
      <div className="w-full h-full relative">
        <ImageWithFallback
          src={image}
          alt={title || 'Slide image'}
          className="w-full h-full object-cover"
        />
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-16"
          >
            <h2 className="text-6xl font-bold text-white mb-4">{title}</h2>
            {caption && <p className="text-2xl text-white/80">{caption}</p>}
          </motion.div>
        )}
      </div>
    );
  }

  if (layout === 'split') {
    return (
      <div className="w-full h-full bg-slate-50 grid grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-16 flex flex-col justify-center"
        >
          {title && (
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          <div className="text-xl text-slate-700 leading-relaxed">
            {content}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <ImageWithFallback
            src={image}
            alt={title || 'Slide image'}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-4 sm:p-8 md:p-12 lg:p-16 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        {title && (
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {title}
          </h2>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center h-auto md:h-[calc(100%-120px)]"
      >
        <div className="max-w-full md:max-w-4xl lg:max-w-5xl w-full">
          <ImageWithFallback
            src={image}
            alt={title || 'Slide image'}
            className="w-full h-auto rounded-xl md:rounded-2xl shadow-2xl"
          />
          {caption && (
            <p className="text-center text-base sm:text-lg md:text-xl text-slate-600 mt-4 md:mt-6">{caption}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
