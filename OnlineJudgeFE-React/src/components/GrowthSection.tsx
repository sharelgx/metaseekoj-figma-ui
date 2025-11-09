import { motion } from "motion/react";
import { Trophy, Star, BookCheck, TrendingUp } from "lucide-react";
import { Progress } from "./ui/progress";
import { FigmaContainer } from './FigmaContainer'; // 8080精确容器

const stats = [
  {
    icon: Trophy,
    label: "当前等级",
    value: "LV.12",
    subtitle: "编程新星",
    color: "#FFA726",
    progress: 75,
  },
  {
    icon: Star,
    label: "收集星星",
    value: "1,234",
    subtitle: "继续加油",
    color: "#3DBAFB",
    progress: 62,
  },
  {
    icon: BookCheck,
    label: "已通过题目",
    value: "89",
    subtitle: "总计 500 题",
    color: "#8ED1A9",
    progress: 18,
  },
  {
    icon: TrendingUp,
    label: "错题本",
    value: "12",
    subtitle: "待复习",
    color: "#C49CFF",
    progress: 40,
  },
];

const badges = [
  { name: "初学者", icon: "🌱", earned: true, color: "#8ED1A9" },
  { name: "算法新手", icon: "🎯", earned: true, color: "#3DBAFB" },
  { name: "编程达人", icon: "🚀", earned: true, color: "#FFA726" },
  { name: "竞赛选手", icon: "🏆", earned: false, color: "#C49CFF" },
  { name: "大师级", icon: "👑", earned: false, color: "#C49CFF" },
];

export function GrowthSection() {
  return (
    <section style={{ padding: '80px 0', background: 'white' }}> {/* 8080精确值 */}
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
            <span className="inline-block">🌟</span> 我的成长记录
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            记录每一步成长，见证编程能力的提升
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: stat.color + "20" }}
                >
                  <Icon className="w-7 h-7" style={{ color: stat.color }} />
                </motion.div>

                {/* Content */}
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className="text-2xl mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mb-4">{stat.subtitle}</div>

                {/* Progress */}
                <Progress value={stat.progress} className="h-2" />
              </motion.div>
            );
          })}
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#F5F7FA] to-white rounded-3xl p-8 md:p-12 border border-gray-200"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl mb-2">成就徽章</h3>
            <p className="text-gray-600">解锁更多徽章，展示你的编程实力</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: badge.earned ? 1.1 : 1.05,
                  rotate: badge.earned ? [0, -5, 5, 0] : 0,
                }}
                className={`relative ${
                  badge.earned ? "" : "opacity-40 grayscale"
                }`}
              >
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl border-2 ${
                    badge.earned
                      ? "bg-white shadow-lg"
                      : "bg-gray-100 border-gray-200"
                  }`}
                  style={
                    badge.earned
                      ? { borderColor: badge.color + "40", boxShadow: `0 10px 30px ${badge.color}30` }
                      : {}
                  }
                >
                  {badge.icon}
                </div>
                <div className="text-center mt-3">
                  <div className="text-sm">{badge.name}</div>
                </div>

                {/* Sparkle effect for earned badges */}
                {badge.earned && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    style={{ backgroundColor: badge.color }}
                  >
                    <Star className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </FigmaContainer>
    </section>
  );
}
