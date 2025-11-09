/**
 * 课程编辑器 - 左右分栏版本
 * 左侧40%: AI对话区
 * 右侧60%: 文档预览编辑区
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Send, Loader2, Sparkles, Menu, X, Star, Clock,
  MessageSquare, FileText, User, ChevronDown, Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { getCourse, type Course } from '@/api/classroom'
import { aiChat, aiGenerateCourse } from '@/api/credits'
import { CreditsBadge } from '@/components/classroom/CreditsBadge'
import { getCurrentUser, type UserProfile } from '@/api/auth'
import { DocumentPreviewEditor } from '@/components/classroom/DocumentPreviewEditor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'  // KaTeX样式
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// 消息类型
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  documentId?: number
  isStreaming?: boolean  // 是否正在流式输出
  displayedContent?: string  // 已显示的内容（用于流式输出）
}

export default function CourseEditorSplit() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [course, setCourse] = useState<Course | null>(null)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // 文档状态
  const [documentId, setDocumentId] = useState<number | null>(null)
  const [documentVersion, setDocumentVersion] = useState(1)
  const [documentContent, setDocumentContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  
  // 分栏状态
  const [showPreview, setShowPreview] = useState(false)  // 默认关闭，生成文档后才显示
  const [leftPanelWidth, setLeftPanelWidth] = useState(40)  // 左侧宽度百分比
  const [isResizing, setIsResizing] = useState(false)

  // 侧边栏状态
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

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

  // 键盘快捷键
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
        console.log('✅ 用户信息加载成功:', user)
        setCurrentUser(user)
      } else {
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
      // 修复：使用正确的参数格式
      const response = await aiChat({
        message: inputText,
        course_id: parseInt(courseId!),
        conversation_history: messages.map(m => ({ role: m.role, content: m.content }))
      })
      
      const fullContent = response.ai_response || response.reply || ''
      
      // 创建流式输出的消息
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
        isStreaming: true,
        displayedContent: ''
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // 模拟流式输出效果（打字机效果）
      simulateStreamingOutput(assistantMessageId, fullContent)
    } catch (error: any) {
      const errorMsg = error || 'AI对话失败'
      
      // 检查是否是AI配置问题
      if (errorMsg.includes('所有提供商均失败') || errorMsg.includes('Insufficient credits')) {
        toast.error('AI服务不可用，请检查配置', {
          duration: 5000,
          action: {
            label: '去配置',
            onClick: () => window.open('http://localhost:8080/admin/ai/config', '_blank')
          }
        })
      } else {
        toast.error(errorMsg)
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `❌ ${errorMsg}\n\n💡 提示：${
          errorMsg.includes('所有提供商均失败') || errorMsg.includes('Insufficient credits')
            ? '请访问 http://localhost:8080/admin/ai/config 配置可用的AI提供商（建议启用Volcengine）'
            : '请重试或联系管理员'
        }`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateCourseware = async () => {
    if (messages.length === 0) {
      toast.error('请先和AI对话生成课程内容')
      return
    }

    setIsGenerating(true)
    toast.info('正在生成课件，请稍候...')

    try {
      // 修复：使用正确的参数格式
      const response = await aiGenerateCourse({
        course_id: parseInt(courseId!),
        topic: messages[0]?.content || '课件',
        conversation: messages.map(m => ({ role: m.role, content: m.content }))
      })

      setDocumentId(response.document_id)
      setDocumentVersion(prev => prev + 1)
      setDocumentContent(response.content_markdown || '')
      
      // 生成文档后显示预览区
      setShowPreview(true)
      
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `✅ 课件已生成！版本 v${documentVersion + 1}`,
        timestamp: new Date(),
        documentId: response.document_id
      }
      
      setMessages(prev => [...prev, systemMessage])
      toast.success('课件生成成功！')
    } catch (error: any) {
      const errorMsg = error || '生成课件失败'
      
      // 检查是否是AI配置问题
      if (errorMsg.includes('所有提供商均失败') || errorMsg.includes('Insufficient credits')) {
        toast.error('AI服务不可用，请检查配置', {
          duration: 5000,
          action: {
            label: '去配置',
            onClick: () => window.open('http://localhost:8080/admin/ai/config', '_blank')
          }
        })
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: `❌ ${errorMsg}\n\n💡 提示：请访问 http://localhost:8080/admin/ai/config 配置可用的AI提供商（建议启用Volcengine）`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } else {
        toast.error(errorMsg)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = () => {
    if (!documentId) {
      toast.error('没有可发布的文档')
      return
    }

    setIsPublished(true)
    toast.success('课件已发布！')
    
    // 跳转到Figma风格全屏幻灯片页面
    window.open(`/classroom/teacher/slide-fullscreen-figma?document_id=${documentId}`, '_blank')
  }

  const handleDocumentContentChange = (newContent: string) => {
    setDocumentContent(newContent)
    setDocumentVersion(prev => prev + 1)
  }

  // 过滤HTML注释标签（<!-- question:choice -->等）
  const filterHtmlComments = (content: string): string => {
    // 移除所有HTML注释
    return content.replace(/<!--[\s\S]*?-->/g, '')
  }

  // 处理消息内容：完全移除技术标记，只保留可视化内容
  const processMessageContent = (content: string): string => {
    let processed = content
    
    // 1. 移除HTML注释
    processed = filterHtmlComments(processed)
    
    // 2. 完全移除YAML frontmatter（不显示）
    processed = processed.replace(/^---\n[\s\S]*?\n---\n*/gm, '')
    
    // 3. 移除单独的### 标题行（会在ReactMarkdown中自动渲染）
    // 不需要额外处理，ReactMarkdown会处理
    
    // 4. 移除残留的代码块标记
    processed = processed.replace(/^```\w*\s*$/gm, '')
    
    return processed.trim()
  }

  // 模拟流式输出效果（打字机效果）
  const simulateStreamingOutput = (messageId: string, fullContent: string) => {
    let currentIndex = 0
    const chunkSize = 3  // 每次显示3个字符
    const intervalTime = 30  // 30ms间隔，模拟Claude的流式输出速度
    
    const interval = setInterval(() => {
      if (currentIndex >= fullContent.length) {
        clearInterval(interval)
        // 流式输出完成，标记为非流式
        setMessages(prev => prev.map(m => 
          m.id === messageId 
            ? { ...m, isStreaming: false, displayedContent: fullContent }
            : m
        ))
        return
      }
      
      currentIndex += chunkSize
      const displayedText = fullContent.substring(0, currentIndex)
      
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, displayedContent: displayedText }
          : m
      ))
    }, intervalTime)
  }

  // 拖拽调整宽度
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const container = document.querySelector('.split-container') as HTMLElement
      if (!container) return
      
      const containerRect = container.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      
      // 限制在20%-80%之间
      const clampedWidth = Math.max(20, Math.min(80, newLeftWidth))
      setLeftPanelWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <div className="h-screen flex bg-[#FBF9F6]">
      {/* 左侧窄侧边栏 */}
      <motion.div
        initial={{ width: 64 }}
        animate={{ width: sidebarExpanded ? 280 : 64 }}
        className="bg-[#F5F3EF] border-r border-gray-200 flex flex-col transition-all duration-300"
      >
        {/* 顶部：Logo和折叠按钮 */}
        <div className="p-3 border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-10 h-10"
          >
            {sidebarExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* 中间：导航 */}
        <div className="flex-1 py-4 space-y-2">
          <Button
            variant="ghost"
            className={`${sidebarExpanded ? 'w-full justify-start px-4' : 'w-10 h-10 mx-auto'}`}
            onClick={() => navigate('/classroom/teacher/courses')}
          >
            <FileText className="h-5 w-5 flex-shrink-0" />
            {sidebarExpanded && <span className="ml-2">返回课程列表</span>}
          </Button>
        </div>

        {/* 底部：积分和用户 */}
        <div className={`px-3 pt-4 border-t border-gray-200 mt-4 ${sidebarExpanded ? '' : 'flex flex-col items-center gap-3'}`}>
          {!sidebarExpanded && <CreditsBadge />}
          
          <Button
            variant="ghost"
            className={`${
              sidebarExpanded ? 'w-full justify-start' : 'w-10 h-10'
            } bg-gray-700 text-white rounded-full hover:bg-gray-600 mb-3`}
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.username}
                className="h-5 w-5 rounded-full flex-shrink-0"
              />
            ) : (
              <User className="h-5 w-5 flex-shrink-0" />
            )}
            {sidebarExpanded && currentUser && (
              <div className="ml-2 flex-1 text-left">
                <div className="text-sm font-medium truncate">
                  {currentUser.real_name || currentUser.username}
                </div>
                <div className="text-xs text-gray-300 truncate">
                  {currentUser.user_type === 'Teacher' ? '教师' : 
                   currentUser.user_type === 'Student' ? '学生' : 
                   currentUser.is_admin ? '管理员' : 'Free plan'}
                </div>
              </div>
            )}
          </Button>
        </div>
      </motion.div>

      {/* 主内容区：左右分栏 */}
      <div className="flex-1 flex overflow-hidden split-container">
        {/* 左侧对话区 */}
        <div 
          className="flex flex-col border-r border-gray-200 bg-white"
          style={{ width: showPreview ? `${leftPanelWidth}%` : '100%' }}
        >
          {/* 顶部标题 */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {course?.title || 'AI智慧课堂'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              与AI对话生成课件内容
            </p>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {messages.length === 0 && !isGenerating && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-[#D97757] mb-4" />
                <p className="text-gray-600">开始和AI对话吧！</p>
                <p className="text-sm text-gray-400 mt-2">
                  描述您想要的课件内容
                </p>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${
                      message.role === 'user' ? 'bg-gray-100 rounded-2xl rounded-br-sm p-3' :
                      message.role === 'system' ? 'bg-green-50 border border-green-200 rounded-xl p-3' :
                      'bg-transparent p-3'
                    }`}>
                      {/* 完全可视化渲染Markdown（不显示任何标签） */}
                      {message.role === 'assistant' ? (
                        <div className="text-sm prose prose-slate max-w-none prose-p:my-2 prose-headings:my-2">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code(props: any) {
                                const { children, className, node, ...rest } = props;
                                const match = /language-(\w+)/.exec(className || '');
                                const language = match ? match[1] : '';
                                const isInline = !className;
                                
                                return isInline ? (
                                  <code className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-xs font-mono border border-pink-200" {...rest}>
                                    {children}
                                  </code>
                                ) : (
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={language}
                                    PreTag="div"
                                    customStyle={{ fontSize: '13px', borderRadius: '8px', marginTop: '8px', marginBottom: '8px' }}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                );
                              },
                              p: ({ children }) => (
                                <p className="text-sm leading-relaxed mb-2 text-slate-800">{children}</p>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-lg font-bold mb-2 text-slate-700 border-l-2 border-[#3DBAFB] pl-2 bg-blue-50/50 py-1">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-base font-bold mb-2 text-slate-800">{children}</h3>
                              ),
                              ul: ({ children }) => (
                                <ul className="space-y-1 my-2 pl-4">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="space-y-1 my-2 pl-4 list-decimal">{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-sm leading-relaxed text-slate-800 marker:text-[#3DBAFB]">
                                  {children}
                                </li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-[#3DBAFB]">{children}</strong>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-[#3DBAFB] bg-blue-50 pl-3 pr-3 py-2 my-2 rounded-r text-sm">
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-3">
                                  <table className="min-w-full text-xs border border-slate-200 rounded">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white">
                                  {children}
                                </thead>
                              ),
                              th: ({ children }) => (
                                <th className="px-2 py-1 text-left text-xs font-bold">{children}</th>
                              ),
                              td: ({ children }) => (
                                <td className="px-2 py-1 text-xs text-slate-700 border-t border-slate-200">{children}</td>
                              ),
                            }}
                          >
                            {processMessageContent(
                              message.isStreaming 
                                ? message.displayedContent || '' 
                                : message.content
                            )}
                          </ReactMarkdown>
                          {message.isStreaming && (
                            <span className="inline-block w-1 h-4 bg-gray-700 ml-1 animate-pulse" />
                          )}
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      )}
                      
                      {message.documentId && (
                        <div className="mt-2 text-xs text-gray-500">
                          📄 文档ID: {message.documentId}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && currentUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center ml-3 flex-shrink-0 mt-1 overflow-hidden">
                        {currentUser.avatar ? (
                          <img 
                            src={currentUser.avatar} 
                            alt={currentUser.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isGenerating && (
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">AI正在思考...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 底部输入框 */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="描述您想要的课件内容..."
                className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-400"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <CreditsBadge />
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateCourseware}
                  disabled={isGenerating || messages.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  生成课件
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isGenerating}
                  className="bg-[#D97757] hover:bg-[#C86646]"
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 拖拽调整手柄 */}
        {showPreview && (
          <div
            className="w-1 bg-gray-300 hover:bg-[#D97757] cursor-col-resize transition-colors relative group"
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* 右侧预览编辑区 */}
        {showPreview && (
          <div 
            className="flex flex-col"
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <DocumentPreviewEditor
              documentId={documentId}
              version={documentVersion}
              content={documentContent}
              isPublished={isPublished}
              onContentChange={handleDocumentContentChange}
              onPublish={handlePublish}
            />
          </div>
        )}
      </div>
    </div>
  )
}

