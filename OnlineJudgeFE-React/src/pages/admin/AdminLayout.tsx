import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { SideMenu } from './components/SideMenu'
import { Maximize2, LogOut } from 'lucide-react'
import { DEFAULT_AVATAR_URL } from '@/utils/avatar'

export function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: 'admin', admin_type: 'Super Admin' })
  const [profile, setProfile] = useState({ real_name: '管理员', avatar: DEFAULT_AVATAR_URL })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('authed')
    navigate('/admin/login')
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div style={{
      overflow: 'auto',
      fontWeight: 400,
      height: '100%',
      WebkitFontSmoothing: 'antialiased',
      backgroundColor: '#EDECEC',
      overflowY: 'scroll',
      minWidth: '1000px'
    }}>
      {/* 侧边菜单 */}
      <SideMenu />

      {/* 顶部Header */}
      <div style={{
        textAlign: 'right',
        paddingLeft: '210px',
        paddingRight: '30px',
        lineHeight: '50px',
        height: '50px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e7e7e7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '20px'
      }}>
        <button
          onClick={toggleFullscreen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#606266'
          }}
        >
          <Maximize2 size={14} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <span style={{ fontSize: '14px', color: '#303133' }}>
            {profile.real_name || user.username}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#606266',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div style={{
        marginLeft: '210px',
        padding: '20px',
        minHeight: 'calc(100vh - 50px)'
      }}>
        <Outlet />
        
        <div style={{
          textAlign: 'center',
          padding: '20px 0',
          color: '#909399',
          fontSize: '12px'
        }}>
          Build Version: v1.0.0
        </div>
      </div>
    </div>
  )
}


