import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, User, Lock, Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { userAPI } from '@/api/user'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('return_url') || '/classroom'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('请填写所有必填项')
      return
    }

    if (password !== confirmPassword) {
      toast.error('两次密码输入不一致')
      return
    }

    if (password.length < 6) {
      toast.error('密码长度至少6位')
      return
    }

    setIsLoading(true)

    try {
      await userAPI.register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        captcha: '' // 如果后端需要验证码，这里需要添加验证码逻辑
      })
      
      // 注册成功
      toast.success('注册成功！正在跳转...')
      
      // 延迟跳转到登录页
      setTimeout(() => {
        navigate(`/login?return_url=${encodeURIComponent(returnUrl)}`)
      }, 1000)
    } catch (error: any) {
      console.error('注册错误:', error)
      const errorMsg = error.response?.data?.data || error.message || '注册失败'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4">
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
              加入 MetaSeekOJ
            </CardTitle>
            <CardDescription className="text-center text-base">
              创建账号，开启编程学习之旅
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* 用户名 */}
              <div className="space-y-2">
                <Label htmlFor="username">用户名 *</Label>
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

              {/* 邮箱 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱 *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <Label htmlFor="password">密码 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="至少6位密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* 确认密码 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* 注册按钮 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册账号'}
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
                <span className="px-2 bg-white text-gray-500">已有账号？</span>
              </div>
            </div>

            {/* 登录按钮 */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/login?return_url=${encodeURIComponent(returnUrl)}`)}
            >
              立即登录
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
          注册即表示您同意我们的服务条款和隐私政策
        </p>
      </motion.div>
    </div>
  )
}

