import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Download } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface ExamPaper {
  id: number
  title: string
  question_count: number
  time_limit: number
  total_score: number
  usage_count: number
  create_time: string
}

export default function ExamPaperList() {
  const navigate = useNavigate()
  const [papers, setPapers] = useState<ExamPaper[]>([])

  useEffect(() => {
    loadPapers()
  }, [])

  const loadPapers = async () => {
    try {
      const data = await adminAPI.getExamPaperList({
        offset: 0,
        limit: 100
      })
      setPapers(data.results || [])
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败')
      setPapers([])
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
        <h2 style={{ margin: 0, fontSize: '18px' }}>试卷列表</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '8px 20px',
            background: '#409eff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Download size={16} />
            导入试卷
          </button>
          <button style={{
            padding: '8px 20px',
            background: '#67c23a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Plus size={16} />
            创建试卷
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>试卷名称</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>题目数</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>时长</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>总分</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>使用次数</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {papers.map(paper => (
            <tr key={paper.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', color: '#409eff', fontWeight: 600 }}>{paper.id}</td>
              <td style={{ padding: '12px', color: '#303133' }}>{paper.title}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{paper.question_count}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{paper.time_limit}分钟</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{paper.total_score}分</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{paper.usage_count}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button style={{
                  padding: '4px 12px',
                  background: '#409eff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
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


