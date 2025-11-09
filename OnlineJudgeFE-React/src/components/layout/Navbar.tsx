import { Link } from 'react-router-dom'
import { Code, Home, BookOpen, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Code className="w-6 h-6" />
            <span>MetaSeekOJ</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                首页
              </Button>
            </Link>
            
            <Link to="/problem">
              <Button variant="ghost" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                题库
              </Button>
            </Link>
            
            <Link to="/contest">
              <Button variant="ghost" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                竞赛
              </Button>
            </Link>
            
            <Link to="/rank">
              <Button variant="ghost" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                排行榜
              </Button>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              登录
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              注册
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

