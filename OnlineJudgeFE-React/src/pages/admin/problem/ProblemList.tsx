import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, Eye } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface Problem {
  id: number
  _id: string
  title: string
  difficulty: string
  visible: boolean
  create_time: string
  created_by: string
}

export default function AdminProblemList() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProblems()
  }, [])

  const loadProblems = async () => {
    setLoading(true)
    try {
      const data = await adminAPI.getProblemList({
        offset: 0,
        limit: 100
      })
      setProblems(data.results || [])
    } catch (error) {
      console.error('加载题目失败:', error)
      toast.error('加载题目失败')
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (diff: string) => {
    const map: Record<string, string> = {
      'Low': '#67c23a',
      'Mid': '#e6a23c',
      'High': '#f56c6c'
    }
    return map[diff] || '#909399'
  }

  const getDifficultyText = (diff: string) => {
    const map: Record<string, string> = {
      'Low': '简单',
      'Mid': '中等',
      'High': '困难'
    }
    return map[diff] || diff
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
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e8eaec'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#303133' }}>题目列表</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/problem/create')}
            style={{
              padding: '8px 20px',
              background: '#67c23a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <Plus size={16} />
            创建题目
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8eaec' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px', width: '100px' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>标题</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '100px' }}>难度</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '100px' }}>可见性</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px', width: '120px' }}>创建者</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px', width: '180px' }}>创建时间</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '150px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(problem => (
            <tr key={problem.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', fontSize: '14px', color: '#409eff', fontWeight: 600 }}>{problem._id}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#303133' }}>{problem.title}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: getDifficultyColor(problem.difficulty),
                  color: 'white'
                }}>
                  {getDifficultyText(problem.difficulty)}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: problem.visible ? '#67c23a' : '#909399',
                  color: 'white'
                }}>
                  {problem.visible ? '可见' : '隐藏'}
                </span>
              </td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>{problem.created_by}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>
                {new Date(problem.create_time).toLocaleString('zh-CN')}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/problem/edit/${problem.id}`)}
                  style={{
                    padding: '4px 12px',
                    marginRight: '8px',
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


