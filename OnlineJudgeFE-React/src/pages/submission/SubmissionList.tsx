import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { RefreshCw } from 'lucide-react'
import { submissionAPI } from '@/api/submission'
import { toast } from 'sonner'

const JUDGE_STATUS: Record<number, { name: string; color: string }> = {
  0: { name: 'Accepted', color: '#19be6b' },
  1: { name: 'Wrong Answer', color: '#ed3f14' },
  2: { name: 'Time Limit Exceeded', color: '#ff9900' },
  3: { name: 'Memory Limit Exceeded', color: '#ff9900' },
  4: { name: 'Runtime Error', color: '#ed3f14' },
  5: { name: 'System Error', color: '#ed3f14' },
  6: { name: 'Compile Error', color: '#ff9900' },
  7: { name: 'Pending', color: '#2d8cf0' },
  8: { name: 'Judging', color: '#2d8cf0' }
}

interface Submission {
  id: string
  create_time: string
  result: number
  problem: string
  statistic_info: {
    time_cost: number
    memory_cost: number
  }
  language: string
  username: string
  show_link: boolean
}

export default function SubmissionList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [myself, setMyself] = useState(searchParams.get('myself') === '1')
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState('All')
  const [result, setResult] = useState('')

  useEffect(() => {
    getSubmissions()
  }, [page, myself, result])

  const getSubmissions = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockSubmissions: Submission[] = Array.from({ length: 20 }, (_, i) => ({
        id: `sub_${Date.now()}_${i}`,
        create_time: new Date(Date.now() - i * 3600000).toISOString(),
        result: i % 9,
        problem: `P100${i + 1}`,
        statistic_info: {
          time_cost: Math.floor(Math.random() * 1000),
          memory_cost: Math.floor(Math.random() * 10000)
        },
        language: ['C++', 'Python', 'Java'][i % 3],
        username: 'testuser',
        show_link: true
      }))

      setSubmissions(mockSubmissions)
      setTotal(100)
    } catch (error) {
      console.error('获取提交记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMemory = (memory: number) => {
    return `${(memory / 1024).toFixed(2)} MB`
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
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* 主面板 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
          }}>
            {/* 标题和筛选栏 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e8eaec'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#303133' }}>
                {myself ? '我的提交' : '所有提交'}
              </h2>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Mine/All切换 */}
                <div style={{
                  display: 'flex',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #dcdfe6'
                }}>
                  <button
                    onClick={() => setMyself(false)}
                    style={{
                      padding: '8px 20px',
                      background: !myself ? '#409eff' : 'white',
                      color: !myself ? 'white' : '#606266',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >All</button>
                  <button
                    onClick={() => setMyself(true)}
                    style={{
                      padding: '8px 20px',
                      background: myself ? '#409eff' : 'white',
                      color: myself ? 'white' : '#606266',
                      border: 'none',
                      borderLeft: '1px solid #dcdfe6',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >Mine</button>
                </div>

                {/* 用户名搜索 */}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="搜索用户"
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    width: '200px'
                  }}
                />

                {/* 刷新按钮 */}
                <button
                  onClick={getSubmissions}
                  style={{
                    padding: '8px 16px',
                    background: '#409eff',
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
                  <RefreshCw size={16} />
                  刷新
                </button>
              </div>
            </div>

            {/* 表格 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8eaec' }}>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>时间</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>状态</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>题目</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>时间</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>内存</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>语言</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>作者</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #e8eaec' }}>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                        {formatTime(sub.create_time)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                        {sub.show_link ? (
                          <span
                            onClick={() => navigate(`/status/${sub.id}`)}
                            style={{ color: '#57a3f3', cursor: 'pointer' }}
                          >
                            {sub.id.slice(0, 12)}
                          </span>
                        ) : (
                          <span>{sub.id.slice(0, 12)}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: JUDGE_STATUS[sub.result].color,
                          color: 'white'
                        }}>
                          {JUDGE_STATUS[sub.result].name}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span
                          onClick={() => navigate(`/problem/${sub.problem}`)}
                          style={{ color: '#57a3f3', cursor: 'pointer', fontSize: '14px' }}
                        >
                          {sub.problem}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                        {sub.statistic_info.time_cost}ms
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                        {formatMemory(sub.statistic_info.memory_cost)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                        {sub.language}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span
                          onClick={() => navigate(`/user-home?username=${sub.username}`)}
                          style={{ color: '#57a3f3', cursor: 'pointer', fontSize: '14px' }}
                        >
                          {sub.username}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {total > limit && (
              <div style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '8px 16px',
                    background: page === 1 ? '#f5f5f5' : 'white',
                    color: page === 1 ? '#c0c4cc' : '#606266',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >上一页</button>
                <span style={{ fontSize: '14px', color: '#606266' }}>
                  {page} / {Math.ceil(total / limit)}
                </span>
                <button
                  onClick={() => setPage(Math.min(Math.ceil(total / limit), page + 1))}
                  disabled={page >= Math.ceil(total / limit)}
                  style={{
                    padding: '8px 16px',
                    background: page >= Math.ceil(total / limit) ? '#f5f5f5' : 'white',
                    color: page >= Math.ceil(total / limit) ? '#c0c4cc' : '#606266',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    cursor: page >= Math.ceil(total / limit) ? 'not-allowed' : 'pointer'
                  }}
                >下一页</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}


