import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, BookOpen, Users, Clock, Edit, Trash2, Loader2, Sparkles, MessageSquare, FileText, Zap } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { CreateCourseDialog } from '@/components/classroom/CreateCourseDialog'
import { EditCourseDialog } from '@/components/classroom/EditCourseDialog'
import { AIGenerateCoursewareDialog } from '@/components/classroom/AIGenerateCoursewareDialog'
import { CreditsBadge } from '@/components/classroom/CreditsBadge'
import { getCourses, deleteCourse, type Course } from '@/api/classroom'

// MetaSeekOJ 语言配色（与 8080 端口完全一致）
const typeConfig = {
  scratch: { 
    label: 'Scratch', 
    color: 'bg-[#FFA726]',           // MetaSeekOJ 橙色
    textColor: 'text-[#F57C00]',
    borderColor: 'border-[#FFA726]'
  },
  python: { 
    label: 'Python', 
    color: 'bg-[#3DBAFB]',           // MetaSeekOJ 蓝色
    textColor: 'text-[#0288D1]',
    borderColor: 'border-[#3DBAFB]'
  },
  cpp: { 
    label: 'C++', 
    color: 'bg-[#C49CFF]',           // MetaSeekOJ 紫色
    textColor: 'text-[#8E24AA]',
    borderColor: 'border-[#C49CFF]'
  }
}

const levelConfig = {
  beginner: { label: '初级', color: 'bg-green-100 text-green-800' },
  intermediate: { label: '中级', color: 'bg-yellow-100 text-yellow-800' },
  advanced: { label: '高级', color: 'bg-red-100 text-red-800' }
}

