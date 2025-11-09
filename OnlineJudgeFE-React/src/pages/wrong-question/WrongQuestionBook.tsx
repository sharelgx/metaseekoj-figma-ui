import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { BookOpen, AlertCircle } from 'lucide-react'

interface WrongQuestion {
  id: number
  title: string
  content: string
  question_type: 'single' | 'multiple'
  difficulty: number
  wrong_count: number
  last_wrong_time: string
  category: string
}

export default function WrongQuestionBook() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<WrongQuestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadWrongQuestions()
  }, [])

  const loadWrongQuestions = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockQuestions: WrongQuestion[] = Array.from({ length: 8 }, (_, i) => ({
        id: 2100 + i,
        title: `错题${i + 1}：${['变量定义', '循环结构', '数组操作', '函数调用', '递归思想', '动态规划', '贪心算法', '图论基础'][i]}`,
        content: `这是第${i + 1}道错题的内容...`,
        question_type: i % 2 === 0 ? 'single' : 'multiple',
        difficulty: (i % 3) + 1,
        wrong_count: Math.floor(Math.random() * 5) + 1,
        last_wrong_time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        category: ['GESP等级考试', '算法基础', '数学竞赛'][i % 3]
      }))

      setQuestions(mockQuestions)
    } catch (error) {
      console.error('加载错题失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyText = (level: number) => {
    const texts: Record<number, string> = { 1: '简单', 2: '中等', 3: '困难' }
    return texts[level] || '未知'
  }

  const getDifficultyColor = (level: number) => {
    const colors: Record<number, string> = { 1: '#67c23a', 2: '#e6a23c', 3: '#f56c6c' }
    return colors[level] || '#909399'
  }

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN', {
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
          {/* 标题 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <BookOpen size={24} style={{ color: '#f56c6c' }} />
              <h2 style={{ margin: 0, fontSize: '24px', color: '#303133' }}>我的错题本</h2>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                background: '#f56c6c',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600
              }}>{questions.length}</span>
            </div>
          </div>

          {/* 错题列表 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
          ) : questions.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '60px 24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <AlertCircle size={80} style={{ color: '#dcdee2', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#909399', margin: '0 0 8px 0' }}>暂无错题</p>
              <p style={{ fontSize: '14px', color: '#c0c4cc', margin: 0 }}>继续加油，保持全对！</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {questions.map(question => (
                <div
                  key={question.id}
                  onClick={() => navigate(`/choice-question/${question.id}`)}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '18px',
                      color: '#303133',
                      flex: 1
                    }}>{question.title}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: getDifficultyColor(question.difficulty),
                        color: 'white'
                      }}>
                        {getDifficultyText(question.difficulty)}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: question.question_type === 'single' ? '#409eff' : '#67c23a',
                        color: 'white'
                      }}>
                        {question.question_type === 'single' ? '单选' : '多选'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#909399'
                  }}>
                    <div>
                      <span>分类: {question.category}</span>
                      <span style={{ margin: '0 12px' }}>|</span>
                      <span style={{ color: '#f56c6c' }}>错误次数: {question.wrong_count}</span>
                    </div>
                    <span>最近错误: {formatTime(question.last_wrong_time)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


