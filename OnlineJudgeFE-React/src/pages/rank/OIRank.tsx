import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Trophy } from 'lucide-react'
import { rankAPI } from '@/api/rank'
import { toast } from 'sonner'

interface RankUser {
  user: {
    username: string
    real_name: string
  }
  mood: string
  total_score: number
  submission_number: number
}

export default function OIRank() {
  const navigate = useNavigate()
  const [dataRank, setDataRank] = useState<RankUser[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(30)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getRankData()
  }, [page])

  const getRankData = async () => {
    setLoading(true)
    try {
      const data = await rankAPI.getOIRank({
        offset: (page - 1) * limit,
        limit: limit
      })
      
      setDataRank(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('加载排名失败:', error)
      toast.error('加载排名失败')
      setDataRank([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
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
          {/* 标题 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Trophy size={24} style={{ color: '#fa8c16' }} />
              <h2 style={{ margin: 0, fontSize: '24px', color: '#303133' }}>OI 排名榜</h2>
            </div>
          </div>

          {/* 排名表格 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '2px solid #e8eaec' }}>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '80px' }}>排名</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>用户</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px' }}>个性签名</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '120px' }}>总分</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '120px' }}>提交数</th>
                </tr>
              </thead>
              <tbody>
                {dataRank.map((item, index) => {
                  const rank = (page - 1) * limit + index + 1
                  const getRankColor = () => {
                    if (rank === 1) return '#FFD700'
                    if (rank === 2) return '#C0C0C0'
                    if (rank === 3) return '#CD7F32'
                    return '#606266'
                  }

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #e8eaec' }}>
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: getRankColor()
                      }}>
                        {rank <= 3 && <Trophy size={20} style={{ display: 'inline', marginRight: '4px' }} />}
                        {rank}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span
                          onClick={() => navigate(`/user-home?username=${item.user.username}`)}
                          style={{
                            color: '#409eff',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500
                          }}
                        >
                          {item.user.real_name || item.user.username}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', color: '#606266', fontSize: '14px' }}>
                        {item.mood}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', color: '#fa8c16', fontSize: '18px', fontWeight: 600 }}>
                        {item.total_score}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', color: '#606266', fontSize: '14px' }}>
                        {item.submission_number}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* 分页 */}
            {total > limit && (
              <div style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'center',
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
                <span style={{ fontSize: '14px', color: '#606266', display: 'flex', alignItems: 'center' }}>
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


