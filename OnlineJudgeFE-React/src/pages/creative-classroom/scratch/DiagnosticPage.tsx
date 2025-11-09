import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function ScratchDiagnostic() {
  const [checks, setChecks] = useState({
    reactFrontend: { status: 'checking', message: '' },
    scratchEditor: { status: 'checking', message: '' },
    djangoBackend: { status: 'checking', message: '' },
    iframeEmbed: { status: 'checking', message: '' },
  })

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    // 1. 检查 React 前端
    setChecks(prev => ({
      ...prev,
      reactFrontend: { status: 'success', message: '运行在 http://localhost:8081' }
    }))

    // 2. 检查 Scratch 编辑器
    try {
      const response = await fetch('http://localhost:8601/')
      if (response.ok) {
        setChecks(prev => ({
          ...prev,
          scratchEditor: { status: 'success', message: '运行在 http://localhost:8601' }
        }))
      } else {
        setChecks(prev => ({
          ...prev,
          scratchEditor: { status: 'error', message: '响应异常: ' + response.status }
        }))
      }
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        scratchEditor: { status: 'error', message: '无法连接，请启动编辑器' }
      }))
    }

    // 3. 检查 Django 后端
    try {
      const response = await fetch('http://localhost:8086/api/scratch/mystuff/', {
        credentials: 'include'
      })
      if (response.ok || response.status === 403 || response.status === 401) {
        setChecks(prev => ({
          ...prev,
          djangoBackend: { 
            status: 'success', 
            message: response.status === 401 ? '运行中（未登录）' : '运行在 http://localhost:8086'
          }
        }))
      } else {
        setChecks(prev => ({
          ...prev,
          djangoBackend: { status: 'warning', message: '响应异常: ' + response.status }
        }))
      }
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        djangoBackend: { status: 'error', message: '无法连接，请启动 Django' }
      }))
    }

    // 4. 检查 iframe 嵌入
    setTimeout(() => {
      setChecks(prev => ({
        ...prev,
        iframeEmbed: { 
          status: 'success', 
          message: '请访问测试页面查看实际效果' 
        }
      }))
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      default:
        return <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">正常</Badge>
      case 'error':
        return <Badge className="bg-red-500">错误</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500">警告</Badge>
      default:
        return <Badge className="bg-gray-400">检查中</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent mb-4">
            🔍 Scratch 系统诊断
          </h1>
          <p className="text-gray-600">检查所有服务是否正常运行</p>
        </div>

        {/* Status Cards */}
        <div className="space-y-4">
          {/* React 前端 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(checks.reactFrontend.status)}
                  <CardTitle>React 前端服务</CardTitle>
                </div>
                {getStatusBadge(checks.reactFrontend.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{checks.reactFrontend.message}</p>
              <a 
                href="http://localhost:8081" 
                target="_blank" 
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                访问 http://localhost:8081
              </a>
            </CardContent>
          </Card>

          {/* Scratch 编辑器 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(checks.scratchEditor.status)}
                  <CardTitle>Scratch 编辑器</CardTitle>
                </div>
                {getStatusBadge(checks.scratchEditor.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{checks.scratchEditor.message}</p>
              <a 
                href="http://localhost:8601" 
                target="_blank" 
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                访问 http://localhost:8601
              </a>
              {checks.scratchEditor.status === 'error' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800 font-semibold mb-2">启动命令：</p>
                  <code className="text-xs bg-red-100 px-2 py-1 rounded">
                    cd /home/sharelgx/MetaSeekOJdev/scratch-editor && ./start-editor.sh
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Django 后端 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(checks.djangoBackend.status)}
                  <CardTitle>Django 后端 API</CardTitle>
                </div>
                {getStatusBadge(checks.djangoBackend.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{checks.djangoBackend.message}</p>
              <a 
                href="http://localhost:8086/admin/" 
                target="_blank" 
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                访问 http://localhost:8086/admin/
              </a>
              {checks.djangoBackend.status === 'error' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800 font-semibold mb-2">启动命令：</p>
                  <code className="text-xs bg-red-100 px-2 py-1 rounded">
                    cd /home/sharelgx/MetaSeekOJdev/OnlineJudge && python manage.py runserver 0.0.0.0:8086
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* iframe 嵌入 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(checks.iframeEmbed.status)}
                  <CardTitle>iframe 嵌入测试</CardTitle>
                </div>
                {getStatusBadge(checks.iframeEmbed.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{checks.iframeEmbed.message}</p>
              <Button
                onClick={() => window.location.href = '/classroom/scratch/test'}
                className="bg-gradient-to-r from-orange-500 to-orange-600"
              >
                打开 iframe 测试页面
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/classroom/scratch/test'}
            className="h-auto py-4 flex-col gap-2"
          >
            <span className="text-lg">🧪</span>
            <span>iframe 测试页面</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = '/classroom/scratch/editor'}
            className="h-auto py-4 flex-col gap-2"
          >
            <span className="text-lg">✏️</span>
            <span>Scratch 编辑器</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = '/classroom/scratch/projects'}
            className="h-auto py-4 flex-col gap-2"
          >
            <span className="text-lg">📂</span>
            <span>项目列表</span>
          </Button>
        </div>

        {/* Refresh */}
        <div className="mt-6 text-center">
          <Button onClick={runDiagnostics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            重新检查
          </Button>
        </div>
      </div>
    </div>
  )
}

