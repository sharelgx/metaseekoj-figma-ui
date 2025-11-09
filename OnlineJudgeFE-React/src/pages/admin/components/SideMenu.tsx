import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Menu, 
  Users, 
  Megaphone, 
  Settings, 
  Server,
  Trash2,
  Bot,
  FileText,
  Plus,
  Download,
  List,
  Trophy,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import { useState } from 'react'

export function SideMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState<string[]>(['general', 'problem', 'choice-question'])

  const menuItems = [
    {
      key: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/'
    },
    {
      key: 'general',
      icon: Menu,
      label: '通用管理',
      children: [
        { key: 'user', label: '用户管理', path: '/admin/user' },
        { key: 'role', label: '角色权限', path: '/admin/role-permissions' },
        { key: 'announcement', label: '公告管理', path: '/admin/announcement' },
        { key: 'conf', label: '系统配置', path: '/admin/conf' },
        { key: 'judge-server', label: '判题服务器', path: '/admin/judge-server' },
        { key: 'prune', label: '测试用例清理', path: '/admin/prune-test-case' },
        { key: 'ai-config', label: 'AI配置', path: '/admin/ai/config' }
      ]
    },
    {
      key: 'problem',
      icon: FileText,
      label: '题目管理',
      children: [
        { key: 'problem-list', label: '题目列表', path: '/admin/problems' },
        { key: 'create-problem', label: '创建题目', path: '/admin/problem/create' },
        { key: 'import-problem', label: '导入/导出', path: '/admin/problem/batch_ops' },
        { key: 'batch-collect', label: '批量采集', path: '/admin/problem/batch_collect' }
      ]
    },
    {
      key: 'choice-question',
      icon: List,
      label: '选择题管理',
      children: [
        { key: 'choice-list', label: '选择题列表', path: '/admin/choice-questions' },
        { key: 'create-choice', label: '创建选择题', path: '/admin/choice-question/create' },
        { key: 'import-choice', label: '批量导入', path: '/admin/choice-question/import' },
        { key: 'exam-papers', label: '试卷列表', path: '/admin/exam-papers' },
        { key: 'import-paper', label: '导入试卷', path: '/admin/exam-paper/import' },
        { key: 'category', label: '分类管理', path: '/admin/choice-question/category' },
        { key: 'tag', label: '标签管理', path: '/admin/choice-question/tag' },
        { key: 'topic', label: '专题管理', path: '/admin/topic/management' },
        { key: 'exam-stats', label: '考试统计', path: '/admin/exam-statistics' }
      ]
    },
    {
      key: 'contest',
      icon: Trophy,
      label: '竞赛管理',
      children: [
        { key: 'contest-list', label: '竞赛列表', path: '/admin/contest' },
        { key: 'create-contest', label: '创建竞赛', path: '/admin/contest/create' }
      ]
    },
    {
      key: 'homework',
      icon: BookOpen,
      label: '作业管理',
      children: [
        { key: 'class', label: '班级管理', path: '/admin/class-management' },
        { key: 'homework-list', label: '作业列表', path: '/admin/homework-list' }
      ]
    },
    {
      key: 'classroom',
      icon: GraduationCap,
      label: '智慧课堂',
      children: [
        { key: 'courses', label: '课程管理', path: '/admin/classroom/courses' },
        { key: 'documents', label: '文档管理', path: '/admin/classroom/documents' }
      ]
    }
  ]

  const toggleMenu = (key: string) => {
    setOpenMenus(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div style={{
      overflow: 'auto',
      width: '205px',
      height: '100%',
      position: 'fixed',
      zIndex: 100,
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: '#324157',
      color: '#fff'
    }}>
      {/* Logo */}
      <div style={{
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <img
          src="/assets/logo.svg"
          alt="oj admin"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          style={{
            backgroundColor: '#fff',
            borderRadius: '50%',
            border: '3px solid #fff',
            width: '75px',
            height: '75px'
          }}
        />
      </div>

      {/* 菜单项 */}
      <div>
        {menuItems.map(item => (
          <div key={item.key}>
            {item.children ? (
              // 有子菜单
              <div>
                <div
                  onClick={() => toggleMenu(item.key)}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#263445'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <item.icon size={16} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{
                    transition: 'transform 0.3s',
                    transform: openMenus.includes(item.key) ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </div>
                
                {/* 子菜单 */}
                {openMenus.includes(item.key) && (
                  <div style={{
                    backgroundColor: '#1f2d3d'
                  }}>
                    {item.children.map(child => (
                      <div
                        key={child.key}
                        onClick={() => navigate(child.path)}
                        style={{
                          padding: '12px 20px 12px 50px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: isActive(child.path) ? '#409eff' : 'rgba(255, 255, 255, 0.7)',
                          backgroundColor: isActive(child.path) ? '#001528' : 'transparent',
                          borderLeft: isActive(child.path) ? '3px solid #409eff' : '3px solid transparent',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(child.path)) {
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.backgroundColor = '#263445'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive(child.path)) {
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        {child.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // 无子菜单
              <div
                onClick={() => navigate(item.path!)}
                style={{
                  padding: '14px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: isActive(item.path!) ? '#409eff' : '#fff',
                  backgroundColor: isActive(item.path!) ? '#001528' : 'transparent',
                  borderLeft: isActive(item.path!) ? '3px solid #409eff' : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path!)) {
                    e.currentTarget.style.backgroundColor = '#263445'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path!)) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <item.icon size={16} />
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


