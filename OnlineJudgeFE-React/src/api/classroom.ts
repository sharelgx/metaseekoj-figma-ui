import axios from 'axios'
import Cookies from 'js-cookie'

// Axios 实例（使用相对路径，Vite 会代理到 8086）
const api = axios.create({
  baseURL: '/api/classroom',
  timeout: 60000, // 60秒，足够加载文档和幻灯片
  withCredentials: true,
})

// 请求拦截器 - 添加CSRF token
api.interceptors.request.use(
  (config) => {
    const csrftoken = Cookies.get('csrftoken')
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Classroom API Error:', error)
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    // 如果是401认证错误，给出更友好的提示
    if (error.response?.status === 401) {
      console.warn('未登录或登录已过期，请先登录 MetaSeekOJ 系统')
    }
    
    return Promise.reject(error)
  }
)

// ==================== 类型定义 ====================

export interface Course {
  id: number
  teacher: {
    id: number
    username: string
    email: string
  }
  title: string
  description: string
  course_type: 'scratch' | 'python' | 'cpp'
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  cover_url: string
  created_at: string
  updated_at: string
  is_published: boolean
}

export interface CreateCourseData {
  title: string
  description?: string
  course_type: 'scratch' | 'python' | 'cpp'
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  cover_url?: string
  is_published?: boolean
}

// ==================== API 函数 ====================

/**
 * 获取课程列表
 */
export const getCourses = async (): Promise<Course[]> => {
  return api.get('/courses/')
}

/**
 * 创建课程
 */
export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  return api.post('/courses/', data)
}

/**
 * 更新课程
 */
export const updateCourse = async (id: number, data: CreateCourseData): Promise<Course> => {
  return api.patch(`/courses/${id}/`, data)
}

/**
 * 获取课程详情
 */
export const getCourse = async (id: number): Promise<Course> => {
  return api.get(`/courses/${id}/`)
}

/**
 * 删除课程
 */
export const deleteCourse = async (id: number): Promise<void> => {
  return api.delete(`/courses/${id}/`)
}

/**
 * 获取文档的幻灯片列表
 */
export const getDocumentSlides = async (documentId: number): Promise<any[]> => {
  return api.get(`/documents/${documentId}/slides/`)
}

/**
 * 获取文档详情
 */
export const getDocument = async (documentId: number): Promise<any> => {
  return api.get(`/documents/${documentId}/`)
}

/**
 * 发布课程
 */
export const publishCourse = async (id: number): Promise<Course> => {
  return api.post(`/courses/${id}/publish/`)
}

/**
 * 取消发布课程
 */
export const unpublishCourse = async (id: number): Promise<Course> => {
  return api.post(`/courses/${id}/unpublish/`)
}

// ==================== 版本管理 API ====================

export interface DocumentVersion {
  id: number
  version_number: number
  title: string
  content_html: string
  content_markdown: string
  change_description: string
  created_at: string
  content_length?: number
}

export interface VersionListResponse {
  current_version: number
  versions: DocumentVersion[]
}

/**
 * 获取文档的所有版本历史
 */
export const getDocumentVersions = async (documentId: number): Promise<VersionListResponse> => {
  return api.get(`/documents/${documentId}/versions/`)
}

/**
 * 获取特定版本的完整内容
 */
export const getDocumentVersion = async (documentId: number, versionNumber: number): Promise<DocumentVersion> => {
  return api.get(`/documents/${documentId}/versions/${versionNumber}/`)
}

/**
 * 恢复到指定版本
 */
export const revertToVersion = async (documentId: number, versionNumber: number): Promise<any> => {
  return api.post(`/documents/${documentId}/versions/${versionNumber}/revert/`)
}

export default api

