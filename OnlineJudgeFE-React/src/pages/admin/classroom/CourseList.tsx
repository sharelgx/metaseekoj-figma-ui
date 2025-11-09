import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Eye } from 'lucide-react'
import { adminAPI } from '@/api/admin'
import { toast } from 'sonner'

interface Course {
  id: number
  title: string
  description: string
  student_count: number
  lesson_count: number
  status: string
  create_time: string
}

export default function AdminCourseList() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await adminAPI.getCourseList({
        offset: 0,
        limit: 100
      })
      setCourses(data.results || [])
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败')
      setCourses([])
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '4px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e8eaec'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>课程管理</h2>
        <button style={{
          padding: '8px 20px',
          background: '#67c23a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Plus size={16} />
          创建课程
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>课程名称</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#909399' }}>描述</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>学生数</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>课时数</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>状态</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#909399' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id} style={{ borderBottom: '1px solid #e8eaec' }}>
              <td style={{ padding: '12px', color: '#409eff', fontWeight: 600 }}>{course.id}</td>
              <td style={{ padding: '12px', color: '#303133' }}>{course.title}</td>
              <td style={{ padding: '12px', color: '#606266' }}>{course.description}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{course.student_count}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#606266' }}>{course.lesson_count}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: course.status === 'active' ? '#67c23a' : '#909399',
                  color: 'white'
                }}>
                  {course.status === 'active' ? '已发布' : '草稿'}
                </span>
              </td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


