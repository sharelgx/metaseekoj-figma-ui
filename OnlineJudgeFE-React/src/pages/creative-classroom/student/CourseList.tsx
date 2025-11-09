import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Trophy, Target, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface StudentCourse {
  id: number
  title: string
  description: string
  type: 'scratch' | 'python' | 'cpp'
  progress: number
  totalLessons: number
  completedLessons: number
  nextLesson: string
  coverUrl?: string
}

const mockCourses: StudentCourse[] = [
  {
    id: 1,
    title: 'Scratch 图形化编程入门',
    description: '通过创意游戏和动画学习编程基础概念',
    type: 'scratch',
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    nextLesson: '第9课：弹球游戏',
    coverUrl: 'https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Scratch'
  },
  {
    id: 2,
    title: 'Python 趣味编程',
    description: '用 Python 创建有趣的小项目',
    type: 'python',
    progress: 30,
    totalLessons: 15,
    completedLessons: 5,
    nextLesson: '第6课：猜数字游戏',
    coverUrl: 'https://via.placeholder.com/400x200/3776AB/FFFFFF?text=Python'
  },
  {
    id: 3,
    title: 'C++ 算法入门',
    description: '学习基础算法和数据结构',
    type: 'cpp',
    progress: 10,
    totalLessons: 20,
    completedLessons: 2,
    nextLesson: '第3课：排序算法',
    coverUrl: 'https://via.placeholder.com/400x200/9C27B0/FFFFFF?text=C++'
  }
]

const typeConfig = {
  scratch: { label: 'Scratch', gradient: 'from-orange-500 to-orange-600' },
  python: { label: 'Python', gradient: 'from-blue-500 to-blue-600' },
  cpp: { label: 'C++', gradient: 'from-purple-500 to-purple-600' }
}

export default function StudentCourseList() {
  const [courses] = useState<StudentCourse[]>(mockCourses)

  const totalProgress = Math.round(
    courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
  )

  const handleContinueLearning = (courseId: number) => {
    toast.success(`继续学习课程 ${courseId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
                🎨 智慧课堂
              </h1>
              <p className="text-gray-600 mt-1">我的学习中心</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">总进度</div>
              <div className="text-2xl font-bold text-purple-600">{totalProgress}%</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <BookOpen className="h-8 w-8 mb-2" />
                <CardTitle className="text-2xl font-bold">{courses.length}</CardTitle>
                <CardDescription className="text-orange-100">
                  在学课程
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <Target className="h-8 w-8 mb-2" />
                <CardTitle className="text-2xl font-bold">
                  {courses.reduce((sum, c) => sum + c.completedLessons, 0)}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  完成课时
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <Trophy className="h-8 w-8 mb-2" />
                <CardTitle className="text-2xl font-bold">28</CardTitle>
                <CardDescription className="text-purple-100">
                  获得成就
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <Clock className="h-8 w-8 mb-2" />
                <CardTitle className="text-2xl font-bold">42</CardTitle>
                <CardDescription className="text-green-100">
                  学习小时
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">我的课程</h2>
          
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="md:flex">
                  {/* Cover */}
                  <div className={`md:w-64 h-48 md:h-auto bg-gradient-to-br ${typeConfig[course.type].gradient} relative`}>
                    {course.coverUrl && (
                      <img
                        src={course.coverUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-4 left-4 bg-white text-gray-800">
                      {typeConfig[course.type].label}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl">{course.title}</CardTitle>
                      <CardDescription className="text-base">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>学习进度</span>
                          <span className="font-semibold text-purple-600">
                            {course.completedLessons} / {course.totalLessons} 课时
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">已完成 {course.progress}%</p>
                      </div>

                      {/* Next Lesson */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs text-blue-600 font-semibold mb-1">下一节课</div>
                        <div className="text-sm text-blue-800">{course.nextLesson}</div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-0 pt-4">
                      <Button
                        onClick={() => handleContinueLearning(course.id)}
                        className="w-full md:w-auto"
                        size="lg"
                      >
                        继续学习
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

