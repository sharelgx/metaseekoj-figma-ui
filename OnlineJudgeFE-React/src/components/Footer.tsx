import { motion } from "motion/react";
import { Rocket, Mail, Github, Heart } from "lucide-react";
import { FigmaContainer } from './FigmaContainer'; // 8080精确容器

const socialLinks = [
  { icon: Mail, label: "邮箱", href: "#", color: "#FFA726" },
  { icon: Github, label: "GitHub", href: "#", color: "#3DBAFB" },
  { icon: Heart, label: "公众号", href: "#", color: "#C49CFF" },
];

const footerLinks = [
  {
    title: "产品",
    links: ["题库", "比赛", "成长记录", "教师专区"],
  },
  {
    title: "资源",
    links: ["学习路线", "使用指南", "API 文档", "常见问题"],
  },
  {
    title: "关于",
    links: ["关于我们", "加入我们", "隐私政策", "服务条款"],
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 relative overflow-hidden" style={{ width: '100%' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* 8080: Footer内容使用FigmaContainer */}
      <FigmaContainer className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3DBAFB] to-[#C49CFF] flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl">MetaSeekOJ</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                少儿编程的智能成长伙伴，用 AI 技术让编程学习更有趣、更高效。
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" style={{ color: social.color }} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>
              © 2025 MetaSeekOJ - 少儿编程的智能成长伙伴. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <span>基于</span>
              <a
                href="#"
                className="text-[#3DBAFB] hover:text-[#8ED1A9] transition-colors"
              >
                QDUOJ
              </a>
              <span>开源改造 + AI 增强功能</span>
            </div>
          </div>
        </motion.div>
      </FigmaContainer>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-16 h-16 rounded-xl bg-[#3DBAFB]/10 blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-12 h-12 rounded-full bg-[#C49CFF]/10 blur-xl"
      />
    </footer>
  );
}
