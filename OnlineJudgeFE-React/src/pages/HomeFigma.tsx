import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Code,
  Rocket,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  GraduationCap,
  FileCode,
  Brain,
  Blocks,
  BarChart3,
  Star,
  TrendingUp,
  Bell
} from 'lucide-react'
import { homeAPI } from '@/api/home'
import type { Statistics, Problem, Announcement } from '@/types/home'
import Announcements from '@/components/layout/Announcements'
import Footer from '@/components/layout/Footer'

export default function HomeFigma() {
  const navigate = useNavigate()
  
  // 动态数据状态
  const [statistics, setStatistics] = useState<Statistics>({})
  const [problems, setProblems] = useState<Problem[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // 并行加载所有数据
      const [statsRes, problemsRes, announcementsRes] = await Promise.all([
        homeAPI.getStatistics().catch(() => ({ data: {} })),
        homeAPI.getProblems({ limit: 6 }).catch(() => ({ data: { results: [] } })),
        homeAPI.getAnnouncements().catch(() => ({ data: { results: [] } })),
      ])

      setStatistics(statsRes.data || {})
      setProblems(problemsRes.data?.results || [])
      setAnnouncements(announcementsRes.data?.results?.slice(0, 3) || [])
    } catch (error) {
      console.error('加载首页数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // Hero统计数据（使用真实数据）
  const heroStats = [
    { 
      number: statistics.user_count ? `${(statistics.user_count / 1000).toFixed(1)}K+` : '10,000+', 
      label: '在线学员' 
    },
    { 
      number: statistics.problem_count ? `${statistics.problem_count}+` : '500+', 
      label: '编程题目' 
    },
    { 
      number: '98%', 
      label: '满意度' 
    }
  ]

  // 事件处理
  const handleStartChallenge = () => {
    navigate('/problem')
  }

  const handleLearnMore = () => {
    navigate('/about')
  }

  const handleStartProblem = (problem: Problem) => {
    navigate(`/problem/${problem._id}`)
  }

  const handleTeacherZone = () => {
    navigate('/teacher/classroom/courses')
  }

  const handleViewAllAnnouncements = () => {
    navigate('/announcement')
  }

  // 学习阶段
  const learningStages = [
    {
      icon: Blocks,
      title: 'Scratch',
      subtitle: '图形编程',
      description: '从积木开始，建立编程思维',
      color: '#FFA726'
    },
    {
      icon: Code,
      title: 'Python',
      subtitle: '语言过渡',
      description: '掌握文本编程的基础',
      color: '#3DBAFB'
    },
    {
      icon: Trophy,
      title: 'C++',
      subtitle: '进阶竞赛',
      description: '算法与数据结构深造',
      color: '#8ED1A9'
    },
    {
      icon: Sparkles,
      title: 'AI 生成题',
      subtitle: '竞赛挑战',
      description: '智能题库与竞赛实战',
      color: '#C49CFF'
    }
  ]

  // 热门题目（使用真实数据或mock数据）
  const challenges = problems.length > 0 
    ? problems.slice(0, 6).map(p => ({
        id: p.id,
        _id: p._id,
        title: p.title,
        difficulty: p.difficulty || '中等',
        category: p.tags?.[0] || '算法',
        stars: p.difficulty === 'Low' ? 3 : p.difficulty === 'Mid' ? 4 : 5,
        color: p.difficulty === 'Low' ? '#8ED1A9' : p.difficulty === 'Mid' ? '#3DBAFB' : '#C49CFF'
      }))
    : [
        { title: '斐波那契数列', difficulty: '简单', category: '数学', stars: 3, color: '#8ED1A9' },
        { title: '二分查找', difficulty: '中等', category: '算法', stars: 4, color: '#3DBAFB' },
        { title: '最短路径', difficulty: '困难', category: '图论', stars: 5, color: '#C49CFF' },
        { title: '动态规划入门', difficulty: '中等', category: 'DP', stars: 4, color: '#FFA726' },
        { title: '排序算法', difficulty: '简单', category: '算法', stars: 3, color: '#8ED1A9' },
        { title: '树的遍历', difficulty: '中等', category: '数据结构', stars: 4, color: '#3DBAFB' }
      ]

  // AI功能
  const aiFeatures = [
    {
      icon: Target,
      title: 'AI 自动生成测试用例',
      description: '智能生成边界测试，确保代码质量',
      color: '#3DBAFB'
    },
    {
      icon: Zap,
      title: '批量题目采集',
      description: '从各大 OJ 平台自动采集优质题目',
      color: '#FFA726'
    },
    {
      icon: BookOpen,
      title: '智能错题本',
      description: '艾宾浩斯复习曲线，科学巩固知识',
      color: '#C49CFF'
    }
  ]

  // 成长统计
  const growthStats = [
    {
      icon: Trophy,
      label: '当前等级',
      value: 'LV.12',
      subtitle: '编程新星',
      color: '#FFA726',
      progress: 75
    },
    {
      icon: Star,
      label: '收集星星',
      value: '1,234',
      subtitle: '继续加油',
      color: '#3DBAFB',
      progress: 62
    },
    {
      icon: CheckCircle,
      label: '已通过题目',
      value: '89',
      subtitle: '总计 500 题',
      color: '#8ED1A9',
      progress: 18
    },
    {
      icon: TrendingUp,
      label: '错题本',
      value: '12',
      subtitle: '待复习',
      color: '#C49CFF',
      progress: 40
    }
  ]

  // 成就徽章
  const badges = [
    { name: '初学者', icon: '🌱', earned: true, color: '#8ED1A9' },
    { name: '算法新手', icon: '🎯', earned: true, color: '#3DBAFB' },
    { name: '编程达人', icon: '🚀', earned: true, color: '#FFA726' },
    { name: '竞赛选手', icon: '🏆', earned: false, color: '#C49CFF' },
    { name: '大师级', icon: '👑', earned: false, color: '#C49CFF' }
  ]

  // 教师功能
  const teacherFeatures = [
    { icon: Users, title: '班级管理', description: '轻松创建和管理多个班级' },
    { icon: BookOpen, title: '题目布置', description: '灵活分配编程作业和练习' },
    { icon: BarChart3, title: '数据分析', description: '查看学生学习进度和成绩' },
    { icon: CheckCircle, title: '错题追踪', description: '智能分析学生薄弱环节' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero区域 */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* 浮动背景元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center"
          >
            <Code className="w-8 h-8 text-blue-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-orange-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-1/4 w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center"
          >
            <Brain className="w-7 h-7 text-purple-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-green-500" />
          </motion.div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* AI徽章 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">AI 智能辅助学习</span>
              </div>

              {/* 主标题 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                用 AI 助你
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
                  闯编程关卡！
                </span>
              </h1>

              {/* 副标题 */}
              <p className="text-lg text-gray-600 max-w-xl">
                自动题库＋智能错题本，让每一次挑战都更聪明。
                为 8-15 岁青少年打造的趣味编程学习平台。
              </p>

              {/* 按钮组 */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleStartChallenge}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:shadow-lg hover:scale-105 transition-all"
                >
                  立即挑战
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLearnMore}
                  className="hover:scale-105 hover:border-blue-500 hover:text-blue-500 transition-all"
                >
                  了解更多
                </Button>
              </div>

              {/* 统计数据 */}
              <div className="flex flex-wrap gap-8 pt-8">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-semibold text-blue-500">{stat.number}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 右侧图片区域 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="/static/images/hero-learning.jpg"
                  alt="孩子们学习编程"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.pixabay.com/photo/2017/08/06/12/52/children-2594747_1280.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
              </motion.div>

              {/* AI助手浮动卡片 */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex gap-3 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">AI 智能助手</div>
                  <div className="text-base text-blue-500 font-medium">24/7 在线指导</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. 学习路线图 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              学习路线图 <span>🧭</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              从积木到代码，从代码到竞赛，循序渐进掌握编程技能
            </p>
          </motion.div>

          {/* 连接线 */}
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-500 via-green-500 to-purple-500 opacity-20 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {learningStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="relative group"
                >
                  <Card className="relative overflow-hidden transition-shadow hover:shadow-2xl">
                    {/* 数字徽章 */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center text-sm text-gray-600 z-10">
                      {index + 1}
                    </div>

                    <CardContent className="p-6">
                      {/* 图标 */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${stage.color}1A` }}
                      >
                        <stage.icon className="w-8 h-8" style={{ color: stage.color }} />
                      </motion.div>

                      {/* 内容 */}
                      <h3 className="text-xl font-semibold mb-1" style={{ color: stage.color }}>
                        {stage.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{stage.subtitle}</p>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </CardContent>

                    {/* 发光效果 */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"
                      style={{ backgroundColor: stage.color }}
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 热门题目与AI功能 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span>🔥</span> 热门题目与 AI 辅助功能
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              精选编程题目，配合 AI 智能助手，让学习更高效
            </p>
          </motion.div>

          {/* 题目卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">{challenge.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" style={{ borderColor: `${challenge.color}66`, color: challenge.color }}>
                            {challenge.category}
                          </Badge>
                          <Badge
                            variant={challenge.difficulty === '简单' ? 'default' : challenge.difficulty === '中等' ? 'secondary' : 'destructive'}
                            className={
                              challenge.difficulty === '简单' ? 'bg-blue-50 text-green-600' :
                              challenge.difficulty === '中等' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-red-50 text-red-600'
                            }
                          >
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: challenge.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500"
                      onClick={() => (challenge as any)._id ? handleStartProblem(challenge as any) : toast.info('题目加载中...')}
                    >
                      开始挑战
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI功能区域 */}
          <div className="mt-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mx-auto mb-8">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-purple-500">AI 智能功能</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="relative overflow-hidden hover:shadow-2xl transition-all">
                    {/* 背景渐变装饰 */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-3xl"
                      style={{ backgroundColor: feature.color }}
                    />

                    <CardContent className="p-8">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${feature.color}33` }}
                      >
                        <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                      </motion.div>

                      <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 我的成长记录 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span>🌟</span> 我的成长记录
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              记录每一步成长，见证编程能力的提升
            </p>
          </motion.div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {growthStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <Card className="hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ rotate: -15, rotateY: 15 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${stat.color}33` }}
                    >
                      <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                    </motion.div>

                    <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mb-4">{stat.subtitle}</div>

                    <Progress value={stat.progress} className="h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 成就徽章 */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">成就徽章</h3>
              <p className="text-gray-600">解锁更多徽章，展示你的编程实力</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={badge.earned ? { scale: 1.1, rotate: 5 } : { scale: 1.05 }}
                  className={`text-center cursor-pointer ${!badge.earned ? 'opacity-40 grayscale' : ''}`}
                >
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl border-2 bg-white mb-3 mx-auto transition-all"
                      style={badge.earned ? {
                        borderColor: `${badge.color}66`,
                        boxShadow: `0 10px 30px ${badge.color}4D`
                      } : {
                        borderColor: '#e4e7ed',
                        background: '#f5f7fa'
                      }}
                    >
                      {badge.icon}
                    </div>

                    {/* 闪烁星星 */}
                    {badge.earned && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: badge.color }}
                      >
                        <Star className="w-4 h-4 fill-white text-white" />
                      </motion.div>
                    )}
                  </div>

                  <div className="text-sm font-medium">{badge.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 教师管理与课堂智能 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧图片 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/static/images/teacher-classroom.jpg"
                  alt="教师课堂数字化"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-transparent" />
              </div>

              {/* 浮动统计卡片1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4 flex gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">320+</div>
                  <div className="text-xs text-gray-500">活跃学生</div>
                </div>
              </motion.div>

              {/* 浮动统计卡片2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 flex gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">95%</div>
                  <div className="text-xs text-gray-500">完成率</div>
                </div>
              </motion.div>
            </motion.div>

            {/* 右侧内容 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* 教师徽章 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">教师专区</span>
              </div>

              {/* 标题 */}
              <h2 className="text-3xl md:text-4xl font-bold">
                <span>👩‍🏫</span> 教师管理与
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
                  课堂智能
                </span>
              </h2>

              {/* 描述 */}
              <p className="text-lg text-gray-600">
                老师可创建班级、布置题目、查看学生错题分析与成长报告，
                让教学更高效，管理更轻松。
              </p>

              {/* 功能网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {teacherFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <feature.icon className="w-6 h-6 text-blue-500 mb-2" />
                        <h4 className="text-sm font-medium mb-1">{feature.title}</h4>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* CTA按钮 */}
              <Button 
                size="lg" 
                onClick={handleTeacherZone}
                className="bg-gradient-to-r from-blue-500 to-green-500 mt-4"
              >
                了解教师专区
                <Users className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. 最新公告 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6" />
              最新公告
            </h2>
            <Button 
              variant="link" 
              onClick={handleViewAllAnnouncements}
              className="text-blue-500"
            >
              查看全部 →
            </Button>
          </div>

          {/* 公告组件 */}
          <Announcements />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

