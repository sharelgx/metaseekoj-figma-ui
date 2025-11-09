import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Clock, FileText } from 'lucide-react'
import { choiceQuestionAPI } from '@/api/choice-question'
import { toast } from 'sonner'

interface ExamPaper {
  id: number
  title: string
  duration: number
  total_score: number
}

interface ExamHistory {
  id: number
  paper: ExamPaper
  status: 'submitted' | 'timeout' | 'started' | 'created'
  score: number | null
  correct_count: number
  total_count: number
  start_time: string
  end_time: string
}

export default function ExamHistory() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  useEffect(() => {
    getExamHistoryList()
  }, [currentPage, pageSize])

  const getExamHistoryList = async () => {
    setLoading(true)
    try {
      const data = await choiceQuestionAPI.getExamHistory({
        offset: (currentPage - 1) * pageSize,
        limit: pageSize
      })
      
      setExamHistory(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('加载考试历史失败:', error)
      toast.error('加载考试历史失败')
      
      // 失败时使用空数据
      setExamHistory([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  // 备用Mock数据（仅用于开发测试）
  const getExamHistoryListMock = async () => {
    setLoading(true)
    try {
      const mockData: ExamHistory[] = [
        {
          id: 1,
          paper: {
            id: 1,
            title: 'GESP三级模拟试卷一',
            duration: 90,
            total_score: 100
          },
          status: 'submitted',
          score: 85,
          correct_count: 21,
          total_count: 25,
          start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          paper: {
            id: 2,
            title: '算法基础综合测试',
            duration: 60,
            total_score: 100
          },
          status: 'submitted',
          score: 72,
          correct_count: 14,
          total_count: 20,
          start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          paper: {
            id: 3,
            title: '数学竞赛专项练习',
            duration: 120,
            total_score: 100
          },
          status: 'timeout',
          score: 56,
          correct_count: 16,
          total_count: 30,
          start_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString()
        }
      ]

      setExamHistory(mockData)
      setTotal(mockData.length)
    } catch (err) {
      console.error('获取考试历史失败:', err)
      alert('获取考试历史失败')
    } finally {
      setLoading(false)
    }
  }

  const resetFilter = () => {
    setSelectedStatus('')
    setDateRange([null, null])
    setCurrentPage(1)
    getExamHistoryList()
  }

  const viewDetail = (sessionId: number) => {
    navigate(`/exam-review/${sessionId}`)
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      'submitted': '#67c23a',
      'timeout': '#e6a23c',
      'started': '#409eff',
      'created': '#909399'
    }
    return colorMap[status as keyof typeof colorMap] || '#909399'
  }

  const getStatusText = (status: string) => {
    const textMap = {
      'submitted': '已提交',
      'timeout': '超时',
      'started': '进行中',
      'created': '已创建'
    }
    return textMap[status as keyof typeof textMap] || '未知'
  }

  const getAccuracyRate = (exam: ExamHistory) => {
    if (!exam.total_count || exam.total_count === 0) return 0
    return Math.round((exam.correct_count / exam.total_count) * 100)
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-'
    return new Date(timeStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  // 响应式margin-top（同步8080设计）
  const getResponsiveMarginTop = () => {
    if (typeof window === 'undefined') return '160px'
    return window.innerWidth >= 1200 ? '80px' : '160px'
  }

  const [marginTop, setMarginTop] = useState(getResponsiveMarginTop())

  useEffect(() => {
    const handleResize = () => {
      setMarginTop(getResponsiveMarginTop())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        marginTop,
        padding: '0 2%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px'
        }}>
          {/* 页面头部 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <Clock size={20} style={{ color: '#409eff' }} />
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#303133'
              }}>考试历史记录</h2>
              <span style={{
                padding: '2px 10px',
                borderRadius: '12px',
                background: '#409eff',
                color: 'white',
                fontSize: '12px',
                marginLeft: '10px'
              }}>{total}</span>
            </div>

            {/* 筛选器 */}
            <div style={{
              padding: '16px',
              background: '#f8f8f9',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minWidth: '120px'
                  }}
                >
                  <option value="">全部状态</option>
                  <option value="submitted">已提交</option>
                  <option value="timeout">超时</option>
                </select>

                <button
                  onClick={getExamHistoryList}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >筛选</button>
                <button
                  onClick={resetFilter}
                  style={{
                    padding: '8px 20px',
                    background: 'white',
                    color: '#606266',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >重置</button>
              </div>
            </div>

            {/* 历史记录表格 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e4e7ed' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '80px'
                    }}>ID</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px'
                    }}>试卷名称</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>考试状态</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '80px'
                    }}>得分</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>正确率</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '150px'
                    }}>开始时间</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '150px'
                    }}>结束时间</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '120px'
                    }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {examHistory.map(exam => {
                    const accuracy = getAccuracyRate(exam)
                    return (
                      <tr key={exam.id} style={{ borderBottom: '1px solid #e4e7ed' }}>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#606266',
                          fontSize: '14px'
                        }}>{exam.id}</td>
                        <td style={{
                          padding: '12px',
                          color: '#606266',
                          fontSize: '14px'
                        }}>
                          <div>
                            <div style={{
                              fontWeight: 'bold',
                              marginBottom: '4px'
                            }}>{exam.paper.title}</div>
                            <div style={{
                              fontSize: '12px',
                              color: '#999'
                            }}>时长: {exam.paper.duration}分钟 | 总分: {exam.paper.total_score}分</div>
                          </div>
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'white',
                            background: getStatusColor(exam.status)
                          }}>
                            {getStatusText(exam.status)}
                          </span>
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: (exam.score || 0) >= 60 ? '#19be6b' : '#ed4014',
                          fontSize: '14px'
                        }}>
                          {exam.score || 0}分
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: accuracy >= 60 ? '#19be6b' : '#ed4014',
                          fontSize: '14px'
                        }}>
                          {accuracy}%
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#606266',
                          fontSize: '14px'
                        }}>
                          {formatTime(exam.start_time)}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#606266',
                          fontSize: '14px'
                        }}>
                          {formatTime(exam.end_time)}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          <button
                            onClick={() => viewDetail(exam.id)}
                            style={{
                              padding: '5px 15px',
                              background: '#409eff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >查看详情</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {total > pageSize && (
              <div style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '14px', color: '#606266' }}>
                  共 {total} 条
                </span>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '5px 15px',
                    background: currentPage === 1 ? '#f5f5f5' : 'white',
                    color: currentPage === 1 ? '#c0c4cc' : '#606266',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >上一页</button>
                <span style={{ fontSize: '14px', color: '#606266' }}>
                  {currentPage} / {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(total / pageSize)}
                  style={{
                    padding: '5px 15px',
                    background: currentPage >= Math.ceil(total / pageSize) ? '#f5f5f5' : 'white',
                    color: currentPage >= Math.ceil(total / pageSize) ? '#c0c4cc' : '#606266',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: currentPage >= Math.ceil(total / pageSize) ? 'not-allowed' : 'pointer'
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

