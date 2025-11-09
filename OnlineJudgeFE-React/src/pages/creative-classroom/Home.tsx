import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Users, Code2, Sparkles, BookOpen, Trophy, Palette } from 'lucide-react'

export default function CreativeClassroomHome() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: 'Scratch 图形化编程',
      description: '通过拖拽积木块创作游戏和动画',
      color: 'from-orange-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-orange-600/10'
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Python 趣味编程',
      description: '用代码创造有趣的小项目',
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'C++ 算法竞赛',
      description: 'NOI/NOIP 算法训练',
      color: 'from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Palette className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                智慧课堂
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              让创意成为现实，用代码创造未来
              <br />
              <span className="text-lg text-gray-500">
                支持 Scratch / Python / C++ 三种编程语言
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                  onClick={() => navigate('/classroom/teacher/courses')}
                >
                  <GraduationCap className="h-6 w-6 mr-2" />
                  教师端入口
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
                  onClick={() => navigate('/classroom/student/courses')}
                >
                  <Users className="h-6 w-6 mr-2" />
                  学生端入口
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2"
                  onClick={() => navigate('/classroom/scratch/projects')}
                >
                  <Code2 className="h-6 w-6 mr-2" />
                  Scratch 项目
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            三大编程方向，全面发展
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={`${feature.gradient} border-0 shadow-lg hover:shadow-xl transition-shadow h-full`}>
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Quick Access Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Teacher Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-orange-500">
              <div className="h-3 bg-gradient-to-r from-orange-500 to-orange-600" />
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">教师端</CardTitle>
                </div>
                <div className="text-base space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>课程管理与创建</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>课堂授课与互动</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>作业批改与反馈</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>学生学习数据分析</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={() => navigate('/classroom/teacher/courses')}
                >
                  进入教师端
                </Button>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <div className="h-3 bg-gradient-to-r from-purple-500 to-purple-600" />
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">学生端</CardTitle>
                </div>
                <div className="text-base space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>课程学习与互动</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>闪卡识记与练习</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>作业提交与查看</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>学习进度追踪</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  onClick={() => navigate('/classroom/student/courses')}
                >
                  进入学生端
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Scratch Highlight */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-orange-500 to-purple-500 p-12 text-white flex flex-col justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <Code2 className="h-16 w-16 mb-6" />
                </motion.div>
                <h3 className="text-4xl font-bold mb-4">Scratch 创意编程</h3>
                <p className="text-xl text-white/90 mb-6">
                  通过图形化编程，让孩子轻松入门编程世界
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span>零基础友好</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span>创意无限</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span>即时反馈</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span>作品分享</span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/classroom/scratch/projects')}
                  className="w-full md:w-auto"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  查看我的项目
                </Button>
              </div>
              
              <div className="md:w-1/2 p-12 bg-gradient-to-br from-orange-50 to-purple-50">
                <div className="space-y-6">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white p-6 rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-lg">创建项目</h4>
                    </div>
                    <p className="text-gray-600 ml-13">从零开始或选择模板</p>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="bg-white p-6 rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-lg">拖拽编程</h4>
                    </div>
                    <p className="text-gray-600 ml-13">用积木块构建逻辑</p>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="bg-white p-6 rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-lg">运行分享</h4>
                    </div>
                    <p className="text-gray-600 ml-13">看到作品运行并分享</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="mb-2">
            🎨 智慧课堂 - 让创意成为现实
          </p>
          <p className="text-sm text-gray-500">
            Powered by React 19 + TypeScript + Tailwind CSS + Shadcn/UI + Motion
          </p>
        </motion.div>
      </footer>
    </div>
  )
}

