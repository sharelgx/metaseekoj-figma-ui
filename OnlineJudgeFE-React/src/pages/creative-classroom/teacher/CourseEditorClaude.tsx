/**
 * Claude风格AI课件编辑器
 * 
 * 完全参考Claude界面设计：
 * - 左侧窄侧边栏（图标导航）
 * - 主内容区单列布局
 * - 底部大输入框
 * - 快捷建议按钮
 * - 米白色背景
 * - 橙红色点缀
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, MessageSquare, FolderOpen, Grid3x3, ArrowLeft,
  Send, Loader2, Sparkles, BookOpen, ChevronDown,
  PencilLine, GraduationCap, Code2, Coffee, Lightbulb,
  FileText, Clock, Paperclip, RefreshCw, Edit3, Share2,
  User, Copy, ExternalLink, Menu, X, Star
} from 'lucide-react'
import { toast } from 'sonner'
import { getCourse, type Course } from '@/api/classroom'
import { aiChat, aiGenerateCourse } from '@/api/credits'
import { CreditsBadge } from '@/components/classroom/CreditsBadge'
import { getCurrentUser, getDefaultAvatar, type UserProfile } from '@/api/auth'

// 消息类型
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  documentId?: number  // 如果消息包含生成的文档
}

// 快捷建议
const SUGGESTIONS = [
  { icon: <PencilLine className="h-4 w-4" />, label: '创建课程' },
  { icon: <GraduationCap className="h-4 w-4" />, label: '生成闪卡' },
  { icon: <Code2 className="h-4 w-4" />, label: '添加代码' },
  { icon: <Coffee className="h-4 w-4" />, label: '测试题' },
  { icon: <Lightbulb className="h-4 w-4" />, label: 'Claude的选择' }
]

export default function CourseEditorClaude() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [course, setCourse] = useState<Course | null>(null)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)  // 当前用户
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [documentId, setDocumentId] = useState<number | null>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)  // 侧边栏展开状态
  const [generationProgress, setGenerationProgress] = useState(0)

  // 加载用户信息
  useEffect(() => {
    loadUserInfo()
  }, [])

  useEffect(() => {
    if (courseId) {
      loadCourse(parseInt(courseId))
    }
  }, [courseId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 快捷键监听：Ctrl+. 切换侧边栏
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault()
        setSidebarExpanded(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const loadUserInfo = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        console.log('✅ 用户信息加载成功:', {
          username: user.username,
          real_name: user.real_name,
          avatar: user.avatar,  // 显示完整URL
          user_type: user.user_type,
          is_admin: user.is_admin
        })
        setCurrentUser(user)
      } else {
        // 未登录，跳转到登录页
        toast.error('请先登录')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('❌ 加载用户信息失败:', error)
      toast.error('加载用户信息失败')
    }
  }

  const loadCourse = async (id: number) => {
    try {
      const data = await getCourse(id)
      setCourse(data)
    } catch (error) {
      toast.error('加载课程失败')
      navigate('/classroom/teacher/courses')
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsGenerating(true)

    try {
      const response = await aiChat({
        message: inputText,
        conversation_history: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        course_id: parseInt(courseId!)
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.ai_response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      toast.success('AI回复完成')
    } catch (error: any) {
      console.error('AI对话失败:', error)
      toast.error(`AI对话失败: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateCourseware = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // 模拟进度
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 1000)

    try {
      const response = await aiGenerateCourse({
        course_id: parseInt(courseId!),
        topic: course?.title || '未命名课程',
        requirements: messages.map(m => m.content).join('\n')
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)
      setDocumentId(response.document_id)

      const systemMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `✅ 已生成${response.slides_count}个幻灯片、${response.flashcards_count}个闪卡`,
        timestamp: new Date(),
        documentId: response.document_id
      }

      setMessages(prev => [...prev, systemMessage])
      toast.success('课件生成成功！')
    } catch (error: any) {
      clearInterval(progressInterval)
      console.error('生成课件失败:', error)
      toast.error(`生成失败: ${error}`)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FBF9F6]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-[#FBF9F6]">
      {/* Left Sidebar - Claude Style with Expand/Collapse */}
      <motion.div
        initial={false}
        animate={{ width: sidebarExpanded ? 280 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#F5F3EF] border-r border-gray-200 flex flex-col py-4 overflow-hidden"
      >
        {/* Toggle Button + Logo */}
        <div className={`px-4 mb-4 ${sidebarExpanded ? 'flex items-center justify-between' : 'flex justify-center'}`}>
          {sidebarExpanded && (
            <h2 className="text-lg font-serif text-gray-900">Claude</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="hover:bg-gray-200/50 flex-shrink-0"
            title={`Toggle sidebar ${sidebarExpanded ? '' : 'Ctrl+.'}`}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setMessages([])
              setDocumentId(null)
            }}
            className={`${
              sidebarExpanded ? 'w-full justify-start' : 'w-10 h-10'
            } bg-[#D97757] hover:bg-[#C86647] text-white rounded-full transition-all`}
          >
            <Plus className="h-5 w-5 flex-shrink-0" />
            {sidebarExpanded && <span className="ml-2">New chat</span>}
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="px-3 space-y-1 mb-4">
          <Button
            variant="ghost"
            className={`${
              sidebarExpanded ? 'w-full justify-start' : 'w-10 h-10'
            } hover:bg-gray-200/50 text-gray-700`}
          >
            <MessageSquare className="h-5 w-5 flex-shrink-0" />
            {sidebarExpanded && <span className="ml-2">Chats</span>}
          </Button>
          <Button
            variant="ghost"
            className={`${
              sidebarExpanded ? 'w-full justify-start' : 'w-10 h-10'
            } hover:bg-gray-200/50 text-gray-700`}
          >
            <FolderOpen className="h-5 w-5 flex-shrink-0" />
            {sidebarExpanded && <span className="ml-2">Projects</span>}
          </Button>
          <Button
            variant="ghost"
            className={`${
              sidebarExpanded ? 'w-full justify-start' : 'w-10 h-10'
            } hover:bg-gray-200/50 text-gray-700`}
          >
            <Grid3x3 className="h-5 w-5 flex-shrink-0" />
            {sidebarExpanded && <span className="ml-2">Artifacts</span>}
          </Button>
        </div>

        {/* Starred & Recents - Only when expanded */}
        {sidebarExpanded && (
          <div className="flex-1 overflow-y-auto px-3">
            {/* Starred */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">Starred</h3>
              <div className="space-y-1">
                {documentId && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-gray-700 hover:bg-gray-200/50"
                  >
                    <Star className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{course?.title}</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Recents */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">Recents</h3>
              <div className="space-y-1">
                {messages.slice(0, 5).map((msg, i) => (
                  msg.role === 'user' && (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start text-sm text-gray-700 hover:bg-gray-200/50"
                    >
                      <span className="truncate">{msg.content.substring(0, 30)}...</span>
                    </Button>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom: Credits & User */}
        <div className={`px-3 pt-4 border-t border-gray-200 mt-4 ${sidebarExpanded ? '' : 'flex flex-col items-center gap-3'}`}>
          {!sidebarExpanded && <CreditsBadge />}
          
          <Button
            variant="ghost"
            className={`${
              sidebarExpanded ? 'w-full justify-start' : 'w-10 h-10'
            } bg-gray-700 text-white rounded-full hover:bg-gray-600`}
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.username}
                className="h-5 w-5 rounded-full flex-shrink-0"
                onError={(e) => {
                  console.error('❌ 头像加载失败:', currentUser.avatar)
                  // 头像加载失败时显示默认图标
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <User className={`h-5 w-5 flex-shrink-0 ${currentUser?.avatar ? 'hidden' : ''}`} />
            {sidebarExpanded && currentUser && (
              <div className="ml-2 flex-1 text-left">
                <div className="text-sm font-medium truncate">
                  {currentUser.real_name || currentUser.username}
                </div>
                <div className="text-xs text-gray-300 truncate">
                  {currentUser.user_type === 'Teacher' ? '教师' : 
                   currentUser.user_type === 'Student' ? '学生' : 
                   currentUser.is_admin ? '管理员' : 
                   'Free plan'}
                </div>
              </div>
            )}
            {sidebarExpanded && <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Main Content Area - Single Column */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Top Header - Minimal */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-gray-900">
              {course.title}
            </h1>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-200/50 text-[13px]"
          >
            <Share2 className="h-4 w-4 mr-1" />
            分享
          </Button>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 && !isGenerating && (
            // 欢迎屏幕 - Claude Style
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Sparkles className="h-8 w-8 text-[#D97757]" />
                  <h2 className="text-4xl font-serif text-gray-900">
                    {currentUser?.real_name || currentUser?.username || 'robin'} returns!
                  </h2>
                </div>
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex-1 max-w-3xl">
                    <div
                      className={`${
                        message.role === 'user'
                          ? 'bg-gray-200 rounded-2xl rounded-br-sm'
                          : message.role === 'system'
                          ? 'bg-green-50 border border-green-200 rounded-xl'
                          : 'bg-transparent'
                      } p-4`}
                    >
                      <div className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* 如果消息包含文档 */}
                      {message.documentId && (
                        <div 
                          className="mt-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 cursor-pointer transition"
                          onClick={() => window.open(`/classroom/teacher/slide-fullscreen?document_id=${message.documentId}`, '_blank')}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                                AI智慧课堂课件
                              </h3>
                              <p className="text-[13px] text-gray-600">
                                Document • 已生成
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="flex items-center gap-2 mt-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-gray-200/50"
                        >
                          <RefreshCw className="h-3 w-3 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-gray-200/50"
                        >
                          <Edit3 className="h-3 w-3 text-gray-500" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center ml-3 flex-shrink-0 mt-1 overflow-hidden relative">
                      {currentUser?.avatar ? (
                        <>
                          <img 
                            src={currentUser.avatar} 
                            alt={currentUser.username}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              console.error('❌ 消息头像加载失败:', currentUser.avatar)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <User className="h-4 w-4" />
                        </>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3 flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                      <span className="text-[15px] text-gray-700">
                        {generationProgress > 0 ? `生成中 ${generationProgress}%...` : 'AI正在思考...'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Input Area - Claude Style */}
        <div className="px-6 pb-8">
          <div className="max-w-3xl mx-auto">
            {/* Input Box */}
            <div className="relative bg-white border border-gray-300 rounded-3xl shadow-sm focus-within:border-gray-400 focus-within:shadow-md transition-all">
              <div className="flex items-end gap-2 p-3">
                {/* Left Icons */}
                <div className="flex items-center gap-1 pb-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 rounded-lg"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 rounded-lg"
                  >
                    <Paperclip className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 rounded-lg"
                  >
                    <Clock className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                {/* Textarea */}
                <Textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="How can I help you today?"
                  className="flex-1 min-h-[52px] max-h-[200px] px-3 py-3 bg-transparent border-none outline-none resize-none text-[16px] leading-relaxed text-gray-900 placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                  disabled={isGenerating}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-2 pb-1">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                    <span className="text-[13px] text-gray-700">Sonnet 4.5</span>
                    <ChevronDown className="h-3 w-3 text-gray-600" />
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isGenerating}
                    size="icon"
                    className="h-9 w-9 bg-[#D97757] hover:bg-[#C86647] disabled:bg-gray-200 rounded-lg transition-all disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Suggestion Pills - Claude Style */}
            {messages.length === 0 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-[13px] px-3 py-1.5 h-auto rounded-full"
                    onClick={() => setInputText(suggestion.label)}
                  >
                    {suggestion.icon}
                    <span className="ml-1.5">{suggestion.label}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* 生成课件按钮 - 对话后显示 */}
            {messages.filter(m => m.role === 'user').length > 0 && !documentId && !isGenerating && (
              <div className="mt-4">
                <Button
                  onClick={handleGenerateCourseware}
                  className="w-full bg-[#D97757] hover:bg-[#C86647] text-white font-medium py-3 text-[14px] rounded-xl"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  生成完整课件
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  消耗10点卡 • 包含讲解+闪卡+测试题
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

