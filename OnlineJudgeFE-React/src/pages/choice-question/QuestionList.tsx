/**
 * 选择题列表页 - 100%像素级复刻8080
 * 
 * 借鉴首页Home.tsx的成功经验：
 * ✅ inline style + 精确数值
 * ✅ 标注8080来源
 * ✅ 原生HTML元素
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Search,
  BookOpen,
  Clock,
  List as ListIcon
} from 'lucide-react'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import {
  getChoiceQuestionList,
  getCategoryList,
  getTagList,
  createExamPaper,
  type ChoiceQuestion,
  type Category,
  type Tag
} from '@/api/choice-question'

export default function QuestionList() {
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<ChoiceQuestion[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  useEffect(() => {
    document.title = '选择题列表 - 元探索少儿编程'
    loadCategories()
    loadTags()
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [currentPage, pageSize, selectedCategory, selectedTag, selectedDifficulty, selectedType])

  const loadCategories = async () => {
    try {
      const data = await getCategoryList()
      setCategories(data || [])
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  const loadTags = async () => {
    try {
      const data = await getTagList()
      setTags(data?.results || data || [])
    } catch (error) {
      console.error('加载标签失败:', error)
    }
  }

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const offset = (currentPage - 1) * pageSize
      const params: any = {}
      if (keyword) params.keyword = keyword
      if (selectedCategory) params.category = selectedCategory
      if (selectedTag) params.tags = selectedTag
      if (selectedDifficulty) {
        const map: any = { '1': 'easy', '2': 'medium', '3': 'hard' }
        params.difficulty = map[selectedDifficulty] || selectedDifficulty
      }
      if (selectedType) params.question_type = selectedType

      const data = await getChoiceQuestionList({offset, limit: pageSize, ...params})
      setQuestions(data?.results || [])
      setTotal(data?.total || data?.count || 0)
    } catch (error) {
      console.error('加载题目列表失败:', error)
      setQuestions([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadQuestions()
  }

  const handleReset = () => {
    setKeyword('')
    setSelectedCategory(null)
    setSelectedTag(null)
    setSelectedDifficulty('')
    setSelectedType('')
    setCurrentPage(1)
  }

  const goToQuestion = (question: ChoiceQuestion) => {
    const query: any = {}
    if (selectedCategory) query.category = selectedCategory
    if (selectedTag) query.tags = selectedTag
    if (selectedDifficulty) query.difficulty = selectedDifficulty
    if (selectedType) query.question_type = selectedType
    if (keyword) query.keyword = keyword

    const queryString = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, String(v)])
    ).toString()
    navigate(`/choice-question/${question.id}${queryString ? `?${queryString}` : ''}`)
  }

  const startPracticeMode = () => {
    if (questions.length === 0) {
      toast.warning('当前筛选条件下没有题目，请调整筛选条件')
      return
    }
    goToQuestion(questions[0])
  }

  const startExamMode = async () => {
    if (total === 0) {
      toast.warning('当前筛选条件下没有可用题目，请调整筛选条件')
      return
    }
    try {
      const examConfig = {
        title: '选择题考试',
        description: `基于当前筛选条件的考试（共${total}道题）`,
        duration: Math.max(30, Math.ceil(total * 2)),
        question_count: total,
        total_score: total * 2,
        categories: selectedCategory ? [selectedCategory] : [],
        tags: selectedTag ? [selectedTag] : [],
        difficulty_distribution: {
          easy: Math.ceil(total * 0.5),
          medium: Math.ceil(total * 0.3),
          hard: Math.ceil(total * 0.2)
        }
      }
      const response = await createExamPaper(examConfig)
      const paper = response.data?.data || response.data
      toast.success(`试卷创建成功！共${total}道题`)
      navigate(`/exam-paper/${paper.id}`)
    } catch (error) {
      console.error('创建考试试卷失败:', error)
      toast.error('创建考试试卷失败')
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    const map: any = {
      'easy': { text: '简单', color: '#19be6b', bg: '#f0fff4', border: '#b8f5d0' },
      'medium': { text: '中等', color: '#ff9900', bg: '#fffaf0', border: '#ffd591' },
      'hard': { text: '困难', color: '#ed4014', bg: '#fff2f0', border: '#ffccc7' }
    }
    return map[difficulty] || { text: '未知', color: '#2d8cf0', bg: '#f0faff', border: '#b3e5fc' }
  }

  const renderCategoryOptions = (cats: Category[], level: number = 0): JSX.Element[] => {
    const indent = '\u00A0'.repeat(level * 6) + (level > 0 ? '└ ' : '')
    return cats.flatMap(cat => [
      <option key={cat.id} value={cat.id}>{indent}{cat.name}</option>,
      ...(cat.children ? renderCategoryOptions(cat.children, level + 1) : [])
    ])
  }

  return (
    <>
      <Header />
      
      {/* 8080: .content-app 容器 - 响应式margin-top */}
      <div style={{
        marginTop: window.innerWidth >= 1200 ? '80px' : '160px',  // 8080响应式：大屏80px 小屏160px
        padding: '0 2%',       // 8080: .content-app padding
        width: '100%'
      }}>
        {/* 8080: Panel shadow */}
        <div style={{
          background: 'white',
          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',  // 8080: Panel shadow
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {/* Panel Header - 8080精确样式 */}
          <div style={{
            padding: '14px 16px',              // 8080: Panel header padding
            borderBottom: '1px solid #e8eaec',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ListIcon style={{ width: '20px', height: '20px', color: '#515a6e' }} />
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#17233d' }}>选择题列表</span>
            <span style={{
              backgroundColor: '#2d8cf0',     // 8080: Badge背景
              color: 'white',
              padding: '2px 10px',            // 8080: Badge padding
              borderRadius: '12px',
              fontSize: '12px',
              marginLeft: '10px'              // 8080: Badge margin
            }}>{total}</span>
          </div>

          {/* Panel Body */}
          <div style={{ padding: '16px' }}>
            {/* 8080: .filter-section */}
            <div style={{
              padding: '16px',                // 8080: filter-section padding
              backgroundColor: '#f8f8f9',     // 8080: 背景
              borderRadius: '4px',            // 8080: 圆角
              marginBottom: '20px'            // 8080: margin-bottom
            }}>
              {/* 8080: Row gutter=10 → marginLeft/Right: -5px */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '25% 16.67% 16.67% 12.5% 12.5% 16.67%',  // 8080: span=6,4,4,3,3,4
                gap: '10px',                  // 8080: gutter=10
                marginBottom: '0'
              }}>
                {/* 搜索框 - 8080: Col span=6 */}
                <div style={{ position: 'relative' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '8px',              // 8080: icon left
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    color: '#c5c8ce',         // 8080: icon颜色
                    zIndex: 1
                  }} />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="搜索题目标题或内容"
                    style={{
                      width: '100%',
                      height: '32px',          // 8080: Input height
                      paddingLeft: '32px',     // 8080: padding-left for icon
                      paddingRight: '7px',
                      fontSize: '14px',
                      color: '#515a6e',
                      border: '1px solid #dcdee2',
                      borderRadius: '4px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                {/* 分类选择 - 8080: Col span=4 */}
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  style={{
                    height: '32px',
                    padding: '4px 7px',
                    fontSize: '14px',
                    color: '#515a6e',
                    border: '1px solid #dcdee2',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">分类</option>
                  {renderCategoryOptions(categories)}
                </select>

                {/* 标签选择 - 8080: Col span=4 */}
                <select
                  value={selectedTag || ''}
                  onChange={(e) => setSelectedTag(e.target.value ? Number(e.target.value) : null)}
                  style={{
                    height: '32px',
                    padding: '4px 7px',
                    fontSize: '14px',
                    color: '#515a6e',
                    border: '1px solid #dcdee2',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">标签</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>

                {/* 难度选择 - 8080: Col span=3 */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1) }}
                  style={{
                    height: '32px',
                    padding: '4px 7px',
                    fontSize: '14px',
                    color: '#515a6e',
                    border: '1px solid #dcdee2',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">难度</option>
                  <option value="1">简单</option>
                  <option value="2">中等</option>
                  <option value="3">困难</option>
                </select>

                {/* 题型选择 - 8080: Col span=3 */}
                <select
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1) }}
                  style={{
                    height: '32px',
                    padding: '4px 7px',
                    fontSize: '14px',
                    color: '#515a6e',
                    border: '1px solid #dcdee2',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">题型</option>
                  <option value="single">单选题</option>
                  <option value="multiple">多选题</option>
                </select>

                {/* 操作按钮 - 8080: Col span=4 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSearch}
                    style={{
                      flex: 1,
                      padding: '6px 15px',       // 8080: Button padding
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'white',
                      backgroundColor: '#2d8cf0', // 8080: primary色
                      border: '1px solid #2d8cf0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#57a3f3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d8cf0'}
                  >
                    搜索
                  </button>
                  <button
                    onClick={handleReset}
                    style={{
                      flex: 1,
                      padding: '6px 15px',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#515a6e',
                      backgroundColor: 'white',
                      border: '1px solid #dcdee2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginLeft: '8px'          // 8080: margin-left: 8px
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#2d8cf0'
                      e.currentTarget.style.borderColor = '#2d8cf0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#515a6e'
                      e.currentTarget.style.borderColor = '#dcdee2'
                    }}
                  >
                    重置
                  </button>
                </div>
              </div>

              {/* 8080: 做题模式选择 - Row margin-top: 16px */}
              {(selectedCategory || selectedTag) && (
                <div style={{ marginTop: '16px' }}>  {/* 8080: 精确16px */}
                  {/* 8080: Alert show-icon */}
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: '#f0faff',       // 8080: Alert info背景
                    border: '1px solid #91d5ff',
                    borderRadius: '4px',
                    color: '#0050b3',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ListIcon style={{ width: '16px', height: '16px' }} />
                    <span>
                      <strong>选择做题模式：</strong>
                      <button
                        onClick={startPracticeMode}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',    // 8080: size=small
                          fontSize: '13px',       // 8080: small字号
                          fontWeight: 400,
                          color: 'white',
                          backgroundColor: '#2d8cf0',
                          border: '1px solid #2d8cf0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginLeft: '8px',      // 8080: margin-left
                          marginRight: '8px'      // 8080: margin-right
                        }}
                      >
                        <BookOpen style={{ width: '14px', height: '14px' }} />
                        <span>练习模式</span>
                      </button>
                      <button
                        onClick={startExamMode}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          fontSize: '13px',
                          fontWeight: 400,
                          color: 'white',
                          backgroundColor: '#ff9900',  // 8080: warning色
                          border: '1px solid #ff9900',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Clock style={{ width: '14px', height: '14px' }} />
                        <span>考试模式</span>
                      </button>
                      <span style={{ marginLeft: '16px', color: '#666', fontSize: '14px' }}>
                        练习模式：逐题练习，可查看解析；考试模式：试卷形式，限时答题
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 8080: Table精确样式 */}
            <table style={{
              width: '100%',
              fontSize: '14px',              // 8080: 选择题表格14px
              borderCollapse: 'collapse'
            }}>
              <thead style={{ backgroundColor: '#f8f8f9' }}>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>ID</th>
                  <th style={{ width: '250px', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>题目</th>
                  <th style={{ width: '120px', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>分类</th>
                  <th style={{ width: '150px', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>标签</th>
                  <th style={{ width: '80px', textAlign: 'center', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>难度</th>
                  <th style={{ width: '80px', textAlign: 'center', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>题型</th>
                  <th style={{ width: '80px', textAlign: 'center', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>分值</th>
                  <th style={{ width: '150px', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>创建时间</th>
                  <th style={{ width: '120px', textAlign: 'center', padding: '14px 16px', fontWeight: 500, color: '#17233d', borderBottom: '1px solid #e8eaec' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#808695' }}>加载中...</td></tr>
                ) : questions.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#808695' }}>暂无数据</td></tr>
                ) : (
                  questions.map(q => {
                    const diff = getDifficultyBadge(q.difficulty)
                    return (
                      <tr 
                        key={q.id}
                        style={{ height: '60px', cursor: 'pointer', borderBottom: '1px solid #e8eaec' }}  // 8080: 行高60px
                        onClick={() => goToQuestion(q)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f7fa'}  // 8080: hover精确色
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      >
                        <td style={{ textAlign: 'center', padding: '12px 8px', verticalAlign: 'middle', color: '#515a6e' }}>{q.id}</td>
                        <td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
                          <div style={{
                            fontWeight: 'bold',    // 8080: bold
                            fontSize: '14px',      // 8080: 14px
                            color: '#2d8cf0',      // 8080: 蓝色
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} title={q.title}>
                            {q.title.length > 12 ? q.title.substring(0, 12) + '...' : q.title}
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px', verticalAlign: 'middle', color: '#515a6e' }}>
                          {q.category?.name || '-'}
                        </td>
                        <td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
                          {q.tags.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {q.tags.map(tag => (
                                <span key={tag.id} style={{
                                  padding: '3px 8px',
                                  fontSize: '12px',
                                  borderRadius: '3px',
                                  border: '1px solid #b3e5fc',
                                  color: '#2d8cf0',         // 8080: Tag blue
                                  backgroundColor: '#f0faff',
                                  marginRight: '4px'        // 8080: marginRight
                                }}>
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          ) : '-'}
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px', verticalAlign: 'middle' }}>
                          <span style={{
                            padding: '3px 8px',
                            fontSize: '12px',
                            borderRadius: '3px',
                            border: `1px solid ${diff.border}`,
                            color: diff.color,
                            backgroundColor: diff.bg
                          }}>
                            {diff.text}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px', verticalAlign: 'middle', color: '#515a6e' }}>
                          {q.question_type === 'single' ? '单选' : '多选'}
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px', verticalAlign: 'middle', color: '#515a6e' }}>
                          {q.score}
                        </td>
                        <td style={{ padding: '12px 8px', verticalAlign: 'middle', color: '#515a6e' }}>
                          {new Date(q.create_time).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px', verticalAlign: 'middle' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); goToQuestion(q) }}
                            style={{
                              padding: '4px 12px',    // 8080: size=small
                              fontSize: '13px',
                              fontWeight: 400,
                              color: 'white',
                              backgroundColor: '#2d8cf0',
                              border: '1px solid #2d8cf0',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            练习
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            {/* 8080: .pagination text-align: right, margin-top: 20px */}
            <div style={{
              marginTop: '20px',              // 8080: 精确margin
              textAlign: 'right',             // 8080: 右对齐
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#808695' }}>共 {total} 条</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
                style={{
                  height: '32px',
                  padding: '4px 7px',
                  border: '1px solid #dcdee2',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#515a6e',
                  cursor: 'pointer'
                }}
              >
                <option value="10">10 条/页</option>
                <option value="20">20 条/页</option>
                <option value="50">50 条/页</option>
                <option value="100">100 条/页</option>
              </select>
              
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  border: '1px solid #dcdee2',
                  borderRadius: '4px',
                  backgroundColor: currentPage === 1 ? '#f7f7f7' : 'white',
                  color: currentPage === 1 ? '#c5c8ce' : '#515a6e',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                上一页
              </button>
              
              <span style={{
                padding: '0 8px',
                fontSize: '14px',
                color: '#808695'
              }}>
                第 {currentPage} / {Math.ceil(total / pageSize)} 页
              </span>
              
              <button
                disabled={currentPage >= Math.ceil(total / pageSize)}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  border: '1px solid #dcdee2',
                  borderRadius: '4px',
                  backgroundColor: currentPage >= Math.ceil(total / pageSize) ? '#f7f7f7' : 'white',
                  color: currentPage >= Math.ceil(total / pageSize) ? '#c5c8ce' : '#515a6e',
                  cursor: currentPage >= Math.ceil(total / pageSize) ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
