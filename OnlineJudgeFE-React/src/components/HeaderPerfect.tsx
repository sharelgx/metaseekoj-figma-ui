import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Rocket, Home, BookOpen, Trophy, TrendingUp, Users, Menu as MenuIcon, User, Settings, LogOut, FileText, Bookmark, Award } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import axios from '@/api/axios';
import tokens from '../design-tokens';
import { getAvatarUrl, DEFAULT_AVATAR_URL } from '@/utils/avatar';
import './HeaderUserMenu.css';

interface UserProfile {
  id?: number;
  username: string;
  real_name?: string;
  avatar?: string;
  admin_type?: string;
  is_super_admin?: boolean;
}

interface WebsiteConfig {
  website_name?: string;
  website_name_shortcut?: string;
  allow_register?: boolean;
}

export function HeaderPerfect() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [website, setWebsite] = useState<WebsiteConfig>({
    website_name: '元探索少儿编程', // 🔴 修复默认值
    website_name_shortcut: '元探索',
    allow_register: true
  });
  const [activeMenu, setActiveMenu] = useState('/');

  useEffect(() => {
    loadUserProfile();
    loadWebsiteConfig();
    
    // 🔴 根据当前路径设置activeMenu
    updateActiveMenu();
    
    // 🔴 监听路由变化（监听popstate和自定义导航事件）
    const handleRouteChange = () => {
      updateActiveMenu();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // 🔴 根据pathname更新activeMenu
  const updateActiveMenu = () => {
    const path = window.location.pathname;
    let newActiveMenu = path;
    
    if (path === '/' || path === '/home') {
      newActiveMenu = '/';
    } else if (path.startsWith('/problem')) {
      newActiveMenu = '/problem';
    } else if (path.startsWith('/choice-question')) {
      newActiveMenu = '/choice-questions';
    } else if (path.startsWith('/contest')) {
      newActiveMenu = '/contest';
    }
    
    console.log('🎯 导航栏active更新:', { 
      currentPath: path, 
      activeMenu: newActiveMenu 
    });
    setActiveMenu(newActiveMenu);
  };

  const loadUserProfile = async () => {
    try {
      const response = await axios.get('/profile/');
      const data = response.data?.data;
      if (!data) {
        setIsAuthenticated(false);
        setProfile(null);
        return;
      }

      const userData = data.user || {};
      const normalized: UserProfile = {
        id: userData.id,
        username: userData.username || data.username || '',
        real_name: data.real_name || userData.real_name,
        avatar: data.avatar || userData.avatar,
        admin_type: userData.admin_type || data.admin_type,
        is_super_admin: userData.is_super_admin || data.is_super_admin,
      };

      setProfile(normalized);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setProfile(null);
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
      // 🔴 页面会重新加载，useEffect会自动调用updateActiveMenu()
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
    if (!profile) return false;
    if (profile.is_super_admin) return true;
    const type = profile.admin_type?.toLowerCase();
    return type === 'super admin' || type === 'admin';
  };

  return (
    <header
      style={{
        ...tokens.components.header,
        width: '100%',
        left: 0,
        right: 0,
        top: 0,
      }}
    >
      <div style={{ maxWidth: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: tokens.components.header.height }}>
          {/* Logo - 精确复刻8080 */}
          <div 
            onClick={() => handleRoute('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: tokens.components.logo.marginLeft,
              marginRight: tokens.components.logo.marginRight,
              cursor: 'pointer',
              lineHeight: '60px',
            }}
          >
            <div
              style={{
                width: tokens.components.logo.iconSize,
                height: tokens.components.logo.iconSize,
                borderRadius: tokens.components.logo.iconRadius,
                background: tokens.components.logo.iconGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Rocket style={{ width: '24px', height: '24px', color: 'white', display: 'block' }} />
            </div>
            <span
              style={{
                fontSize: tokens.components.logo.textSize,
                fontWeight: tokens.components.logo.textWeight,
                letterSpacing: '-0.025em',
                color: tokens.components.logo.textColor,
                whiteSpace: 'nowrap', // 🔴 防止换行
              }}
            >
              {website.website_name || '元探索少儿编程'}
            </span>
          </div>

          {/* Navigation - Desktop (精确复刻8080) */}
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1, 
            gap: 0,
            flexWrap: 'nowrap', // 🔴 防止换行
            overflow: 'visible', // 🔴 确保内容可见
          }} className="hidden md:flex">
            <NavItemPerfect 
              icon={Home} 
              label="首页" 
              active={activeMenu === '/'}
              onClick={() => handleRoute('/')}
            />
            <NavItemPerfect 
              icon={BookOpen} 
              label="问题" 
              active={activeMenu === '/problem'}
              onClick={() => handleRoute('/problem')}
            />
            <NavItemPerfect 
              icon={FileText} 
              label="选择题" 
              active={activeMenu === '/choice-questions'}
              onClick={() => handleRoute('/choice-questions')}
            />
            <NavItemPerfect 
              icon={FileText} 
              label="专题练习" 
              active={activeMenu === '/topics'}
              onClick={() => handleRoute('/topics')}
            />
            {isAuthenticated && (
              <NavItemPerfect 
                icon={Bookmark} 
                label="我的作业" 
                active={activeMenu === '/homework'}
                onClick={() => handleRoute('/homework')}
              />
            )}
            <NavItemPerfect 
              icon={Trophy} 
              label="练习&比赛" 
              active={activeMenu === '/contest'}
              onClick={() => handleRoute('/contest')}
            />
            
            {/* 状态菜单已隐藏 */}
            
            {/* 排名子菜单 - 8080样式（✅ 使用SubMenuPerfect组件，含hover下划线） */}
            <SubMenuPerfect icon={Award} label="排名">
              <DropdownMenuItem onClick={() => handleRoute('/acm-rank')}>
                <Trophy className="w-4 h-4" />
                ACM排名
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoute('/oi-rank')}>
                <Trophy className="w-4 h-4" />
                OI排名
              </DropdownMenuItem>
            </SubMenuPerfect>
          </nav>

          {/* Right Actions (精确复刻8080) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginRight: '20px',
            flexShrink: 0, // 🔴 防止被压缩
            whiteSpace: 'nowrap', // 🔴 防止换行
          }}>
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="hidden md:inline-flex"
                  style={{
                    ...tokens.components.navButton,
                    ...tokens.components.navButton.ghost,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap', // 🔴 防止文字换行
                    flexShrink: 0, // 🔴 防止压缩
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = tokens.components.navButton.ghost.hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = tokens.components.navButton.ghost.background}
                >
                  登录
                </button>
                
                {website.allow_register && (
                  <button
                    onClick={() => window.location.href = '/register'}
                    className="hidden md:inline-flex"
                    style={{
                      ...tokens.components.navButton,
                      ...tokens.components.navButton.ghost,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap', // 🔴 防止文字换行
                      flexShrink: 0, // 🔴 防止压缩
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = tokens.components.navButton.ghost.hoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.background = tokens.components.navButton.ghost.background}
                  >
                    注册
                  </button>
                )}
                
                <button
                  onClick={() => handleRoute('/')}
                  className="hidden md:inline-flex"
                  style={{
                    ...tokens.components.navButton,
                    background: tokens.components.navButton.primary.background,
                    color: tokens.components.navButton.primary.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = String(tokens.components.navButton.primary.hoverOpacity)}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <Rocket style={{ width: '16px', height: '16px' }} />
                  马上开始闯关
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleRoute('/')}
                  className="hidden md:inline-flex"
                  style={{
                    ...tokens.components.navButton,
                    background: tokens.components.navButton.primary.background,
                    color: tokens.components.navButton.primary.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = String(tokens.components.navButton.primary.hoverOpacity)}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <Rocket style={{ width: '16px', height: '16px' }} />
                  马上开始闯关
                </button>

                {/* 用户菜单 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="oj-user-toggle">
                      <img
                        src={getUserAvatarUrl()}
                        alt="用户头像"
                        className="oj-user-avatar"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_AVATAR_URL;
                        }}
                      />
                      <span className="oj-user-name">{profile?.real_name || profile?.username}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="oj-user-dropdown">
                    <DropdownMenuItem onClick={() => handleRoute('/user-home')}>
                      <User className="w-4 h-4 mr-2" />
                      我的主页
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/homework')}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      我的作业
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/status?myself=1')}>
                      <FileText className="w-4 h-4 mr-2" />
                      我的提交
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/status')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      编程题提交
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/unified-status')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      统一提交记录
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/exam-history')}>
                      <Award className="w-4 h-4 mr-2" />
                      考试历史
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/wrong-questions')}>
                      <Bookmark className="w-4 h-4 mr-2" />
                      错题本
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute('/setting/profile')}>
                      <Settings className="w-4 h-4 mr-2" />
                      我的设置
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
            <button 
              className="md:hidden"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                background: 'transparent',
                color: '#333',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// 导航项组件 - 100%精确复刻iView Menu-item（✅ 8080像素级复刻 - 含hover下划线）
function NavItemPerfect({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: tokens.spacing.navItemPadding,
        height: tokens.spacing.navItemHeight,
        fontSize: tokens.typography.navItem.fontSize,
        fontWeight: tokens.typography.navItem.fontWeight,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        // 8080: hover或active时都显示蓝色下划线
        borderBottom: (isHovered || active) ? tokens.effects.activeBorder : '2px solid transparent',
        color: isHovered || active ? tokens.typography.navItem.colorActive : tokens.typography.navItem.color,
        transition: tokens.effects.transition.colors,
        whiteSpace: 'nowrap', // 🔴 防止文字换行竖排
        flexShrink: 0, // 🔴 防止压缩
      }}
    >
      <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
      {label}
    </button>
  );
}

// 子菜单组件 - 100%精确复刻iView Submenu（✅ 8080像素级复刻 - 含hover下划线）
function SubMenuPerfect({ 
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: tokens.spacing.navItemPadding,
            height: tokens.spacing.navItemHeight,
            fontSize: tokens.typography.navItem.fontSize,
            fontWeight: tokens.typography.navItem.fontWeight,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            // 8080: hover或open时都显示蓝色下划线
            borderBottom: (isHovered || isOpen) ? tokens.effects.activeBorder : '2px solid transparent',
            color: (isHovered || isOpen) ? tokens.typography.navItem.colorHover : tokens.typography.navItem.color,
            transition: tokens.effects.transition.colors,
          }}
        >
          <Icon style={{ width: '16px', height: '16px' }} />
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

