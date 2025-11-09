import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Trophy, Calendar, Clock, Lock } from 'lucide-react'
import { contestAPI } from '@/api/contest'
import { toast } from 'sonner'

const CONTEST_STATUS: Record<number, { name: string; color: string }> = {
  '-1': { name: 'Ended', color: '#909399' },
  '0': { name: 'Underway', color: '#19be6b' },
  '1': { name: 'Not Started', color: '#2d8cf0' }
}

interface Contest {
  id: number
  title: string
  start_time: string
  end_time: string
  rule_type: 'ACM' | 'OI'
  contest_type: 'Public' | 'Password' | 'Private'
  status: number
}

export default function ContestList() {
  const navigate = useNavigate()
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadContests()
  }, [page])

  const loadContests = async () => {
    setLoading(true)
    try {
      const data = await contestAPI.getContestList({
        offset: (page - 1) * limit,
        limit: limit
      })
      
      setContests(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('加载竞赛失败:', error)
      toast.error('加载竞赛失败')
      setContests([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}小时${minutes}分钟`
  }

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const goContest = (contest: Contest) => {
    navigate(`/contest/${contest.id}`)
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
          {/* 标题和筛选 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Trophy size={24} style={{ color: '#fa8c16' }} />
                <h2 style={{ margin: 0, fontSize: '24px', color: '#303133' }}>竞赛列表</h2>
              </div>
              <input
                type="text"
                placeholder="搜索竞赛..."
                style={{
                  padding: '8px 16px',
                  border: '1px solid #dcdfe6',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '250px'
                }}
              />
            </div>
          </div>

          {/* 竞赛列表 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
          ) : contests.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '60px 24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', color: '#909399' }}>暂无竞赛</p>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}>
              {contests.map(contest => (
                <div
                  key={contest.id}
                  onClick={() => goContest(contest)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    marginBottom: '16px',
                    border: '1px solid #e8eaec',
                    borderRadius: '8px',
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
                  <img
                    src="/assets/Cup.svg"
                    alt="trophy"
                    style={{ width: '48px', height: '48px', marginRight: '20px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '18px',
                        color: '#303133',
                        fontWeight: 600
                      }}>{contest.title}</h3>
                      {contest.contest_type !== 'Public' && (
                        <Lock size={16} style={{ color: '#909399' }} />
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      fontSize: '14px',
                      color: '#606266'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} style={{ color: '#3091f2' }} />
                        {formatTime(contest.start_time)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} style={{ color: '#3091f2' }} />
                        {getDuration(contest.start_time, contest.end_time)}
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background: '#f0f0f0',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {contest.rule_type}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 16px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      background: CONTEST_STATUS[contest.status].color,
                      color: 'white'
                    }}>
                      {CONTEST_STATUS[contest.status].name === 'Underway' ? '进行中' :
                       CONTEST_STATUS[contest.status].name === 'Not Started' ? '未开始' : '已结束'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分页 */}
          {total > limit && (
            <div style={{
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
    </>
  )
}


