import axios from 'axios'

// 后端 API 基础 URL
const API_BASE_URL = 'http://localhost:8086/api/scratch'

// Axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 支持 Django Session 认证
})

// 从 cookie 中获取 CSRF token
function getCsrfToken(): string | null {
  const name = 'csrftoken'
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1]
  return cookieValue || null
}

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 为所有修改数据的请求添加 CSRF token
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// ==================== 类型定义 ====================

export interface ScratchProject {
  id?: number
  owner?: number
  title: string
  description?: string
  is_public: boolean
  data_json: any // Scratch 项目数据
  cover_url?: string
  thumbnail?: string // 缩略图 URL
  like_count?: number // 点赞数
  view_count?: number // 浏览量
  created_at?: string
  updated_at?: string
}

export interface ScratchAssignment {
  id?: number
  teacher?: number
  course_id?: number
  title: string
  description: string
  requirements?: string
  due_date?: string
  max_score: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface ScratchSubmission {
  id?: number
  assignment_id: number
  student?: number
  project_id: number
  status: 'pending' | 'reviewed'
  comment?: string
  submitted_at?: string
  updated_at?: string
}

export interface ScratchReview {
  id?: number
  submission_id: number
  score: number
  comment: string
  reviewed_at?: string
}

// ==================== 项目相关 API ====================

/**
 * 创建 Scratch 项目
 */
export const createProject = async (data: Partial<ScratchProject>): Promise<ScratchProject> => {
  return api.post('/projects/', data)
}

/**
 * 获取项目详情
 */
export const getProject = async (id: number): Promise<ScratchProject> => {
  return api.get(`/projects/${id}/`)
}

/**
 * 更新项目
 */
export const updateProject = async (id: number, data: Partial<ScratchProject>): Promise<ScratchProject> => {
  return api.put(`/projects/${id}/`, data)
}

/**
 * 部分更新项目（只更新部分字段）
 */
export const patchProject = async (id: number, data: Partial<ScratchProject>): Promise<ScratchProject> => {
  return api.patch(`/projects/${id}/`, data)
}

/**
 * 删除项目
 */
export const deleteProject = async (id: number): Promise<void> => {
  return api.delete(`/projects/${id}/`)
}

/**
 * 获取我的项目列表
 */
export const getMyProjects = async (): Promise<ScratchProject[]> => {
  return api.get('/mystuff/')
}

/**
 * 获取用户项目列表（getMyProjects 的别名）
 */
export const getUserProjects = getMyProjects

// ==================== 作业相关 API ====================

/**
 * 获取作业列表
 * @param role 'teacher' | 'student'
 * @param courseId 可选，课程ID
 */
export const getAssignments = async (role: 'teacher' | 'student', courseId?: number): Promise<ScratchAssignment[]> => {
  const params: any = { role }
  if (courseId) params.course_id = courseId
  return api.get('/assignments/', { params })
}

/**
 * 创建作业
 */
export const createAssignment = async (data: Partial<ScratchAssignment>): Promise<ScratchAssignment> => {
  return api.post('/assignments/', data)
}

/**
 * 获取作业详情
 */
export const getAssignment = async (id: number): Promise<ScratchAssignment> => {
  return api.get(`/assignments/${id}/`)
}

/**
 * 更新作业
 */
export const updateAssignment = async (id: number, data: Partial<ScratchAssignment>): Promise<ScratchAssignment> => {
  return api.put(`/assignments/${id}/`, data)
}

/**
 * 删除作业
 */
export const deleteAssignment = async (id: number): Promise<void> => {
  return api.delete(`/assignments/${id}/`)
}

// ==================== 提交相关 API ====================

/**
 * 获取提交列表
 * @param assignmentId 可选，作业ID
 */
export const getSubmissions = async (assignmentId?: number): Promise<ScratchSubmission[]> => {
  const params: any = {}
  if (assignmentId) params.assignment_id = assignmentId
  return api.get('/submissions/', { params })
}

/**
 * 提交作业
 */
export const submitAssignment = async (data: {
  assignment_id: number
  project_id: number
  comment?: string
}): Promise<ScratchSubmission> => {
  return api.post('/submissions/submit/', data)
}

/**
 * 获取提交详情
 */
export const getSubmission = async (id: number): Promise<ScratchSubmission> => {
  return api.get(`/submissions/${id}/`)
}

// ==================== 批改相关 API ====================

/**
 * 批改作业
 */
export const reviewSubmission = async (data: {
  submission_id: number
  score: number
  comment: string
}): Promise<ScratchReview> => {
  return api.post('/reviews/submit/', data)
}

/**
 * 获取批改详情
 */
export const getReview = async (id: number): Promise<ScratchReview> => {
  return api.get(`/reviews/${id}/`)
}

// ==================== 辅助函数 ====================

/**
 * 检查用户是否登录
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    await api.get('/mystuff/')
    return true
  } catch (error) {
    return false
  }
}

/**
 * 生成项目缩略图 URL（临时方案，使用占位图）
 */
export const getProjectThumbnail = (projectId: number): string => {
  return `https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Project+${projectId}`
}

export default api

