import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface ChoiceQuestion {
  id: number
  _id: string
  title: string
  question_type: 'single' | 'multiple'
  difficulty: number
  visible: boolean
  create_time: string
}

export default function AdminChoiceQuestionList() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<ChoiceQuestion[]>([])

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const data = await adminAPI.getChoiceQuestionList({
        offset: 0,
        limit: 100
      })
      setQuestions(data.results || [])
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败')
      setQuestions([])
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '4px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e8eaec'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>选择题列表</h2>
        <button
          onClick={() => navigate('/admin/choice-question/create')}
          style={{
            padding: '8px 20px',
            background: '#67c23a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} />
          创建选择题
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>标题</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>类型</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>难度</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', color: '#409eff', fontWeight: 600 }}>{q._id}</td>
              <td style={{ padding: '12px' }}>{q.title}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: q.question_type === 'single' ? '#409eff' : '#67c23a',
                  color: 'white'
                }}>
                  {q.question_type === 'single' ? '单选' : '多选'}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: ['#67c23a', '#e6a23c', '#f56c6c'][q.difficulty - 1],
                  color: 'white'
                }}>
                  {['简单', '中等', '困难'][q.difficulty - 1]}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/choice-question/edit/${q.id}`)}
                  style={{
                    padding: '4px 12px',
                    background: '#409eff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  编辑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


