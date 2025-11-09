import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { ArrowLeft, Calendar, Clock, CheckCircle, FileText } from 'lucide-react'

interface Problem {
  id: number
  type: 'programming' | 'choice'
  title: string
  _id?: string
  difficulty: string
  status: 'not_started' | 'in_progress' | 'completed'
  score: number | null
  total_score: number
}

interface Homework {
  id: number
  title: string
  description: string
  start_time: string
  deadline: string
  total_score: number
  problems: Problem[]
}

interface Submission {
  id: number
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded'
  auto_score: number
  final_score: number
  completed_problems: number
  total_problems: number
  feedback?: string
}

export default function HomeworkDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [homework, setHomework] = useState<Homework | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadHomework()
    }
  }, [id])

  const loadHomework = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockHomework: Homework = {
        id: parseInt(id || '0'),
        title: '第1周编程作业',
        description: '本周作业包含5道编程题和3道选择题，请在截止日期前完成。',
        start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        total_score: 100,
        problems: [
          { id: 1, type: 'programming', title: '简单的A+B问题', _id: 'P1001', difficulty: 'easy', status: 'completed', score: 10, total_score: 10 },
          { id: 2, type: 'programming', title: '输出字符串', _id: 'P1002', difficulty: 'easy', status: 'completed', score: 10, total_score: 10 },
          { id: 3, type: 'choice', title: '变量定义', difficulty: 'easy', status: 'completed', score: 5, total_score: 5 },
          { id: 4, type: 'programming', title: '循环结构', _id: 'P1003', difficulty: 'medium', status: 'in_progress', score: null, total_score: 15 },
          { id: 5, type: 'choice', title: '函数调用', difficulty: 'medium', status: 'not_started', score: null, total_score: 5 }
        ]
      }

      const mockSubmission: Submission = {
        id: 1,
        status: 'in_progress',
        auto_score: 25,
        final_score: 0,
        completed_problems: 3,
        total_problems: 5,
        feedback: ''
      }

      setHomework(mockHomework)
      setSubmission(mockSubmission)
    } catch (error) {
      console.error('加载作业失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = () => {
    if (!submission) return '未开始'
    const map: Record<string, string> = {
      'not_started': '未开始',
      'in_progress': '进行中',
      'submitted': '已提交',
      'graded': '已完成'
    }
    return map[submission.status] || '未知'
  }

  const getStatusColor = () => {
    if (!submission) return '#909399'
    const map: Record<string, string> = {
      'not_started': '#909399',
      'in_progress': '#409eff',
      'submitted': '#e6a23c',
      'graded': '#67c23a'
    }
    return map[submission.status] || '#909399'
  }

  const getProgress = () => {
    if (!submission) return 0
    return Math.round((submission.completed_problems / submission.total_problems) * 100)
  }

  const getScorePercent = () => {
    if (!homework || !submission) return 0
    const score = submission.status === 'graded' ? submission.final_score : submission.auto_score
    return Math.round((score / homework.total_score) * 100)
  }

  const getDifficultyText = (difficulty: string) => {
    const map: Record<string, string> = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    }
    return map[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const map: Record<string, string> = {
      'easy': '#67c23a',
      'medium': '#e6a23c',
      'hard': '#f56c6c'
    }
    return map[difficulty] || '#909399'
  }

  const getProblemStatusText = (status: string) => {
    const map: Record<string, string> = {
      'not_started': '未开始',
      'in_progress': '进行中',
      'completed': '已完成'
    }
    return map[status] || status
  }

  const getProblemStatusColor = (status: string) => {
    const map: Record<string, string> = {
      'not_started': '#909399',
      'in_progress': '#409eff',
      'completed': '#67c23a'
    }
    return map[status] || '#909399'
  }

  const handleProblemClick = (problem: Problem) => {
    if (problem.type === 'programming') {
      navigate(`/problem/${problem._id}`)
    } else {
      navigate(`/choice-question/${problem.id}`)
    }
  }

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
  }

  if (!homework) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>未找到作业</div>
  }

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        marginTop: window.innerWidth >= 1200 ? '80px' : '160px',
        padding: '20px 2%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* 返回按钮 */}
          <button
            onClick={() => navigate('/homework')}
            style={{
              marginBottom: '20px',
              padding: '8px 20px',
              background: 'white',
              color: '#606266',
              border: '1px solid #dcdfe6',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <ArrowLeft size={16} />
            返回列表
          </button>

          {/* 标题区域 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#303133' }}>{homework.title}</h2>
              <span style={{
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                background: getStatusColor(),
                color: 'white',
                fontWeight: 600
              }}>
                {getStatusText()}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#606266', lineHeight: '1.6' }}>
              {homework.description}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px'
          }}>
            {/* 左侧主内容 */}
            <div>
              {/* 得分卡片 */}
              {submission && submission.auto_score > 0 && (
                <div style={{
                  background: submission.status === 'graded' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  color: submission.status === 'graded' ? 'white' : '#303133'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
                        {submission.status === 'graded' ? '最终得分' : '自动评分'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '48px', fontWeight: 'bold' }}>
                          {submission.status === 'graded' ? submission.final_score : submission.auto_score}
                        </span>
                        <span style={{ fontSize: '24px', opacity: 0.7 }}>
                          / {homework.total_score}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
                        得分率: <span style={{ fontWeight: 600 }}>{getScorePercent()}%</span>
                      </div>
                    </div>

                    {/* 圆形进度 */}
                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                      <svg viewBox="0 0 128 128" style={{ width: '100%', height: '100%' }}>
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={submission.status === 'graded' ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={submission.status === 'graded' ? 'white' : '#19be6b'}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - getScorePercent() / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 64 64)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{getScorePercent()}%</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>完成度</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 作业信息 */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      color: '#909399',
                      fontSize: '14px'
                    }}>
                      <Calendar size={16} />
                      <span>开始时间</span>
                    </div>
                    <div style={{ fontSize: '16px', color: '#303133', fontWeight: 600 }}>
                      {formatTime(homework.start_time)}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      color: '#909399',
                      fontSize: '14px'
                    }}>
                      <Clock size={16} />
                      <span>截止时间</span>
                    </div>
                    <div style={{ fontSize: '16px', color: '#f56c6c', fontWeight: 600 }}>
                      {formatTime(homework.deadline)}
                    </div>
                  </div>
                </div>

                {submission && (
                  <div>
                    <div style={{ fontSize: '14px', color: '#909399', marginBottom: '8px' }}>完成进度</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        flex: 1,
                        height: '6px',
                        background: '#f0f0f0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${getProgress()}%`,
                          height: '100%',
                          background: '#2563eb',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      <span style={{ fontSize: '14px', color: '#606266', fontWeight: 600 }}>
                        {submission.completed_problems || 0} / {submission.total_problems || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 教师反馈 */}
              {submission && submission.status === 'graded' && (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <CheckCircle size={20} style={{ color: '#19be6b' }} />
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#303133' }}>教师反馈</h3>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#606266',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {submission.feedback || '老师暂未添加评语'}
                  </div>
                </div>
              )}

              {/* 题目列表 */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <FileText size={20} style={{ color: '#2d8cf0' }} />
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#303133' }}>作业项目</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: '#409eff',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>{homework.problems.length}题</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {homework.problems.map(problem => (
                    <div
                      key={problem.id}
                      onClick={() => handleProblemClick(problem)}
                      style={{
                        border: '1px solid #e8eaec',
                        borderRadius: '8px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#409eff'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(64, 158, 255, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e8eaec'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#303133'
                          }}>{problem.type === 'programming' ? problem._id : `选择题${problem.id}`}</span>
                          <span style={{ fontSize: '14px', color: '#606266' }}>{problem.title}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            background: getDifficultyColor(problem.difficulty),
                            color: 'white'
                          }}>
                            {getDifficultyText(problem.difficulty)}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            background: getProblemStatusColor(problem.status),
                            color: 'white'
                          }}>
                            {getProblemStatusText(problem.status)}
                          </span>
                          {problem.score !== null && (
                            <span style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#67c23a'
                            }}>
                              {problem.score}/{problem.total_score}分
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧边栏 */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#303133' }}>培养指南</h3>
                <div style={{
                  padding: '16px',
                  background: '#e6f7ff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1890ff'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#606266', lineHeight: '1.6' }}>
                    {submission && submission.status === 'not_started'
                      ? '点击下方题目开始答题，完成后提交作业'
                      : submission && submission.status === 'in_progress'
                      ? '继续完成剩余题目，全部完成后记得提交'
                      : submission && submission.status === 'submitted'
                      ? '作业已提交，等待教师批阅'
                      : '作业已完成，查看教师反馈'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


