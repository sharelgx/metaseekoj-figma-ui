import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Clock, List, Grid } from 'lucide-react'
import { choiceQuestionAPI } from '@/api/choice-question'
import { toast } from 'sonner'

interface Question {
  id: number
  content: string
  description?: string
  question_type: 'single' | 'multiple'
  options: string[]
  score: number
}

interface ExamPaper {
  id: number
  title: string
  total_score: number
  question_count: number
  time_limit: number
  language?: string
}

interface ExamSession {
  id: number
  status: 'created' | 'started' | 'submitted' | 'timeout'
}

export default function ExamPaper() {
  const { paperId } = useParams<{ paperId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [examPaper, setExamPaper] = useState<ExamPaper | null>(null)
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [remainingTime, setRemainingTime] = useState(0)
  const [examMode, setExamMode] = useState<'single' | 'full'>('single')
  const [submitModalVisible, setSubmitModalVisible] = useState(false)

  useEffect(() => {
    if (paperId) {
      initExam()
    }
  }, [paperId])

  // 倒计时
  useEffect(() => {
    if (remainingTime > 0 && examSession?.status !== 'submitted') {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            autoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [remainingTime, examSession])

  const initExam = async () => {
    setLoading(true)
    try {
      // 获取试卷详情
      const paperData = await choiceQuestionAPI.getExamPaperDetail(paperId!)
      
      setExamPaper(paperData)
      setQuestions(paperData.questions || [])
      setRemainingTime(paperData.time_limit * 60)
      
      // TODO: 创建或获取考试会话
      setExamSession({
        id: Date.now(),
        status: 'started'
      })
    } catch (error) {
      console.error('加载试卷失败:', error)
      toast.error('加载试卷失败')
      
      // 失败时使用Mock数据作为后备
      const mockExamPaper: ExamPaper = {
        id: parseInt(paperId || '0'),
        title: 'GESP三级模拟试卷一（Mock）',
        total_score: 100,
        question_count: 25,
        time_limit: 90,
        language: 'cpp'
      }

      const mockQuestions: Question[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        content: `这是第 ${i + 1} 题的题目内容。请仔细阅读题目要求并选择正确答案。`,
        description: i < 5 ? `这是第 ${i + 1} 题的补充说明。` : undefined,
        question_type: i % 3 === 0 ? 'multiple' : 'single',
        options: [
          `选项 A的内容`,
          `选项 B 的内容`,
          `选项 C 的内容`,
          `选项 D 的内容`
        ],
        score: 4
      }))

      const mockSession: ExamSession = {
        id: 1,
        status: 'started'
      }

      setExamPaper(mockExamPaper)
      setQuestions(mockQuestions)
      setExamSession(mockSession)
      setRemainingTime(mockExamPaper.time_limit * 60)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionClick = (questionId: number, optionIndex: number, questionType: string) => {
    if (examSession?.status === 'submitted') return

    setAnswers(prev => {
      const current = prev[questionId] || []
      if (questionType === 'single') {
        return { ...prev, [questionId]: [optionIndex] }
      } else {
        // 多选
        const index = current.indexOf(optionIndex)
        if (index > -1) {
          return { ...prev, [questionId]: current.filter(i => i !== optionIndex) }
        } else {
          return { ...prev, [questionId]: [...current, optionIndex] }
        }
      }
    })
  }

  const isQuestionAnswered = (index: number) => {
    const question = questions[index]
    return question && answers[question.id] && answers[question.id].length > 0
  }

  const answeredCount = Object.keys(answers).filter(key => answers[parseInt(key)].length > 0).length

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const showSubmitConfirm = () => {
    setSubmitModalVisible(true)
  }

  const submitExam = async () => {
    try {
      // TODO: 提交到API
      console.log('提交答案:', answers)
      alert('试卷提交成功！')
      navigate('/exam-history')
    } catch (error) {
      console.error('提交试卷失败:', error)
      alert('提交试卷失败')
    }
  }

  const autoSubmit = async () => {
    alert('考试时间已到，系统将自动提交试卷')
    await submitExam()
  }

  const handleModeChange = (mode: 'single' | 'full') => {
    setExamMode(mode)
  }

  const timeWarning = remainingTime <= 300 && remainingTime > 60
  const timeDanger = remainingTime <= 60

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
  }

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        marginTop: window.innerWidth >= 1200 ? '80px' : '160px',
        padding: '0 2%'
      }}>
        <div style={{ padding: '20px' }}>
          {/* 考试头部信息 */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              {/* 左侧：试卷信息 */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h2 style={{
                  margin: '0 0 10px 0',
                  color: '#2d8cf0',
                  fontSize: '20px'
                }}>{examPaper?.title}</h2>
                <p style={{
                  margin: 0,
                  color: '#666',
                  fontSize: '14px'
                }}>
                  <span>总分：{examPaper?.total_score}分</span>
                  <span style={{ margin: '0 8px' }}>|</span>
                  <span>题目数量：{examPaper?.question_count}题</span>
                  <span style={{ margin: '0 8px' }}>|</span>
                  <span>考试时长：{examPaper?.time_limit}分钟</span>
                </p>
              </div>

              {/* 中间：模式切换 */}
              <div style={{ display: 'flex', gap: '0' }}>
                <button
                  onClick={() => handleModeChange('single')}
                  style={{
                    padding: '8px 20px',
                    background: examMode === 'single' ? 'linear-gradient(90deg, #2d8cf0, #19be6b)' : 'white',
                    color: examMode === 'single' ? 'white' : '#606266',
                    border: examMode === 'single' ? 'none' : '1px solid #dcdfe6',
                    borderRadius: '4px 0 0 4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <List size={16} />
                  单题模式
                </button>
                <button
                  onClick={() => handleModeChange('full')}
                  style={{
                    padding: '8px 20px',
                    background: examMode === 'full' ? 'linear-gradient(90deg, #2d8cf0, #19be6b)' : 'white',
                    color: examMode === 'full' ? 'white' : '#606266',
                    border: examMode === 'full' ? 'none' : '1px solid #dcdfe6',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Grid size={16} />
                  整卷模式
                </button>
              </div>

              {/* 右侧：倒计时 */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: timeDanger ? '#fff2f0' : timeWarning ? '#fff7e6' : '#f0f9ff',
                  border: timeDanger ? '1px solid #ffccc7' : timeWarning ? '1px solid #ffd591' : '1px solid #b3d8ff',
                  borderRadius: '4px',
                  color: timeDanger ? '#f5222d' : timeWarning ? '#fa8c16' : '#2d8cf0',
                  fontWeight: 500
                }}>
                  <Clock size={20} />
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '16px'
                  }}>剩余时间：{formatTime(remainingTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 考试内容区域 */}
          {examMode === 'single' ? (
            // 单题模式
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: '20px'
            }}>
              {/* 题目区域 */}
              <div>
                {currentQuestion && (
                  <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    {/* 题目头部 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      paddingBottom: '15px',
                      borderBottom: '1px solid #e8eaec'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '18px',
                        color: '#303133'
                      }}>第 {currentQuestionIndex + 1} 题 ({currentQuestion.score}分)</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: currentQuestion.question_type === 'single' ? '#409eff' : '#67c23a',
                        color: 'white'
                      }}>
                        {currentQuestion.question_type === 'single' ? '单选题' : '多选题'}
                      </span>
                    </div>

                    {/* 题目内容 */}
                    <div style={{ marginBottom: '20px' }}>
                      <div
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.8',
                          color: '#303133',
                          marginBottom: '15px'
                        }}
                        dangerouslySetInnerHTML={{ __html: currentQuestion.content }}
                      />
                      {currentQuestion.description && (
                        <div
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#666',
                            padding: '12px',
                            background: '#f8f8f9',
                            borderLeft: '4px solid #2d8cf0',
                            borderRadius: '4px'
                          }}
                          dangerouslySetInnerHTML={{ __html: currentQuestion.description }}
                        />
                      )}
                    </div>

                    {/* 选项 */}
                    <div style={{ marginBottom: '30px' }}>
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = answers[currentQuestion.id]?.includes(index)
                        return (
                          <div
                            key={index}
                            onClick={() => handleOptionClick(currentQuestion.id, index, currentQuestion.question_type)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              padding: '12px 16px',
                              marginBottom: '12px',
                              background: isSelected ? '#e6f7ff' : '#fafafa',
                              border: isSelected ? '2px solid #2d8cf0' : '2px solid transparent',
                              borderRadius: '8px',
                              cursor: examSession?.status === 'submitted' ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              if (examSession?.status !== 'submitted') {
                                e.currentTarget.style.background = isSelected ? '#e6f7ff' : '#f0f9ff'
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isSelected ? '#e6f7ff' : '#fafafa'
                            }}
                          >
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              marginRight: '12px',
                              border: isSelected ? '2px solid #2d8cf0' : '2px solid #d9d9d9',
                              borderRadius: currentQuestion.question_type === 'single' ? '50%' : '4px',
                              background: isSelected ? '#2d8cf0' : 'white',
                              color: isSelected ? 'white' : '#d9d9d9',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#303133'
                              }}
                              dangerouslySetInnerHTML={{ __html: option }}
                            />
                          </div>
                        )
                      })}
                    </div>

                    {/* 操作按钮 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '15px'
                    }}>
                      <button
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        style={{
                          flex: 1,
                          padding: '10px 20px',
                          background: currentQuestionIndex === 0 ? '#f5f5f5' : 'white',
                          color: currentQuestionIndex === 0 ? '#c0c4cc' : '#606266',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >上一题</button>
                      <button
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        style={{
                          flex: 1,
                          padding: '10px 20px',
                          background: currentQuestionIndex === questions.length - 1 ? '#f5f5f5' : 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                          color: currentQuestionIndex === questions.length - 1 ? '#c0c4cc' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      >下一题</button>
                    </div>
                  </div>
                )}
              </div>

              {/* 答题卡区域 */}
              <div>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'sticky',
                  top: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e8eaec'
                  }}>
                    <List size={18} style={{ color: '#2d8cf0' }} />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#303133'
                    }}>答题卡</span>
                  </div>

                  {/* 题号网格 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        onClick={() => goToQuestion(index)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          border: index === currentQuestionIndex ? '2px solid #2d8cf0' : '1px solid #dcdfe6',
                          borderRadius: '4px',
                          background: isQuestionAnswered(index) ? '#52c41a' : 'white',
                          color: isQuestionAnswered(index) ? 'white' : (index === currentQuestionIndex ? '#2d8cf0' : '#606266'),
                          fontSize: '14px',
                          fontWeight: index === currentQuestionIndex ? 600 : 'normal',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          if (index !== currentQuestionIndex) {
                            e.currentTarget.style.borderColor = '#2d8cf0'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== currentQuestionIndex) {
                            e.currentTarget.style.borderColor = '#dcdfe6'
                          }
                        }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* 统计信息 */}
                  <div style={{
                    marginBottom: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e8eaec'
                  }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      color: '#606266'
                    }}>已答题：<strong style={{ color: '#52c41a' }}>{answeredCount}</strong> / {questions.length}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#606266'
                    }}>未答题：<strong style={{ color: '#999' }}>{questions.length - answeredCount}</strong></p>
                  </div>

                  {/* 提交按钮 */}
                  <button
                    onClick={showSubmitConfirm}
                    disabled={examSession?.status === 'submitted'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: examSession?.status === 'submitted' ? '#f5f5f5' : 'linear-gradient(135deg, #f5222d, #fa541c)',
                      color: examSession?.status === 'submitted' ? '#c0c4cc' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: examSession?.status === 'submitted' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >提交试卷</button>
                </div>
              </div>
            </div>
          ) : (
            // 整卷模式
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: '20px'
            }}>
              {/* 所有题目列表 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    id={`question-${index}`}
                    style={{
                      background: 'white',
                      padding: '24px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      scrollMarginTop: '20px'
                    }}
                  >
                    {/* 题目头部 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      paddingBottom: '15px',
                      borderBottom: '1px solid #e8eaec'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '18px',
                        color: '#303133'
                      }}>第 {index + 1} 题 ({question.score}分)</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: question.question_type === 'single' ? '#409eff' : '#67c23a',
                          color: 'white'
                        }}>
                          {question.question_type === 'single' ? '单选题' : '多选题'}
                        </span>
                        {isQuestionAnswered(index) && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            background: '#f6ffed',
                            color: '#52c41a'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                              <path d="M5.5 11L1 6.5l1.4-1.4L5.5 8.2 11.6 2l1.4 1.4L5.5 11z"/>
                            </svg>
                            已答
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 题目内容 */}
                    <div style={{ marginBottom: '20px' }}>
                      <div
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.8',
                          color: '#303133',
                          marginBottom: '15px'
                        }}
                        dangerouslySetInnerHTML={{ __html: question.content }}
                      />
                      {question.description && (
                        <div
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#666',
                            padding: '12px',
                            background: '#f8f8f9',
                            borderLeft: '4px solid #2d8cf0',
                            borderRadius: '4px'
                          }}
                          dangerouslySetInnerHTML={{ __html: question.description }}
                        />
                      )}
                    </div>

                    {/* 选项 */}
                    <div>
                      {question.options.map((option, optionIndex) => {
                        const isSelected = answers[question.id]?.includes(optionIndex)
                        return (
                          <div
                            key={optionIndex}
                            onClick={() => handleOptionClick(question.id, optionIndex, question.question_type)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              padding: '12px 16px',
                              marginBottom: '12px',
                              background: isSelected ? '#e6f7ff' : '#fafafa',
                              border: isSelected ? '2px solid #2d8cf0' : '2px solid transparent',
                              borderRadius: '8px',
                              cursor: examSession?.status === 'submitted' ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              if (examSession?.status !== 'submitted') {
                                e.currentTarget.style.background = isSelected ? '#e6f7ff' : '#f0f9ff'
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isSelected ? '#e6f7ff' : '#fafafa'
                            }}
                          >
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              marginRight: '12px',
                              border: isSelected ? '2px solid #2d8cf0' : '2px solid #d9d9d9',
                              borderRadius: question.question_type === 'single' ? '50%' : '4px',
                              background: isSelected ? '#2d8cf0' : 'white',
                              color: isSelected ? 'white' : '#d9d9d9',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#303133'
                              }}
                              dangerouslySetInnerHTML={{ __html: option }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* 整卷模式答题卡 */}
              <div>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'sticky',
                  top: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e8eaec'
                  }}>
                    <Grid size={18} style={{ color: '#2d8cf0' }} />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#303133'
                    }}>答题卡</span>
                  </div>

                  {/* 进度条 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', color: '#606266' }}>答题进度</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d8cf0' }}>
                        {Math.round(answeredCount / questions.length * 100)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${answeredCount / questions.length * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  {/* 图例 */}
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e8eaec'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        background: '#52c41a',
                        borderRadius: '2px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#606266' }}>已答</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        background: 'white',
                        border: '1px solid #dcdfe6',
                        borderRadius: '2px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#606266' }}>未答</span>
                    </div>
                  </div>

                  {/* 题号网格 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        onClick={() => {
                          document.getElementById(`question-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          background: isQuestionAnswered(index) ? '#52c41a' : 'white',
                          color: isQuestionAnswered(index) ? 'white' : '#606266',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#2d8cf0'
                          e.currentTarget.style.transform = 'scale(1.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#dcdfe6'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* 统计信息 */}
                  <div style={{
                    marginBottom: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e8eaec'
                  }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      color: '#606266'
                    }}>已答题：<strong style={{ color: '#52c41a' }}>{answeredCount}</strong> / {questions.length}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#606266'
                    }}>未答题：<strong style={{ color: '#999' }}>{questions.length - answeredCount}</strong></p>
                  </div>

                  {/* 提交按钮 */}
                  <button
                    onClick={showSubmitConfirm}
                    disabled={examSession?.status === 'submitted'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: examSession?.status === 'submitted' ? '#f5f5f5' : 'linear-gradient(135deg, #f5222d, #fa541c)',
                      color: examSession?.status === 'submitted' ? '#c0c4cc' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: examSession?.status === 'submitted' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >提交试卷</button>
                </div>
              </div>
            </div>
          )}

          {/* 提交确认对话框 */}
          {submitModalVisible && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  color: '#303133'
                }}>提交确认</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#606266' }}>
                  确定要提交试卷吗？提交后将无法修改答案。
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#606266' }}>
                  当前已答题：{answeredCount} / {questions.length}
                </p>
                {answeredCount < questions.length && (
                  <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#fa8c16' }}>
                    还有 {questions.length - answeredCount} 题未作答，确定提交吗？
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '20px'
                }}>
                  <button
                    onClick={() => setSubmitModalVisible(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'white',
                      color: '#606266',
                      border: '1px solid #dcdfe6',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >取消</button>
                  <button
                    onClick={() => {
                      setSubmitModalVisible(false)
                      submitExam()
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #f5222d, #fa541c)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >确定提交</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

