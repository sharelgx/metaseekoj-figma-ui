/**
 * 问题列表页 - 100%像素级复刻8080
 * 
 * 精确对齐：
 * - Row gutter=18 (左右各9px)
 * - Col span=19 (79.17%) + span=5 (20.83%)
 * - 表格字体16px
 * - Panel shadow效果
 * - 精确的间距和颜色
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { problemAPI } from '@/api/problem'
import type { Problem, ProblemTag } from '@/types/problem'
import { useUserStore } from '@/store/user'
import '@/styles/iview-clone.css'

export default function ProblemList() {
  const { isAuthenticated } = useUserStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // 状态管理
  const [problemList, setProblemList] = useState<Problem[]>([])
  const [tagList, setTagList] = useState<ProblemTag[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tagLoading, setTagLoading] = useState(true)
  const [showTags, setShowTags] = useState(false)

  // 查询参数
  const [query, setQuery] = useState({
    keyword: searchParams.get('keyword') || '',
    difficulty: searchParams.get('difficulty') || '',
    tag: searchParams.get('tag') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10')
  })

  // 初始化加载
  useEffect(() => {
    document.title = '编程题列表 - 元探索少儿编程'
    loadTagList()
  }, [])

  // 监听URL变化
  useEffect(() => {
    const newQuery = {
      keyword: searchParams.get('keyword') || '',
      difficulty: searchParams.get('difficulty') || '',
      tag: searchParams.get('tag') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }
    setQuery(newQuery)
  }, [searchParams])

  // 查询参数变化时加载数据
  useEffect(() => {
    loadProblemList()
  }, [query])

  const loadProblemList = async () => {
    try {
      setLoading(true)
      const offset = (query.page - 1) * query.limit
      const response = await problemAPI.getProblemList({
        offset,
        limit: query.limit,
        keyword: query.keyword,
        difficulty: query.difficulty as any,
        tag: query.tag
      })

      const data = response.data?.data || response.data
      setProblemList(data?.results || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('加载题目列表失败:', error)
      toast.error('加载题目列表失败')
    } finally {
      setLoading(false)
    }
  }

  const loadTagList = async () => {
    try {
      const response = await problemAPI.getProblemTagList()
      setTagList(response.data?.data || [])
    } catch (error) {
      console.error('加载标签失败:', error)
    } finally {
      setTagLoading(false)
    }
  }

  const updateURL = (newQuery: typeof query) => {
    const params = new URLSearchParams()
    if (newQuery.keyword) params.set('keyword', newQuery.keyword)
    if (newQuery.difficulty) params.set('difficulty', newQuery.difficulty)
    if (newQuery.tag) params.set('tag', newQuery.tag)
    if (newQuery.page > 1) params.set('page', newQuery.page.toString())
    if (newQuery.limit !== 10) params.set('limit', newQuery.limit.toString())
    setSearchParams(params)
  }

  const filterByDifficulty = (diff: string) => {
    const newQuery = { ...query, difficulty: diff, page: 1 }
    updateURL(newQuery)
  }

  const filterByTag = (tagName: string) => {
    const newQuery = { ...query, tag: tagName, page: 1 }
    updateURL(newQuery)
  }

  const filterByKeyword = () => {
    const newQuery = { ...query, page: 1 }
    updateURL(newQuery)
  }

  const onReset = () => {
    const newQuery = { keyword: '', difficulty: '', tag: '', page: 1, limit: 10 }
    updateURL(newQuery)
  }

  const pickone = async () => {
    try {
      const response = await problemAPI.pickOne()
      const problemID = response.data?.data || response.data
      toast.success('Good Luck!')
      navigate(`/problem/${problemID}`)
    } catch (error) {
      toast.error('随机选题失败')
    }
  }

  const getACRate = (accepted: number, total: number) => {
    if (!total) return '0.00%'
    return ((accepted / total) * 100).toFixed(2) + '%'
  }

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Low') return 'green'
    if (diff === 'High') return 'yellow'
    return 'blue'
  }

  return (
    <>
      <Header />

      {/* iView Row with gutter=18 */}
      <div style={{ 
        display: 'flex', 
        marginLeft: '-9px', 
        marginRight: '-9px',
        padding: '20px'
      }}>
        {/* 左侧 span=19 (79.17%) */}
        <div style={{ 
          width: '79.166667%', 
          paddingLeft: '9px', 
          paddingRight: '9px' 
        }}>
          {/* Panel shadow */}
          <div className="iview-panel iview-panel-shadow">
            {/* Panel Header */}
            <div className="iview-panel-header">
              <span>问题列表</span>
              
              {/* 筛选器在extra slot */}
              <ul className="iview-filter-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '12px' }}>
                <li>
                  {/* 难度筛选 Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="iview-dropdown">
                        {query.difficulty === '' ? '难度' : 
                          query.difficulty === 'Low' ? '简单' :
                          query.difficulty === 'Mid' ? '中等' : '困难'}
                        <ChevronDown className="inline h-4 w-4 ml-1" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="iview-dropdown-menu">
                      <DropdownMenuItem onClick={() => filterByDifficulty('')}>全部</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => filterByDifficulty('Low')}>简单</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => filterByDifficulty('Mid')}>中等</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => filterByDifficulty('High')}>困难</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
                <li>
                  {/* Tags Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Switch checked={showTags} onCheckedChange={setShowTags} />
                    <span className="text-sm">Tags</span>
                  </div>
                </li>
                <li>
                  {/* 搜索框 */}
                  <div style={{ position: 'relative', width: '200px' }}>
                    <Input
                      value={query.keyword}
                      onChange={(e) => setQuery({...query, keyword: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && filterByKeyword()}
                      placeholder="keyword"
                      className="iview-input"
                    />
                    <Search className="h-4 w-4" style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#c5c8ce'
                    }} />
                  </div>
                </li>
                <li>
                  {/* 重置按钮 */}
                  <Button onClick={onReset} className="iview-btn iview-btn-info">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    重置
                  </Button>
                </li>
              </ul>
            </div>

            {/* Panel Body - 表格 */}
            <div className="iview-panel-body iview-panel-body-nopadding">
              <table className="iview-table" style={{ width: '100%', fontSize: '16px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>#</th>
                    <th style={{ width: '400px' }}>标题</th>
                    <th>难度</th>
                    <th>提交</th>
                    <th>通过率</th>
                    {showTags && <th style={{ textAlign: 'center' }}>标签</th>}
                    {isAuthenticated && <th style={{ textAlign: 'center' }}>状态</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={showTags ? (isAuthenticated ? 7 : 6) : (isAuthenticated ? 6 : 5)} style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="text-gray-500">加载中...</div>
                      </td>
                    </tr>
                  ) : problemList.length === 0 ? (
                    <tr>
                      <td colSpan={showTags ? (isAuthenticated ? 7 : 6) : (isAuthenticated ? 6 : 5)} style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="text-gray-500">暂无数据</div>
                      </td>
                    </tr>
                  ) : (
                    problemList.map(problem => (
                      <tr key={problem._id} style={{ cursor: 'pointer' }} className="hover:bg-gray-50">
                        <td>
                          <button
                            onClick={() => navigate(`/problem/${problem._id}`)}
                            className="iview-btn iview-btn-text"
                            style={{ padding: '2px 0', fontSize: '16px' }}
                          >
                            {problem._id}
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/problem/${problem._id}`)}
                            className="iview-btn iview-btn-text"
                            style={{ 
                              padding: '2px 0',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '16px'
                            }}
                          >
                            {problem.title}
                          </button>
                        </td>
                        <td>
                          <Badge className={`iview-tag iview-tag-${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty === 'Low' ? '简单' : problem.difficulty === 'Mid' ? '中等' : '困难'}
                          </Badge>
                        </td>
                        <td>{problem.submission_number}</td>
                        <td>{getACRate(problem.accepted_number, problem.submission_number)}</td>
                        {showTags && (
                          <td style={{ textAlign: 'center' }}>
                            {problem.tags && problem.tags.length > 0 ? (
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {problem.tags.map((tag: any, idx: number) => (
                                  <Badge key={idx} className="iview-tag">
                                    {typeof tag === 'string' ? tag : tag.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                        )}
                        {isAuthenticated && (
                          <td style={{ textAlign: 'center' }}>
                            {problem.my_status === 0 ? (
                              <CheckCircle className="h-5 w-5 text-green-500 inline" />
                            ) : problem.my_status === -1 ? (
                              <XCircle className="h-5 w-5 text-red-500 inline" />
                            ) : '-'}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="iview-pagination" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
              <span className="text-sm text-gray-600">共 {total} 条</span>
              <select
                value={query.limit}
                onChange={(e) => {
                  const newQuery = { ...query, limit: Number(e.target.value), page: 1 }
                  updateURL(newQuery)
                }}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="10">10 条/页</option>
                <option value="20">20 条/页</option>
                <option value="30">30 条/页</option>
                <option value="50">50 条/页</option>
              </select>
              
              <Button
                size="sm"
                disabled={query.page === 1}
                onClick={() => updateURL({ ...query, page: query.page - 1 })}
                className="iview-pagination-item"
              >
                上一页
              </Button>
              
              <span className="iview-pagination-item iview-pagination-item-active">
                {query.page}
              </span>
              
              <Button
                size="sm"
                disabled={query.page >= Math.ceil(total / query.limit)}
                onClick={() => updateURL({ ...query, page: query.page + 1 })}
                className="iview-pagination-item"
              >
                下一页
              </Button>
            </div>
          </div>
        </div>

        {/* 右侧 span=5 (20.83%) */}
        <div style={{ 
          width: '20.833333%', 
          paddingLeft: '9px', 
          paddingRight: '9px' 
        }}>
          {/* Panel padding=10 */}
          <div className="iview-panel iview-panel-shadow" style={{ padding: '10px', position: 'relative' }}>
            <div className="taglist-title" style={{ marginLeft: '-10px', marginBottom: '-10px', fontWeight: 500, fontSize: '14px', padding: '10px', color: '#17233d' }}>
              标签
            </div>
            
            {/* 标签按钮 */}
            {tagList.map(tag => (
              <Button
                key={tag.name}
                onClick={() => filterByTag(tag.name)}
                disabled={query.tag === tag.name}
                className="iview-btn iview-btn-ghost iview-btn-circle tag-btn"
                style={{ 
                  marginRight: '5px', 
                  marginBottom: '10px',
                  borderRadius: '20px'
                }}
              >
                {tag.name}
              </Button>
            ))}

            {/* Pick One按钮 */}
            <Button
              onClick={pickone}
              className="iview-btn iview-btn-ghost"
              style={{ 
                width: '100%',
                marginTop: '10px'
              }}
            >
              <Shuffle className="h-4 w-4 mr-2 inline" />
              Pick One
            </Button>

            {/* Loading */}
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
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}>
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: '#2d8cf0' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

