import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { CheckCircle, TrendingUp, XCircle } from 'lucide-react'
import { choiceQuestionAPI } from '@/api/choice-question'
import { toast } from 'sonner'

interface Question {
  id: number
  order: number
  content: string
  question_type: 'single' | 'multiple'
  options: string[]
  correct_answer: number[]
  user_answer: number[]
  is_correct: boolean
  difficulty: string
  explanation?: string
  score: number
}

interface ExamSession {
  id: number
  exam_paper_title: string
  start_time: string
  duration: number
  total_score: number
  max_score: number
  score_percentage: number
  correct_count: number
  total_count: number
  accuracy_rate: number
  questions: Question[]
}

interface TypeStat {
  type: string
  type_display: string
  total: number
  correct: number
  accuracy: number
}

interface DifficultyStat {
  difficulty: string
  difficulty_display: string
  total: number
  correct: number
  accuracy: number
}

export default function ExamResult() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([])
  const [typeStats, setTypeStats] = useState<TypeStat[]>([])
  const [difficultyStats, setDifficultyStats] = useState<DifficultyStat[]>([])

  useEffect(() => {
    if (sessionId) {
      loadExamResult()
    }
  }, [sessionId])

  const loadExamResult = async () => {
    setLoading(true)
    try {
      // 获取考试结果
      const data = await choiceQuestionAPI.getExamResult(sessionId!)
      
      setExamSession(data)
      setWrongQuestions(data.questions?.filter((q: Question) => !q.is_correct) || [])
      
      // TODO: 计算统计数据
      // setTypeStats(...)
      // setDifficultyStats(...)
    } catch (error) {
      console.error('加载考试结果失败:', error)
      toast.error('加载考试结果失败')
      
      // 失败时使用Mock数据
      const mockSession: ExamSession = {
        id: parseInt(sessionId || '0'),
        exam_paper_title: 'GESP三级模拟试卷一',
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 5400, // 90分钟
        total_score: 85,
        max_score: 100,
        score_percentage: 85,
        correct_count: 21,
        total_count: 25,
        accuracy_rate: 84,
        questions: Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          order: i + 1,
          content: `这是第 ${i + 1} 题的题目内容。`,
          question_type: (i % 3 === 0 ? 'multiple' : 'single') as 'single' | 'multiple',
          options: ['选项A', '选项B', '选项C', '选项D'],
          correct_answer: i % 3 === 0 ? [0, 1] : [i % 4],
          user_answer: i < 21 ? (i % 3 === 0 ? [0, 1] : [i % 4]) : (i % 3 === 0 ? [0] : [(i + 1) % 4]),
          is_correct: i < 21,
          difficulty: i < 10 ? 'easy' : i < 20 ? 'medium' : 'hard',
          explanation: i >= 21 ? `第 ${i + 1} 题的解析：正确答案是...` : undefined,
          score: 4
        }))
      }

      setExamSession(mockSession)
      processStats(mockSession)
      processWrongQuestions(mockSession)
    } finally {
      setLoading(false)
    }
  }

  const processStats = (session: ExamSession) => {
    const typeMap: Record<string, any> = {}
    const difficultyMap: Record<string, any> = {}

    session.questions.forEach(question => {
      // 题型统计
      const type = question.question_type
      if (!typeMap[type]) {
        typeMap[type] = {
          type,
          type_display: type === 'single' ? '单选题' : '多选题',
          total: 0,
          correct: 0
        }
      }
      typeMap[type].total++
      if (question.is_correct) {
        typeMap[type].correct++
      }

      // 难度统计
      const difficulty = question.difficulty
      if (!difficultyMap[difficulty]) {
        difficultyMap[difficulty] = {
          difficulty,
          difficulty_display: getDifficultyDisplay(difficulty),
          total: 0,
          correct: 0
        }
      }
      difficultyMap[difficulty].total++
      if (question.is_correct) {
        difficultyMap[difficulty].correct++
      }
    })

    setTypeStats(Object.values(typeMap).map(stat => ({
      ...stat,
      accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    })))

    setDifficultyStats(Object.values(difficultyMap).map(stat => ({
      ...stat,
      accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    })))
  }

  const processWrongQuestions = (session: ExamSession) => {
    setWrongQuestions(session.questions.filter(q => !q.is_correct))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0分钟'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}分${secs}秒`
  }

  const formatAnswer = (answer: number[]) => {
    if (!answer || answer.length === 0) return ''
    return answer.map(index => String.fromCharCode(65 + index)).join(', ')
  }

  const isCorrectOption = (correctAnswer: number[], optionIndex: number) => {
    return correctAnswer.includes(optionIndex)
  }

  const isUserSelectedOption = (userAnswer: number[], optionIndex: number) => {
    return userAnswer && userAnswer.includes(optionIndex)
  }

  const getScoreClass = (percentage: number) => {
    if (percentage >= 90) return '#52c41a'
    if (percentage >= 80) return '#1890ff'
    if (percentage >= 60) return '#faad14'
    return '#f5222d'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return '#52c41a'
    if (percentage >= 60) return '#faad14'
    return '#f5222d'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': '#67c23a',
      'medium': '#e6a23c',
      'hard': '#f56c6c'
    }
    return colors[difficulty] || '#909399'
  }

  const getDifficultyDisplay = (difficulty: string) => {
    const displays: Record<string, string> = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    }
    return displays[difficulty] || difficulty
  }

  const goBack = () => {
    navigate('/choice-questions')
  }

  const reviewExam = () => {
    navigate(`/exam-review/${sessionId}`)
  }

  const practiceWrongQuestions = () => {
    const wrongQuestionIds = wrongQuestions.map(q => q.id)
    navigate(`/wrong-question-book?examSessionId=${sessionId}&questionIds=${wrongQuestionIds.join(',')}`)
  }

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
  }

  if (!examSession) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>未找到考试记录</div>
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
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px'
        }}>
          {/* 考试结果头部 */}
          <div style={{
            background: 'white',
            padding: '40px 20px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <CheckCircle size={48} style={{ color: '#52c41a', marginBottom: '10px' }} />
            <h1 style={{
              margin: '10px 0 20px 0',
              color: '#52c41a',
              fontSize: '32px'
            }}>考试完成</h1>
            
            <h2 style={{
              margin: '0 0 10px 0',
              color: '#333',
              fontSize: '24px'
            }}>{examSession.exam_paper_title}</h2>
            <p style={{
              color: '#666',
              fontSize: '14px',
              margin: 0
            }}>
              <span>考试时间：{formatDate(examSession.start_time)}</span>
              <span style={{ margin: '0 10px', color: '#ddd' }}>|</span>
              <span>用时：{formatDuration(examSession.duration)}</span>
            </p>
          </div>

          {/* 成绩概览 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: getScoreClass(examSession.score_percentage)
              }}>{examSession.total_score}</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '4px'
              }}>总分</div>
              <div style={{
                fontSize: '12px',
                color: '#999'
              }}>满分 {examSession.max_score}</div>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#1890ff'
              }}>{examSession.score_percentage}%</div>
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>得分率</div>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#52c41a'
              }}>{examSession.correct_count}</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '4px'
              }}>正确题数</div>
              <div style={{
                fontSize: '12px',
                color: '#999'
              }}>共 {examSession.total_count} 题</div>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#722ed1'
              }}>{examSession.accuracy_rate}%</div>
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>正确率</div>
            </div>
          </div>

          {/* 答题情况分析 */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              paddingBottom: '15px',
              borderBottom: '1px solid #e8eaec'
            }}>
              <TrendingUp size={20} style={{ color: '#2d8cf0' }} />
              <span style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#303133'
              }}>答题情况分析</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px'
            }}>
              {/* 题型统计 */}
              <div>
                <h4 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  color: '#333'
                }}>按题型统计</h4>
                {typeStats.map(stat => (
                  <div key={stat.type} style={{ marginBottom: '15px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', color: '#606266' }}>{stat.type_display}</span>
                      <span style={{ fontSize: '12px', color: '#909399' }}>
                        {stat.correct}/{stat.total} ({stat.accuracy}%)
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
                        width: `${stat.accuracy}%`,
                        height: '100%',
                        background: getProgressColor(stat.accuracy),
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 难度统计 */}
              <div>
                <h4 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  color: '#333'
                }}>按难度统计</h4>
                {difficultyStats.map(stat => (
                  <div key={stat.difficulty} style={{ marginBottom: '15px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: getDifficultyColor(stat.difficulty),
                        color: 'white'
                      }}>{stat.difficulty_display}</span>
                      <span style={{ fontSize: '12px', color: '#909399' }}>
                        {stat.correct}/{stat.total} ({stat.accuracy}%)
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
                        width: `${stat.accuracy}%`,
                        height: '100%',
                        background: getProgressColor(stat.accuracy),
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 错题回顾 */}
          {wrongQuestions.length > 0 && (
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e8eaec'
              }}>
                <XCircle size={20} style={{ color: '#f5222d' }} />
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#303133'
                }}>错题回顾 ({wrongQuestions.length} 题)</span>
              </div>

              {wrongQuestions.map((question, index) => (
                <div key={question.id} style={{
                  border: '1px solid #e8eaec',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  {/* 题目头部 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e8eaec'
                  }}>
                    <h4 style={{ margin: 0, color: '#333' }}>第 {question.order} 题</h4>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: '#f5222d',
                      color: 'white'
                    }}>{question.question_type === 'single' ? '单选题' : '多选题'}</span>
                  </div>

                  {/* 题目内容 */}
                  <div style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '15px',
                    color: '#333'
                  }}>{question.content}</div>

                  {/* 选项 */}
                  <div style={{ marginBottom: '20px' }}>
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = isCorrectOption(question.correct_answer, optionIndex)
                      const isUserSelected = isUserSelectedOption(question.user_answer, optionIndex)
                      const isWrong = isUserSelected && !isCorrect

                      return (
                        <div
                          key={optionIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '14px 16px',
                            marginBottom: '10px',
                            borderRadius: '10px',
                            border: '1px solid #e8eaec',
                            background: isCorrect ? '#f6ffed' : isWrong ? '#fff2f0' : '#fff'
                          }}
                        >
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            fontWeight: 600,
                            marginRight: '10px',
                            flexShrink: 0,
                            color: isCorrect ? '#fff' : isWrong ? '#fff' : '#2d8cf0',
                            background: isCorrect ? '#52c41a' : isWrong ? '#f5222d' : '#f0f3f9',
                            border: isCorrect ? 'none' : isWrong ? 'none' : '1px solid #d6e4ff'
                          }}>
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <div style={{ flex: 1, lineHeight: '1.65' }}>{option}</div>
                          {isCorrect && (
                            <CheckCircle size={16} style={{ color: '#52c41a', marginLeft: '8px' }} />
                          )}
                          {isWrong && (
                            <XCircle size={16} style={{ color: '#f5222d', marginLeft: '8px' }} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* 答案对比 */}
                  <div style={{
                    background: '#fafafa',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: question.explanation ? '15px' : 0
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: 500, color: '#666' }}>正确答案：</span>
                      <span style={{ color: '#52c41a', fontWeight: 500 }}>
                        {formatAnswer(question.correct_answer)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 500, color: '#666' }}>你的答案：</span>
                      <span style={{ color: '#f5222d', fontWeight: 500 }}>
                        {formatAnswer(question.user_answer) || '未作答'}
                      </span>
                    </div>
                  </div>

                  {/* 解析 */}
                  {question.explanation && (
                    <div style={{
                      background: '#fff7e6',
                      borderLeft: '4px solid #faad14',
                      padding: '15px',
                      borderRadius: '4px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px'
                      }}>
                        <span style={{
                          fontWeight: 600,
                          color: '#fa8c16',
                          fontSize: '14px'
                        }}>答案解析：</span>
                      </div>
                      <div style={{
                        color: '#595959',
                        lineHeight: '1.8',
                        fontSize: '14px'
                      }}>{question.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div style={{
            textAlign: 'center',
            padding: '40px 0'
          }}>
            <button
              onClick={goBack}
              style={{
                padding: '12px 32px',
                margin: '0 10px',
                background: 'white',
                color: '#606266',
                border: '1px solid #dcdfe6',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >返回题目列表</button>
            <button
              onClick={reviewExam}
              style={{
                padding: '12px 32px',
                margin: '0 10px',
                background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >查看完整试卷</button>
            {wrongQuestions.length > 0 && (
              <button
                onClick={practiceWrongQuestions}
                style={{
                  padding: '12px 32px',
                  margin: '0 10px',
                  background: 'linear-gradient(90deg, #67c23a, #52c41a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >练习错题</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}


