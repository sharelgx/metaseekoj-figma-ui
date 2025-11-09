/**
 * 选择题答题交互组件
 * 
 * 功能：
 * - 选项选择（单选/多选）
 * - 提交答案
 * - 即时反馈（对/错动画）
 * - 显示解析
 * - 进度统计
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  BookOpen, SkipForward, Award, TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

export interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

export interface QuizQuestion {
  id: number
  question_text: string
  options: QuizOption[]
  explanation: string      // 答案解析
  difficulty: 'easy' | 'medium' | 'hard'
  knowledge_point: string  // 知识点
  score: number           // 分值
}

interface Answer {
  question_id: number
  selected_option_id: string
  is_correct: boolean
  time_spent: number
}

interface QuizInteractiveProps {
  questions: QuizQuestion[]
  onComplete?: (result: QuizResult) => void
  onExit?: () => void
}

export interface QuizResult {
  total_questions: number
  correct_count: number
  wrong_count: number
  skipped_count: number
  total_score: number
  accuracy: number
  answers: Answer[]
}

export function QuizInteractive({ questions, onComplete, onExit }: QuizInteractiveProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map())
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set())
  const [startTime, setStartTime] = useState<number>(Date.now())

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers.get(currentIndex)
  const progress = Math.round(((answers.size + skippedQuestions.size) / questions.length) * 100)
  
  // 统计
  const correctCount = Array.from(answers.values()).filter(a => a.is_correct).length
  const wrongCount = Array.from(answers.values()).filter(a => !a.is_correct).length
  const totalScore = Array.from(answers.values())
    .filter(a => a.is_correct)
    .reduce((sum, a) => {
      const q = questions.find(q => q.id === a.question_id)
      return sum + (q?.score || 0)
    }, 0)

  // 提交答案
  const handleSubmit = () => {
    if (!selectedOption) {
      toast.warning('请先选择一个答案')
      return
    }

    const correctOption = currentQuestion.options.find(o => o.is_correct)
    const isCorrect = selectedOption === correctOption?.id
    const timeSpent = Math.round((Date.now() - startTime) / 1000)

    const answer: Answer = {
      question_id: currentQuestion.id,
      selected_option_id: selectedOption,
      is_correct: isCorrect,
      time_spent: timeSpent
    }

    setAnswers(new Map(answers.set(currentIndex, answer)))
    setIsSubmitted(true)

    // 移除跳过标记（如果之前跳过了）
    if (skippedQuestions.has(currentIndex)) {
      const newSkipped = new Set(skippedQuestions)
      newSkipped.delete(currentIndex)
      setSkippedQuestions(newSkipped)
    }

    // 播放反馈音效（可选）
    if (isCorrect) {
      toast.success('✅ 回答正确！')
    } else {
      toast.error('❌ 答错了，查看解析吧')
    }
  }

  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
      setStartTime(Date.now())
    } else {
      // 最后一题，显示成绩
      showResults()
    }
  }

  // 上一题
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      const prevAnswer = answers.get(currentIndex - 1)
      setSelectedOption(prevAnswer?.selected_option_id || null)
      setIsSubmitted(!!prevAnswer)
      setStartTime(Date.now())
    }
  }

  // 跳过此题
  const handleSkip = () => {
    setSkippedQuestions(new Set([...skippedQuestions, currentIndex]))
    handleNext()
  }

  // 显示成绩
  const showResults = () => {
    const result: QuizResult = {
      total_questions: questions.length,
      correct_count: correctCount,
      wrong_count: wrongCount,
      skipped_count: skippedQuestions.size,
      total_score: totalScore,
      accuracy: Math.round((correctCount / questions.length) * 100),
      answers: Array.from(answers.values())
    }

    if (onComplete) {
      onComplete(result)
    }
  }

  const difficultyConfig = {
    easy: { label: '简单', color: 'bg-green-100 text-green-700' },
    medium: { label: '中等', color: 'bg-yellow-100 text-yellow-700' },
    hard: { label: '困难', color: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#FFF3E0] to-[#F0F9FF] p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-[#FFA726] to-[#F57C00] rounded"></div>
            <div>
              <h2 className="text-2xl font-bold text-[#525252]">📝 测验模式</h2>
              <p className="text-sm text-[#737373]">
                选择答案后点击提交，查看即时反馈和详细解析
              </p>
            </div>
          </div>
          {onExit && (
            <Button
              variant="outline"
              onClick={onExit}
              className="border-[#e5e5e5] hover:bg-white"
            >
              保存并退出
            </Button>
          )}
        </div>

        {/* Stats and Progress */}
        <div className="flex items-center gap-4 mb-3">
          <Badge className="bg-green-500 text-white">
            ✅ 正确: {correctCount}
          </Badge>
          <Badge className="bg-red-500 text-white">
            ❌ 错误: {wrongCount}
          </Badge>
          <Badge className="bg-gray-500 text-white">
            ⏭️ 跳过: {skippedQuestions.size}
          </Badge>
          <Badge className="bg-[#3DBAFB] text-white">
            💯 得分: {totalScore}
          </Badge>
        </div>

        <Progress value={progress} className="h-2" />
        <p className="text-xs text-[#737373] mt-1">
          进度：{answers.size + skippedQuestions.size}/{questions.length} 题已完成
        </p>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-3xl bg-white p-8 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#3DBAFB]">
                    第 {currentIndex + 1} 题
                  </span>
                  <span className="text-[#737373]">/ 共 {questions.length} 题</span>
                </div>
                <div className="flex gap-2">
                  <Badge className={difficultyConfig[currentQuestion.difficulty].color}>
                    {difficultyConfig[currentQuestion.difficulty].label}
                  </Badge>
                  <Badge variant="outline" className="border-[#3DBAFB] text-[#3DBAFB]">
                    {currentQuestion.score}分
                  </Badge>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <p className="text-lg text-[#525252] leading-relaxed">
                  {currentQuestion.question_text}
                </p>
                <p className="text-sm text-[#737373] mt-2">
                  📌 知识点：{currentQuestion.knowledge_point}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
                  const isSelected = selectedOption === option.id
                  const isCorrectOption = option.is_correct
                  
                  let className = 'p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#3DBAFB]'
                  
                  if (!isSubmitted) {
                    // 未提交状态
                    className += isSelected 
                      ? ' border-[#3DBAFB] bg-[#F0F9FF]' 
                      : ' border-[#e5e5e5] bg-white'
                  } else {
                    // 已提交状态
                    if (isCorrectOption) {
                      className += ' border-green-500 bg-green-50'
                    } else if (isSelected && !isCorrectOption) {
                      className += ' border-red-500 bg-red-50'
                    } else {
                      className += ' border-[#e5e5e5] bg-gray-50'
                    }
                  }

                  return (
                    <div
                      key={option.id}
                      className={className}
                      onClick={() => !isSubmitted && setSelectedOption(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isSubmitted
                              ? isCorrectOption
                                ? 'bg-green-500 text-white'
                                : isSelected
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                              : isSelected
                              ? 'bg-[#3DBAFB] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {optionLetter}
                          </div>
                          <span className="text-[#525252]">{option.text}</span>
                        </div>
                        {isSubmitted && (
                          <div>
                            {isCorrectOption && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                            {isSelected && !isCorrectOption && <XCircle className="h-6 w-6 text-red-500" />}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              {!isSubmitted ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="border-[#e5e5e5]"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    暂时跳过
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="flex-1 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white"
                  >
                    提交答案
                  </Button>
                </div>
              ) : (
                <>
                  {/* Feedback */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-4 ${
                      currentAnswer?.is_correct
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-red-50 border-2 border-red-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {currentAnswer?.is_correct ? (
                        <>
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          <span className="text-lg font-bold text-green-700">太棒了！答对了！</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          <span className="text-lg font-bold text-red-700">答错了，再仔细想想</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-[#525252]">
                      正确答案：{currentQuestion.options.find(o => o.is_correct)?.text}
                    </p>
                  </motion.div>

                  {/* Explanation */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-[#F5F7FA] rounded-lg mb-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-[#3DBAFB]" />
                      <span className="font-semibold text-[#525252]">📖 答案解析</span>
                    </div>
                    <p className="text-[#525252] leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>

                  {/* Next Button */}
                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white"
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        下一题
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        查看成绩
                        <Award className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="border-[#e5e5e5]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一题
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer ${
                index === currentIndex
                  ? 'bg-[#3DBAFB] text-white'
                  : answers.has(index)
                  ? answers.get(index)?.is_correct
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : skippedQuestions.has(index)
                  ? 'bg-yellow-300 text-yellow-900'
                  : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => {
                setCurrentIndex(index)
                setSelectedOption(answers.get(index)?.selected_option_id || null)
                setIsSubmitted(answers.has(index))
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === questions.length - 1}
          className="border-[#e5e5e5]"
        >
          下一题
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// 成绩展示组件
export function QuizResults({ result, onRestart, onExit }: {
  result: QuizResult
  onRestart?: () => void
  onExit?: () => void
}) {
  const accuracyColor = result.accuracy >= 80 ? 'text-green-600' : result.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#F0F9FF] to-[#FFF3E0] p-6">
      <Card className="max-w-2xl w-full bg-white p-8 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Award className="h-20 w-20 mx-auto mb-4 text-[#FFA726]" />
          <h2 className="text-3xl font-bold text-[#525252] mb-2">测验完成！</h2>
          <p className="text-[#737373] mb-8">你已完成所有题目，查看你的成绩吧</p>

          {/* Score Card */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-gradient-to-br from-[#F0F9FF] to-white rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[#3DBAFB]" />
              <div className={`text-4xl font-bold ${accuracyColor} mb-1`}>
                {result.accuracy}%
              </div>
              <p className="text-sm text-[#737373]">正确率</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#FFF3E0] to-white rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-[#FFA726]" />
              <div className="text-4xl font-bold text-[#F57C00] mb-1">
                {result.total_score}
              </div>
              <p className="text-sm text-[#737373]">总得分</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.correct_count}</div>
              <p className="text-sm text-[#737373]">答对</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.wrong_count}</div>
              <p className="text-sm text-[#737373]">答错</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{result.skipped_count}</div>
              <p className="text-sm text-[#737373]">跳过</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {onRestart && (
              <Button
                variant="outline"
                onClick={onRestart}
                className="flex-1 border-[#e5e5e5]"
              >
                重新测试
              </Button>
            )}
            {onExit && (
              <Button
                onClick={onExit}
                className="flex-1 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white"
              >
                继续学习
              </Button>
            )}
          </div>
        </motion.div>
      </Card>
    </div>
  )
}

