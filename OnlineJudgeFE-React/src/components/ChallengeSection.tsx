import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, TestTube, BookOpen, Star, Zap, Target } from "lucide-react";
import { FigmaContainer } from './FigmaContainer'; // 8080精确容器

const challenges = [
  {
    title: "斐波那契数列",
    difficulty: "简单",
    category: "数学",
    stars: 3,
    color: "#8ED1A9",
  },
  {
    title: "二分查找",
    difficulty: "中等",
    category: "算法",
    stars: 4,
    color: "#3DBAFB",
  },
  {
    title: "最短路径",
    difficulty: "困难",
    category: "图论",
    stars: 5,
    color: "#C49CFF",
  },
  {
    title: "动态规划入门",
    difficulty: "中等",
    category: "DP",
    stars: 4,
    color: "#FFA726",
  },
  {
    title: "排序算法",
    difficulty: "简单",
    category: "算法",
    stars: 3,
    color: "#8ED1A9",
  },
  {
    title: "树的遍历",
    difficulty: "中等",
    category: "数据结构",
    stars: 4,
    color: "#3DBAFB",
  },
];

const aiFeatures = [
  {
    icon: TestTube,
    title: "AI 自动生成测试用例",
    description: "智能生成边界测试，确保代码质量",
    color: "#3DBAFB",
  },
  {
    icon: Target,
    title: "批量题目采集",
    description: "从各大 OJ 平台自动采集优质题目",
    color: "#FFA726",
  },
  {
    icon: BookOpen,
    title: "智能错题本",
    description: "艾宾浩斯复习曲线，科学巩固知识",
    color: "#C49CFF",
  },
];

export function ChallengeSection() {
  return (
    <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #F5F7FA, white)' }}> {/* 8080精确值 */}
      <FigmaContainer>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl mb-4">
            <span className="inline-block">🔥</span> 热门题目与 AI 辅助功能
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            精选编程题目，配合 AI 智能助手，让学习更高效
          </p>
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg mb-2">{challenge.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="border-gray-300"
                      style={{ borderColor: challenge.color + "40", color: challenge.color }}
                    >
                      {challenge.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        challenge.difficulty === "简单"
                          ? "bg-green-100 text-green-700"
                          : challenge.difficulty === "中等"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: challenge.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFA726] text-[#FFA726]" />
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90">
                开始挑战
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C49CFF]/10 border border-[#C49CFF]/20 mb-4">
              <Brain className="w-5 h-5 text-[#C49CFF]" />
              <span className="text-sm text-[#C49CFF]">AI 智能功能</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                >
                  {/* Background gradient */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: feature.color }}
                  />

                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: feature.color + "20" }}
                    >
                      <Icon className="w-8 h-8" style={{ color: feature.color }} />
                    </motion.div>

                    <h3 className="text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </FigmaContainer>
    </section>
  );
}
