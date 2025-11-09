/**
 * 幻灯片全屏播放页面
 * 
 * 功能：
 * - 浏览模式：讲解幻灯片
 * - 闪卡模式：翻转交互
 * - 答题模式：在线测试
 * - 自动模式切换
 */

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Home, Menu, X, Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { getDocumentSlides, getDocument } from '@/api/classroom'
import { FlashcardInteractive, Flashcard } from '@/components/classroom/FlashcardInteractive'
import { QuizInteractive, Question } from '@/components/classroom/QuizInteractive'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import '@/styles/slides.css'

// 幻灯片类型
enum SlideMode {
  BROWSE = 'browse',      // 浏览模式
  FLASHCARD = 'flashcard', // 闪卡模式
  QUIZ = 'quiz'           // 答题模式
}

interface Slide {
  id: number
  slide_index: number
  content_html: string
  has_code: boolean
  has_question: boolean
  code_language: string
}

export default function SlideFullscreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('document_id')
  
  const revealRef = useRef<HTMLDivElement>(null)
  const [deck, setDeck] = useState<any>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [document, setDocument] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [currentMode, setCurrentMode] = useState<SlideMode>(SlideMode.BROWSE)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // 模拟闪卡数据（实际应从后端加载）
  const [flashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front_content: "什么是Python列表？",
      back_content: "列表（List）是Python中最常用的数据类型之一，用于存储多个有序的元素。列表使用方括号[]创建，元素之间用逗号分隔。",
      code_example: "my_list = [1, 2, 3, 'hello', True]"
    },
    {
      id: 2,
      front_content: "如何访问列表中的元素？",
      back_content: "使用索引访问列表元素，索引从0开始。使用负数索引可以从列表末尾访问元素。",
      code_example: "my_list = ['a', 'b', 'c']\nprint(my_list[0])  # 输出: 'a'\nprint(my_list[-1]) # 输出: 'c'"
    }
  ])

  // 模拟测试题数据（实际应从后端加载）
  const [questions] = useState<Question[]>([
    {
      id: 1,
      question_text: "下列哪个是创建Python列表的正确方式？",
      options: [
        { id: 1, text: "my_list = (1, 2, 3)", is_correct: false },
        { id: 2, text: "my_list = [1, 2, 3]", is_correct: true },
        { id: 3, text: "my_list = {1, 2, 3}", is_correct: false },
        { id: 4, text: "my_list = <1, 2, 3>", is_correct: false }
      ],
      explanation: "Python列表使用方括号[]创建。圆括号()用于元组，花括号{}用于集合或字典。",
      difficulty: "easy"
    },
    {
      id: 2,
      question_text: "执行 my_list = [1, 2, 3]; my_list.append(4) 后，列表的值是？",
      options: [
        { id: 1, text: "[1, 2, 3]", is_correct: false },
        { id: 2, text: "[1, 2, 3, 4]", is_correct: true },
        { id: 3, text: "[4, 1, 2, 3]", is_correct: false },
        { id: 4, text: "错误", is_correct: false }
      ],
      explanation: "append()方法会在列表末尾添加一个新元素。",
      difficulty: "easy"
    }
  ])

  // 加载幻灯片数据
  useEffect(() => {
    if (documentId) {
      loadSlides(parseInt(documentId))
    } else {
      setIsLoading(false)
      toast.error('缺少文档ID')
    }
  }, [documentId])

  // 初始化Reveal.js
  useEffect(() => {
    if (revealRef.current && slides.length > 0 && !deck) {
      initReveal()
    }

    return () => {
      if (deck) {
        deck.destroy()
      }
    }
  }, [slides])

  const loadSlides = async (docId: number) => {
    setIsLoading(true)
    try {
      const [docData, slidesData] = await Promise.all([
        getDocument(docId),
        getDocumentSlides(docId)
      ])
      
      setDocument(docData)
      
      const formattedSlides: Slide[] = slidesData
        .sort((a, b) => a.slide_index - b.slide_index)
        .map(slide => ({
          id: slide.id,
          slide_index: slide.slide_index,
          content_html: slide.content_html,
          has_code: slide.has_code,
          has_question: slide.has_question,
          code_language: slide.code_language
        }))
      
      setSlides(formattedSlides)
    } catch (error: any) {
      console.error('加载幻灯片失败:', error)
      toast.error('加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  const initReveal = () => {
    const revealDeck = new Reveal(revealRef.current!, {
      controls: false,  // 隐藏默认控制按钮
      progress: true,
      slideNumber: 'c/t',
      hash: false,
      transition: 'slide',
      backgroundTransition: 'fade',
      width: '100%',
      height: '100%',
      margin: 0.04,
      minScale: 0.2,
      maxScale: 2.0,
      keyboard: true,
      overview: true,
      center: true,
      touch: true,
      loop: false,
      rtl: false,
      navigationMode: 'default',
      shuffle: false,
      fragments: true,
      embedded: false,
      help: true,
      showNotes: false,
      autoPlayMedia: null,
      preloadIframes: null,
      autoAnimate: true,
      autoAnimateMatcher: null,
      autoAnimateEasing: 'ease',
      autoAnimateDuration: 1.0,
      autoAnimateUnmatched: true,
    })

    revealDeck.initialize().then(() => {
      console.log('Reveal.js初始化成功')
      
      // 监听幻灯片切换事件
      revealDeck.on('slidechanged', (event: any) => {
        const slideIndex = event.indexh
        setCurrentSlideIndex(slideIndex)
        
        // 检测幻灯片类型，自动切换模式
        const currentSlide = slides[slideIndex]
        if (currentSlide) {
          detectAndSwitchMode(currentSlide)
        }
      })
    })

    setDeck(revealDeck)
  }

  // 检测幻灯片类型并切换模式
  const detectAndSwitchMode = (slide: Slide) => {
    // 简单检测：如果HTML中包含特定标记
    const html = slide.content_html.toLowerCase()
    
    if (html.includes('flashcard') || html.includes('闪卡')) {
      setCurrentMode(SlideMode.FLASHCARD)
      toast.info('📝 进入闪卡交互模式')
    } else if (slide.has_question || html.includes('测试题') || html.includes('选择题')) {
      setCurrentMode(SlideMode.QUIZ)
      toast.info('📝 进入答题模式')
    } else {
      setCurrentMode(SlideMode.BROWSE)
    }
  }

  // 导航控制
  const goToPrevSlide = () => {
    if (deck && currentMode === SlideMode.BROWSE) {
      deck.prev()
    }
  }

  const goToNextSlide = () => {
    if (deck && currentMode === SlideMode.BROWSE) {
      deck.next()
    }
  }

  const goToHome = () => {
    navigate(-1)
  }

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // 闪卡模式完成
  const handleFlashcardComplete = () => {
    toast.success('🎉 闪卡练习完成！')
    setCurrentMode(SlideMode.BROWSE)
    goToNextSlide()
  }

  // 测试完成
  const handleQuizComplete = (score: number, total: number) => {
    toast.success(`🎉 测试完成！得分：${score}/${total}`)
    setCurrentMode(SlideMode.BROWSE)
    goToNextSlide()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEEEEE] to-[#E0E0E0] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#3DBAFB] mx-auto mb-4" />
          <p className="text-[#737373] text-lg">正在加载幻灯片...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen bg-[#1a1a1a] overflow-hidden">
      {/* 顶部控制栏 */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToHome}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-white">
              <h2 className="text-lg font-semibold">
                {document?.title || 'AI生成课件'}
              </h2>
              <p className="text-sm text-white/70">
                第 {currentSlideIndex + 1} / {slides.length} 页
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 模式指示器 */}
            {currentMode === SlideMode.FLASHCARD && (
              <Badge className="bg-purple-500 text-white">
                📝 闪卡模式
              </Badge>
            )}
            {currentMode === SlideMode.QUIZ && (
              <Badge className="bg-orange-500 text-white">
                📝 答题模式
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:bg-white/20"
            >
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 侧边菜单 */}
      {showMenu && (
        <div className="absolute top-16 right-4 z-50 w-64 bg-white rounded-lg shadow-2xl p-4">
          <h3 className="font-semibold text-[#525252] mb-3">幻灯片目录</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  if (deck) {
                    deck.slide(index)
                    setShowMenu(false)
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  index === currentSlideIndex
                    ? 'bg-[#3DBAFB] text-white'
                    : 'hover:bg-[#EEEEEE] text-[#525252]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">第 {index + 1} 页</span>
                  <div className="flex gap-1">
                    {slide.has_code && (
                      <Badge variant="secondary" className="text-xs">代码</Badge>
                    )}
                    {slide.has_question && (
                      <Badge className="bg-[#FFA726] text-white text-xs">题目</Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <div className="w-full h-full flex items-center justify-center">
        {currentMode === SlideMode.BROWSE && (
          // 浏览模式：Reveal.js幻灯片
          <div ref={revealRef} className="reveal w-full h-full">
            <div className="slides">
              {slides.map((slide) => (
                <section
                  key={slide.id}
                  data-slide-id={slide.id}
                  className="flex items-center justify-center"
                >
                  <div 
                    className="w-full h-full flex items-center justify-center p-8"
                    dangerouslySetInnerHTML={{ __html: slide.content_html }}
                    style={{
                      fontSize: '1.5rem',
                      lineHeight: '1.6',
                    }}
                  />
                </section>
              ))}
            </div>
          </div>
        )}

        {currentMode === SlideMode.FLASHCARD && (
          // 闪卡模式
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
              <FlashcardInteractive
                flashcards={flashcards}
                onComplete={handleFlashcardComplete}
                onExit={() => {
                  setCurrentMode(SlideMode.BROWSE)
                }}
              />
            </div>
          </div>
        )}

        {currentMode === SlideMode.QUIZ && (
          // 答题模式
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
              <QuizInteractive
                questions={questions}
                onComplete={handleQuizComplete}
                onExit={() => {
                  setCurrentMode(SlideMode.BROWSE)
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 底部导航栏（仅浏览模式显示） */}
      {currentMode === SlideMode.BROWSE && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6 mr-2" />
              上一页
            </Button>

            <div className="text-white text-sm">
              {currentSlideIndex + 1} / {slides.length}
            </div>

            <Button
              variant="ghost"
              size="lg"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="text-white hover:bg-white/20"
            >
              下一页
              <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          </div>

          <div className="mt-4 text-center text-white/70 text-sm">
            <p>
              💡 使用键盘 <kbd className="px-2 py-1 bg-white/20 border border-white/30 rounded">←</kbd>{' '}
              <kbd className="px-2 py-1 bg-white/20 border border-white/30 rounded">→</kbd> 翻页，
              按 <kbd className="px-2 py-1 bg-white/20 border border-white/30 rounded">ESC</kbd> 查看概览
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

