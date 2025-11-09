import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Eye } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface Homework {
  id: number
  title: string
  class_name: string
  deadline: string
  status: string
  student_count: number
  submitted_count: number
  create_time: string
}

export default function AdminHomeworkList() {
  const navigate = useNavigate()
  const [homeworks, setHomeworks] = useState<Homework[]>([])

  useEffect(() => {
    loadHomeworks()
  }, [])

  const loadHomeworks = async () => {
    try {
      const data = await adminAPI.getHomeworkList({
        offset: 0,
        limit: 100
      })
      setHomeworks(data.results || [])
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败')
      setHomeworks([])
    }
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      'not_started': '#909399',
      'in_progress': '#409eff',
      'ended': '#67c23a'
    }
    return map[status] || '#909399'
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'not_started': '未开始',
      'in_progress': '进行中',
      'ended': '已结束'
    }
    return map[status] || status
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
        <h2 style={{ margin: 0, fontSize: '18px' }}>作业列表</h2>
        <button
          onClick={() => navigate('/admin/homework/create')}
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
          创建作业
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>标题</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>班级</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>状态</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>提交情况</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {homeworks.map(hw => (
            <tr key={hw.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', color: '#409eff', fontWeight: 600 }}>{hw.id}</td>
              <td style={{ padding: '12px' }}>{hw.title}</td>
              <td style={{ padding: '12px' }}>{hw.class_name}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: getStatusColor(hw.status),
                  color: 'white'
                }}>
                  {getStatusText(hw.status)}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                {hw.submitted_count} / {hw.student_count}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/homework/detail/${hw.id}`)}
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
                  <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  查看
                </button>
                <button
                  onClick={() => navigate(`/admin/homework/grade/${hw.id}`)}
                  style={{
                    padding: '4px 12px',
                    background: '#67c23a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  批改
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


