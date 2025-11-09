import { Button } from "./ui/button";
import { Sparkles, Code, Brain, Zap } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-16 h-16 rounded-xl bg-[#3DBAFB]/10 flex items-center justify-center"
        >
          <Code className="w-8 h-8 text-[#3DBAFB]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-40 right-20 w-12 h-12 rounded-full bg-[#FFA726]/10 flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 text-[#FFA726]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 w-14 h-14 rounded-xl bg-[#C49CFF]/10 flex items-center justify-center"
        >
          <Brain className="w-7 h-7 text-[#C49CFF]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-[#8ED1A9]/10 flex items-center justify-center"
        >
          <Zap className="w-5 h-5 text-[#8ED1A9]" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3DBAFB]/10 border border-[#3DBAFB]/20">
              <Sparkles className="w-4 h-4 text-[#3DBAFB]" />
              <span className="text-sm text-[#3DBAFB]">AI 智能辅助学习</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
              用 AI 助你
              <br />
              <span className="bg-gradient-to-r from-[#3DBAFB] via-[#8ED1A9] to-[#C49CFF] bg-clip-text text-transparent">
                闯编程关卡！
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl">
              自动题库＋智能错题本，让每一次挑战都更聪明。
              为 8-15 岁青少年打造的趣味编程学习平台。
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:shadow-xl transition-shadow">
                  立即挑战
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline">
                  了解更多
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              {[
                { number: "10,000+", label: "在线学员" },
                { number: "500+", label: "编程题目" },
                { number: "98%", label: "满意度" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl text-[#3DBAFB]">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1603354350266-a8de3496163b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwbGVhcm5pbmclMjBjb2RpbmclMjByb2JvdHxlbnwxfHx8fDE3NjE1Nzc4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Kids learning coding"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3DBAFB]/20 to-transparent" />
            </motion.div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA726] to-[#FFA726]/70 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">AI 智能助手</div>
                  <div className="text-[#3DBAFB]">24/7 在线指导</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
