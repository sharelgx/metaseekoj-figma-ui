import { Rocket, Mail, Github, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const footerSections = [
    {
      title: '产品',
      links: [
        { name: '题库', href: '/problem' },
        { name: '比赛', href: '/contest' },
        { name: '成长记录', href: '/status' },
        { name: '教师专区', href: '/teacher' }
      ]
    },
    {
      title: '资源',
      links: [
        { name: '学习路线', href: '#' },
        { name: '使用指南', href: '#' },
        { name: 'API 文档', href: '#' },
        { name: '常见问题', href: '#' }
      ]
    },
    {
      title: '关于',
      links: [
        { name: '关于我们', href: '/about' },
        { name: '加入我们', href: '#' },
        { name: '隐私政策', href: '#' },
        { name: '服务条款', href: '#' }
      ]
    }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* 主内容网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* 品牌区域 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MetaSeekOJ
              </span>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-sm">
              少儿编程的智能成长伙伴，用 AI 技术让编程学习更有趣、更高效。
            </p>
            
            {/* 社交链接 */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Support"
              >
                <Heart className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* 链接区域 */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部栏 */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 text-center md:text-left">
              © 2025 <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">MetaSeekOJ</Link> - 少儿编程的智能成长伙伴. All rights reserved.
            </div>
            <div className="text-sm text-gray-600 text-center md:text-right">
              <span>基于 </span>
              <a 
                href="https://github.com/QingdaoU/OnlineJudge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                QDUOJ
              </a>
              <span> 开源改造 + AI 增强功能</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

