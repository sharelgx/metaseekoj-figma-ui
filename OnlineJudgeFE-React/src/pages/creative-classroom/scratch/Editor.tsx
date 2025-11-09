import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { User, LogIn, UserPlus, LogOut, FolderOpen, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createProject, updateProject, getProject, patchProject, ScratchProject } from '@/api/scratch'

// Scratch 编辑器基础 URL
const SCRATCH_EDITOR_BASE_URL = 'http://localhost:8601'

export default function ScratchEditor() {
  const { id } = useParams() // 项目 ID（编辑模式）
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [vmReady, setVmReady] = useState(false)
  
  // 使用 ref 存储最新的状态值（避免闭包陷阱）
  const isLoggedInRef = useRef(false)
  const iframeLoadedRef = useRef(false)
  const vmReadyRef = useRef(false)
  const loadedProjectIdRef = useRef<number | null>(null) // 跟踪已加载的项目 ID，防止重复加载
  const titleRequestResolverRef = useRef<((value: string) => void) | null>(null)
  const titleRequestTimeoutRef = useRef<number | null>(null)
  const latestTitleRef = useRef('')
  
  // 使用固定 URL，避免每次挂载都重新加载 iframe
  const scratchEditorUrl = SCRATCH_EDITOR_BASE_URL

  const [project, setProject] = useState<ScratchProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showRemixDialog, setShowRemixDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  
  // 🔧 【优化】用户信息初始化完成标志（用于控制 iframe 渲染时机）
  const [isInitialized, setIsInitialized] = useState(false)
  const [isUserInfoReady, setIsUserInfoReady] = useState(false)

  // 表单状态
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    latestTitleRef.current = title
  }, [title])

  const applyTitleUpdate = useCallback((incomingTitle: string) => {
    const trimmed = typeof incomingTitle === 'string' ? incomingTitle.trim() : ''
    const fallbackTitle = trimmed || latestTitleRef.current.trim() || '未命名项目'

    setTitle(prev => {
      if ((prev || '').trim() === fallbackTitle) {
        return prev
      }
      return fallbackTitle
    })

    setProject(prev => (prev ? { ...prev, title: fallbackTitle } : prev))

    latestTitleRef.current = fallbackTitle

    return fallbackTitle
  }, [setProject, setTitle])

  const requestProjectTitle = useCallback(() => {
    return new Promise<string>((resolve) => {
      const fallbackTitle = latestTitleRef.current.trim() || '未命名项目'

      if (!iframeRef.current?.contentWindow) {
        resolve(fallbackTitle)
        return
      }

      const resolver = (value: string) => {
        if (titleRequestTimeoutRef.current) {
          window.clearTimeout(titleRequestTimeoutRef.current)
          titleRequestTimeoutRef.current = null
        }
        if (titleRequestResolverRef.current === resolver) {
          titleRequestResolverRef.current = null
        }
        const finalTitle = applyTitleUpdate(value)
        resolve(finalTitle)
      }

      titleRequestResolverRef.current = resolver

      const success = (() => {
        try {
          iframeRef.current?.contentWindow?.postMessage({
            type: 'REQUEST_PROJECT_TITLE'
          }, SCRATCH_EDITOR_BASE_URL)
          return true
        } catch (error) {
          console.error('❌ 请求项目标题失败:', error)
          return false
        }
      })()

      if (!success) {
        titleRequestResolverRef.current = null
        resolve(fallbackTitle)
        return
      }

      titleRequestTimeoutRef.current = window.setTimeout(() => {
        if (titleRequestResolverRef.current) {
          titleRequestResolverRef.current = null
          titleRequestTimeoutRef.current = null
          resolve(fallbackTitle)
        }
      }, 2000)
    })
  }, [applyTitleUpdate])

  useEffect(() => {
    return () => {
      if (titleRequestTimeoutRef.current) {
        window.clearTimeout(titleRequestTimeoutRef.current)
        titleRequestTimeoutRef.current = null
      }
      titleRequestResolverRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!showSettingsDialog) return

    requestProjectTitle()
      .then(title => {
        if (title) {
          applyTitleUpdate(title)
        }
      })
      .catch(error => {
        console.warn('⚠️ 打开设置对话框时获取标题失败:', error)
      })
  }, [showSettingsDialog, requestProjectTitle, applyTitleUpdate])

  useEffect(() => {
    if (!iframeLoaded) return

    const iframeWindow = iframeRef.current?.contentWindow
    if (!iframeWindow) return

    const titleToSend = (project?.title || '').trim()
    if (!titleToSend) return

    try {
      iframeWindow.postMessage({
        type: 'SET_PROJECT_TITLE',
        data: {
          title: titleToSend,
          timestamp: new Date().toISOString()
        }
      }, SCRATCH_EDITOR_BASE_URL)
    } catch (error) {
      console.warn('⚠️ 无法向 iframe 发送标题更新:', error)
    }
  }, [iframeLoaded, project?.title, project?.id])

  /**
   * 检查用户是否登录
   */
  const checkLoginStatus = useCallback(async () => {
    try {
      console.log('[Auth] 正在检查登录状态...');
      const response = await fetch('http://localhost:8086/api/profile/', {
        credentials: 'include'
      });
      
      console.log('[Auth] API 响应状态:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('[Auth] API 返回数据:', result);
        
        // API 返回格式：{error: null, data: {user: {...}, real_name: "...", avatar: "..."}}
        if (result.error === null && result.data) {
          const username = result.data.real_name || result.data.user?.username || '用户';
          const avatar = result.data.avatar ? `http://localhost:8086${result.data.avatar}` : '';
          
          const userInfo = {
            isLoggedIn: true,
            username: username,
            avatarUrl: avatar || null
          };
          
          // 立即设置全局状态
          (window as any).__scratchUserInfo = userInfo;
          
          // 更新 React 状态
          setIsLoggedIn(true);
          isLoggedInRef.current = true;
          setUsername(username);
          setAvatarUrl(avatar);
          
          console.log('[Auth] 用户登录成功:', username);
          setIsUserInfoReady(true);
        } else {
          // 用户未登录
          (window as any).__scratchUserInfo = { isLoggedIn: false, username: null, avatarUrl: null };
          setIsLoggedIn(false);
          isLoggedInRef.current = false;
          setUsername('');
          setAvatarUrl('');
          console.log('[Auth] 用户未登录');
          setIsUserInfoReady(true);
        }
      } else {
        // API 响应异常
        (window as any).__scratchUserInfo = { isLoggedIn: false, username: null, avatarUrl: null };
        setIsLoggedIn(false);
        isLoggedInRef.current = false;
        setUsername('');
        setAvatarUrl('');
        console.log('[Auth] API 响应异常:', response.status);
        setIsUserInfoReady(true);
      }
    } catch (error) {
      console.error('[Auth] 获取用户信息失败:', error);
      (window as any).__scratchUserInfo = { isLoggedIn: false, username: null, avatarUrl: null };
      setIsLoggedIn(false);
      isLoggedInRef.current = false;
      setUsername('');
      setAvatarUrl('');
      setIsUserInfoReady(true);
    }
  }, [])

  // 加载项目（需要等待 iframe 和 VM 都准备好）
  // 参考官方 Project Loading States 文档
  useEffect(() => {
    console.log('[LoadProject] useEffect 触发', {
      id,
      vmReady,
      iframeLoaded,
      hasProject: !!project,
      projectId: project?.id
    })
    
    if (id && vmReady && iframeLoaded && !project) {
      console.log('[LoadProject] 条件满足，开始加载项目:', id)
      loadProject(parseInt(id))
    } else if (!id) {
      // 新建项目
      console.log('[LoadProject] 无 ID，初始化新项目')
      setTitle('未命名项目')
      setDescription('')
      setIsPublic(false)
      setProject(null)
      loadedProjectIdRef.current = null // 清理已加载标记
    }
  }, [id, vmReady, iframeLoaded, project])

  // 当项目数据和 VM 都准备好时，自动发送到 iframe
  // 参考官方 LOADING_VM_WITH_ID → SHOWING_WITH_ID 状态转换
  useEffect(() => {
    console.log('[SendProject] useEffect 触发', {
      hasProjectData: !!project?.data_json,
      vmReady,
      hasIframe: !!iframeRef.current?.contentWindow,
      projectId: project?.id,
      loadedProjectId: loadedProjectIdRef.current
    })
    
    if (!project?.data_json || !vmReady) {
      return
    }
    
    // 防止重复加载同一个项目（比如保存后 project state 更新但 id 没变）
    if (project.id && loadedProjectIdRef.current === project.id) {
      console.log('[SendProject] 跳过重复加载，项目', project.id, '已加载')
      return
    }
    
    // 严格验证 iframe（防止指向错误的窗口）
    const iframe = iframeRef.current
    if (!iframe) {
      console.error('[SendProject] iframe ref 为空')
      return
    }
    
    // 验证 iframe src
    if (!iframe.src || !iframe.src.includes('8601')) {
      console.error('[SendProject] iframe src 不正确:', iframe.src)
      return
    }
    
    const targetWindow = iframe.contentWindow
    if (!targetWindow) {
      console.error('[SendProject] iframe contentWindow 为空')
      return
    }
    
    console.log('[SendProject] iframe 验证通过，准备发送项目数据')
    console.log('[SendProject] iframe.src:', iframe.src)
    console.log('[SendProject] 项目 ID:', project.id)
    
    try {
      // 发送项目数据
      targetWindow.postMessage({
        type: 'LOAD_PROJECT',
        data: project.data_json
      }, 'http://localhost:8601')
      
      // 记录已加载的项目 ID
      loadedProjectIdRef.current = project.id || null
      console.log('[SendProject] 项目已发送，更新 loadedProjectIdRef 为:', loadedProjectIdRef.current)
    } catch (error) {
      console.error('[SendProject] postMessage 失败:', error)
    }
  }, [project, vmReady])

  // 组件加载时初始化用户信息，完成后再渲染 iframe
  useEffect(() => {
    const initUserInfo = async () => {
      // HMR 防护：如果已经初始化过且用户已登录，保持原有信息
      const existingUserInfo = (window as any).__scratchUserInfo
      if (existingUserInfo && existingUserInfo.isLoggedIn) {
        setIsInitialized(true)
        setIsLoggedIn(true)
        setUsername(existingUserInfo.username)
        setAvatarUrl(existingUserInfo.avatarUrl || '')
        setIsUserInfoReady(true)
        return
      }
      
      // 1. 标记为待获取，防止 iframe 误以为未登录
      (window as any).__scratchUserInfo = {
        isLoggedIn: null,
        username: null,
        avatarUrl: null
      };
      setIsUserInfoReady(false)
      
      // 2. 异步获取真实用户信息
      await checkLoginStatus();
      
      // 3. 标记初始化完成，允许渲染 iframe
      setIsInitialized(true);
    };
    
    initUserInfo();
  }, [checkLoginStatus]);

  // 定义发送用户信息到 iframe 的函数（参考官方 vm-listener-hoc 模式）
  const sendUserInfo = useCallback(() => {
    if (!isUserInfoReady) {
      console.log('[Auth] 用户信息尚未准备好，跳过 sendUserInfo');
      return;
    }

    // 直接从 window.__scratchUserInfo 读取最新值
    const latestUserInfo = (window as any).__scratchUserInfo || {
      isLoggedIn: false,
      username: null,
      avatarUrl: null
    };

    if (latestUserInfo.isLoggedIn === null) {
      console.log('[Auth] 用户信息仍在加载，暂不发送到 iframe');
      return;
    }
    
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'USER_INFO_UPDATE',
        data: latestUserInfo
      }, 'http://localhost:8601');
    }
  }, [isUserInfoReady])

  // 向 Scratch 编辑器提供用户信息（模拟官方的 componentDidUpdate）
  useEffect(() => {
    // 存储 sendUserInfo 函数的引用，供 message 监听器使用
    (window as any).__sendUserInfoRef = sendUserInfo;
    
    // 只有在 iframe 加载完成后才发送消息
    if (!iframeLoaded || !isUserInfoReady) {
      return;
    }
    
    // React state 更新后自动发送（模拟 componentDidUpdate）
    sendUserInfo();
  }, [isLoggedIn, username, avatarUrl, iframeLoaded, isUserInfoReady, sendUserInfo])

  // 注册全局刷新用户信息函数（供 iframe 调用）
  useEffect(() => {
    (window as any).refreshUserInfo = () => {
      console.log('🔄 收到 iframe 的刷新请求，立即检查登录状态...')
      checkLoginStatus()
    }
    
    return () => {
      delete (window as any).refreshUserInfo
    }
  }, [checkLoginStatus])

  // 监听来自 iframe 的消息
  useEffect(() => {
    console.log('========================================')
    console.log('✅ 父窗口 message 监听器已注册')
    console.log('========================================')
    
    const handleMessage = (event: MessageEvent) => {
      // 安全检查：确保消息来自 localhost
      if (!event.origin.includes('localhost')) {
        return
      }

      // 🔧 优化：简化日志，只显示关键信息
      if (event.data && typeof event.data === 'object' && event.data.type) {
        console.log(`📬 收到消息: ${event.data.type} (来自 ${event.origin})`)
      }

      // 处理保存请求（从 Scratch 编辑器菜单点击"立即保存"）
      if (event.data && event.data.type === 'SCRATCH_SAVE_REQUEST') {
        console.log('💾 收到 iframe 的保存请求')
        // 使用全局函数引用
        if ((window as any).scratchSaveHandler) {
          (window as any).scratchSaveHandler()
        }
      }

      // 处理退出登录请求
      if (event.data && event.data.type === 'SCRATCH_LOGOUT_REQUEST') {
        console.log('🚪 收到 iframe 的退出登录请求')
        // 使用全局函数引用
        if ((window as any).scratchLogoutHandler) {
          (window as any).scratchLogoutHandler()
        }
      }

      // 处理登录成功通知
      if (event.data && event.data.type === 'SCRATCH_LOGIN_SUCCESS') {
        console.log('[Auth] 收到 iframe 的登录成功通知')
        console.log('[Auth] 刷新用户信息...')
        // 重新检查登录状态，然后通知 iframe
        checkLoginStatus().then(() => {
          console.log('[Auth] 用户信息已更新，通知 iframe...')
          sendUserInfo()
        })
      }

      // 处理用户信息更新确认
      if (event.data && event.data.type === 'USER_INFO_UPDATE_ACK') {
        console.log('✅ iframe 已确认收到用户信息更新:', event.data.data)
      }

      if (event.data && event.data.type === 'SCRATCH_PROJECT_TITLE_UPDATE') {
        const incomingTitle = event.data.data?.title ?? ''
        if (titleRequestResolverRef.current) {
          titleRequestResolverRef.current(incomingTitle)
        } else {
          applyTitleUpdate(incomingTitle)
        }
      }

      if (event.data && event.data.type === 'PROJECT_TITLE_RESPONSE') {
        const incomingTitle = event.data.data?.title ?? ''
        if (titleRequestResolverRef.current) {
          titleRequestResolverRef.current(incomingTitle)
        } else {
          if (titleRequestTimeoutRef.current) {
            window.clearTimeout(titleRequestTimeoutRef.current)
            titleRequestTimeoutRef.current = null
          }
          applyTitleUpdate(incomingTitle)
        }
      }

      // 处理项目加载确认
      if (event.data && event.data.type === 'LOAD_PROJECT_ACK') {
        if (event.data.data.success) {
          console.log('✅ iframe 已确认项目加载成功')
        } else {
          console.error('❌ iframe 项目加载失败:', event.data.data.error)
          toast.error('项目加载失败：' + event.data.data.error)
        }
      }

        // 处理 iframe 监听器就绪通知
        if (event.data && event.data.type === 'IFRAME_READY') {
          console.log('========================================')
          console.log('🎉 iframe 监听器已就绪！')
          console.log('⏰ 时间戳:', event.data.data.timestamp)
          console.log('========================================')
          
          // 🔧 修复：延迟发送，确保最新的登录状态已同步
          setTimeout(() => {
            console.log('📨 延迟发送最新用户信息给 iframe（响应 IFRAME_READY）')
            const currentUserInfo = (window as any).__scratchUserInfo
            console.log('📦 当前用户信息:', currentUserInfo)
            
            if ((window as any).__sendUserInfoRef) {
              (window as any).__sendUserInfoRef()
            } else {
              console.warn('⚠️ __sendUserInfoRef 未定义')
            }

            requestProjectTitle().catch(error => {
              console.warn('⚠️ 获取项目标题失败（IFRAME_READY 后）:', error)
            })
          }, 200)
        }

      // 处理 Scratch VM 就绪通知
      if (event.data && event.data.type === 'SCRATCH_VM_READY') {
        console.log('🎉 Scratch VM 已初始化并就绪！')
        console.log('⏰ 时间戳:', event.data.data.timestamp)
        setVmReady(true)
        vmReadyRef.current = true  // 同步更新 ref
        toast.success('Scratch 编辑器已就绪', { duration: 1000 })
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [checkLoginStatus, sendUserInfo, applyTitleUpdate, requestProjectTitle])

  // 注册全局处理器，让 Scratch 编辑器能调用我们的功能
  useEffect(() => {
    // 保存处理器（立即保存）
    (window as any).scratchSaveHandler = () => {
      if (!project?.id) {
        void handleSave()
      } else {
        void handleQuickSave()
      }
    }

    // 保存到线上处理器（新增）
    (window as any).scratchSaveToOnlineHandler = () => {
      handleSaveToOnline()
    }

    // 新建项目处理器
    (window as any).scratchNewHandler = () => {
      handleNewProject()
    }

    // 改编处理器
    (window as any).scratchRemixHandler = () => {
      handleRemix()
    }

    // 登录处理器
    (window as any).scratchLoginHandler = () => {
      handleLogin()
    }

    // 注册处理器
    (window as any).scratchRegisterHandler = () => {
      handleRegister()
    }

    // 登出处理器
    (window as any).scratchLogoutHandler = () => {
      handleLogout()
    }

    // 项目数据导出器
    (window as any).scratchExportProject = () => {
      return getScratchProjectData()
    }

    // 清理
    return () => {
      delete (window as any).scratchSaveHandler
      delete (window as any).scratchSaveToOnlineHandler
      delete (window as any).scratchNewHandler
      delete (window as any).scratchRemixHandler
      delete (window as any).scratchLoginHandler
      delete (window as any).scratchRegisterHandler
      delete (window as any).scratchLogoutHandler
      delete (window as any).scratchExportProject
    }
  }, [project, isLoggedIn])

  /**
   * 加载项目数据（参考官方 FETCHING_WITH_ID 状态）
   * 只负责获取数据并保存到 state，发送到 VM 由 useEffect 统一管理
   */
  const loadProject = async (projectId: number) => {
    setIsLoading(true)
    try {
      const data = await getProject(projectId)
      
      if (!data.data_json) {
        toast.error('项目数据为空')
        return
      }
      
      // 保存到 state（进入 LOADING_VM_WITH_ID 状态）
      setProject(data)
      setTitle(data.title)
      setDescription(data.description || '')
      setIsPublic(data.is_public)
      
      // 标记为待加载（将在 useEffect 中发送）
      loadedProjectIdRef.current = null
      
      // 项目数据发送由 useEffect 管理，这里只负责获取
      toast.success('项目加载成功', { duration: 2000 })
    } catch (error: any) {
      console.error('❌ 加载项目失败:', error)
      toast.error('加载项目失败：' + (error.response?.data?.detail || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 从 Scratch 编辑器获取项目数据（通过 postMessage）
   */
  const getScratchProjectData = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log('🔍 开始获取 Scratch 项目数据...')
      
      if (!iframeRef.current?.contentWindow) {
        console.error('❌ iframe 未准备好')
        reject(new Error('Scratch 编辑器未初始化'))
        return
      }

      console.log('✅ iframe 已准备好，发送导出请求...')
      
      // 🔧 优化：减少超时时间到5秒（VM就绪时导出应该很快）
      const timeout = setTimeout(() => {
        window.removeEventListener('message', messageHandler)
        console.error('❌ 获取项目数据超时（5秒）')
        reject(new Error('导出超时，请重试'))
      }, 5000) // 5秒超时
      
      // 监听响应
      const messageHandler = (event: MessageEvent) => {
        // 🔧 优化：简化日志
        if (!event.origin.includes('localhost')) return
        
        if (event.data && event.data.type === 'EXPORT_PROJECT_RESPONSE') {
          console.log('✅ 收到导出响应')
          clearTimeout(timeout)
          window.removeEventListener('message', messageHandler)
          
          const projectData = event.data.data
          
          if (!projectData) {
            console.error('❌ 导出的项目数据为空')
            reject(new Error('无法导出项目数据'))
            return
          }
          
          console.log('📦 项目数据:', JSON.stringify(projectData).length, '字节')
          resolve(projectData)
        }
      }
      
      window.addEventListener('message', messageHandler)
      
      // 通过 postMessage 请求导出
      console.log('📨 向 iframe 发送导出请求...')
      iframeRef.current.contentWindow.postMessage({
        type: 'EXPORT_PROJECT_REQUEST'
      }, 'http://localhost:8601')
      
      console.log('⏳ 等待 iframe 响应（最多 10 秒）...')
    })
  }

  /**
   * 从 Scratch 编辑器获取舞台截图（用作缩略图）
   */
  const getScratchThumbnail = (): Promise<string | null> => {
    return new Promise((resolve) => {
      console.log('📸 开始获取 Scratch 舞台截图...')
      
      if (!iframeRef.current?.contentWindow) {
        console.error('❌ iframe 未准备好')
        resolve(null)
        return
      }
      
      // 🔧 优化：减少缩略图超时到3秒（截图应该很快，且非必需）
      const timeout = setTimeout(() => {
        window.removeEventListener('message', messageHandler)
        console.warn('⏰ 获取缩略图超时（3秒），继续保存项目')
        resolve(null)
      }, 3000) // 3秒超时（缩略图不是必需的）
      
      // 监听响应
      const messageHandler = (event: MessageEvent) => {
        if (!event.origin.includes('localhost')) return
        
        if (event.data && event.data.type === 'THUMBNAIL_RESPONSE') {
          clearTimeout(timeout)
          window.removeEventListener('message', messageHandler)
          
          const thumbnail = event.data.data
          
          if (thumbnail) {
            console.log('✅ 成功获取缩略图')
            resolve(thumbnail)
          } else {
            console.warn('⚠️ 缩略图为空')
            resolve(null)
          }
        }
      }
      
      window.addEventListener('message', messageHandler)
      
      // 通过 postMessage 请求缩略图
      console.log('📨 向 iframe 发送缩略图请求...')
      iframeRef.current.contentWindow.postMessage({
        type: 'GET_THUMBNAIL'
      }, 'http://localhost:8601')
      
      console.log('⏳ 等待缩略图响应（最多 5 秒）...')
    })
  }

  /**
   * 保存项目
   */
  const handleSave = async () => {
    const finalTitle = (await requestProjectTitle()).trim() || '未命名项目'

    setIsSaving(true)
    try {
      // 获取 Scratch 项目数据
      let projectData = await getScratchProjectData()
      
      // 🔧 修复：如果是字符串，解析为对象
      if (typeof projectData === 'string') {
        try {
          projectData = JSON.parse(projectData)
        } catch (e) {
          console.error('❌ 项目数据解析失败:', e)
          throw new Error('项目数据格式错误')
        }
      }
      
      // 验证数据有效性
      if (!projectData || !projectData.targets) {
        console.error('❌ 项目数据无效')
        throw new Error('项目数据无效')
      }
      
      // 获取舞台截图作为缩略图（不阻塞保存流程）
      const thumbnail = await getScratchThumbnail()

      const payload: Partial<ScratchProject> = {
        title: finalTitle,
        description: description.trim(),
        is_public: isPublic,
        data_json: projectData,
      }
      
      // 如果成功获取缩略图，添加到 payload
      if (thumbnail) {
        payload.cover_url = thumbnail
      }

      // 🔧 最终检查：确保 data_json 是对象
      if (typeof payload.data_json === 'string') {
        console.error('❌ 数据格式错误：data_json 是字符串')
        throw new Error('项目数据格式错误')
      }

      let savedProject: ScratchProject

      if (project?.id) {
        // 更新现有项目
        savedProject = await updateProject(project.id, payload)
        toast.success('项目保存成功', { duration: 2000 })
      } else {
        // 创建新项目
        savedProject = await createProject(payload)
        toast.success('项目创建成功', { duration: 2000 })
        
        // 更新 URL 但不重新加载页面
        window.history.replaceState(null, '', `/classroom/scratch/editor/${savedProject.id}`)
      }

      // 更新 project state 并标记为已加载（防止 useEffect 重复加载）
      setProject(savedProject)
      loadedProjectIdRef.current = savedProject.id ?? null
    } catch (error: any) {
      console.error('❌ 保存项目失败:', error)
      console.error('❌ 错误详情:', error.response?.data)
      toast.error('保存失败：' + (error.response?.data?.detail || error.message))
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 快速保存（不弹窗）
   */
  const handleQuickSave = async () => {
    if (!project?.id) {
      await handleSave()
      return
    }

    setIsSaving(true)
    try {
      let projectData = await getScratchProjectData()
      
      // 🔧 修复：如果是字符串，解析为对象
      if (typeof projectData === 'string') {
        try {
          projectData = JSON.parse(projectData)
        } catch (e) {
          console.error('❌ 项目数据解析失败:', e)
          throw new Error('项目数据格式错误')
        }
      }
      
      // 验证数据有效性
      if (!projectData || !projectData.targets) {
        console.error('❌ 项目数据无效')
        throw new Error('项目数据无效')
      }
      
      // 同时更新缩略图
      const thumbnail = await getScratchThumbnail()
      
      const finalTitle = (await requestProjectTitle()).trim() || '未命名项目'

      const payload: any = {
        data_json: projectData,
        title: finalTitle,
      }
      
      if (thumbnail) {
        payload.cover_url = thumbnail
      }
      
      // 🔧 最终检查：确保 data_json 是对象
      if (typeof payload.data_json === 'string') {
        console.error('❌ 数据格式错误：data_json 是字符串')
        throw new Error('数据格式错误')
      }
      
      await patchProject(project.id, payload)
      
      toast.success('保存成功', { duration: 2000 })
    } catch (error: any) {
      console.error('❌ 快速保存失败:', error)
      console.error('❌ 错误详情:', error.response?.data)
      toast.error('保存失败：' + (error.response?.data?.detail || error.message))
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 运行项目
   */
  const handleRun = () => {
    // Scratch 编辑器自带运行功能
    toast.info('点击编辑器内的绿旗运行项目')
  }

  /**
   * 分享项目
   */
  const handleShare = () => {
    if (!project?.id) {
      toast.error('请先保存项目')
      return
    }
    
    const shareUrl = `${window.location.origin}/classroom/scratch/view/${project.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('分享链接已复制到剪贴板', { duration: 2000 })
  }

  /**
   * 新建项目
   */
  const handleNewProject = () => {
    if (confirm('创建新项目将放弃当前未保存的更改，确定要继续吗？')) {
      navigate('/classroom/scratch/editor')
      window.location.reload()
    }
  }

  /**
   * 改编项目（创建副本）
   */
  const handleRemix = () => {
    if (!project?.id) {
      toast.error('请先保存项目')
      return
    }
    setShowRemixDialog(true)
  }

  /**
   * 确认改编
   */
  const handleConfirmRemix = async () => {
    if (!project?.id) return

    setIsSaving(true)
    try {
      const projectData = await getScratchProjectData()
      const newProject = await createProject({
        title: `${project.title} 的改编`,
        description: `改编自：${project.title}`,
        is_public: false,
        data_json: projectData,
      })
      toast.success('改编成功！', { duration: 2000 })
      setShowRemixDialog(false)
      navigate(`/classroom/scratch/editor/${newProject.id}`)
    } catch (error: any) {
      toast.error('改编失败：' + (error.response?.data?.detail || error.message))
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 从电脑中打开（上传 .sb3 文件）
   */
  const handleOpenFromComputer = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.sb3,.sb2'
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        // TODO: 解析 .sb3 文件并加载到编辑器
        toast.success('文件上传成功（功能开发中）')
        console.log('上传文件:', file.name)
      } catch (error: any) {
        toast.error('文件上传失败：' + error.message)
      }
    }
    input.click()
  }

  /**
   * 保存到电脑（下载 .sb3 文件）
   */
  const handleSaveToComputer = async () => {
    try {
      const downloadTitle = (await requestProjectTitle()).trim() || '未命名项目'
      setTitle(downloadTitle)
      setProject(prev => (prev ? { ...prev, title: downloadTitle } : prev))

      const projectData = await getScratchProjectData()
      
      // 创建 Blob 并下载
      const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${downloadTitle}.sb3`
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('项目已下载到电脑', { duration: 2000 })
    } catch (error: any) {
      toast.error('下载失败：' + error.message)
    }
  }

  /**
   * 保存到线上（新增）
   */
  const handleSaveToOnline = useCallback(async () => {
    console.log('💾 用户点击"保存到线上"')
    console.log('📊 iframe 加载状态(ref):', iframeLoadedRef.current)
    console.log('📊 VM 就绪状态(ref):', vmReadyRef.current)
    console.log('📊 登录状态(ref):', isLoggedInRef.current)
    
    // 使用 ref 的值（最新值）
    if (!isLoggedInRef.current) {
      console.log('⚠️ 用户未登录')
      toast.error('请先登录后再保存项目')
      setShowLoginDialog(true)
      return
    }

    // 检查 iframe 是否加载（使用 ref）
    if (!iframeLoadedRef.current) {
      console.error('❌ Scratch 编辑器尚未加载')
      toast.error('编辑器正在加载，请稍候再试')
      return
    }

    // 不再检查 vmReady，直接尝试保存
    // getScratchProjectData 内部会检查并处理超时
    console.log('💾 准备保存项目')

    // 如果是新项目，打开保存对话框
    if (!project?.id) {
      console.log('📝 新项目，执行首次保存')
      await handleSave()
      return
    }

    // 已有项目，快速保存
    console.log('💾 已有项目，执行快速保存')
    await handleQuickSave()
  }, [project, setShowLoginDialog, handleQuickSave])

  /**
   * 处理登录
   */
  const handleLogin = () => {
    // 跳转到登录页面（保存当前路径，登录后返回）
    const returnUrl = window.location.pathname + window.location.search
    navigate(`/login?return_url=${encodeURIComponent(returnUrl)}`)
  }

  /**
   * 处理注册
   */
  const handleRegister = () => {
    const returnUrl = window.location.pathname + window.location.search
    navigate(`/register?return_url=${encodeURIComponent(returnUrl)}`)
  }

  /**
   * 处理登出
   */
  const handleLogout = useCallback(async () => {
    try {
      // Django 后端的 logout API 使用 GET 请求
      const response = await fetch('http://localhost:8086/api/logout/', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        // 1. 立即更新全局状态
        (window as any).__scratchUserInfo = {
          isLoggedIn: false,
          username: null,
          avatarUrl: null
        };
        
        // 2. 更新 React 状态
        setIsLoggedIn(false);
        isLoggedInRef.current = false;
        setUsername('');
        setAvatarUrl('');
        
        // 3. 显示提示
        toast.success('已退出登录', { duration: 2000 });
        
        // 4. 通知 iframe 更新用户状态
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'USER_INFO_UPDATE',
            data: {
              isLoggedIn: false,
              username: null,
              avatarUrl: null
            }
          }, 'http://localhost:8601');
        }
      } else {
        toast.error('退出登录失败');
      }
    } catch (error) {
      toast.error('退出登录失败');
    }
  }, [])

  /**
   * 查看我的作品
   */
  const handleMyProjects = () => {
    navigate('/classroom/scratch/projects')
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Scratch 编辑器 - 使用原生登录系统 */}
      {!isInitialized ? (
        // 🔧 【优化】用户信息初始化中，显示加载提示
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="mb-4 flex justify-center"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
            </motion.div>
            <div className="text-lg font-semibold text-gray-700">正在初始化编辑器...</div>
            <div className="text-sm text-gray-500 mt-2">检查登录状态中</div>
          </motion.div>
        </div>
      ) : (
        // 🔧 【优化】只在用户信息初始化完成后才渲染 iframe
        // 🔧 【关键修复】不要因为 isLoading 而卸载 iframe，否则会丢失已加载的项目
        <>
          <iframe
            ref={iframeRef}
            src={scratchEditorUrl}
            className="w-full h-full border-0"
            title="Scratch Editor"
            allow="camera; microphone"
            style={{ display: 'block', margin: 0, padding: 0 }}
            onLoad={() => {
              // iframe 加载完成，设置状态
              // 项目加载由 useEffect 统一管理（参考官方 Project Loading States）
              setIframeLoaded(true)
              iframeLoadedRef.current = true
            }}
          />
          
          {/* 项目加载中遮罩层 - 不卸载 iframe，只显示遮罩 */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  className="mb-4 flex justify-center"
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="64" 
                    height="64" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                  </svg>
                </motion.div>
                <div className="text-lg font-semibold text-gray-700">加载项目中...</div>
              </motion.div>
            </div>
          )}
        </>
      )}

      {/* 设置对话框 */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>项目设置</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="settings-title">项目标题</Label>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {title || '未命名项目'}
              </div>
              <p className="text-xs text-gray-500">如需修改标题，请使用编辑器顶部的输入框。</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-description">项目描述</Label>
              <Textarea
                id="settings-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="settings-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="settings-public">公开项目</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(false)}
            >
              取消
            </Button>
            <Button onClick={() => {
              setShowSettingsDialog(false)
              void handleQuickSave()
            }}>
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 改编对话框 */}
      <Dialog open={showRemixDialog} onOpenChange={setShowRemixDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>改编项目</DialogTitle>
            <DialogDescription>
              创建此项目的副本，您可以自由修改
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600">
              改编项目将创建一个新的副本，原项目不会被修改。
            </p>
            {project && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">原项目</div>
                <div className="text-sm text-blue-700 mt-1">{project.title}</div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemixDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleConfirmRemix}
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSaving ? '创建中...' : '确认改编'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 登录提示对话框 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>需要登录</DialogTitle>
            <DialogDescription>
              保存项目到线上需要先登录账号
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                <span className="text-3xl">🔒</span>
              </div>
              <div className="text-center">
                <p className="text-gray-700 mb-2">
                  您还未登录，无法保存项目到线上
                </p>
                <p className="text-sm text-gray-500">
                  登录后可以：
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>✅ 保存项目到云端</li>
                  <li>✅ 在任何设备访问作品</li>
                  <li>✅ 分享作品给朋友</li>
                  <li>✅ 参加课程和作业</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
              className="w-full sm:w-auto"
            >
              稍后再说
            </Button>
            <Button
              onClick={handleLogin}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600"
            >
              立即登录
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


