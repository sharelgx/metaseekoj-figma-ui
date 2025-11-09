import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const homeAPI = {
  // 获取统计数据
  getStatistics: () => api.get('/website/'),
  
  // 获取题目列表
  getProblems: (params?: { offset?: number; limit?: number; difficulty?: string }) => 
    api.get('/problem/', { params }),
  
  // 获取公告列表
  getAnnouncements: () => api.get('/announcement/'),
  
  // 获取用户信息
  getUserProfile: () => api.get('/profile/'),
}

export default api