export default function TeacherCourseList() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiGeneratingCourse, setAiGeneratingCourse] = useState<Course | null>(null)

  // 加载课程列表
  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setIsLoading(true)
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (error: any) {
      console.error('加载课程失败:', error)
      
      // 根据错误状态码显示不同的提示
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('请先登录 MetaSeekOJ 系统', {
          description: '您需要先登录才能访问智慧课堂功能',
          action: {
            label: '去登录',
            onClick: () => window.location.href = 'http://localhost:8080/login'
          }
        })
      } else {
        toast.error('加载课程失败，请重试')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = () => {
    setShowCreateDialog(true)
  }

  const handleCreateSuccess = (newCourse: Course) => {
    // 将新课程添加到列表顶部
    setCourses([newCourse, ...courses])
    toast.success(`课程"${newCourse.title}"创建成功！`)
  }

  const handleEditCourse = (id: number) => {
    const course = courses.find(c => c.id === id)
    if (course) {
      setEditingCourse(course)
      setShowEditDialog(true)
    }
  }

  const handleEditSuccess = (updatedCourse: Course) => {
    // 更新课程列表中的课程
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c))
    toast.success(`课程"${updatedCourse.title}"更新成功！`)
  }

  const handleDeleteCourse = (id: number) => {
    setDeletingCourseId(id)
    setShowDeleteDialog(true)
  }

  const confirmDeleteCourse = async () => {
    if (!deletingCourseId) return

    setIsDeleting(true)
    try {
      await deleteCourse(deletingCourseId)
      
      // 从列表中移除课程
      const deletedCourse = courses.find(c => c.id === deletingCourseId)
      setCourses(courses.filter(c => c.id !== deletingCourseId))
      
      toast.success(`课程"${deletedCourse?.title}"已删除`)
      setShowDeleteDialog(false)
      setDeletingCourseId(null)
    } catch (error: any) {
      console.error('删除课程失败:', error)
      toast.error('删除失败：' + (error.response?.data?.error || error.message || '未知错误'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAIGenerate = (course: Course) => {
    setAiGeneratingCourse(course)
    setShowAIDialog(true)
  }

  const handleAIGenerateSuccess = () => {
    // AI生成成功后，可以重新加载课程列表或导航到课程详情页
    toast.success('课件生成完成！')
    loadCourses()
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Header - MetaSeekOJ 风格 */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
                🎨 智慧课堂
              </h1>
              <p className="text-[#525252] mt-1">教师端 - 课程管理</p>
            </div>
            <div className="flex items-center gap-3">
              <CreditsBadge />
              <Button 
                onClick={() => navigate('/classroom/teacher/markdown-to-slides')}
                size="lg"
                variant="outline"
                className="gap-2 border-2 border-[#FFA726] text-[#F57C00] hover:bg-[#FFF3E0]"
              >
                <Zap className="h-5 w-5" />
                快速生成幻灯片
              </Button>
              <Button 
                onClick={handleCreateCourse} 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white border-0"
              >
                <PlusCircle className="h-5 w-5" />
                创建新课程
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Create Course Dialog */}
      <CreateCourseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Course Dialog */}
      <EditCourseDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        course={editingCourse}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#525252]">确认删除课程？</AlertDialogTitle>
            <AlertDialogDescription className="text-[#737373]">
              此操作无法撤销。课程的所有内容（包括课件、文档、学生数据）都将被永久删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="border-[#e5e5e5] text-[#525252] hover:bg-[#F5F7FA]"
              disabled={isDeleting}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCourse}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                '确认删除'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Generate Courseware Dialog */}
      <AIGenerateCoursewareDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        course={aiGeneratingCourse}
        onSuccess={handleAIGenerateSuccess}
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
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
                className="text-[#3DBAFB] mx-auto mb-4"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              <p className="text-[#737373]">加载课程中...</p>
            </motion.div>
          </div>
        ) : (
          <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#525252]">
                  课程总数
                </CardTitle>
                <BookOpen className="h-4 w-4 text-[#FFA726]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#525252]">{courses.length}</div>
                <p className="text-xs text-[#737373] mt-1">已发布 {courses.filter(c => c.isPublished).length} 个</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#525252]">
                  学生总数
                </CardTitle>
                <Users className="h-4 w-4 text-[#3DBAFB]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#525252]">
                  {courses.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
                </div>
                <p className="text-xs text-[#737373] mt-1">分布在 {courses.length} 个课程</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#525252]">
                  本周授课
                </CardTitle>
                <Clock className="h-4 w-4 text-[#C49CFF]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#525252]">12</div>
                <p className="text-xs text-[#737373] mt-1">课时</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Course List */}
        {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow rounded-lg">
                {/* Cover Image */}
                <div className={`h-40 ${typeConfig[course.course_type].color} relative`}>
                  {course.cover_url && (
                    <img
                      src={course.cover_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className={levelConfig[course.difficulty_level].color}>
                      {levelConfig[course.difficulty_level].label}
                    </Badge>
                    {course.is_published && (
                      <Badge className="bg-green-500 text-white">已发布</Badge>
                    )}
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1 text-[#525252]">{course.title}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${typeConfig[course.course_type].textColor} ${typeConfig[course.course_type].borderColor}`}
                      >
                        {typeConfig[course.course_type].label}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2 text-[#737373]">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-[#525252]">
                    <Users className="h-4 w-4 text-[#737373]" />
                    <span>0 名学生</span>
                  </div>
                </CardContent>

                <CardFooter className="gap-2 flex-col">
                  {/* 主操作：进入编辑器 */}
                  <Button
                    className="w-full bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white"
                    onClick={() => navigate(`/classroom/teacher/courses/${course.id}/edit`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    进入AI编辑器
                  </Button>
                  
                  {/* 次要操作 */}
                  <div className="w-full flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#FFA726] text-[#F57C00] hover:bg-[#FFF3E0]"
                      onClick={() => handleAIGenerate(course)}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      快速生成
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#e5e5e5] text-[#525252] hover:bg-[#F5F7FA]"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      编辑信息
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#e5e5e5] text-[#525252] hover:bg-[#F5F7FA]"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="h-16 w-16 mx-auto text-[#a3a3a3] mb-4" />
            <h3 className="text-xl font-semibold text-[#525252] mb-2">还没有课程</h3>
            <p className="text-[#737373] mb-6">创建您的第一个课程，开始教学之旅</p>
            <Button 
              onClick={handleCreateCourse} 
              size="lg"
              className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white border-0"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              创建课程
            </Button>
          </motion.div>
        )}
        </>
        )}
      </main>
    </div>
  )
}

