import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Eye } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface Contest {
  id: number
  title: string
  rule_type: 'ACM' | 'OI'
  status: number
  start_time: string
  end_time: string
  created_by: string
}

export default function AdminContestList() {
  const navigate = useNavigate()
  const [contests, setContests] = useState<Contest[]>([])

  useEffect(() => {
    loadContests()
  }, [])

  const loadContests = async () => {
    try {
      const data = await adminAPI.getContestList({
        offset: 0,
        limit: 100
      })
      setContests(data.results || [])
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败')
      setContests([])
    }
  }

  const getStatusText = (status: number) => {
    const map: Record<number, string> = { 1: '未开始', 0: '进行中', '-1': '已结束' }
    return map[status] || '未知'
  }

  const getStatusColor = (status: number) => {
    const map: Record<number, string> = { 1: '#2d8cf0', 0: '#19be6b', '-1': '#909399' }
    return map[status] || '#909399'
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
        <h2 style={{ margin: 0, fontSize: '18px' }}>竞赛列表</h2>
        <button
          onClick={() => navigate('/admin/contest/create')}
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
          创建竞赛
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>标题</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>规则</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>状态</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>开始时间</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {contests.map(contest => (
            <tr key={contest.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', color: '#409eff', fontWeight: 600 }}>{contest.id}</td>
              <td style={{ padding: '12px' }}>{contest.title}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: '#e6a23c',
                  color: 'white'
                }}>
                  {contest.rule_type}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: getStatusColor(contest.status),
                  color: 'white'
                }}>
                  {getStatusText(contest.status)}
                </span>
              </td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>
                {new Date(contest.start_time).toLocaleString('zh-CN')}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/contest/${contest.id}/edit`)}
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


