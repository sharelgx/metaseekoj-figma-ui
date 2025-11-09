import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Folder, FileText, Edit, Trophy } from 'lucide-react'
import { choiceQuestionAPI } from '@/api/choice-question'
import { toast } from 'sonner'

interface Category {
  id: number
  name: string
  description: string
  topic_count: number
  question_count: number
}

interface Topic {
  id: number
  title: string
  description: string
  difficulty_level: number
  total_questions: number
  practice_count: number
}

interface Practice {
  id: number
  topic: number
  topic_title: string
  status: 'in_progress' | 'completed' | 'paused'
  score: number | null
  start_time: string
}

export default function TopicList() {
  const navigate = useNavigate()
  const [rootCategories, setRootCategories] = useState<Category[]>([])
  const [popularTopics, setPopularTopics] = useState<Topic[]>([])
  const [recentPractices, setRecentPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadCategories(),
        loadPopularTopics(),
        loadRecentPractices()
      ])
    } catch (err) {
      console.error('初始化失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      // 使用模拟数据，因为前台API还没有完全实现
      setRootCategories([
        {
          id: 1,
          name: 'GESP等级考试',
          description: 'GESP等级考试相关专题练习',
          topic_count: 12,
          question_count: 256
        },
        {
          id: 2,
          name: '算法基础',
          description: '基础算法与数据结构专题',
          topic_count: 8,
          question_count: 189
        },
        {
          id: 3,
          name: '数学竞赛',
          description: '数学竞赛相关专题练习',
          topic_count: 15,
          question_count: 324
        }
      ])
    } catch (err) {
      console.error('加载分类失败:', err)
    }
  }

  const loadPopularTopics = async () => {
    try {
      // 使用模拟数据
      setPopularTopics([
        {
          id: 1,
          title: 'GESP三级算法基础',
          description: 'GESP三级考试中的基础算法题目练习',
          difficulty_level: 2,
          total_questions: 25,
          practice_count: 156
        },
        {
          id: 2,
          title: '排序算法专项',
          description: '各种排序算法的原理与实现',
          difficulty_level: 3,
          total_questions: 18,
          practice_count: 89
        },
        {
          id: 3,
          title: '数学基础知识',
          description: '编程竞赛中常用的数学知识',
          difficulty_level: 1,
          total_questions: 32,
          practice_count: 234
        }
      ])
    } catch (err) {
      console.error('加载热门专题失败:', err)
    }
  }

  const loadRecentPractices = async () => {
    try {
      const token = localStorage.getItem('authed')
      if (!token) return

      // 使用模拟数据
      setRecentPractices([
        {
          id: 1,
          topic: 1,
          topic_title: 'GESP三级算法基础',
          status: 'completed',
          score: 85.5,
          start_time: new Date().toISOString()
        },
        {
          id: 2,
          topic: 2,
          topic_title: '排序算法专项',
          status: 'in_progress',
          score: null,
          start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ])
    } catch (err) {
      console.error('加载最近练习失败:', err)
    }
  }

  const enterCategory = (category: Category) => {
    navigate(`/topics/${category.id}`)
  }

  const startTopic = (topic: Topic) => {
    const token = localStorage.getItem('authed')
    if (!token) {
      alert('请先登录')
      navigate('/login')
      return
    }

    navigate(`/topic-practice/${topic.id}`)
  }

  const continuePractice = (practice: Practice) => {
    navigate(`/topic-practice/${practice.topic}?practiceId=${practice.id}`)
  }

  const viewResult = (practice: Practice) => {
    navigate(`/topic-result/${practice.id}`)
  }

  const getDifficultyType = (level: number) => {
    const types = ['', 'success', 'primary', 'warning', 'danger', 'info']
    return types[level] || 'info'
  }

  const getDifficultyText = (level: number) => {
    const texts = ['', '简单', '中等', '困难', '专家', '大师']
    return texts[level] || '未知'
  }

  const getStatusType = (status: string) => {
    const types = {
      'in_progress': 'warning',
      'completed': 'success',
      'paused': 'info'
    }
    return types[status as keyof typeof types] || 'info'
  }

  const getStatusText = (status: string) => {
    const texts = {
      'in_progress': '进行中',
      'completed': '已完成',
      'paused': '已暂停'
    }
    return texts[status as keyof typeof texts] || status
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          {/* 页面标题 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h1 style={{
              fontSize: '2.5em',
              color: '#2c3e50',
              marginBottom: '10px',
              margin: 0
            }}>专题练习</h1>
            <p style={{
              fontSize: '1.2em',
              color: '#7f8c8d',
              margin: 0,
              marginTop: '10px'
            }}>按分类系统化学习，提升您的专业技能</p>
          </div>

          {/* 分类导航 */}
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{
              fontSize: '1.8em',
              color: '#2c3e50',
              marginBottom: '20px',
              borderLeft: '4px solid #3498db',
              paddingLeft: '15px',
              margin: 0,
              marginBottom: '20px'
            }}>选择分类</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {rootCategories.map(category => (
                <div
                  key={category.id}
                  onClick={() => enterCategory(category)}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{
                    fontSize: '2.5em',
                    color: '#3498db',
                    flexShrink: 0
                  }}>
                    <Folder size={40} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.3em',
                      color: '#2c3e50',
                      marginBottom: '8px',
                      margin: 0,
                      marginBottom: '8px'
                    }}>{category.name}</h3>
                    <p style={{
                      color: '#7f8c8d',
                      marginBottom: '12px',
                      lineHeight: '1.5',
                      margin: 0,
                      marginBottom: '12px'
                    }}>{category.description || '暂无描述'}</p>
                    <div style={{
                      display: 'flex',
                      gap: '15px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#95a5a6',
                        fontSize: '0.9em'
                      }}>
                        <FileText size={14} style={{ color: '#3498db' }} />
                        {category.topic_count || 0} 个专题
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#95a5a6',
                        fontSize: '0.9em'
                      }}>
                        <Edit size={14} style={{ color: '#3498db' }} />
                        {category.question_count || 0} 道题目
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.5em',
                    color: '#bdc3c7',
                    flexShrink: 0
                  }}>
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 热门专题 */}
          {popularTopics.length > 0 && (
            <div style={{ marginBottom: '50px' }}>
              <h2 style={{
                fontSize: '1.8em',
                color: '#2c3e50',
                marginBottom: '20px',
                borderLeft: '4px solid #3498db',
                paddingLeft: '15px',
                margin: 0,
                marginBottom: '20px'
              }}>热门专题</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {popularTopics.map(topic => {
                  const difficultyColors = {
                    1: '#67c23a',
                    2: '#409eff',
                    3: '#e6a23c',
                    4: '#f56c6c',
                    5: '#909399'
                  }
                  const difficultyColor = difficultyColors[topic.difficulty_level as keyof typeof difficultyColors] || '#909399'

                  return (
                    <div
                      key={topic.id}
                      onClick={() => startTopic(topic)}
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          fontSize: '1.2em',
                          fontWeight: 600,
                          color: '#2c3e50',
                          flex: 1,
                          marginRight: '10px'
                        }}>{topic.title}</div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'white',
                          background: difficultyColor
                        }}>
                          {getDifficultyText(topic.difficulty_level)}
                        </span>
                      </div>
                      <div style={{
                        color: '#7f8c8d',
                        lineHeight: '1.5',
                        marginBottom: '15px',
                        height: '3em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{topic.description}</div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px'
                      }}>
                        <span style={{
                          color: '#95a5a6',
                          fontSize: '0.9em'
                        }}>{topic.total_questions} 道题目</span>
                        <span style={{
                          color: '#95a5a6',
                          fontSize: '0.9em'
                        }}>{topic.practice_count} 次练习</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <button style={{
                          padding: '8px 15px',
                          background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}>开始练习</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 最近练习记录 */}
          {recentPractices.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.8em',
                color: '#2c3e50',
                marginBottom: '20px',
                borderLeft: '4px solid #3498db',
                paddingLeft: '15px',
                margin: 0,
                marginBottom: '20px'
              }}>最近练习</h2>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e4e7ed' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px'
                    }}>专题名称</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>状态</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>得分</th>
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
                    }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPractices.map(practice => {
                    const statusColors = {
                      'in_progress': '#e6a23c',
                      'completed': '#67c23a',
                      'paused': '#909399'
                    }
                    const statusColor = statusColors[practice.status] || '#909399'

                    return (
                      <tr key={practice.id} style={{ borderBottom: '1px solid #e4e7ed' }}>
                        <td style={{
                          padding: '12px',
                          color: '#606266',
                          fontSize: '14px'
                        }}>{practice.topic_title}</td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'white',
                            background: statusColor
                          }}>
                            {getStatusText(practice.status)}
                          </span>
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#606266',
                          fontSize: '14px'
                        }}>
                          {practice.status === 'completed' ? `${practice.score}%` : '-'}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#606266',
                          fontSize: '14px'
                        }}>
                          {formatDate(practice.start_time)}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          {practice.status === 'in_progress' ? (
                            <button
                              onClick={() => continuePractice(practice)}
                              style={{
                                padding: '5px 15px',
                                background: '#409eff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >继续练习</button>
                          ) : (
                            <button
                              onClick={() => viewResult(practice)}
                              style={{
                                padding: '5px 15px',
                                background: '#909399',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >查看结果</button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


