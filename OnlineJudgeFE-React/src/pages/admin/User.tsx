import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface User {
  id: number
  username: string
  email: string
  real_name: string
  admin_type: string
  create_time: string
  is_disabled: boolean
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await adminAPI.getUserList({
        offset: 0,
        limit: 100,
        keyword: keyword || undefined
      })
      setUsers(data.results || [])
    } catch (error) {
      console.error('加载用户失败:', error)
      toast.error('加载用户失败')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN')
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '4px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {/* 标题和操作栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e8eaec'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#303133' }}>用户管理</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索用户..."
              style={{
                padding: '8px 32px 8px 12px',
                border: '1px solid #dcdfe6',
                borderRadius: '4px',
                fontSize: '14px',
                width: '250px'
              }}
            />
            <Search size={16} style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#909399'
            }} />
          </div>
          <button style={{
            padding: '8px 20px',
            background: '#409eff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px'
          }}>
            <Plus size={16} />
            创建用户
          </button>
        </div>
      </div>

      {/* 表格 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8eaec' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>用户名</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>真实姓名</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>邮箱</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>权限</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399', fontSize: '14px' }}>创建时间</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399', fontSize: '14px', width: '150px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>{user.id}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#303133', fontWeight: 600 }}>{user.username}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>{user.real_name}</td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>{user.email}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: user.admin_type === 'Super Admin' ? '#f56c6c' : user.admin_type === 'Admin' ? '#e6a23c' : '#909399',
                  color: 'white'
                }}>
                  {user.admin_type}
                </span>
              </td>
              <td style={{ padding: '12px', fontSize: '14px', color: '#606266' }}>{formatTime(user.create_time)}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button style={{
                  padding: '4px 12px',
                  marginRight: '8px',
                  background: '#409eff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  <Edit size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  编辑
                </button>
                <button style={{
                  padding: '4px 12px',
                  background: '#f56c6c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  <Trash size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


