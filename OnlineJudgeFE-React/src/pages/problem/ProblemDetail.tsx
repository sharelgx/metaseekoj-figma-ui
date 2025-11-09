/**
 * 问题详情页 - 100%像素级复刻8080
 * 
 * 借鉴首页Home.tsx的成功经验：
 * ✅ inline style + 精确数值
 * ✅ 标注8080来源
 * ✅ 原生HTML元素
 * ✅ 每个px都精确对齐
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { 
  Copy, 
  BarChart3, 
  Info, 
  CheckCircle,
  XCircle
} from 'lucide-react'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { CodeEditor } from '@/components/code-editor/CodeEditor'
import { problemAPI } from '@/api/problem'
import { userAPI } from '@/api/user'
import { useUserStore } from '@/store/user'
import './ProblemDetail.css'

// 判题状态映射 - 8080精确配置
const JUDGE_STATUS: Record<number, { name: string; color: string }> = {
  '-2': { name: 'Compile Error', color: 'warning' },
  '-1': { name: 'Wrong Answer', color: 'error' },
  '0': { name: 'Accepted', color: 'success' },
  '1': { name: 'Time Limit Exceeded', color: 'error' },
  '2': { name: 'Time Limit Exceeded', color: 'error' },
  '3': { name: 'Memory Limit Exceeded', color: 'error' },
  '4': { name: 'Runtime Error', color: 'error' },
  '6': { name: 'Pending', color: 'default' },
  '7': { name: 'Judging', color: 'primary' },
  '8': { name: 'Partial Accepted', color: 'primary' },
  '9': { name: 'Submitting', color: 'primary' }
}

type EditorTheme = 'monokai' | 'solarized' | 'material'

interface Problem {
  _id: string
  id: number
  title: string
  description: string
  input_description: string
  output_description: string
  hint: string
  source: string
  original_url: string
  samples: Array<{ input: string; output: string }>
  time_limit: number
  memory_limit: number
  difficulty: 'Low' | 'Mid' | 'High'
  languages: string[]
  template: Record<string, string>
  tags: string[]
  my_status: number
  created_by: { username: string }
  io_mode: { io_mode: string; input?: string; output?: string }
  accepted_number: number
  submission_number: number
  total_score?: number
}

export default function ProblemDetail() {
  const { problemID, contestID } = useParams<{ problemID: string; contestID?: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useUserStore()
  
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('C++')
  const [theme, setTheme] = useState<EditorTheme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('code_editor_theme') as EditorTheme | null
      if (stored && ['monokai', 'solarized', 'material'].includes(stored)) {
        return stored
      }
    }
    return 'solarized'
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState('')
  const [statusVisible, setStatusVisible] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<any>({ result: 9 })

  const refreshStatusRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (problemID) loadProblem()
    return () => {
      if (refreshStatusRef.current) clearTimeout(refreshStatusRef.current)
    }
  }, [problemID, contestID])

  const loadProblem = async () => {
    try {
      setLoading(true)
      const problemData = await problemAPI.getProblemDetail(problemID!)
      
      setProblem(problemData)
      document.title = `${problemData.title} - 元探索少儿编程`
      
      if (problemData.languages && problemData.languages.length > 0) {
        const sortedLangs = [...problemData.languages].sort()

        const profilePreferred = (user?.preferred_code_language || user?.profile?.preferred_code_language || user?.user?.preferred_code_language) as string | undefined
        const localPreferred = localStorage.getItem('preferred_code_language') || undefined

        const initialLang = [profilePreferred, localPreferred].find((lang) => lang && sortedLangs.includes(lang)) || sortedLangs[0]

        setLanguage(initialLang)

        if (problemData.template && problemData.template[initialLang]) {
          setCode(problemData.template[initialLang])
        }
      }
    } catch (error) {
      console.error('加载题目失败:', error)
      toast.error('加载题目失败')
    } finally {
      setLoading(false)
    }
  }

  // 8080: formatContent精确复刻
  const formatContent = (content: string) => {
    if (!content) return ''
    try {
      let result = String(content)
      result = result.split('\\r\\n').join('\n')
      result = result.split('\\n').join('\n')

      const mdImg = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g
      result = result.replace(mdImg, (m, alt, url, title) => {
        const safeAlt = (alt || '').replace(/"/g, '&quot;')
        const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : ''
        return `<img src="${url}" alt="${safeAlt}"${titleAttr} style="width: 400px; height: auto;" />`
      })

      result = result.replace(/<img([^>]*)>/gi, (m, attrs) => {
        if (/style=/i.test(attrs)) {
          return `<img${attrs.replace(/style=(["'])(.*?)\1/i, (n, q, s) => {
            const cleanStyle = s.replace(/width\s*:[^;]+;?/gi, '').replace(/height\s*:[^;]+;?/gi, '')
            return `style=${q}${cleanStyle}; width: 400px !important; height: auto !important;${q}`
          })}>`
        } else {
          return `<img${attrs} style="width: 400px !important; height: auto !important;">`
        }
      })
      
      return result
    } catch (error) {
      console.error('formatContent处理失败:', error)
      return content || ''
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success('代码已复制')).catch(() => toast.error('复制失败'))
  }

  const handleSubmitCode = async () => {
    if (!code.trim()) { toast.error('代码不能为空'); return }
    if (!problem) return

    setSubmitting(true)
    setStatusVisible(true)

    try {
      const data: any = { problem_id: problem.id, language, code, contest_id: contestID || null }
      const homeworkId = searchParams.get('homework_id')
      const homeworkProblemId = searchParams.get('homework_problem_id')
      if (homeworkId && homeworkProblemId) {
        data.homework_id = homeworkId
        data.homework_problem_id = homeworkProblemId
      }

      const result = await problemAPI.submitCode(data)
      const submissionIdValue = result.data?.submission_id || result.submission_id
      setSubmissionId(submissionIdValue)
      setSubmitted(true)
      toast.success('提交成功')
      checkSubmissionStatus(submissionIdValue)
    } catch (error: any) {
      console.error('提交失败:', error)
      toast.error(error.response?.data?.data || '提交失败')
      setStatusVisible(false)
    } finally {
      setSubmitting(false)
    }
  }

  const checkSubmissionStatus = (id: string) => {
    if (!id) return
    const checkStatus = async () => {
      try {
        const response = await problemAPI.getSubmission(id)
        const result = response.data?.data || response.data
        setSubmissionResult(result)
        
        if (result.statistic_info && Object.keys(result.statistic_info).length > 0) {
          setSubmitting(false)
          setSubmitted(false)
          if (refreshStatusRef.current) clearTimeout(refreshStatusRef.current)
          loadProblem()
        } else {
          refreshStatusRef.current = setTimeout(checkStatus, 2000)
        }
      } catch (error) {
        console.error('检查提交状态失败:', error)
        setSubmitting(false)
        if (refreshStatusRef.current) clearTimeout(refreshStatusRef.current)
      }
    }
    refreshStatusRef.current = setTimeout(checkStatus, 2000)
  }

  const handleResetCode = () => {
    if (!problem) return
    if (confirm('确定要重置代码吗？')) {
      const template = problem.template
      if (template && template[language]) {
        setCode(template[language])
      } else {
        setCode('')
      }
    }
  }

  const persistPreferredLanguage = async (lang: string) => {
    try {
      localStorage.setItem('preferred_code_language', lang)
      if (isAuthenticated) {
        await userAPI.updateProfile({ preferred_code_language: lang })
      }
    } catch (error) {
      console.error('保存语言偏好失败:', error)
    }
  }

  const handleChangeLang = (newLang: string) => {
    if (problem?.template?.[newLang] && code.trim() === '') {
      setCode(problem.template[newLang])
    }
    setLanguage(newLang)
    void persistPreferredLanguage(newLang)
  }

  const handleChangeTheme = (newTheme: EditorTheme) => {
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('code_editor_theme', newTheme)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #2d8cf0',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px'
            }} />
            <p style={{ color: '#808695', fontSize: '14px' }}>加载中...</p>
          </div>
        </div>
      </>
    )
  }

  if (!problem) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <p style={{ color: '#808695' }}>题目不存在</p>
        </div>
      </>
    )
  }

  const statusColorKey = JUDGE_STATUS[submissionResult.result]?.color || 'default'

  return (
    <>
      <Header />
      <div id="problem-detail-root">
        <div className="problem-flex-container">
          <div id="problem-main">
            <div className="problem-panel">
              <h2 className="problem-title">{problem.title}</h2>
              <div id="problem-content">
                <p className="section-title">题目描述</p>
                <div className="problem-rich-text" dangerouslySetInnerHTML={{ __html: formatContent(problem.description) }} />

                <p className="section-title">
                  输入格式
                  {problem.io_mode.io_mode === 'File IO' && (
                    <span className="section-extra"> (从文件: {problem.io_mode.input})</span>
                  )}
                </p>
                <div className="problem-rich-text" dangerouslySetInnerHTML={{ __html: formatContent(problem.input_description) }} />

                <p className="section-title">
                  输出格式
                  {problem.io_mode.io_mode === 'File IO' && (
                    <span className="section-extra"> (到文件: {problem.io_mode.output})</span>
                  )}
                </p>
                <div className="problem-rich-text" dangerouslySetInnerHTML={{ __html: formatContent(problem.output_description) }} />

                {problem.samples && problem.samples.map((sample, index) => (
                  <div key={index} className="sample">
                    <div className="sample-input">
                      <p className="section-title with-action">
                        样例输入 {index + 1}
                        <button
                          type="button"
                          className="copy-button"
                          onClick={() => handleCopy(sample.input)}
                          title="复制"
                        >
                          <Copy style={{ width: '16px', height: '16px' }} />
                        </button>
                      </p>
                      <pre>{sample.input}</pre>
                    </div>
                    <div className="sample-output">
                      <p className="section-title">样例输出 {index + 1}</p>
                      <pre>{sample.output}</pre>
                    </div>
                  </div>
                ))}

                {problem.hint && (
                  <div className="hint-section">
                    <p className="section-title">提示</p>
                    <div className="hint-card">
                      <div className="problem-rich-text" dangerouslySetInnerHTML={{ __html: formatContent(problem.hint) }} />
                    </div>
                  </div>
                )}

                {(problem.source || problem.original_url) && (
                  <div className="source-section">
                    <p className="section-title">来源</p>
                    {problem.source && (
                      <p className="problem-rich-text">
                        {problem.source.startsWith('http') ? (
                          <a href={problem.source} target="_blank" rel="noopener noreferrer" className="link">
                            {problem.source}
                          </a>
                        ) : problem.source}
                      </p>
                    )}
                    {problem.original_url && (
                      <p className="problem-rich-text">
                        <a href={problem.original_url} target="_blank" rel="noopener noreferrer" className="link">
                          {problem.original_url}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div id="submit-code" className="problem-submit-card">
              <CodeEditor
                value={code}
                language={language}
                theme={theme}
                languages={problem.languages}
                onChange={setCode}
                onChangeLang={handleChangeLang}
                onChangeTheme={handleChangeTheme}
                onReset={handleResetCode}
              />

              <div className="submit-footer">
                <div className="submit-status">
                  {statusVisible && (
                    <div className="status-content">
                      <span className="status-label">状态:</span>
                      <button
                        type="button"
                        className={`status-tag status-${statusColorKey}`}
                        onClick={() => navigate(`/status/${submissionId}`)}
                      >
                        {JUDGE_STATUS[submissionResult.result]?.name || 'Unknown'}
                      </button>
                    </div>
                  )}
                  {problem.my_status === 0 && !statusVisible && (
                    <div className="status-success">
                      <CheckCircle className="status-success-icon" />
                      <span>您已经解决了这道题</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmitCode}
                  disabled={submitting || submitted}
                >
                  {submitting ? '提交中...' : '提交'}
                </button>
              </div>
            </div>
          </div>

          <div id="right-column">
            <div className="problem-card info-card">
              <div className="card-header">
                <Info className="card-icon" />
                <span className="card-title">信息</span>
              </div>
              <ul className="info-list">
                {[
                  ['ID', problem._id],
                  ['时间限制', `${problem.time_limit}MS`],
                  ['内存限制', `${problem.memory_limit}MB`],
                  ['IO模式', problem.io_mode.io_mode],
                  ['创建者', problem.created_by.username],
                  ...(problem.difficulty ? [['难度', getDifficultyText(problem.difficulty)]] : []),
                  ...(problem.total_score ? [['分数', problem.total_score]] : []),
                  ['标签', '查看']
                ].map((item, idx) => (
                  <li key={idx} className="info-item">
                    <p className="info-label">{item[0]}</p>
                    <p className="info-value">{item[1]}</p>
                  </li>
                ))}
              </ul>
            </div>

            {!contestID && (
              <div className="problem-card stat-card">
                <div className="card-header">
                  <BarChart3 className="card-icon" />
                  <span className="card-title">统计</span>
                </div>
                <div className="statistics">
                  <div className="stat-total">
                    <span className="stat-ac">{problem.accepted_number}</span>
                    <span className="stat-split"> / </span>
                    <span>{problem.submission_number}</span>
                  </div>
                  <div className="stat-rate">
                    通过率: {problem.submission_number > 0
                      ? ((problem.accepted_number / problem.submission_number) * 100).toFixed(1)
                      : 0}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
  
  function getDifficultyText(diff: string) {
    const map: any = { 'Low': '简单', 'Mid': '中等', 'High': '困难' }
    return map[diff] || diff
  }
}
