import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { Github, Mail, Globe } from 'lucide-react'
import { userAPI } from '@/api/user'
import { toast } from 'sonner'
import { getAvatarUrl, DEFAULT_AVATAR_URL } from '@/utils/avatar'

interface User {
  username: string
  email: string
  create_time: string
}

interface UserProfile {
  user: User
  avatar: string
  school?: string
  mood?: string
  accepted_number: number
  submission_number: number
  total_score: number
  acm_problems_status: {
    problems: Record<string, any>
  }
  oi_problems_status: {
    problems: Record<string, any>
  }
  github?: string
  blog?: string
}

export default function UserHome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username')

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [solvedProblems, setSolvedProblems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const parseStatus = useCallback((status: any) => {
    if (!status) {
      return { problems: {} }
    }

    if (typeof status === 'string') {
      try {
        const parsed = JSON.parse(status)
        return typeof parsed === 'object' && parsed !== null ? parsed : { problems: {} }
      } catch (error) {
        console.warn('解析题目状态失败:', error)
        return { problems: {} }
      }
    }

    if (typeof status === 'object') {
      return status
    }

    return { problems: {} }
  }, [])

  const transformProfile = useCallback((data: any): UserProfile => {
    const acmStatus = parseStatus(data.acm_problems_status)
    const oiStatus = parseStatus(data.oi_problems_status)

    const userData = data.user || {}

    return {
      user: {
        username: userData.username || data.username || username || '',
        email: userData.email || data.email || '',
        create_time: userData.create_time || data.create_time || new Date().toISOString()
      },
      avatar: data.avatar || userData.avatar || '',
      school: data.school || '',
      mood: data.mood || '',
      accepted_number: data.accepted_number || 0,
      submission_number: data.submission_number || 0,
      total_score: data.total_score || 0,
      acm_problems_status: {
        problems: acmStatus?.problems || {}
      },
      oi_problems_status: {
        problems: oiStatus?.problems || {}
      },
      github: data.github || '',
      blog: data.blog || ''
    }
  }, [parseStatus, username])

  const processSolvedProblems = useCallback((profile: UserProfile) => {
    const ACMProblems = profile.acm_problems_status.problems || {}
    const OIProblems = profile.oi_problems_status.problems || {}
    const ACProblems: string[] = []

    for (const problems of [ACMProblems, OIProblems]) {
      Object.keys(problems).forEach(problemID => {
        if (problems[problemID]['status'] === 0) {
          ACProblems.push(problems[problemID]['_id'])
        }
      })
    }

    ACProblems.sort()
    setSolvedProblems(ACProblems)
  }, [])

  const loadUserInfo = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userAPI.getUserInfo(username || undefined)
      if (!data) {
        toast.error('未找到用户信息')
        setProfile(null)
        setSolvedProblems([])
        return
      }

      const transformed = transformProfile(data)
      setProfile(transformed)
      processSolvedProblems(transformed)
    } catch (error) {
      console.error('加载用户信息失败:', error)
      toast.error('加载用户信息失败')
      setProfile(null)
      setSolvedProblems([])
    } finally {
      setLoading(false)
    }
  }, [processSolvedProblems, transformProfile, username])

  useEffect(() => {
    loadUserInfo()
  }, [loadUserInfo])

  const goProblem = (problemID: string) => {
    navigate(`/problem/${problemID}`)
  }

  const resolveAvatarUrl = () => getAvatarUrl(profile?.avatar, profile?.user?.username)

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
  }

  if (!profile) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>未找到用户信息</div>
  }

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        marginTop: window.innerWidth >= 1200 ? '80px' : '160px',
        padding: '0 2%'
      }}>
        <div style={{
          position: 'relative',
          width: '75%',
          maxWidth: '900px',
          margin: '170px auto',
          textAlign: 'center'
        }}>
          {/* 头像容器 */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            top: '-90px'
          }}>
            <img
              src={resolveAvatarUrl()}
              alt="用户头像"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = DEFAULT_AVATAR_URL
              }}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '4px solid white'
              }}
            />
          </div>

          {/* 主卡片 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '100px 40px 40px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
          }}>
            {/* 用户名和学校 */}
            <p style={{
              marginTop: '-10px',
              marginBottom: '8px',
              fontSize: '16px'
            }}>
              <span style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#303133'
              }}>{profile.user.username}</span>
              {profile.school && (
                <span style={{ color: '#606266', marginLeft: '8px' }}>
                  @{profile.school}
                </span>
              )}
            </p>

            {/* 个性签名 */}
            {profile.mood && (
              <p style={{
                marginTop: '8px',
                marginBottom: '8px',
                color: '#606266',
                fontSize: '14px'
              }}>{profile.mood}</p>
            )}

            {/* 分隔线 */}
            <hr style={{
              margin: '20px auto',
              width: '90%',
              border: 'none',
              borderTop: '1px solid #e8eaec'
            }} />

            {/* 统计数据 */}
            <div style={{
              display: 'flex',
              marginTop: '30px',
              padding: '0 20px'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: '8px 0',
                  fontSize: '14px',
                  color: '#606266'
                }}>已解决</p>
                <p style={{
                  margin: '8px 0',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#52c41a'
                }}>{profile.accepted_number}</p>
              </div>
              <div style={{
                flex: 1,
                borderLeft: '1px solid #999',
                borderRight: '1px solid #999'
              }}>
                <p style={{
                  margin: '8px 0',
                  fontSize: '14px',
                  color: '#606266'
                }}>提交数</p>
                <p style={{
                  margin: '8px 0',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#409eff'
                }}>{profile.submission_number}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: '8px 0',
                  fontSize: '14px',
                  color: '#606266'
                }}>总分</p>
                <p style={{
                  margin: '8px 0',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#fa8c16'
                }}>{profile.total_score}</p>
              </div>
            </div>

            {/* 已解决的题目 */}
            <div style={{
              marginTop: '40px',
              textAlign: 'left',
              padding: '0 20px'
            }}>
              <div style={{
                marginBottom: '20px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#303133'
              }}>
                {solvedProblems.length > 0 ? '已解决的题目' : '开始你的编程之旅吧！'}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {solvedProblems.map(problemID => (
                  <button
                    key={problemID}
                    onClick={() => goProblem(problemID)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#606266',
                      border: '1px solid #dcdfe6',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#409eff'
                      e.currentTarget.style.color = '#409eff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#dcdfe6'
                      e.currentTarget.style.color = '#606266'
                    }}
                  >{problemID}</button>
                ))}
              </div>
            </div>

            {/* 社交图标 */}
            <div style={{
              marginTop: '40px',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px'
            }}>
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#606266',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#409eff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#606266'
                  }}
                >
                  <Github size={30} />
                </a>
              )}
              {profile.user.email && (
                <a
                  href={`mailto:${profile.user.email}`}
                  style={{
                    color: '#606266',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#409eff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#606266'
                  }}
                >
                  <Mail size={30} />
                </a>
              )}
              {profile.blog && (
                <a
                  href={profile.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#606266',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#409eff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#606266'
                  }}
                >
                  <Globe size={30} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


