import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { BookOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { homeworkAPI } from '@/api/homework'
import { toast } from 'sonner'

interface Homework {
  id: number
  title: string
  description: string
  deadline: string
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded'
  score: number | null
  total_score: number
  problem_count: number
  completed_count: number
}

export default function HomeworkList() {
  const navigate = useNavigate()
  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    avgScore: 0
  })

  useEffect(() => {
    loadHomework()
  }, [])

  const loadHomework = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockHomework: Homework[] = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `第${i + 1}周编程作业`,
        description: `本周作业包含${3 + i}道编程题，请在截止日期前完成。`,
        deadline: new Date(Date.now() + (7 - i) * 24 * 60 * 60 * 1000).toISOString(),
        status: ['not_started', 'in_progress', 'submitted', 'graded'][i % 4] as any,
        score: i % 4 === 3 ? 85 + i * 2 : null,
        total_score: 100,
        problem_count: 3 + i,
        completed_count: i % 4 >= 2 ? 3 + i : i
      }))

      setHomeworkList(mockHomework)
      
      // 计算统计数据
      setStats({
        total: mockHomework.length,
        pending: mockHomework.filter(h => h.status !== 'graded').length,
        completed: mockHomework.filter(h => h.status === 'graded').length,
        avgScore: mockHomework.filter(h => h.score !== null).reduce((sum, h) => sum + (h.score || 0), 0) / mockHomework.filter(h => h.score !== null).length || 0
      })
    } catch (error) {
      console.error('加载作业失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'not_started': '未开始',
      'in_progress': '进行中',
      'submitted': '已提交',
      'graded': '已完成'
    }
    return map[status] || status
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      'not_started': '#909399',
      'in_progress': '#409eff',
      'submitted': '#e6a23c',
      'graded': '#67c23a'
    }
    return map[status] || '#909399'
  }

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          {/* 统计卡片 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={28} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#909399', marginBottom: '4px' }}>作业总数</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#303133' }}>{stats.total}</div>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={28} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#909399', marginBottom: '4px' }}>待完成</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#303133' }}>{stats.pending}</div>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={28} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#909399', marginBottom: '4px' }}>已完成</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#303133' }}>{stats.completed}</div>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={28} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#909399', marginBottom: '4px' }}>平均得分</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#303133' }}>{stats.avgScore.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* 作业列表 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '20px',
              color: '#303133',
              paddingBottom: '16px',
              borderBottom: '1px solid #e8eaec'
            }}>我的作业</h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
            ) : homeworkList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#909399' }}>
                <p>暂无作业</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {homeworkList.map(hw => (
                  <div
                    key={hw.id}
                    onClick={() => navigate(`/homework/${hw.id}`)}
                    style={{
                      border: '1px solid #e8eaec',
                      borderRadius: '8px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#409eff'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(64, 158, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8eaec'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#303133' }}>{hw.title}</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: getStatusColor(hw.status),
                        color: 'white'
                      }}>
                        {getStatusText(hw.status)}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 12px 0', color: '#606266', fontSize: '14px' }}>
                      {hw.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      color: '#909399'
                    }}>
                      <div>
                        <span>进度: {hw.completed_count}/{hw.problem_count}</span>
                        {hw.score !== null && (
                          <span style={{ marginLeft: '20px', color: '#67c23a', fontWeight: 600 }}>
                            得分: {hw.score}/{hw.total_score}
                          </span>
                        )}
                      </div>
                      <span>截止时间: {formatDeadline(hw.deadline)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}


