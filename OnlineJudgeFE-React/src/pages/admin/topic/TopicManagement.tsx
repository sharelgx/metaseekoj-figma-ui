import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface Topic {
  id: number
  title: string
  category: string
  difficulty: number
  question_count: number
  practice_count: number
  create_time: string
}

export default function TopicManagement() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      const data = await adminAPI.getTopicList({
        offset: 0,
        limit: 100
      })
      setTopics(data.results || [])
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败')
      setTopics([])
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
        <h2 style={{ margin: 0, fontSize: '18px' }}>专题管理</h2>
        <button
          onClick={() => navigate('/admin/topic/create')}
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
          创建专题
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>专题名称</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>分类</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>难度</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>题目数</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>练习次数</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {topics.map(topic => (
            <tr key={topic.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', color: '#409eff', fontWeight: 600 }}>{topic.id}</td>
              <td style={{ padding: '12px' }}>{topic.title}</td>
              <td style={{ padding: '12px', color: '#606266' }}>{topic.category}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: ['#67c23a', '#e6a23c', '#f56c6c'][topic.difficulty - 1],
                  color: 'white'
                }}>
                  {['简单', '中等', '困难'][topic.difficulty - 1]}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{topic.question_count}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{topic.practice_count}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/topic/edit/${topic.id}`)}
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


