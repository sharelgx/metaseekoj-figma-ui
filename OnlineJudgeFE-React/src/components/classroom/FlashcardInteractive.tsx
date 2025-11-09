/**
 * 闪卡交互组件
 * 
 * 功能：
 * - 3D翻转动画
 * - 掌握状态标记
 * - 进度跟踪
 * - 随机乱序
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, 
  Shuffle, RotateCw, Award, ArrowRight 
} from 'lucide-react'
import { toast } from 'sonner'

export interface Flashcard {
  id: number
  front_content: string  // 问题/概念
  back_content: string   // 答案/解释
  code_example?: string  // 代码示例（可选）
}

interface FlashcardInteractiveProps {
  flashcards: Flashcard[]
  onComplete?: () => void  // 完成所有闪卡后的回调
  onExit?: () => void      // 退出闪卡模式
}

export function FlashcardInteractive({ flashcards, onComplete, onExit }: FlashcardInteractiveProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set())
  const [unmasteredCards, setUnmasteredCards] = useState<Set<number>>(new Set())
  const [cardOrder, setCardOrder] = useState<number[]>([])

  // 初始化卡片顺序
  useEffect(() => {
    setCardOrder(flashcards.map((_, i) => i))
  }, [flashcards])

  const currentCard = flashcards[cardOrder[currentIndex]]
  const progress = Math.round(((masteredCards.size + unmasteredCards.size) / flashcards.length) * 100)
  const isAllCompleted = masteredCards.size + unmasteredCards.size === flashcards.length

  // 翻转卡片
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // 标记掌握状态
  const handleMastered = (mastered: boolean) => {
    const cardId = currentCard.id
    
    if (mastered) {
      setMasteredCards(new Set([...masteredCards, cardId]))
      unmasteredCards.delete(cardId)
      setUnmasteredCards(new Set(unmasteredCards))
    } else {
      setUnmasteredCards(new Set([...unmasteredCards, cardId]))
      masteredCards.delete(cardId)
      setMasteredCards(new Set(masteredCards))
    }

    // 自动翻到下一张
    setTimeout(() => handleNext(), 500)
  }

  // 下一张
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // 最后一张了
      if (isAllCompleted && onComplete) {
        toast.success('🎉 闪卡练习完成！')
        onComplete()
      }
    }
  }

  // 上一张
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  // 随机乱序
  const handleShuffle = () => {
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5)
    setCardOrder(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.success('已打乱顺序')
  }

  // 重新开始
  const handleReset = () => {
    setMasteredCards(new Set())
    setUnmasteredCards(new Set())
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.success('已重置进度')
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#F0F9FF] to-[#F0FFF4] p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-[#3DBAFB] to-[#8ED1A9] rounded"></div>
            <div>
              <h2 className="text-2xl font-bold text-[#525252]">🎴 闪卡练习模式</h2>
              <p className="text-sm text-[#737373]">
                点击卡片翻转查看答案，标记掌握状态
              </p>
            </div>
          </div>
          {onExit && (
            <Button
              variant="outline"
              onClick={onExit}
              className="border-[#e5e5e5] hover:bg-white"
            >
              继续课程
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#525252] font-medium">
              学习进度：第 {currentIndex + 1} / {flashcards.length} 张
            </span>
            <span className="text-[#737373]">
              已掌握 {masteredCards.size} 张 | 未掌握 {unmasteredCards.size} 张
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          {/* 3D Flip Card */}
          <div className="perspective-1000">
            <motion.div
              className="relative w-full h-[400px] cursor-pointer"
              onClick={handleFlip}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <Card
                className={`absolute inset-0 bg-gradient-to-br from-white to-[#F0F9FF] border-2 border-[#3DBAFB] shadow-xl
                  flex items-center justify-center p-8 ${isFlipped ? 'invisible' : 'visible'}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[#3DBAFB] text-white text-xs rounded-full">
                      问题
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-[#525252] mb-4">
                    {currentCard?.front_content}
                  </h3>
                  <p className="text-[#737373] text-sm">
                    👆 点击翻转查看答案
                  </p>
                </div>
              </Card>

              {/* Back Side */}
              <Card
                className={`absolute inset-0 bg-gradient-to-br from-white to-[#F0FFF4] border-2 border-[#8ED1A9] shadow-xl
                  flex items-center justify-center p-8 ${isFlipped ? 'visible' : 'invisible'}`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center w-full">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[#8ED1A9] text-white text-xs rounded-full">
                      答案
                    </span>
                  </div>
                  <div className="text-xl text-[#525252] mb-4 whitespace-pre-wrap">
                    {currentCard?.back_content}
                  </div>
                  {currentCard?.code_example && (
                    <div className="mt-4 text-left">
                      <pre className="bg-[#F5F7FA] p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{currentCard.code_example}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
            {/* Mastery Buttons (only show when flipped) */}
            <AnimatePresence>
              {isFlipped && !masteredCards.has(currentCard?.id) && !unmasteredCards.has(currentCard?.id) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 justify-center"
                >
                  <Button
                    onClick={() => handleMastered(false)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    未掌握
                  </Button>
                  <Button
                    onClick={() => handleMastered(true)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    已掌握
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="border-[#e5e5e5]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                上一张
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShuffle}
                  title="随机乱序"
                  className="border-[#e5e5e5]"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  title="重新开始"
                  className="border-[#e5e5e5]"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1 && !isAllCompleted}
                className="border-[#e5e5e5]"
              >
                {currentIndex === flashcards.length - 1 ? '完成' : '下一张'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Completion Celebration */}
          {isAllCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] rounded-lg text-white text-center"
            >
              <Award className="h-12 w-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">🎉 太棒了！全部完成！</h3>
              <p className="mb-4">
                你已掌握 {masteredCards.size} 个知识点，还有 {unmasteredCards.size} 个需要继续努力
              </p>
              {onComplete && (
                <Button
                  onClick={onComplete}
                  className="bg-white text-[#3DBAFB] hover:bg-gray-100"
                >
                  继续学习
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Mastery Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-[#525252]">已掌握 ({masteredCards.size})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-[#525252]">未掌握 ({unmasteredCards.size})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-[#525252]">未学习 ({flashcards.length - masteredCards.size - unmasteredCards.size})</span>
        </div>
      </div>
    </div>
  )
}

