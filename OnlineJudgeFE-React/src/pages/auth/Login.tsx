import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, User, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { userAPI } from '@/api/user'
import { useUserStore } from '@/store/user'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('return_url') || '/'
  const { checkAuth } = useUserStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error('请输入用户名和密码')
      return
    }

    setIsLoading(true)

    try {
      await userAPI.login({
        username: username.trim(),
        password: password
      })
      
      // 登录成功，更新认证状态
      toast.success('登录成功！')
      localStorage.setItem('authed', 'true')
      await checkAuth()
      
      // 延迟跳转
      setTimeout(() => {
        navigate(returnUrl)
      }, 500)
    } catch (error: any) {
      console.error('登录错误:', error)
      const errorMsg = error.response?.data?.data || error.message || '登录失败'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center shadow-lg">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              登录 MetaSeekOJ
            </CardTitle>
            <CardDescription className="text-center text-base">
              登录后畅享智慧课堂所有功能
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* 用户名 */}
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* 登录按钮 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* 分隔线 */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">还没有账号？</span>
              </div>
            </div>

            {/* 注册按钮 */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/register?return_url=${encodeURIComponent(returnUrl)}`)}
            >
              立即注册
            </Button>

            {/* 返回按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(returnUrl)}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </CardFooter>
        </Card>

        {/* 底部提示 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </motion.div>
    </div>
  )
}

