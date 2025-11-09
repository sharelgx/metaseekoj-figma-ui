import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Rocket, Home, BookOpen, Trophy, TrendingUp, Users, Menu as MenuIcon, User, Settings, LogOut, FileText, Bookmark, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import axios from '@/api/axios';
import { getAvatarUrl, DEFAULT_AVATAR_URL } from '@/utils/avatar';

interface UserProfile {
  id: number;
  username: string;
  real_name?: string;
  avatar?: string;
  admin_type?: string;
}

interface WebsiteConfig {
  website_name: string;
  website_name_shortcut: string;
  allow_register: boolean;
}

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [website, setWebsite] = useState<WebsiteConfig>({
    website_name: 'MetaSeekOJ',
    website_name_shortcut: 'MetaSeekOJ',
    allow_register: true
  });
  const [activeMenu, setActiveMenu] = useState('/');

  useEffect(() => {
    loadUserProfile();
    loadWebsiteConfig();
    
    // 设置当前激活的菜单
    const path = window.location.pathname;
    setActiveMenu(path);
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await axios.get('/profile/');
      if (response.data.data) {
        const profileData = response.data.data;
        // UserProfileSerializer返回的数据结构：{user: {id, username, admin_type, ...}, avatar, ...}
        // 需要提取user字段中的信息
        const userInfo = profileData.user || {};
        setProfile({
          id: userInfo.id,
          username: userInfo.username,
          real_name: profileData.real_name,
          avatar: profileData.avatar,
          admin_type: userInfo.admin_type  // 从user对象中获取
        });
        setIsAuthenticated(true);
        console.log('✅ 用户权限:', userInfo.admin_type);
      }
    } catch (error) {
      console.log('未登录');
      setIsAuthenticated(false);
    }
  };

  const loadWebsiteConfig = async () => {
    try {
      const response = await axios.get('/website/');
      if (response.data.data) {
        setWebsite(response.data.data);
      }
    } catch (error) {
      console.error('加载网站配置失败:', error);
    }
  };

  const handleRoute = (path: string) => {
    if (path === '/admin') {
      window.open('/admin/', '_blank');
    } else {
      window.location.href = path;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const getUserAvatarUrl = () => {
    if (!profile) {
      return DEFAULT_AVATAR_URL;
    }
    return getAvatarUrl(profile.avatar, profile.username);
  };

  const isAdminRole = () => {
    return profile && (profile.admin_type === 'Super Admin' || profile.admin_type === 'Admin');
  };
  
  const isTeacherOrAdmin = () => {
    return profile && (
      profile.admin_type === 'Teacher' || 
      profile.admin_type === 'Admin' || 
      profile.admin_type === 'Super Admin'
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      style={{ 
        boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
        minWidth: '300px'
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '100%', position: 'relative' }}>
        <div className="flex items-center" style={{ height: '60px' }}>
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleRoute('/')}
            style={{ marginLeft: '2%', marginRight: '2%' }}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3DBAFB] to-[#C49CFF] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-medium tracking-tight" style={{ fontSize: '20px', fontWeight: 500, color: '#333' }}>
              {website.website_name}
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center flex-1" style={{ gap: '0px' }}>
            <NavItem 
              icon={Home} 
              label="首页" 
              path="/"
              active={activeMenu === '/'}
              onClick={() => handleRoute('/')}
            />
            <NavItem 
              icon={BookOpen} 
              label="题库" 
              path="/problem"
              active={activeMenu === '/problem'}
              onClick={() => handleRoute('/problem')}
            />
            <NavItem 
              icon={FileText} 
              label="选择题" 
              path="/choice-questions"
              active={activeMenu === '/choice-questions'}
              onClick={() => handleRoute('/choice-questions')}
            />
            <NavItem 
              icon={FileText} 
              label="专题练习" 
              path="/topics"
              active={activeMenu === '/topics'}
              onClick={() => handleRoute('/topics')}
            />
            {isAuthenticated && (
              <NavItem 
                icon={Bookmark} 
                label="我的作业" 
                path="/homework"
                active={activeMenu === '/homework'}
                onClick={() => handleRoute('/homework')}
              />
            )}
            {isTeacherOrAdmin() && (
              <NavItem 
                icon={Sparkles} 
                label="智慧课堂" 
                path="/classroom"
                active={activeMenu === '/classroom' || activeMenu.startsWith('/classroom')}
                onClick={() => handleRoute('/classroom')}
              />
            )}
            <NavItem 
              icon={Trophy} 
              label="比赛" 
              path="/contest"
              active={activeMenu === '/contest'}
              onClick={() => handleRoute('/contest')}
            />
            
            {/* 状态子菜单 */}
            <DropdownMenuWithHover icon={TrendingUp} label="状态">
              <DropdownMenuItem onClick={() => handleRoute('/status')}>
                编程提交
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoute('/unified-status')}>
                统一提交
              </DropdownMenuItem>
            </DropdownMenuWithHover>

            {/* 排名子菜单 */}
            <DropdownMenuWithHover icon={Award} label="排名">
              <DropdownMenuItem onClick={() => handleRoute('/acm-rank')}>
                ACM排名
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoute('/oi-rank')}>
                OI排名
              </DropdownMenuItem>
            </DropdownMenuWithHover>

            {/* 关于子菜单 - 已隐藏 */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-gray-600 hover:text-[#3DBAFB] hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  关于
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleRoute('/about')}>
                  判题机
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoute('/FAQ')}>
                  常见问题
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </nav>

          {/* Right Actions */}
          <div 
            className="flex items-center gap-3" 
            style={{
              marginRight: '20px'
            }}
          >
            {!isAuthenticated ? (
              <>
                {/* 登录按钮 */}
                <Button 
                  variant="ghost" 
                  className="hidden md:inline-flex"
                  onClick={() => window.location.href = '/login'}
                  style={{
                    height: '36px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#333',
                    background: 'transparent',
                    border: 'none'
                  }}
                >
                  登录
                </Button>
                
                {/* 注册按钮 */}
                {website.allow_register && (
                  <Button 
                    variant="ghost" 
                    className="hidden md:inline-flex"
                    onClick={() => window.location.href = '/register'}
                    style={{
                      height: '36px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#333',
                      background: 'transparent',
                      border: 'none'
                    }}
                  >
                    注册
                  </Button>
                )}
                
                {/* 马上开始闯关按钮 */}
                <Button 
                  className="hidden md:inline-flex text-white"
                  onClick={() => handleRoute('/')}
                  style={{
                    height: '36px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    background: 'linear-gradient(to right, #3DBAFB, #8ED1A9)',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Rocket className="w-4 h-4" />
                  马上开始闯关
                </Button>
              </>
            ) : (
              <>
                {/* 马上开始闯关按钮 - 已登录 */}
                <Button 
                  className="hidden md:inline-flex text-white"
                  onClick={() => handleRoute('/')}
                  style={{
                    height: '36px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    background: 'linear-gradient(to right, #3DBAFB, #8ED1A9)',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Rocket className="w-4 h-4" />
                  马上开始闯关
                </Button>

                {/* 用户菜单 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all">
                      <img 
                        src={getUserAvatarUrl()} 
                        alt="用户头像" 
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = DEFAULT_AVATAR_URL
                        }}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                        {profile?.real_name || profile?.username}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleRoute('/user-home')}>
                      <User className="w-4 h-4 mr-2" />
                      我的主页
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/status?myself=1')}>
                      <FileText className="w-4 h-4 mr-2" />
                      我的提交
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/exam-history')}>
                      <FileText className="w-4 h-4 mr-2" />
                      考试历史
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/wrong-questions')}>
                      <Bookmark className="w-4 h-4 mr-2" />
                      错题本
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/setting/profile')}>
                      <Settings className="w-4 h-4 mr-2" />
                      设置
                    </DropdownMenuItem>
                    {isAdminRole() && (
                      <DropdownMenuItem onClick={() => handleRoute('/admin')}>
                        <Users className="w-4 h-4 mr-2" />
                        管理后台
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// 导航项组件（完全模仿iView Menu样式 - 8080像素级复刻）
function NavItem({ 
  icon: Icon, 
  label, 
  path, 
  active, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  path: string; 
  active: boolean; 
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center gap-1.5 transition-all"
      style={{
        padding: '0 20px',
        height: '60px',
        fontSize: '14px',
        fontWeight: 'normal',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        // 8080: hover或active时显示蓝色下划线
        borderBottom: (isHovered || active) ? '2px solid #2d8cf0' : '2px solid transparent',
        color: (isHovered || active) ? '#2d8cf0' : '#495060',
        transition: 'color 0.2s ease, border-bottom 0.2s ease'
      }}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// 带hover下划线效果的下拉菜单组件（8080像素级复刻）
function DropdownMenuWithHover({ 
  icon: Icon, 
  label, 
  children 
}: { 
  icon: any; 
  label: string; 
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center gap-1.5 transition-all"
          style={{
            padding: '0 20px',
            height: '60px',
            fontSize: '14px',
            fontWeight: 'normal',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            // 8080: hover或open时显示蓝色下划线
            borderBottom: (isHovered || isOpen) ? '2px solid #2d8cf0' : '2px solid transparent',
            color: (isHovered || isOpen) ? '#2d8cf0' : '#495060',
            transition: 'color 0.2s ease, border-bottom 0.2s ease'
          }}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
