import { create } from 'zustand'
import axios from 'axios'

interface UserState {
  isAuthenticated: boolean
  user: any | null
  setUser: (user: any) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  user: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  checkAuth: async () => {
    // 8080兼容：检查localStorage中的'authed'标志
    try {
      console.log('🔑 开始检查认证状态...')
      
      // 1. 检查8080的authed标志
      const authedStr = localStorage.getItem('authed')
      console.log('🔑 authed标志:', authedStr)
      
      if (authedStr) {
        const isAuthed = JSON.parse(authedStr)
        console.log('🔑 isAuthed:', isAuthed)
        
        if (isAuthed) {
          // 2. 尝试获取用户信息
          try {
            const response = await axios.get('/profile/')
            console.log('🔑 获取用户信息成功:', response.data)
            
            if (response.data && response.data.data) {
              const user = response.data.data
              set({ user, isAuthenticated: true })
              console.log('✅ 用户认证成功:', user.username)
              return
            }
          } catch (error) {
            console.log('⚠️ 获取用户信息失败，但保持认证状态')
            // 即使获取用户信息失败，也保持认证状态（后端会处理）
            set({ isAuthenticated: true })
            return
          }
        }
      }
      
      console.log('❌ 未登录')
      set({ isAuthenticated: false, user: null })
    } catch (error) {
      console.error('❌ 检查认证状态失败:', error)
      set({ isAuthenticated: false, user: null })
    }
  }
}))

