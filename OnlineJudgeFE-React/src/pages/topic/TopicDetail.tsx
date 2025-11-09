import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Folder, ChevronRight } from 'lucide-react'
import { choiceQuestionAPI } from '@/api/choice-question'
import { toast } from 'sonner'

interface CategoryData {
  id: number
  name: string
  description: string
  question_count: number
  paper_count: number
}

interface Subcategory {
  id: number
  name: string
  description: string
  question_count: number
}

interface Question {
  id: number
  title: string
  difficulty_level: number
}

interface Paper {
  id: number
  title: string
  question_count: number
  time_limit: number | null
}

interface Breadcrumb {
  name: string
}

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [papers, setPapers] = useState<Paper[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])

  useEffect(() => {
    if (id) {
      loadCategoryData()
    }
  }, [id])

  const loadCategoryData = async () => {
    if (!id) {
      alert('分类ID不能为空')
      return
    }

    setLoading(true)
    try {
      // 使用模拟数据
      setCategoryData({
        id: parseInt(id),
        name: 'GESP等级考试',
        description: 'GESP等级考试相关专题练习，包含各级别考试真题和模拟题',
        question_count: 256,
        paper_count: 12
      })

      setSubcategories([
        {
          id: 11,
          name: 'GESP一级',
          description: 'GESP一级考试相关题目',
          question_count: 48
        },
        {
          id: 12,
          name: 'GESP二级',
          description: 'GESP二级考试相关题目',
          question_count: 56
        },
        {
          id: 13,
          name: 'GESP三级',
          description: 'GESP三级考试相关题目',
          question_count: 72
        },
        {
          id: 14,
          name: 'GESP四级',
          description: 'GESP四级考试相关题目',
          question_count: 80
        }
      ])

      setQuestions([
        {
          id: 1,
          title: '基础语法-变量与数据类型',
          difficulty_level: 1
        },
        {
          id: 2,
          title: '循环结构-for循环应用',
          difficulty_level: 2
        },
        {
          id: 3,
          title: '数组操作-数组排序',
          difficulty_level: 2
        }
      ])

      setPapers([
        {
          id: 1,
          title: 'GESP三级模拟试卷一',
          question_count: 25,
          time_limit: 90
        },
        {
          id: 2,
          title: 'GESP三级模拟试卷二',
          question_count: 25,
          time_limit: 90
        }
      ])

      setBreadcrumbs([
        { name: 'GESP等级考试' }
      ])
    } catch (error) {
      console.error('加载分类数据失败:', error)
      alert('加载分类数据失败')
    } finally {
      setLoading(false)
    }
  }

  const enterSubcategory = (subcategory: Subcategory) => {
    navigate(`/topics/${subcategory.id}`)
  }

  const startPractice = () => {
    if (!categoryData) {
      alert('分类数据未加载')
      return
    }

    // 如果有试卷，优先使用试卷练习
    if (papers && papers.length > 0) {
      startExam(papers[0])
    } else if (questions && questions.length > 0) {
      // 否则使用题目练习
      navigate(`/choice-question-practice?category=${id}`)
    } else {
      alert('该分类下暂无可练习的内容')
    }
  }

  const startExam = async (paper: Paper) => {
    try {
      // TODO: 创建考试会话
      alert('考试功能开发中...')
      // const response = await axios.post('/api/exam-session', { paper_id: paper.id })
      // const sessionId = response.data.data.id
      // navigate(`/exam-session/${sessionId}`)
    } catch (error) {
      console.error('创建考试会话失败:', error)
      alert('创建考试会话失败')
    }
  }

  const practiceQuestion = (question: Question) => {
    navigate(`/choice-question/${question.id}`)
  }

  const viewWrongQuestions = () => {
    navigate(`/wrong-question-book?category=${id}`)
  }

  const getDifficultyType = (level: number) => {
    const colors = {
      1: '#67c23a',
      2: '#409eff',
      3: '#e6a23c',
      4: '#f56c6c',
      5: '#909399'
    }
    return colors[level as keyof typeof colors] || '#909399'
  }

  const getDifficultyText = (level: number) => {
    const texts = {
      1: '简单',
      2: '中等',
      3: '困难',
      4: '专家',
      5: '大师'
    }
    return texts[level as keyof typeof texts] || '未知'
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
          {/* 面包屑导航 */}
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#606266'
          }}>
            <span
              onClick={() => navigate('/topics')}
              style={{
                cursor: 'pointer',
                color: '#409eff'
              }}
            >专题练习</span>
            {breadcrumbs.map((item, index) => (
              <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronRight size={14} style={{ color: '#909399' }} />
                <span>{item.name}</span>
              </span>
            ))}
          </div>

          {/* 分类信息卡片 */}
          {categoryData && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e4e7ed'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#303133'
                }}>{categoryData.name}</span>
                <button
                  onClick={startPractice}
                  style={{
                    padding: '0',
                    background: 'none',
                    border: 'none',
                    color: '#409eff',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >开始练习</button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  margin: '10px 0',
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.5'
                }}>{categoryData.description || '暂无描述'}</p>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{
                      color: '#666',
                      fontSize: '14px'
                    }}>题目数量:</span>
                    <span style={{
                      color: '#409eff',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>{categoryData.question_count || 0}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{
                      color: '#666',
                      fontSize: '14px'
                    }}>试卷数量:</span>
                    <span style={{
                      color: '#409eff',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>{categoryData.paper_count || 0}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={startPractice}
                  style={{
                    padding: '10px 20px',
                    marginRight: '10px',
                    background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >开始练习</button>
                <button
                  onClick={viewWrongQuestions}
                  style={{
                    padding: '10px 20px',
                    background: 'white',
                    color: '#606266',
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >查看错题</button>
              </div>
            </div>
          )}

          {/* 子分类 */}
          {subcategories && subcategories.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#303133',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e4e7ed'
              }}>子分类</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '15px'
              }}>
                {subcategories.map(subcategory => (
                  <div
                    key={subcategory.id}
                    onClick={() => enterSubcategory(subcategory)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      border: '1px solid #e4e7ed',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#409eff'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(64, 158, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e4e7ed'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      marginRight: '15px',
                      color: '#409eff',
                      fontSize: '24px'
                    }}>
                      <Folder size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 5px 0',
                        color: '#303133',
                        fontSize: '16px'
                      }}>{subcategory.name}</h4>
                      <p style={{
                        margin: '0 0 8px 0',
                        color: '#909399',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}>{subcategory.description || '暂无描述'}</p>
                      <div style={{
                        color: '#666',
                        fontSize: '12px'
                      }}>{subcategory.question_count || 0} 道题目</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 题目列表 */}
          {questions && questions.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#303133',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e4e7ed'
              }}>题目列表</div>
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
                    }}>题目</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>难度</th>
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
                  {questions.map(question => (
                    <tr key={question.id} style={{ borderBottom: '1px solid #e4e7ed' }}>
                      <td style={{
                        padding: '12px',
                        color: '#606266',
                        fontSize: '14px'
                      }}>{question.title}</td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'white',
                          background: getDifficultyType(question.difficulty_level)
                        }}>
                          {getDifficultyText(question.difficulty_level)}
                        </span>
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => practiceQuestion(question)}
                          style={{
                            padding: '5px 15px',
                            background: 'none',
                            color: '#409eff',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >练习</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 试卷列表 */}
          {papers && papers.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#303133',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e4e7ed'
              }}>试卷列表</div>
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
                    }}>试卷名称</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>题目数量</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: '#909399',
                      fontWeight: 500,
                      fontSize: '14px',
                      width: '100px'
                    }}>时间限制</th>
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
                  {papers.map(paper => (
                    <tr key={paper.id} style={{ borderBottom: '1px solid #e4e7ed' }}>
                      <td style={{
                        padding: '12px',
                        color: '#606266',
                        fontSize: '14px'
                      }}>{paper.title}</td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center',
                        color: '#606266',
                        fontSize: '14px'
                      }}>{paper.question_count}</td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center',
                        color: '#606266',
                        fontSize: '14px'
                      }}>{paper.time_limit ? paper.time_limit + '分钟' : '无限制'}</td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => startExam(paper)}
                          style={{
                            padding: '5px 15px',
                            background: 'none',
                            color: '#409eff',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >开始考试</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


