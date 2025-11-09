import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlusCircle, Play, Edit, Trash2, Share2, Heart, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getUserProjects, deleteProject } from '@/api/scratch'
import type { ScratchProject as ScratchProjectType } from '@/api/scratch'

interface ScratchProject {
  id: number
  title: string
  thumbnail: string
  isPublic: boolean
  likes: number
  views: number
  lastModified: string
}

const mockProjects: ScratchProject[] = [
  {
    id: 1,
    title: '弹球游戏',
    thumbnail: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=弹球游戏',
    isPublic: true,
    likes: 12,
    views: 89,
    lastModified: '2小时前'
  },
  {
    id: 2,
    title: '猫捉老鼠',
    thumbnail: 'https://via.placeholder.com/300x200/3776AB/FFFFFF?text=猫捉老鼠',
    isPublic: false,
    likes: 8,
    views: 45,
    lastModified: '1天前'
  },
  {
    id: 3,
    title: '太空冒险',
    thumbnail: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=太空冒险',
    isPublic: true,
    likes: 25,
    views: 156,
    lastModified: '3天前'
  },
  {
    id: 4,
    title: '音乐制作器',
    thumbnail: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=音乐制作器',
    isPublic: false,
    likes: 5,
    views: 23,
    lastModified: '5天前'
  }
]

export default function ScratchProjectList() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ScratchProjectType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    totalViews: 0,
    totalLikes: 0
  })

  // 加载用户的项目列表
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const data = await getUserProjects()
      setProjects(data)
      
      // 计算统计数据
      setStats({
        total: data.length,
        published: data.filter((p: ScratchProjectType) => p.is_public).length,
        totalViews: data.reduce((sum: number, p: ScratchProjectType) => sum + (p.view_count || 0), 0),
        totalLikes: data.reduce((sum: number, p: ScratchProjectType) => sum + (p.like_count || 0), 0)
      })
    } catch (error: any) {
      console.error('加载项目失败:', error)
      toast.error('加载项目失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = () => {
    navigate('/classroom/scratch/editor')
  }

  const handleEditProject = (id: number) => {
    navigate(`/classroom/scratch/editor/${id}`)
  }

  const handlePlayProject = (id: number) => {
    // TODO: 实现预览功能
    toast.info(`运行项目 ${id}`)
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('确定要删除这个项目吗？')) {
      return
    }
    
    try {
      await deleteProject(id)
      toast.success('项目删除成功')
      // 重新加载列表
      loadProjects()
    } catch (error: any) {
      console.error('删除项目失败:', error)
      toast.error('删除项目失败，请重试')
    }
  }

  const handleShareProject = (id: number) => {
    // TODO: 实现分享功能
    const shareUrl = `${window.location.origin}/scratch/project/${id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('分享链接已复制到剪贴板')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/classroom/scratch/editor')}
                className="hover:bg-orange-50"
                title="返回编辑器"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                  🎮 我的作品
                </h1>
                <p className="text-gray-600 mt-1">创造你的想象世界</p>
              </div>
            </div>
            <Button onClick={handleCreateProject} size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600">
              <PlusCircle className="h-5 w-5" />
              新建项目
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-orange-500">{stats.total}</div>
                <div className="text-sm text-gray-600">我的项目</div>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-blue-500">
                  {stats.published}
                </div>
                <div className="text-sm text-gray-600">已发布</div>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-purple-500">
                  {stats.totalLikes}
                </div>
                <div className="text-sm text-gray-600">获得点赞</div>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-green-500">
                  {stats.totalViews}
                </div>
                <div className="text-sm text-gray-600">总浏览量</div>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="text-center"
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
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-blue-500 mx-auto mb-4"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              <p className="text-gray-600">加载项目中...</p>
            </motion.div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">还没有项目</h3>
              <p className="text-gray-500 mb-6">创建你的第一个 Scratch 作品吧！</p>
              <Button onClick={handleCreateProject} size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600">
                <PlusCircle className="h-5 w-5" />
                新建项目
              </Button>
            </div>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all">
                {/* Thumbnail */}
                <div className="relative group">
                  <img
                    src={project.cover_url || 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=' + encodeURIComponent(project.title)}
                    alt={project.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <Button
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlayProject(project.id)}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  {project.is_public && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      公开
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>{project.like_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4 text-blue-500" />
                      <span>{project.view_count || 0}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500">
                    最后修改: {formatDate(project.updated_at)}
                  </div>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareProject(project.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        )}
      </main>
    </div>
  )
}

