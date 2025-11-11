/**
 * 问题列表页 - 100%像素级复刻8080
 * 
 * 借鉴首页Home.tsx的成功经验：
 * ✅ inline style + 精确数值
 * ✅ 标注8080来源
 * ✅ 原生HTML元素
 * ✅ 完全抛弃组件默认样式
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ChevronDown,
  Search,
  RefreshCw,
  Shuffle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { problemAPI } from '@/api/problem'
import type { Problem, ProblemTag } from '@/types/problem'
import { useUserStore } from '@/store/user'

export default function ProblemList() {
  const { isAuthenticated } = useUserStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [problemList, setProblemList] = useState<Problem[]>([])
  const [tagList, setTagList] = useState<ProblemTag[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tagLoading, setTagLoading] = useState(true)
  const [showTags, setShowTags] = useState(false)
  const [showDiffDropdown, setShowDiffDropdown] = useState(false)

  const [query, setQuery] = useState({
    keyword: searchParams.get('keyword') || '',
    difficulty: searchParams.get('difficulty') || '',
    tag: searchParams.get('tag') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10')
  })
  const [keywordInput, setKeywordInput] = useState(searchParams.get('keyword') || '')

  useEffect(() => {
    document.title = '编程题列表 - 元探索少儿编程'
    loadTagList()
  }, [])

  useEffect(() => {
    const keywordParam = searchParams.get('keyword') || ''
    const newQuery = {
      keyword: keywordParam,
      difficulty: searchParams.get('difficulty') || '',
      tag: searchParams.get('tag') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }
    setKeywordInput(keywordParam)
    setQuery(newQuery)
  }, [searchParams])

  useEffect(() => {
    loadProblemList()
  }, [query])

  const loadProblemList = async () => {
    try {
      setLoading(true)
      const offset = (query.page - 1) * query.limit
      const data = await problemAPI.getProblemList({
        offset,
        limit: query.limit,
        keyword: query.keyword,
        difficulty: query.difficulty,
        tag: query.tag
      })
      setProblemList(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('加载题目列表失败:', error)
      toast.error('加载题目列表失败')
    } finally {
      setLoading(false)
    }
  }

  const loadTagList = async () => {
    try {
      const tags = await problemAPI.getTagList()
      setTagList(tags || [])
    } catch (error) {
      console.error('加载标签失败:', error)
    } finally {
      setTagLoading(false)
    }
  }

  const updateURL = (newParams: Partial<typeof query>) => {
    const updatedQuery = { ...query, ...newParams }
    const params: any = {}

    if (updatedQuery.keyword) params.keyword = updatedQuery.keyword
    if (updatedQuery.difficulty) params.difficulty = updatedQuery.difficulty
    if (updatedQuery.tag) params.tag = updatedQuery.tag
    if (updatedQuery.page > 1) params.page = updatedQuery.page.toString()
    if (updatedQuery.limit !== 10) params.limit = updatedQuery.limit.toString()
    setSearchParams(params)
  }

  const handleSearch = () => {
    updateURL({ ...query, keyword: keywordInput.trim(), page: 1 })
  }

  const filterByDifficulty = (diff: string) => {
    updateURL({ ...query, difficulty: diff, page: 1 })
    setShowDiffDropdown(false)
  }

  const filterByTag = (tagName: string) => {
    updateURL({ ...query, tag: tagName, page: 1 })
  }

  const onReset = () => {
    setKeywordInput('')
    updateURL({ keyword: '', difficulty: '', tag: '', page: 1, limit: 10 })
  }

  const pickone = async () => {
    try {
      const result = await problemAPI.pickOne()
      toast.success('Good Luck!')
      navigate(`/problem/${result._id}`)
    } catch (error) {
      toast.error('随机选题失败')
    }
  }

  const getACRate = (accepted: number, total: number) => {
    if (!total) return '0.00%'
    return ((accepted / total) * 100).toFixed(2) + '%'
  }

  const getDifficultyText = (diff: string) => {
    const map: any = { 'Low': '简单', 'Mid': '中等', 'High': '困难' }
    return map[diff] || diff
  }

  const toggleTags = () => {
    setShowTags((prev) => !prev)
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
        {/* 8080: Row gutter=18 → marginLeft/Right: -9px */}
        <div style={{
          display: 'flex',
          marginLeft: '-9px',    // 8080: Row gutter=18 (左右各-9px)
          marginRight: '-9px'
        }}>
        {/* 8080: Col span=19 → 79.166667% */}
        <div style={{
          width: '79.166667%',  // 8080: span=19/24
          paddingLeft: '9px',   // 8080: gutter的一半
          paddingRight: '9px'
        }}>
          {/* 8080: Panel shadow */}
          <div style={{
            background: 'white',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',  // 8080: Panel shadow精确值
            borderRadius: '4px',   // 8080: border-radius
            overflow: 'hidden'
          }}>
            {/* Panel Header - 8080精确样式 */}
            <div style={{
              padding: '14px 16px',              // 8080: Panel header padding
              borderBottom: '1px solid #e8eaec', // 8080: 分割线
              fontSize: '16px',                  // 8080: header字号
              fontWeight: 500,
              color: '#17233d',                  // 8080: 标题颜色
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>问题列表</span>

              {/* 8080: extra slot - 筛选器 */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'  // 8080: filter li间距
              }}>
                {/* 难度筛选 Dropdown */}
                <li style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowDiffDropdown(!showDiffDropdown)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#515a6e',  // 8080: 文本颜色
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {query.difficulty === '' ? '难度' : getDifficultyText(query.difficulty)}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showDiffDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '4px',
                      background: 'white',
                      borderRadius: '4px',   // 8080: dropdown圆角
                      boxShadow: '0 1px 6px rgba(0,0,0,0.2)',  // 8080: dropdown阴影
                      border: '1px solid #e8eaec',
                      padding: '4px 0',      // 8080: dropdown padding
                      minWidth: '100px',
                      zIndex: 1000
                    }}>
                      {['', 'Low', 'Mid', 'High'].map(diff => (
                        <div
                          key={diff}
                          onClick={() => filterByDifficulty(diff)}
                          style={{
                            padding: '7px 16px',   // 8080: dropdown-item padding
                            cursor: 'pointer',
                            color: '#515a6e',      // 8080: item颜色
                            fontSize: '14px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f3f4'  // 8080: hover背景
                            e.currentTarget.style.color = '#2d8cf0'            // 8080: hover颜色
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#515a6e'
                          }}
                        >
                          {diff === '' ? '全部' : getDifficultyText(diff)}
                        </div>
                      ))}
                    </div>
                  )}
                </li>

                {/* Tags Switch - 8080: i-switch size=large */}
                <li>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      role="switch"
                      aria-checked={showTags}
                      tabIndex={0}
                      onClick={toggleTags}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleTags()
                        }
                      }}
                      style={{
                        width: '56px',
                        height: '28px',
                        borderRadius: '14px',
                        background: showTags ? '#2d8cf0' : '#dcdee2',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: showTags ? '0 0 0 2px rgba(45,140,240,0.2)' : 'none'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: showTags ? '30px' : '2px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#fff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '14px', color: '#515a6e' }}>标签</span>
                  </div>
                </li>

                {/* 搜索框 */}
                <li>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSearch()
                        }
                      }}
                      placeholder="keyword"
                      style={{
                        width: '200px',
                        height: '32px',            // 8080: Input height
                        padding: '4px 32px 4px 7px', // 8080: Input padding (右侧留icon空间)
                        fontSize: '14px',          // 8080: Input字号
                        color: '#515a6e',          // 8080: 文本颜色
                        border: '1px solid #dcdee2', // 8080: 边框
                        borderRadius: '4px',       // 8080: 圆角
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#2d8cf0'  // 8080: focus颜色
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(45,140,240,0.2)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#dcdee2'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                    <Search
                      onClick={handleSearch}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#2d8cf0',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleSearch}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 15px',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'white',
                      backgroundColor: '#2d8cf0',
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
                </li>

                {/* 重置按钮 - 8080: Button type=info */}
                <li>
                  <button
                    onClick={onReset}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 15px',       // 8080: Button padding
                      fontSize: '14px',          // 8080: Button字号
                      fontWeight: 400,
                      color: 'white',
                      backgroundColor: '#2db7f5', // 8080: info色
                      border: '1px solid #2db7f5',
                      borderRadius: '4px',       // 8080: 圆角
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#57c5f7'} // 8080: hover
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2db7f5'}
                  >
                    <RefreshCw style={{ width: '14px', height: '14px' }} />
                    <span>重置</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Table - 8080精确样式 */}
            <table style={{
              width: '100%',
              fontSize: '16px',              // 8080: 精确16px!
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                backgroundColor: '#f8f8f9'  // 8080: thead背景
              }}>
                <tr>
                  <th style={{ 
                    width: '80px',           // 8080: # 列宽
                    padding: '14px 16px',    // 8080: th padding
                    textAlign: 'left',
                    color: '#17233d',        // 8080: 标题颜色
                    fontWeight: 500,
                    fontSize: '14px',
                    borderBottom: '1px solid #e8eaec'
                  }}>#</th>
                  <th style={{ 
                    width: '400px',          // 8080: Title列宽
                    padding: '14px 16px',
                    textAlign: 'left',
                    color: '#17233d',
                    fontWeight: 500,
                    fontSize: '14px',
                    borderBottom: '1px solid #e8eaec'
                  }}>标题</th>
                  <th style={{ 
                    padding: '14px 16px',
                    textAlign: 'left',
                    color: '#17233d',
                    fontWeight: 500,
                    fontSize: '14px',
                    borderBottom: '1px solid #e8eaec'
                  }}>难度</th>
                  <th style={{ 
                    padding: '14px 16px',
                    textAlign: 'left',
                    color: '#17233d',
                    fontWeight: 500,
                    fontSize: '14px',
                    borderBottom: '1px solid #e8eaec'
                  }}>总数</th>
                  <th style={{ 
                    padding: '14px 16px',
                    textAlign: 'left',
                    color: '#17233d',
                    fontWeight: 500,
                    fontSize: '14px',
                    borderBottom: '1px solid #e8eaec'
                  }}>通过率</th>
                  {showTags && (
                    <th style={{ 
                      padding: '14px 16px',
                      textAlign: 'center',
                      color: '#17233d',
                      fontWeight: 500,
                      fontSize: '14px',
                      borderBottom: '1px solid #e8eaec'
                    }}>标签</th>
                  )}
                  {isAuthenticated && (
                    <th style={{ 
                      padding: '14px 16px',
                      textAlign: 'center',
                      color: '#17233d',
                      fontWeight: 500,
                      fontSize: '14px',
                      borderBottom: '1px solid #e8eaec'
                    }}>状态</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showTags ? (isAuthenticated ? 7 : 6) : (isAuthenticated ? 6 : 5)} 
                        style={{ textAlign: 'center', padding: '40px', color: '#808695' }}>
                      加载中...
                    </td>
                  </tr>
                ) : problemList.length === 0 ? (
                  <tr>
                    <td colSpan={showTags ? (isAuthenticated ? 7 : 6) : (isAuthenticated ? 6 : 5)} 
                        style={{ textAlign: 'center', padding: '40px', color: '#808695' }}>
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  problemList.map(problem => (
                    <tr 
                      key={problem._id}
                      style={{ borderBottom: '1px solid #e8eaec' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f7fa'}  // 8080: hover
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      {/* ID列 - 8080: Button type=text, size=large, padding: 2px 0 */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #e8eaec' }}>
                        <button
                          onClick={() => navigate(`/problem/${problem._id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2d8cf0',    // 8080: Button text颜色
                            fontSize: '16px',    // 8080: size=large
                            padding: '2px 0',    // 8080: 精确padding!
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#57a3f3'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#2d8cf0'}
                        >
                          {problem._id}
                        </button>
                      </td>

                      {/* 标题列 */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #e8eaec' }}>
                        <button
                          onClick={() => navigate(`/problem/${problem._id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2d8cf0',
                            fontSize: '16px',
                            padding: '2px 0',    // 8080: 精确padding
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#57a3f3'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#2d8cf0'}
                        >
                          {problem.title}
                        </button>
                      </td>

                      {/* 难度列 - 8080: Tag green/blue/yellow */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #e8eaec' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',      // 8080: Tag padding
                          fontSize: '12px',         // 8080: Tag字号
                          lineHeight: 1.5,
                          borderRadius: '3px',      // 8080: Tag圆角
                          border: '1px solid',
                          // 8080: 难度颜色精确值
                          ...(problem.difficulty === 'Low' ? {
                            color: '#19be6b',
                            backgroundColor: '#f0fff4',
                            borderColor: '#b8f5d0'
                          } : problem.difficulty === 'High' ? {
                            color: '#ff9900',
                            backgroundColor: '#fffaf0',
                            borderColor: '#ffd591'
                          } : {
                            color: '#2d8cf0',
                            backgroundColor: '#f0faff',
                            borderColor: '#b3e5fc'
                          })
                        }}>
                          {getDifficultyText(problem.difficulty)}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', color: '#515a6e', borderBottom: '1px solid #e8eaec' }}>
                        {problem.submission_number}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#515a6e', borderBottom: '1px solid #e8eaec' }}>
                        {getACRate(problem.accepted_number, problem.submission_number)}
                      </td>
                      
                      {showTags && (
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid #e8eaec' }}>
                          {problem.tags && problem.tags.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              {problem.tags.map((tag: any, idx: number) => (
                                <span key={idx} style={{
                                  padding: '3px 8px',
                                  fontSize: '12px',
                                  borderRadius: '3px',
                                  border: '1px solid #b3e5fc',
                                  color: '#2d8cf0',
                                  backgroundColor: '#f0faff'
                                }}>
                                  {typeof tag === 'string' ? tag : tag.name}
                                </span>
                              ))}
                            </div>
                          ) : '-'}
                        </td>
                      )}

                      {isAuthenticated && (
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid #e8eaec' }}>
                          {problem.my_status === 0 ? (
                            <CheckCircle style={{ width: '20px', height: '20px', color: '#19be6b' }} />
                          ) : problem.my_status === -1 ? (
                            <XCircle style={{ width: '20px', height: '20px', color: '#ed4014' }} />
                          ) : '-'}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - 8080精确样式 */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '14px', color: '#808695' }}>共 {total} 条</span>
            <select
              value={query.limit}
              onChange={(e) => updateURL({ ...query, limit: Number(e.target.value), page: 1 })}
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
              <option value="30">30 条/页</option>
              <option value="50">50 条/页</option>
            </select>
            
            <button
              disabled={query.page === 1}
              onClick={() => updateURL({ ...query, page: query.page - 1 })}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0 8px',
                border: '1px solid #dcdee2',
                borderRadius: '4px',
                backgroundColor: query.page === 1 ? '#f7f7f7' : 'white',
                color: query.page === 1 ? '#c5c8ce' : '#515a6e',
                cursor: query.page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (query.page > 1) {
                  e.currentTarget.style.borderColor = '#2d8cf0'
                  e.currentTarget.style.color = '#2d8cf0'
                }
              }}
              onMouseLeave={(e) => {
                if (query.page > 1) {
                  e.currentTarget.style.borderColor = '#dcdee2'
                  e.currentTarget.style.color = '#515a6e'
                }
              }}
            >
              上一页
            </button>

            <span style={{
              minWidth: '32px',
              height: '32px',
              lineHeight: '30px',
              padding: '0 8px',
              border: '1px solid #2d8cf0',
              borderRadius: '4px',
              backgroundColor: '#2d8cf0',
              color: 'white',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {query.page}
            </span>

            <button
              disabled={query.page >= Math.ceil(total / query.limit)}
              onClick={() => updateURL({ ...query, page: query.page + 1 })}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0 8px',
                border: '1px solid #dcdee2',
                borderRadius: '4px',
                backgroundColor: query.page >= Math.ceil(total / query.limit) ? '#f7f7f7' : 'white',
                color: query.page >= Math.ceil(total / query.limit) ? '#c5c8ce' : '#515a6e',
                cursor: query.page >= Math.ceil(total / query.limit) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (query.page < Math.ceil(total / query.limit)) {
                  e.currentTarget.style.borderColor = '#2d8cf0'
                  e.currentTarget.style.color = '#2d8cf0'
                }
              }}
              onMouseLeave={(e) => {
                if (query.page < Math.ceil(total / query.limit)) {
                  e.currentTarget.style.borderColor = '#dcdee2'
                  e.currentTarget.style.color = '#515a6e'
                }
              }}
            >
              下一页
            </button>
          </div>
        </div>

        {/* 8080: Col span=5 → 20.833333% */}
        <div style={{
          width: '20.833333%',   // 8080: span=5/24
          paddingLeft: '9px',
          paddingRight: '9px'
        }}>
          {/* 8080: Panel padding=10 */}
          <div style={{
            background: 'white',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            padding: '10px',       // 8080: 精确10px
            position: 'relative'
          }}>
            {/* 标签按钮 - 8080: Button type=ghost, shape=circle */}
            {tagList.map(tag => (
              <button
                key={tag.name}
                onClick={() => filterByTag(tag.name)}
                disabled={query.tag === tag.name}
                style={{
                  display: 'inline-block',
                  padding: '6px 15px',
                  marginRight: '5px',        // 8080: tag-btn margin-right
                  marginBottom: '10px',      // 8080: tag-btn margin-bottom
                  fontSize: '14px',
                  fontWeight: 400,
                  color: query.tag === tag.name ? '#c5c8ce' : '#515a6e',
                  backgroundColor: 'transparent',
                  border: `1px solid ${query.tag === tag.name ? '#dcdee2' : '#dcdee2'}`,
                  borderRadius: '20px',      // 8080: shape=circle
                  cursor: query.tag === tag.name ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (query.tag !== tag.name) {
                    e.currentTarget.style.color = '#2d8cf0'
                    e.currentTarget.style.borderColor = '#2d8cf0'
                  }
                }}
                onMouseLeave={(e) => {
                  if (query.tag !== tag.name) {
                    e.currentTarget.style.color = '#515a6e'
                    e.currentTarget.style.borderColor = '#dcdee2'
                  }
                }}
              >
                {tag.name}
              </button>
            ))}

            {/* 8080: Button long, id=pick-one, margin-top: 10px */}
            <button
              onClick={pickone}
              style={{
                width: '100%',           // 8080: long属性
                marginTop: '10px',       // 8080: #pick-one精确margin
                padding: '6px 15px',
                fontSize: '14px',
                fontWeight: 400,
                color: '#515a6e',
                backgroundColor: 'transparent',
                border: '1px solid #dcdee2',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
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
              <Shuffle style={{ width: '16px', height: '16px' }} />
              <span>Pick One</span>
            </button>

            {/* Loading Spin */}
            {tagLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '4px'
              }}>
                <div style={{
                  width: '32px',           // 8080: Spin size=large
                  height: '32px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #2d8cf0',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              </div>
            )}
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
