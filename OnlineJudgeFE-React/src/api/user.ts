import axios from './axios'

export interface UserProfile {
  id: number
  username: string
  email: string
  real_name?: string
  avatar?: string
  mood?: string
  blog?: string
  github?: string
  school?: string
  major?: string
  language?: string
  accepted_number: number
  submission_number: number
  problems_status?: {
    problems: Record<string, number>
  }
}

export interface LoginData {
  username: string
  password: string
  tfa_code?: string
}

export interface RegisterData {
  username: string
  password: string
  email: string
  captcha: string
}

export const userAPI = {
  // 登录
  async login(data: LoginData) {
    const response = await axios.post('/login', data)
    return response.data
  },

  // 注册
  async register(data: RegisterData) {
    const response = await axios.post('/register', data)
    return response.data
  },

  // 退出登录
  async logout() {
    const response = await axios.get('/logout')
    return response.data
  },

  // 获取用户信息
  async getUserInfo(username?: string) {
    const response = await axios.get<{ error: null, data: UserProfile }>('/profile', {
      params: username ? { username } : {}
    })
    return response.data.data
  },

  // 更新用户信息
  async updateProfile(profile: Partial<UserProfile>) {
    const response = await axios.put('/profile', profile)
    return response.data.data
  },

  // 修改密码
  async changePwd(data: { old_password: string; new_password: string; tfa_code?: string }) {
    const response = await axios.post('/change_password', data)
    return response.data
  },

  // 上传头像
  async uploadAvatar(formData: FormData) {
    const response = await axios.post('/upload_avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // 获取验证码
  async getCaptcha() {
    const response = await axios.get('/captcha')
    return response.data
  },

  // 检查用户名或手机号
  async checkUsernameOrPhone(username: string, phone: string) {
    const response = await axios.post('/check_username_or_phone', {
      username,
      phone
    })
    return response.data
  }
}

