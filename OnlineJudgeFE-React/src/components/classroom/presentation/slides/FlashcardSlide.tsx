import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';

interface FlashcardSlideProps {
  question: string;
  answer: string;
  title?: string;
  category?: string;
}

/**
 * 闪卡幻灯片组件 - 带3D翻转动画
 * 符合设计规范：slide-design-requirements.md 第4.10节
 */
export function FlashcardSlide({ question, answer, title, category }: FlashcardSlideProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 p-8 md:p-12 lg:p-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {title || '知识闪卡'}
          </h2>
          {category && (
            <Badge className="bg-purple-500 text-white text-sm md:text-base">
              {category}
            </Badge>
          )}
        </div>
        <p className="text-slate-600 text-base md:text-lg">点击卡片查看答案</p>
      </motion.div>

      {/* Flashcard Container */}
      <div className="flex items-center justify-center h-[calc(100%-150px)] md:h-[calc(100%-180px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl"
          style={{ perspective: '1000px' }}
        >
          {/* Flashcard - 3D Flip Effect */}
          <div
            className="relative w-full cursor-pointer"
            style={{ transformStyle: 'preserve-3d', minHeight: '500px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Card Inner */}
            <motion.div
              className="relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side - Question */}
              <div
                className={`absolute inset-0 w-full bg-white rounded-3xl shadow-xl border-4 border-blue-100 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center text-center transition-all ${
                  isFlipped ? 'invisible' : 'visible'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  minHeight: '450px'
                }}
              >
                <div className="w-full">
                  <div className="inline-block px-6 py-2 bg-blue-50 rounded-full mb-8">
                    <span className="text-2xl md:text-3xl">❓</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-relaxed mb-6 text-slate-800">
                    {question}
                  </h3>
                  <div className="mt-10 pt-6 border-t border-slate-200">
                    <p className="text-lg text-slate-400">
                      点击查看答案 →
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Side - Answer */}
              <div
                className={`absolute inset-0 w-full bg-white rounded-3xl shadow-xl border-4 border-green-100 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center text-center transition-all ${
                  isFlipped ? 'visible' : 'invisible'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  minHeight: '450px'
                }}
              >
                <div className="w-full">
                  <div className="inline-block px-6 py-2 bg-green-50 rounded-full mb-8">
                    <span className="text-2xl md:text-3xl">✅</span>
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed text-slate-800">
                    {answer}
                  </div>
                  <div className="mt-10 pt-6 border-t border-slate-200">
                    <p className="text-lg text-slate-400">
                      ← 点击返回问题
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Flip Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 md:mt-10"
          >
            <div className="inline-block px-6 py-3 bg-white rounded-full shadow-md border border-slate-200">
              <span className="text-slate-600 text-base md:text-lg font-medium">
                {isFlipped ? '✅ 答案' : '❓ 问题'} • 点击卡片翻转
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

