/**
 * 点卡系统API接口
 */

import axios from 'axios'
import Cookies from 'js-cookie'

// 使用相对路径，通过Vite代理到8086端口
const api = axios.create({
  baseURL: '/api/classroom',
  timeout: 120000, // 增加到120秒，AI生成可能需要较长时间
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
    console.error('Credits API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    return Promise.reject(error.response?.data?.error || error.message)
  }
)

// ============== 类型定义 ==============

export interface UserCredits {
  id: number
  user_id: number
  available_credits: number
  total_earned_credits: number
  total_spent_credits: number
  last_transaction_at: string | null
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: number
  user_id: number
  transaction_type: 'consume' | 'recharge'
  amount: number
  balance_before: number
  balance_after: number
  description: string
  related_type: string | null
  related_id: number | null
  created_at: string
}

export interface CreditRule {
  id: number
  rule_type: string
  name: string
  description: string
  credits_required: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RechargePackage {
  id: number
  name: string
  credits_amount: number
  bonus_credits: number
  price: string
  description: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface CreditStatistics {
  available_credits: number
  total_earned: number
  total_spent: number
  transaction_count: number
  last_transaction: string | null
  this_month_spent: number
  top_consume_type: string | null
}

// ============== API函数 ==============

/**
 * 获取用户点卡余额
 */
export const getCreditsBalance = async (): Promise<UserCredits> => {
  return api.get('/credits/balance/')
}

/**
 * 获取用户点卡统计信息
 */
export const getCreditsStatistics = async (): Promise<CreditStatistics> => {
  return api.get('/credits/statistics/')
}

/**
 * 获取交易历史
 */
export const getCreditTransactionHistory = async (params?: {
  limit?: number
  transaction_type?: 'consume' | 'recharge'
}): Promise<CreditTransaction[]> => {
  return api.get('/credits/history/', { params })
}

/**
 * 消费点卡
 */
export const consumeCredits = async (data: {
  rule_type: string
  description?: string
  related_id?: number
}): Promise<{
  success: boolean
  credits_used: number
  balance_before: number
  balance_after: number
}> => {
  return api.post('/credits/consume/', data)
}

/**
 * 获取消费规则列表
 */
export const getCreditRules = async (): Promise<CreditRule[]> => {
  return api.get('/credits/rules/')
}

/**
 * 获取充值套餐列表
 */
export const getRechargePackages = async (): Promise<RechargePackage[]> => {
  return api.get('/credits/packages/')
}

/**
 * AI对话（生成或编辑课件）
 */
export const aiChat = async (data: {
  message: string
  conversation_history?: Array<{ role: string; content: string }>
  course_id?: number
  rule_type?: string
}): Promise<{
  success: boolean
  ai_response: string
  credits_used: number
  remaining_credits: number
  conversation_id?: string
}> => {
  return api.post('/ai/chat/', data)
}

/**
 * AI生成完整课件
 */
export const aiGenerateCourse = async (data: {
  course_id: number
  topic?: string
  requirements?: string
  conversation?: Array<{ role: string; content: string }>
}): Promise<{
  success: boolean
  course: any
  document_id: number
  content_markdown?: string
  slides_count: number
  flashcards_count: number
  credits_used: number
}> => {
  return api.post('/ai/generate/', data)
}

/**
 * AI编辑课件
 */
export const aiEditCourse = async (data: {
  document_id: number
  edit_request: string
}): Promise<{
  success: boolean
  updated_document: any
  slides_count: number
  credits_used: number
  remaining_credits: number
}> => {
  return api.post('/ai/edit/', data)
}

/**
 * AI生成闪卡
 */
export const aiGenerateFlashcards = async (data: {
  course_id: number
  topic: string
  count?: number
}): Promise<{
  success: boolean
  flashcards: any[]
  count: number
  credits_used: number
  remaining_credits: number
}> => {
  return api.post('/ai/flashcards/', data)
}

