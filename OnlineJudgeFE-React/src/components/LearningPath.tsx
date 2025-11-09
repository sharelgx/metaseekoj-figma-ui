import { motion } from "motion/react";
import { Blocks, Code2, Trophy, Sparkles } from "lucide-react";
import { FigmaContainer } from './FigmaContainer'; // 8080精确容器

const stages = [
  {
    icon: Blocks,
    title: "Scratch",
    subtitle: "图形编程",
    description: "从积木开始，建立编程思维",
    color: "#FFA726",
    bgColor: "bg-[#FFA726]/10",
    textColor: "text-[#FFA726]",
  },
  {
    icon: Code2,
    title: "Python",
    subtitle: "语言过渡",
    description: "掌握文本编程的基础",
    color: "#3DBAFB",
    bgColor: "bg-[#3DBAFB]/10",
    textColor: "text-[#3DBAFB]",
  },
  {
    icon: Trophy,
    title: "C++",
    subtitle: "进阶竞赛",
    description: "算法与数据结构深造",
    color: "#8ED1A9",
    bgColor: "bg-[#8ED1A9]/10",
    textColor: "text-[#8ED1A9]",
  },
  {
    icon: Sparkles,
    title: "AI 生成题",
    subtitle: "竞赛挑战",
    description: "智能题库与竞赛实战",
    color: "#C49CFF",
    bgColor: "bg-[#C49CFF]/10",
    textColor: "text-[#C49CFF]",
  },
];

export function LearningPath() {
  return (
    <section style={{ padding: '80px 0', background: 'white' }}> {/* 8080精确值: py-20 = 80px 0 */}
      <FigmaContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl mb-4">
            学习路线图 <span className="inline-block">🧭</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            从积木到代码，从代码到竞赛，循序渐进掌握编程技能
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FFA726] via-[#3DBAFB] via-[#8ED1A9] to-[#C49CFF] -translate-y-1/2 opacity-20" />

          {/* Stages - 8080精确grid: 4列, gap-8 = 32px */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '32px' }}>
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className={`stage-card-item relative`} // 🔴 添加stage-card-item类名，用于精确hover
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 flex items-center justify-center shadow-md">
                      <span className="text-sm text-gray-600">{index + 1}</span>
                    </div>

                    {/* Icon - 8080精确样式: 卡片hover时旋转 */}
                    <div
                      className="stage-icon-box w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ 
                        backgroundColor: stage.color + '1A', // 8080: stage.color + '1A' (10%透明)
                        transition: 'transform 0.6s', // 8080: transition
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: stage.color }} /> {/* 8080: 纯色 */}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl mb-1" style={{ color: stage.color }}> {/* 8080: 内联color */}
                      {stage.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{stage.subtitle}</p>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>

                  {/* Glow Effect - 增强彩色晕染（与8080一致） */}
                  <div
                    className="stage-glow-effect"
                    style={{
                      position: 'absolute',
                      inset: '-20px', // 🔴 增大范围，确保可见
                      background: stage.color,
                      borderRadius: '24px',
                      filter: 'blur(40px)', // 🔴 增强模糊
                      zIndex: 1, // 🔴 在卡片下方（卡片zIndex是2）
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}
                    data-color={stage.color}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </FigmaContainer>
    </section>
  );
}
