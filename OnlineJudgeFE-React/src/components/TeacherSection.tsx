import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Users, BarChart3, BookOpen, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FigmaContainer } from './FigmaContainer'; // 8080精确容器

const features = [
  {
    icon: Users,
    title: "班级管理",
    description: "轻松创建和管理多个班级",
  },
  {
    icon: BookOpen,
    title: "题目布置",
    description: "灵活分配编程作业和练习",
  },
  {
    icon: BarChart3,
    title: "数据分析",
    description: "查看学生学习进度和成绩",
  },
  {
    icon: CheckCircle2,
    title: "错题追踪",
    description: "智能分析学生薄弱环节",
  },
];

export function TeacherSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #3DBAFB 0px, #3DBAFB 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #3DBAFB 0px, #3DBAFB 1px, transparent 1px, transparent 40px)`
        }} />
      </div>

      <FigmaContainer className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1604933834215-2a64950311bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwY2xhc3Nyb29tJTIwZGlnaXRhbHxlbnwxfHx8fDE3NjE1Nzc4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Teacher classroom digital"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3DBAFB]/30 to-transparent" />
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8ED1A9] to-[#8ED1A9]/70 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl text-[#8ED1A9]">320+</div>
                    <div className="text-xs text-gray-500">活跃学生</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA726] to-[#FFA726]/70 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl text-[#FFA726]">95%</div>
                    <div className="text-xs text-gray-500">完成率</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3DBAFB]/10 border border-[#3DBAFB]/20">
              <Users className="w-4 h-4 text-[#3DBAFB]" />
              <span className="text-sm text-[#3DBAFB]">教师专区</span>
            </div>

            <h2 className="text-3xl md:text-4xl">
              <span className="inline-block">👩‍🏫</span> 教师管理与
              <br />
              <span className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
                课堂智能
              </span>
            </h2>

            <p className="text-lg text-gray-600">
              老师可创建班级、布置题目、查看学生错题分析与成长报告，
              让教学更高效，管理更轻松。
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-6 h-6 text-[#3DBAFB] mb-2" />
                    <h4 className="text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pt-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90">
                了解教师专区
                <Users className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Data Flow Animation */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-[#3DBAFB]/10 to-[#8ED1A9]/10 rounded-full blur-3xl -z-10"
            />
          </motion.div>
        </div>
      </FigmaContainer>
    </section>
  );
}
