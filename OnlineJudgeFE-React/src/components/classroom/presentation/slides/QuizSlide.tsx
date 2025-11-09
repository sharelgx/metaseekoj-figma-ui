import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizSlideProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function QuizSlide({ question, options, correctAnswer, explanation }: QuizSlideProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  const isCorrect = selectedOption === correctAnswer;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8 md:p-12 lg:p-16 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8 lg:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 md:mb-4">
          Quiz Time! 🎯
        </h2>
      </motion.div>

      <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg mb-4 md:mb-6 lg:mb-8"
        >
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-800 leading-relaxed">{question}</p>
        </motion.div>

        {/* Options */}
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              onClick={() => !showResult && setSelectedOption(index)}
              disabled={showResult}
              className={`w-full text-left p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl text-base sm:text-lg md:text-xl font-medium transition-all ${
                !showResult
                  ? selectedOption === index
                    ? 'bg-blue-500 text-white shadow-lg transform scale-[1.02]'
                    : 'bg-white text-slate-800 hover:bg-blue-50 hover:shadow-md'
                  : showResult && index === correctAnswer
                  ? 'bg-green-500 text-white shadow-lg'
                  : showResult && selectedOption === index && !isCorrect
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && index === correctAnswer && (
                  <Check className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                )}
                {showResult && selectedOption === index && !isCorrect && (
                  <X className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Submit/Reset Button */}
        {!showResult ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              提交答案
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3 md:space-y-4"
            >
              <div
                className={`p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl ${
                  isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
                }`}
              >
                <p className={`text-xl sm:text-2xl font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '✅ 答对了!' : '❌ 答错了'}
                </p>
                {explanation && (
                  <p className="text-base sm:text-lg text-slate-700">{explanation}</p>
                )}
              </div>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="w-full text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8"
              >
                再试一次
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
