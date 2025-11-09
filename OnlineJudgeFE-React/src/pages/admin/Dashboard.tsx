import { useState, useEffect } from 'react'
import { Users, FileText, Trophy } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { userAPI } from '@/api/user'
import { toast } from 'sonner'
import { getAvatarUrl, DEFAULT_AVATAR_URL } from '@/utils/avatar'

interface DashboardData {
  user_count: number
  today_submission_count: number
  recent_contest_count: number
  judge_server_count: number
}

export default function Dashboard() {
  const [user, setUser] = useState({ username: 'admin', admin_type: 'Super Admin' })
  const [profile, setProfile] = useState({ 
    real_name: '管理员', 
    avatar: '' 
  })
  const [session] = useState({
    last_activity: new Date().toISOString(),
    ip: '127.0.0.1'
  })
  const [infoData, setInfoData] = useState<DashboardData>({
    user_count: 0,
    today_submission_count: 0,
    recent_contest_count: 0,
    judge_server_count: 0
  })

  useEffect(() => {
    loadDashboardData()
    loadUserProfile()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await adminAPI.getDashboardInfo()
      setInfoData(data || {
        user_count: 0,
        today_submission_count: 0,
        recent_contest_count: 0,
        judge_server_count: 0
      })
    } catch (error) {
      console.error('加载仪表盘数据失败:', error)
      // 保持默认值
    }
  }

  const loadUserProfile = async () => {
    try {
      const data = await userAPI.getUserInfo()
      if (data) {
        setUser({ username: data.username, admin_type: data.admin_type || 'Admin' })
        setProfile({ real_name: data.real_name || data.username, avatar: data.avatar || '' })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }

  const getBrowser = () => {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    return 'Unknown'
  }

  const getOS = () => {
    const ua = navigator.userAgent
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    return 'Unknown'
  }

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN')
  }

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* 左侧个人信息 */}
      <div style={{ flex: '0 0 calc(40% - 10px)', minWidth: '300px' }}>
        {/* 管理员信息卡片 */}
        <div style={{
          background: 'white',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <img
              src={getAvatarUrl(profile.avatar, user.username)}
              alt="avatar"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = DEFAULT_AVATAR_URL
              }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 600,
                color: '#303133'
              }}>{user.username}</p>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#909399'
              }}>{user.admin_type}</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e8eaec', margin: '20px 0' }} />

          <div>
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#303133'
            }}>最后登录信息</p>
            <div style={{ fontSize: '14px', color: '#606266', lineHeight: '2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>Time:</span>
                <span>{formatTime(session.last_activity)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>IP:</span>
                <span>{session.ip}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>OS:</span>
                <span>{getOS()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>Browser:</span>
                <span>{getBrowser()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 系统概览 */}
        <div style={{
          background: 'white',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#303133'
          }}>系统概览</h3>
          <div style={{ fontSize: '14px', color: '#606266', lineHeight: '2' }}>
            <p style={{ margin: '8px 0' }}>
              判题服务器: <span style={{ fontWeight: 600 }}>{infoData.judge_server_count}</span>
            </p>
            <p style={{ margin: '8px 0' }}>
              HTTPS状态: <span style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                background: '#67c23a',
                color: 'white'
              }}>已启用</span>
            </p>
          </div>
        </div>
      </div>

      {/* 右侧统计卡片 */}
      <div style={{ flex: '1', minWidth: '500px' }}>
        {/* 统计卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '8px',
              background: '#909399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={30} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#909399', marginBottom: '4px' }}>总用户数</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#303133' }}>
                {infoData.user_count}
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '8px',
              background: '#67C23A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={30} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#909399', marginBottom: '4px' }}>今日提交</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#303133' }}>
                {infoData.today_submission_count}
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '8px',
              background: '#409EFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={30} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#909399', marginBottom: '4px' }}>近期竞赛</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#303133' }}>
                {infoData.recent_contest_count}
              </div>
            </div>
          </div>
        </div>

        {/* 更新日志 */}
        <div style={{
          background: 'white',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#303133'
          }}>更新日志</h3>
          <div style={{
            padding: '16px',
            background: '#f0f9ff',
            borderRadius: '4px',
            borderLeft: '4px solid #409eff'
          }}>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: '#303133'
            }}>v1.0.0 - 最新版本</p>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '13px',
              color: '#606266',
              lineHeight: '1.8'
            }}>
              <li>✅ 完成前台20+个页面</li>
              <li>✅ 像素级复刻8080设计</li>
              <li>✅ React + TypeScript重构</li>
              <li>✅ 优化用户体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


