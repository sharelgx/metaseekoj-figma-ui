/**
 * 选择题详情页 - 100%像素级复刻8080
 * 
 * 借鉴首页Home.tsx的成功经验：
 * ✅ inline style + 精确数值  
 * ✅ 标注8080来源
 * ✅ 原生HTML元素
 * 
 * 复杂功能：专注模式 + 5个主题 + 上下题导航
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Eye,
  EyeOff,
  Palette,
  Bookmark,
  FileText,
  RadioTower,
  CheckCircle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Info as InfoIcon
} from 'lucide-react'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import {
  getChoiceQuestionDetail,
  submitAnswer as submitAnswerAPI,
  getAdjacentQuestion,
  type ChoiceQuestion
} from '@/api/choice-question'
import { useUserStore } from '@/store/user'

// 8080: 主题配置精确值
const THEMES = [
  { key: 'light', name: '白天', preview: 'linear-gradient(135deg, #ffffff, #f8f9fa)' },
  { key: 'dark', name: '夜间', preview: 'linear-gradient(135deg, #2c3e50, #34495e)' },
  { key: 'tech-blue', name: '科技蓝', preview: 'linear-gradient(135deg, #1e3c72, #2a5298)' },
  { key: 'sunset', name: '日光晕', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
  { key: 'green', name: '护眼绿', preview: 'linear-gradient(135deg, #a8e6cf, #dcedc1)' }
]

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, checkAuth } = useUserStore()

  const [question, setQuestion] = useState<ChoiceQuestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)

  const [focusMode, setFocusMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')

  const homeworkId = searchParams.get('homework_id')
  const canShowExplanation = !homeworkId || hasSubmitted

  // 初始化：检查用户认证状态
  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (id) loadQuestion()
  }, [id])

  useEffect(() => {
    if (focusMode) {
      document.body.className = `theme-${currentTheme}`
    } else {
      document.body.className = ''
    }
    return () => { document.body.className = '' }
  }, [currentTheme, focusMode])

  const loadQuestion = async () => {
    try {
      setLoading(true)
      const data = await getChoiceQuestionDetail(Number(id!))
      setQuestion(data)
      document.title = `${data.title} - 元探索少儿编程`
      setSelectedAnswer('')
      setSelectedAnswers([])
      setHasSubmitted(false)
    } catch (error) {
      console.error('加载题目失败:', error)
      toast.error('加载题目失败')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionClick = (optionKey: string) => {
    if (hasSubmitted) return
    console.log('🔵 点击选项:', optionKey, '题目类型:', question?.question_type)
    if (question?.question_type === 'single') {
      setSelectedAnswer(optionKey)
      console.log('🔵 单选：设置selectedAnswer为', optionKey)
    } else {
      setSelectedAnswers(prev => {
        const newValue = prev.includes(optionKey) ? prev.filter(k => k !== optionKey) : [...prev, optionKey]
        console.log('🔵 多选：selectedAnswers更新为', newValue)
        return newValue
      })
    }
  }

  const handleSubmitAnswer = async () => {
    if (!question || !isAuthenticated) { toast.error('请先登录'); return }
    const userAnswer = question.question_type === 'single' ? selectedAnswer : selectedAnswers.sort().join(',')
    if (!userAnswer) { toast.error('请选择答案'); return }

    setSubmitting(true)
    try {
      const result = await submitAnswerAPI({ question_id: question.id, user_answer: userAnswer })
      setHasSubmitted(true)
      setIsCorrect(result.is_correct || false)
      setCurrentScore(result.score || 0)
      toast.success(result.is_correct ? '回答正确！' : '回答错误！')
    } catch (error) {
      console.error('提交答案失败:', error)
      toast.error('提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const getOptionClass = (optionKey: string) => {
    if (!hasSubmitted) return ''
    const correctAnswers = question?.question_type === 'single'
      ? [question.correct_answer]
      : (question?.correct_answer as string || '').split(',').map((s: string) => s.trim())
    const userAnswers = question?.question_type === 'single' ? [selectedAnswer] : selectedAnswers
    if (correctAnswers.includes(optionKey)) return 'option-correct'
    if (userAnswers.includes(optionKey)) return 'option-wrong'
    return ''
  }

  const escapeHtmlInContent = (content: string) => {
    if (!content) return ''
    return content.replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (/style=/i.test(attrs)) {
        return match.replace(/style=(["'])(.*?)\1/i, (m, q, s) => 
          `style=${q}${s}; max-width: 400px !important; height: auto !important;${q}`
        )
      } else {
        return `<img${attrs} style="max-width: 400px !important; height: auto !important;">`
      }
    })
  }

  const goToNextQuestion = async () => {
    if (!question) return
    try {
      const response = await getAdjacentQuestion(question.id, 'next', {})
      const nextQuestion = response.data?.data
      if (nextQuestion) navigate(`/choice-question/${nextQuestion.id}`)
      else toast.error('没有下一题了')
    } catch (error) {
      toast.error('没有下一题了')
    }
  }

  const goToPreviousQuestion = async () => {
    if (!question) return
    try {
      const response = await getAdjacentQuestion(question.id, 'prev', {})
      const prevQuestion = response.data?.data
      if (prevQuestion) navigate(`/choice-question/${prevQuestion.id}`)
      else toast.error('没有上一题了')
    } catch (error) {
      toast.error('没有上一题了')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #2d8cf0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </>
    )
  }

  if (!question) return <><Header /><div style={{ textAlign: 'center', padding: '40px', color: '#808695' }}>题目不存在</div></>

  // 8080: canSubmit计算 - 需要检查非空字符串
  const canSubmit = isAuthenticated && 
    (question.question_type === 'single' 
      ? (selectedAnswer !== '' && selectedAnswer !== null && selectedAnswer !== undefined)
      : (selectedAnswers.length > 0)
    ) && !hasSubmitted
  
  // 🔍 调试日志
  console.log('🔍 canSubmit计算:', {
    isAuthenticated,
    questionType: question.question_type,
    selectedAnswer,
    selectedAnswers,
    hasSubmitted,
    canSubmit,
    check1: selectedAnswer !== '',
    check2: selectedAnswer !== null,
    check3: selectedAnswer !== undefined
  })

  // 8080: 主题样式映射
  const themeStyles: any = {
    light: { bg: '#f8f8f9', panelBg: 'white', contentBg: '#fafbfc', optionBg: 'white', textColor: '#515a6e', borderColor: '#e8eaec' },
    dark: { bg: '#1a1a1a', panelBg: '#2d2d2d', contentBg: '#2d2d2d', optionBg: '#2d2d2d', textColor: '#e8e8e8', borderColor: '#404040' },
    'tech-blue': { bg: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)', panelBg: 'rgba(30, 41, 59, 0.8)', contentBg: 'rgba(30, 41, 59, 0.6)', optionBg: 'rgba(30, 41, 59, 0.6)', textColor: '#64b5f6', borderColor: '#2196f3' },
    sunset: { bg: 'linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%)', panelBg: 'rgba(255, 255, 255, 0.9)', contentBg: 'rgba(254, 243, 243, 0.8)', optionBg: 'rgba(255, 255, 255, 0.8)', textColor: '#c53030', borderColor: '#fc8181' },
    green: { bg: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)', panelBg: 'rgba(232, 245, 233, 0.8)', contentBg: 'rgba(232, 245, 233, 0.6)', optionBg: 'rgba(232, 245, 233, 0.6)', textColor: '#2e7d32', borderColor: '#4caf50' }
  }
  const theme = themeStyles[currentTheme] || themeStyles.light

  return (
    <>
      {!focusMode && <Header />}
      
      <div style={{
        minHeight: '100vh',
        background: theme.bg,           // 8080: 主题背景
        marginTop: focusMode ? '0' : (window.innerWidth >= 1200 ? '80px' : '160px'),  // 8080响应式：专注模式0 大屏80px 小屏160px
        padding: '0 2%',                // 8080: .content-app padding
        transition: 'all 0.3s ease'
      }}>
        {/* 8080: .focus-mode-btn fixed定位 */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          style={{
            position: 'fixed',
            top: '20px',                  // 8080: 精确20px
            right: '20px',                // 8080: 精确20px
            zIndex: 9999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            fontSize: '13px',
            color: focusMode ? 'white' : '#515a6e',
            backgroundColor: focusMode ? '#ff9900' : 'white',
            border: `1px solid ${focusMode ? '#ff9900' : '#dcdee2'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {focusMode ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
          <span>{focusMode ? '退出专注' : '专注模式'}</span>
        </button>

        {/* 8080: .theme-selector - 专注模式显示 */}
        {focusMode && (
          <div style={{
            position: 'fixed',
            top: '70px',                  // 8080: 70px距顶
            right: '20px',
            zIndex: 9999,
            background: 'rgba(255, 255, 255, 0.95)',  // 8080: 半透明白
            padding: '12px',              // 8080: 12px padding
            borderRadius: '8px',          // 8080: 8px圆角
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)'  // 8080: 毛玻璃效果
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette style={{ width: '16px', height: '16px', color: '#808695' }} />
              {THEMES.map(t => (
                <div
                  key={t.key}
                  onClick={() => setCurrentTheme(t.key)}
                  title={t.name}
                  style={{
                    width: '32px',            // 8080: 32px圆形
                    height: '32px',
                    borderRadius: '50%',
                    background: t.preview,
                    cursor: 'pointer',
                    border: currentTheme === t.key ? '3px solid #2d8cf0' : '2px solid #ddd',  // 8080: active边框
                    transition: 'all 0.2s',
                    transform: currentTheme === t.key ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = currentTheme === t.key ? 'scale(1.1)' : 'scale(1)'}
                />
              ))}
            </div>
          </div>
        )}

        {/* 8080: .main-panel max-width */}
        <div style={{
          maxWidth: focusMode ? '900px' : '1200px',  // 8080: 专注900px，普通1200px
          margin: '0 auto',
          padding: focusMode ? '40px 20px' : '0'
        }}>
          {/* 8080: Panel shadow */}
          <div style={{
            background: theme.panelBg,           // 8080: Panel背景(支持主题)
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            padding: focusMode ? '40px' : '30px'  // 8080: 专注40px，普通30px
          }}>
            {/* 题目内容 - 8080: .question-content */}
            <div>
              {/* 8080: .section-header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '12px',        // 8080: padding-bottom
                borderBottom: `1px solid ${theme.borderColor}`,  // 8080: border-bottom
                marginBottom: '16px'          // 8080: margin-bottom
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText style={{ width: '20px', height: '20px', color: theme.textColor }} />
                  <h3 style={{
                    fontSize: '18px',          // 8080: 标题18px
                    fontWeight: 600,           // 8080: 字重600
                    color: '#17233d',
                    margin: 0
                  }}>题目描述</h3>
                </div>
                
                {/* 标签 */}
                {question.tags && question.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {question.tags.map(tag => (
                      <span key={tag.id} style={{
                        backgroundColor: tag.color || '#2d8cf0',
                        color: 'white',
                        padding: '4px 12px',
                        fontSize: '12px',
                        borderRadius: '3px'
                      }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 8080: .content-box */}
              <div style={{
                padding: '20px',              // 8080: 精确20px
                backgroundColor: theme.contentBg,  // 8080: 内容背景(支持主题)
                borderRadius: '4px',
                border: `1px solid ${theme.borderColor}`,
                marginBottom: '30px'          // 8080: margin-bottom
              }}>
                <div style={{
                  fontSize: '15px',            // 8080: 内容字号
                  lineHeight: 1.8,             // 8080: 行高
                  color: theme.textColor,      // 8080: 文本颜色(支持主题)
                  whiteSpace: 'pre-wrap'
                }} dangerouslySetInnerHTML={{ __html: escapeHtmlInContent(question.content || question.description || '') }} />
              </div>
            </div>

            {/* 选项区域 - 8080: .question-options, margin-top: 30px */}
            <div style={{ marginTop: '30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: `1px solid ${theme.borderColor}`,
                marginBottom: '16px'
              }}>
                <RadioTower style={{ width: '20px', height: '20px', color: theme.textColor }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#17233d', margin: 0 }}>选择答案</h3>
              </div>

              {/* 8080: .choice-options */}
              <div>
                {question.options.map((option: any) => {
                  const optClass = getOptionClass(option.key)
                  const isSelected = question.question_type === 'single' ? selectedAnswer === option.key : selectedAnswers.includes(option.key)
                  
                  // 8080: 选项状态颜色精确值 (ChoiceQuestionDetail.vue line 2761-2775)
                  let optionStyle = {
                    bg: theme.optionBg,
                    border: theme.borderColor,
                    shadow: 'none',
                    transform: 'none'
                  }
                  if (isSelected && !hasSubmitted) {
                    optionStyle = { 
                      bg: '#f0f7ff',       // 8080: .option-row.selected background
                      border: '#2d8cf0',   // 8080: .option-row.selected border-color
                      shadow: '0 2px 8px rgba(45, 140, 240, 0.2)',  // 8080: selected box-shadow
                      transform: 'none'
                    }
                  }
                  if (optClass === 'option-correct') {
                    optionStyle = { 
                      bg: '#f0f9f4',       // 8080: .option-row.option-correct background
                      border: '#19be6b',   // 8080: .option-row.option-correct border-color
                      shadow: 'none',
                      transform: 'none'
                    }
                  }
                  if (optClass === 'option-wrong') {
                    optionStyle = { 
                      bg: '#fff2f0',       // 8080: .option-row.option-wrong background
                      border: '#ed4014',   // 8080: .option-row.option-wrong border-color
                      shadow: 'none',
                      transform: 'none'
                    }
                  }

                  return (
                    <div
                      key={option.key}
                      onClick={() => handleOptionClick(option.key)}
                      style={{
                        padding: '16px',              // 8080: .option-row padding (line 2745)
                        marginBottom: '12px',         // 8080: gap: 12px (line 2738)
                        border: `2px solid ${optionStyle.border}`,  // 8080: 2px! (line 2746)
                        borderRadius: '8px',          // 8080: 8px! (line 2747)
                        backgroundColor: optionStyle.bg,
                        cursor: hasSubmitted ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',  // 8080: 0.3s! (line 2750)
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        boxShadow: optionStyle.shadow,
                        transform: optionStyle.transform
                      }}
                      onMouseEnter={(e) => {
                        if (!hasSubmitted && optClass === '') {
                          e.currentTarget.style.backgroundColor = '#f8f9fa'  // 8080: hover bg (line 2756)
                          e.currentTarget.style.borderColor = '#2d8cf0'      // 8080: hover border (line 2755)
                          e.currentTarget.style.transform = 'translateY(-1px)'  // 8080: hover transform (line 2757)
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 140, 240, 0.15)'  // 8080: hover shadow (line 2758)
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!hasSubmitted && optClass === '' && !isSelected) {
                          e.currentTarget.style.backgroundColor = theme.optionBg
                          e.currentTarget.style.borderColor = theme.borderColor
                          e.currentTarget.style.transform = 'none'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {/* 8080: 原生radio/checkbox (line 2778-2786) */}
                      <input
                        type={question.question_type === 'single' ? 'radio' : 'checkbox'}
                        checked={isSelected}
                        disabled={hasSubmitted}
                        onChange={() => {}}
                        style={{
                          width: '18px',          // 8080: 18px! (line 2779)
                          height: '18px',         // 8080: 18px! (line 2780)
                          marginTop: '2px',       // 8080: 2px (line 2782)
                          marginRight: '0',       // 已经用gap处理
                          cursor: hasSubmitted ? 'not-allowed' : 'pointer',
                          accentColor: '#2d8cf0', // 8080: accent-color (line 2784)
                          flexShrink: 0
                        }}
                      />
                      
                      <div style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-start',  // 8080: label对齐 (line 2796)
                        lineHeight: '1.6'          // 8080: 行高 (line 2799)
                      }}>
                        <span style={{
                          fontWeight: 600,        // 8080: 600 (line 2807)
                          marginRight: '8px',     // 8080: 8px (line 2809)
                          color: '#2d8cf0',       // 8080: option-key color (line 2808)
                          fontSize: '15px',
                          minWidth: '20px',       // 8080: min-width (line 2810)
                          flexShrink: 0
                        }}>
                          {option.key}.
                        </span>
                        <span style={{
                          flex: 1,                // 8080: flex: 1 (line 2815)
                          color: '#515a6e',       // 8080: option-content color (line 2816)
                          fontSize: '15px',
                          lineHeight: '1.6'       // 8080: line-height (line 2817)
                        }} dangerouslySetInnerHTML={{ __html: escapeHtmlInContent(option.text || option.content || '') }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 提交按钮 - 8080: .submit-section, margin-top: 30px */}
            <div style={{
              marginTop: '30px',              // 8080: 精确30px
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              {/* 8080: Button type=primary size=large (line 2870-2883) */}
              <button
                onClick={handleSubmitAnswer}
                disabled={!canSubmit || submitting}
                style={{
                  width: '200px',             // 8080: min-width: 160px
                  height: '48px',             // 8080: padding: 12px 32px
                  fontSize: '16px',           // 8080: font-size: 16px
                  fontWeight: 600,            // 8080: font-weight: 600
                  color: 'white',
                  // 8080: linear-gradient背景 (line 3373)
                  background: (!canSubmit || submitting) 
                    ? '#c5c8ce' 
                    : 'linear-gradient(135deg, #2d8cf0, #1c7cd6)',
                  border: `1px solid ${(!canSubmit || submitting) ? '#c5c8ce' : '#2d8cf0'}`,
                  borderRadius: '8px',        // 8080: border-radius: 8px
                  cursor: (!canSubmit || submitting) ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',  // 8080: 0.3s
                  boxShadow: (canSubmit && !submitting) ? '0 4px 12px rgba(45, 140, 240, 0.3)' : 'none'  // 8080: box-shadow (line 2876)
                }}
                onMouseEnter={(e) => {
                  if (canSubmit && !submitting) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1c7cd6, #0f5aa8)'  // 8080: hover gradient (line 3380)
                    e.currentTarget.style.transform = 'translateY(-2px)'  // 8080: hover transform (line 2881)
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(45, 140, 240, 0.4)'  // 8080: hover shadow (line 2882)
                  }
                }}
                onMouseLeave={(e) => {
                  if (canSubmit && !submitting) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2d8cf0, #1c7cd6)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 140, 240, 0.3)'
                  }
                }}
              >
                <CheckCircle style={{ width: '20px', height: '20px' }} />
                <span>{hasSubmitted ? '已提交' : '提交答案'}</span>
              </button>

              {/* 提示信息 */}
              {!hasSubmitted && !canSubmit && (
                <div style={{
                  color: '#808695',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <InfoIcon style={{ width: '16px', height: '16px' }} />
                  <span>{!isAuthenticated ? '请先登录后再提交答案' : '请选择答案后提交'}</span>
                </div>
              )}

              {/* 8080: .navigation-section, margin-top: 24px */}
              <div style={{
                marginTop: '24px',            // 8080: 精确24px
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'                   // 8080: 16px间距
              }}>
                <button
                  onClick={goToPreviousQuestion}
                  style={{
                    padding: '6px 15px',
                    fontSize: '14px',
                    color: '#515a6e',
                    backgroundColor: 'white',
                    border: '1px solid #dcdee2',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  <span>上一题</span>
                </button>
                
                <span style={{ fontSize: '14px', color: '#808695' }}>
                  题目 #{question.id}
                </span>
                
                <button
                  onClick={goToNextQuestion}
                  style={{
                    padding: '6px 15px',
                    fontSize: '14px',
                    color: '#515a6e',
                    backgroundColor: 'white',
                    border: '1px solid #dcdee2',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>下一题</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* 答案解析 - 8080: .answer-analysis, margin-top: 40px */}
            {hasSubmitted && canShowExplanation && (
              <div style={{
                marginTop: '40px',            // 8080: 精确40px
                padding: '24px',              // 8080: 精确24px
                backgroundColor: '#f0faff',   // 8080: 解析背景
                border: '1px solid #91d5ff',  // 8080: 解析边框
                borderRadius: '4px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #91d5ff',
                  marginBottom: '20px'
                }}>
                  <Lightbulb style={{ width: '20px', height: '20px', color: '#2d8cf0' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#17233d', margin: 0 }}>答案解析</h3>
                </div>

                {/* 8080: .result-info - Alert */}
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: isCorrect ? '#f6ffed' : '#fff2f0',  // 8080: success/error背景
                  border: `1px solid ${isCorrect ? '#b7eb8f' : '#ffccc7'}`,
                  borderRadius: '4px',
                  color: isCorrect ? '#52c41a' : '#ff4d4f',
                  fontSize: '14px',
                  marginBottom: '16px',       // 8080: margin-bottom
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {isCorrect ? <CheckCircle style={{ width: '16px', height: '16px' }} /> : <InfoIcon style={{ width: '16px', height: '16px' }} />}
                  <span>{isCorrect ? '✓ 回答正确！' : '✗ 回答错误！'} 得分：{currentScore} / {question.score}</span>
                </div>

                {/* 正确答案 - 8080: .correct-answer-section */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '12px'
                  }}>
                    <CheckCircle style={{ width: '16px', height: '16px', color: '#52c41a' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#17233d', margin: 0 }}>正确答案</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {question.question_type === 'single' ? (
                      <span style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        borderRadius: '3px',
                        border: '1px solid #b8f5d0',
                        color: '#19be6b',         // 8080: green
                        backgroundColor: '#f0fff4'
                      }}>
                        {question.correct_answer}
                      </span>
                    ) : (
                      (question.correct_answer as string).split(',').map((ans: string, idx: number) => (
                        <span key={idx} style={{
                          padding: '6px 12px',
                          fontSize: '14px',
                          borderRadius: '3px',
                          border: '1px solid #b8f5d0',
                          color: '#19be6b',
                          backgroundColor: '#f0fff4'
                        }}>
                          {ans.trim()}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* 详细解析 - 8080: .explanation-section */}
                {question.explanation && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '12px'
                    }}>
                      <Lightbulb style={{ width: '16px', height: '16px', color: '#ff9900' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#17233d', margin: 0 }}>详细解析</h4>
                    </div>
                    <div style={{
                      padding: '16px',          // 8080: 解析内容padding
                      backgroundColor: 'white',  // 8080: 解析内容背景
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                      fontSize: '15px',
                      lineHeight: 1.8,
                      color: '#515a6e'
                    }} dangerouslySetInnerHTML={{ __html: escapeHtmlInContent(question.explanation) }} />
                  </div>
                )}
              </div>
            )}

            {/* 作业提示 */}
            {hasSubmitted && homeworkId && !canShowExplanation && (
              <div style={{
                marginTop: '24px',
                padding: '8px 16px',
                backgroundColor: '#f0faff',
                border: '1px solid #91d5ff',
                borderRadius: '4px',
                color: '#0050b3',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <InfoIcon style={{ width: '16px', height: '16px' }} />
                <span>作业提交后可查看正确答案和解析</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* 8080: 主题样式 - body级别 */
        body.theme-light { background-color: #f8f8f9; color: #515a6e; }
        body.theme-dark { background-color: #1a1a1a; color: #e8e8e8; }
        body.theme-tech-blue { background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%); color: #64b5f6; }
        body.theme-sunset { background: linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%); color: #c53030; }
        body.theme-green { background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); color: #2e7d32; }
        
        /* 8080: 图片宽度限制 */
        .image-fixed-width img {
          max-width: 400px !important;
          height: auto !important;
          display: block;
          margin: 10px 0;
        }
      `}</style>
    </>
  )
}
