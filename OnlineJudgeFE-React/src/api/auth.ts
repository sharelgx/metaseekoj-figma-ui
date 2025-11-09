/**
 * 认证API - 用户系统适配器
 * 
 * 支持两种模式：
 * 1. integrated: 使用MetaSeekOJ用户系统
 * 2. standalone: 使用独立用户系统
 */

import axios from 'axios'
import Cookies from 'js-cookie'
import { getAvatarUrl, DEFAULT_AVATAR_URL } from '@/utils/avatar'

// API配置 - 可通过环境变量切换
const API_MODE = import.meta.env.VITE_DEPLOYMENT_MODE || 'integrated'

const getAuthApiBase = () => {
  if (API_MODE === 'integrated') {
    // 集成模式：使用MetaSeekOJ的API
    return '/api'
  } else {
    // 独立模式：使用自己的API
    return '/api/classroom'
  }
}

const authApi = axios.create({
  baseURL: getAuthApiBase(),
  timeout: 30000,
  withCredentials: true,
})

// 请求拦截器 - 添加CSRF token
authApi.interceptors.request.use(
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
authApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Auth API Error:', error)
    return Promise.reject(error.response?.data?.error || error.message)
  }
)

// ============== 用户信息接口 ==============

export interface UserProfile {
  id: number
  username: string
  real_name?: string
  email?: string
  avatar?: string  // 头像URL
  user_type?: string  // 用户类型（Teacher/Student/Admin）
  is_admin?: boolean
  created_at?: string
}

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    if (API_MODE === 'integrated') {
      // 集成模式：调用MetaSeekOJ的profile接口
      const response = await authApi.get('/profile')
      const username = response.data.user?.username || response.data.username
      const rawAvatar = response.data.user?.avatar || response.data.avatar

      const avatar = rawAvatar
        ? getAvatarUrl(rawAvatar, username)
        : (getDefaultAvatar(username) || DEFAULT_AVATAR_URL)

      return {
        id: response.data.id,
        username: username,
        real_name: response.data.user?.real_name || response.data.real_name,
        email: response.data.user?.email || response.data.email,
        avatar: avatar,
        user_type: response.data.user?.user_type,
        is_admin: response.data.user?.is_super_admin || false,
      }
    } else {
      // 独立模式：调用自己的用户接口
      const response = await authApi.get('/users/me/')
      return {
        id: response.id,
        username: response.username,
        real_name: response.real_name,
        email: response.email,
        avatar: response.avatar ? getAvatarUrl(response.avatar, response.username) : (getDefaultAvatar(response.username) || DEFAULT_AVATAR_URL),
        user_type: response.user_type,
        is_admin: response.is_admin,
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 生成默认头像（使用用户名首字母）
 */
export const getDefaultAvatar = (username: string): string => {
  if (!username || username.length === 0) {
    username = 'U'  // 默认字母
  }
  
  const firstLetter = username.charAt(0).toUpperCase()
  
  // 生成SVG（直接内嵌，不用base64）
  const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#374151"/><text x="16" y="22" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">${firstLetter}</text></svg>`
  
  // 使用encodeURIComponent而不是btoa（支持中文）
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * 检查登录状态
 */
export const checkLoginStatus = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    return user !== null
  } catch {
    return false
  }
}

/**
 * 登出
 */
export const logout = async (): Promise<void> => {
  try {
    if (API_MODE === 'integrated') {
      await authApi.get('/logout')
    } else {
      await authApi.post('/users/logout/')
    }
  } catch (error) {
    console.error('登出失败:', error)
  }
}

/**
 * 登录（仅独立模式）
 */
export const login = async (username: string, password: string): Promise<UserProfile> => {
  if (API_MODE === 'integrated') {
    throw new Error('集成模式请使用MetaSeekOJ登录页面')
  }
  
  const response = await authApi.post('/users/login/', {
    username,
    password
  })
  
  return response
}

/**
 * 注册（仅独立模式）
 */
export const register = async (data: {
  username: string
  password: string
  email: string
  real_name?: string
}): Promise<UserProfile> => {
  if (API_MODE === 'integrated') {
    throw new Error('集成模式请使用MetaSeekOJ注册页面')
  }
  
  const response = await authApi.post('/users/register/', data)
  return response
}

export default authApi

