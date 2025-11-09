/**
 * 课程编辑器 - 对话式AI生成界面
 * 
 * 布局：左侧对话区(40%) + 右侧预览区(60%)
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, Send, Loader2, Sparkles, BookOpen, 
  Maximize2, ChevronRight, ChevronLeft, Settings,
  Lightbulb, Code2, ListChecks, MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'
import { getCourse, type Course } from '@/api/classroom'
import { aiChat, aiGenerateCourse } from '@/api/credits'
import { CreditsBadge } from '@/components/classroom/CreditsBadge'
import '@/styles/claude-style.css'

// 消息类型
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

// 快捷指令配置
const QUICK_COMMANDS = [
  {
    icon: <BookOpen className="h-4 w-4" />,
    label: '生成课件大纲',
    prompt: '请为这个课程生成一个完整的教学大纲，包括章节划分和知识点'
  },
  {
    icon: <Lightbulb className="h-4 w-4" />,
    label: '添加闪卡',
    prompt: '为当前章节生成5-8个知识闪卡，用于学生记忆关键概念'
  },
  {
    icon: <ListChecks className="h-4 w-4" />,
    label: '生成测试题',
    prompt: '生成10道选择题，覆盖主要知识点，难度分布为简单30%、中等50%、困难20%'
  },
  {
    icon: <Code2 className="h-4 w-4" />,
    label: '添加代码示例',
    prompt: '为当前内容添加3-5个代码示例，要求完整可运行并有注释'
  }
]

export default function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  
  // 状态管理
  const [course, setCourse] = useState<Course | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: '👋 你好！我是AI课件助手。告诉我你想创建什么样的课件，我会帮你生成专业的教学内容。',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [documentId, setDocumentId] = useState<number | null>(null)
  const [isGeneratingCourseware, setIsGeneratingCourseware] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentTopic, setCurrentTopic] = useState('')
  const [currentRequirements, setCurrentRequirements] = useState('')
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 加载课程信息
  useEffect(() => {
    if (courseId) {
      loadCourse(parseInt(courseId))
    }
  }, [courseId])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadCourse = async (id: number) => {
    try {
      const data = await getCourse(id)
      setCourse(data)
    } catch (error: any) {
      console.error('加载课程失败:', error)
      toast.error('加载课程失败')
      navigate('/classroom/teacher/courses')
    }
  }

  const handleSendMessage = async () => {
    const text = inputText.trim()
    if (!text || !course) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }
    setMessages([...messages, userMessage])
    setInputText('')
    setIsGenerating(true)

    // 提取主题和要求（用于后续生成课件）
    if (!currentTopic && text.length > 10) {
      setCurrentTopic(text)
    }
    setCurrentRequirements(prev => prev ? `${prev}\n${text}` : text)

    try {
      // 调用AI对话API（5点卡，用于讨论和规划）
      const response = await aiChat({
        message: text,
        conversation_history: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        course_id: course.id,
        rule_type: 'ai_edit_course'  // 使用编辑规则（5点）
      })

      // 添加AI回复
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.ai_response,
        timestamp: new Date()
      }
      setMessages([...messages, userMessage, aiMessage])

      toast.success(`AI已回复（消耗 ${response.credits_used} 点卡）`)
    } catch (error: any) {
      console.error('AI对话失败:', error)
      
      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `❌ 抱歉，生成失败：${error.response?.data?.error || error.message || '未知错误'}`,
        timestamp: new Date()
      }
      setMessages([...messages, userMessage, errorMessage])
      
      toast.error('AI对话失败')
    } finally {
      setIsGenerating(false)
      inputRef.current?.focus()
    }
  }

  // 生成完整课件（调用后端生成Markdown并转换为幻灯片）
  const handleGenerateCourseware = async () => {
    if (!course) return

    // 从对话历史中提取主题和要求
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
    const topic = currentTopic || userMessages.substring(0, 100) || '课程内容'
    const requirements = currentRequirements || userMessages

    setIsGeneratingCourseware(true)
    setGenerationProgress(0)

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 2000)

      // 调用AI生成完整课件API（10点卡）
      const result = await aiGenerateCourse({
        course_id: course.id,
        topic: topic,
        requirements: requirements
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      // 保存生成的文档ID
      setDocumentId(result.document_id)

      // 添加系统消息
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `✅ 课件生成成功！\n\n已生成 ${result.slides_count} 个幻灯片，包含讲解内容、知识闪卡和测试题。\n消耗 ${result.credits_used} 点卡。\n\n点击右侧"全屏预览"查看完整课件。`,
        timestamp: new Date()
      }
      setMessages([...messages, successMessage])

      toast.success('🎉 课件生成完成！', {
        description: `已生成 ${result.slides_count} 个幻灯片`,
        duration: 5000
      })

    } catch (error: any) {
      console.error('生成课件失败:', error)
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `❌ 课件生成失败：${error.response?.data?.error || error.message || '未知错误'}`,
        timestamp: new Date()
      }
      setMessages([...messages, errorMessage])
      
      toast.error('课件生成失败')
    } finally {
      setIsGeneratingCourseware(false)
      setGenerationProgress(0)
    }
  }

  const handleQuickCommand = (prompt: string) => {
    setInputText(prompt)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#EEEEEE]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3DBAFB]" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header - Claude Minimalist */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/classroom/teacher/courses')}
            className="hover:bg-gray-100 -ml-2"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h1 className="text-[15px] font-semibold text-gray-900">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <CreditsBadge />
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Area (40%) - Claude Style */}
        <div className="w-[40%] flex flex-col bg-white border-r border-gray-200">
          {/* Messages List - 直接显示，无header */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 欢迎消息（仅首次显示） */}
            {messages.length === 0 && (
              <div className="flex justify-start mb-6">
                <div className="max-w-[85%] rounded-[18px] rounded-bl-[4px] p-3.5 bg-gray-100 text-gray-900 shadow-sm">
                  <div className="text-[15px] leading-relaxed">
                    你好！我是AI课件助手。告诉我你想创建什么样的课件，我会帮你生成专业的教学内容。
                  </div>
                </div>
              </div>
            )}
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 shadow-sm ${
                      message.role === 'user'
                        ? 'rounded-[18px] rounded-br-[4px] bg-black text-white'
                        : message.role === 'system'
                        ? 'rounded-xl bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                        : 'rounded-[18px] rounded-bl-[4px] bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1.5 ${
                      message.role === 'user' ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('zh-CN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-[#F5F7FA] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#737373]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI正在思考...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Actions - Claude Minimalist */}
          <div className="border-t border-gray-200 bg-white">
            {/* 快捷指令 - 简洁展示 */}
            {messages.length === 0 && (
              <div className="p-4 pb-2">
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_COMMANDS.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-[13px] bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all font-normal h-auto py-2"
                      onClick={() => handleQuickCommand(cmd.prompt)}
                      disabled={isGenerating || isGeneratingCourseware}
                    >
                      {cmd.icon}
                      <span className="ml-1.5 truncate">{cmd.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 生成课件按钮 - 仅有对话后显示 */}
            {messages.filter(m => m.role === 'user').length > 0 && !documentId && (
              <div className="px-4 pb-2">
                <Button
                  onClick={handleGenerateCourseware}
                  disabled={isGenerating || isGeneratingCourseware}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 text-[14px] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isGeneratingCourseware ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      生成中 {generationProgress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      生成完整课件
                    </>
                  )}
                </Button>
                {!isGeneratingCourseware && (
                  <p className="text-xs text-gray-500 mt-1.5 text-center">
                    消耗10点卡 • 包含讲解+闪卡+测试题
                  </p>
                )}
              </div>
            )}

          {/* Input Area - Claude Style */}
          <div className="p-4 bg-white">
            <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-300 rounded-xl p-2 transition-all focus-within:border-gray-400 focus-within:shadow-sm">
              <Textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="How can I help you today?"
                className="flex-1 min-h-[44px] px-3 py-2.5 bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-gray-900 placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                rows={1}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isGenerating}
                size="icon"
                className="flex-shrink-0 w-9 h-9 bg-black hover:bg-gray-800 disabled:bg-gray-200 rounded-lg transition-all disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 text-white" />
                ) : (
                  <Send className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Preview Area (60%) - Claude Style */}
        <div className="w-[60%] flex flex-col bg-gray-50">
          {/* Preview Header - Claude Minimalist */}
          {documentId && (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white">
              <div className="text-[13px] text-gray-500 font-normal">
                课件预览
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[13px] text-gray-600 hover:bg-gray-100 h-8 px-3"
                  onClick={() => window.open(`/classroom/teacher/slide-fullscreen?document_id=${documentId}`, '_blank')}
                >
                  播放
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[13px] text-gray-600 hover:bg-gray-100 h-8 px-3"
                >
                  发布
                </Button>
              </div>
            </div>
          )}

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-6">
            {isGeneratingCourseware ? (
              // 生成中 - Claude Minimalist Loading
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                      正在生成课件...
                    </h3>
                    <p className="text-[13px] text-gray-600">
                      预计需要30-60秒
                    </p>
                  </div>
                </div>
                
                {/* 进度条 - Claude Simple */}
                <div className="space-y-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gray-900"
                      initial={{ width: 0 }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-[13px] text-gray-600 text-center">{generationProgress}%</p>
                  
                  {/* 简化的步骤提示 */}
                  <div className="mt-4 space-y-2">
                    {[
                      { label: '理解需求', progress: 25 },
                      { label: '生成内容', progress: 50 },
                      { label: '创建幻灯片', progress: 75 },
                      { label: '完成', progress: 100 }
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-[13px]">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                          generationProgress >= step.progress 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {generationProgress >= step.progress ? '✓' : ''}
                        </div>
                        <span className={generationProgress >= step.progress ? 'text-gray-900' : 'text-gray-500'}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : documentId ? (
              // 课件已生成 - Claude Minimalist Card
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition cursor-pointer"
                   onClick={() => window.open(`/classroom/teacher/slide-fullscreen?document_id=${documentId}`, '_blank')}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                      AI智慧课堂课件
                    </h3>
                    <p className="text-[13px] text-gray-600 mb-2">
                      文档 • 已生成
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-gray-500">
                      <span>点击查看</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 空状态 - Claude Minimalist  
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-700 mb-2">
                  开始对话
                </h3>
                <p className="text-[13px] text-gray-500 max-w-xs mx-auto mb-6">
                  在左侧输入框中描述你的需求，AI会帮你生成专业的教学课件
                </p>
                  
                {/* 示例提示 - Claude Minimal Pills */}
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {[
                    'Python列表课程',
                    'C++循环结构',
                    '函数知识闪卡',
                    '变量测试题'
                  ].map((example, i) => (
                    <button
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-[13px] text-gray-700 cursor-pointer transition"
                      onClick={() => setInputText(`创建${example}`)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

