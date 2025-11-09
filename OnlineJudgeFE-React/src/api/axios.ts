import axios from 'axios'

// 基础配置
axios.defaults.baseURL = '/api'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true
axios.defaults.timeout = 30000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.withCredentials = true
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    console.log(`🌐 Request: ${config.method?.toUpperCase()} ${config.url}`, config)
    return config
  },
  error => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    console.log(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    
    // 如果是Blob响应，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 如果响应是数组，直接返回
    if (Array.isArray(response.data)) {
      return response
    }
    
    // 检查是否有error字段
    if (response.data.error !== null && response.data.error !== undefined) {
      console.error(`⚠️ API Error: ${response.config.url}`, response.data.data)
      
      // 检查是否是认证错误
      if (response.data.data && typeof response.data.data === 'string' &&
          (response.data.data.startsWith('Please login') || response.data.data.includes('请先登录'))) {
        const authError: any = new Error('Authentication required')
        authError.isAuthError = true
        authError.originalData = response.data.data
        return Promise.reject(authError)
      }
      
      return Promise.reject(response.data)
    }
    
    return response
  },
  error => {
    console.error('❌ Response error:', error)
    
    if (error.response) {
      // 服务器返回错误状态码
      if (error.response.status === 401) {
        console.log('🔒 Unauthorized, redirecting to login...')
        // 不直接跳转，让组件处理
      } else if (error.response.status === 403) {
        console.log('🚫 Forbidden')
      } else if (error.response.status === 404) {
        console.log('🔍 Not Found')
      } else if (error.response.status >= 500) {
        console.log('💥 Server Error')
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.log('📡 No response received')
    } else {
      // 请求配置出错
      console.log('⚙️ Request setup error')
    }
    
    return Promise.reject(error)
  }
)

export default axios

