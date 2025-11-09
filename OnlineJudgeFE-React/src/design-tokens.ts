/**
 * MetaSeekOJ 设计令牌系统
 * 从8080 Vue.js版本精确提取的所有设计值
 * 确保8081 React版本像素级一致
 */

export const DesignTokens = {
  // ============================================================
  // 颜色系统 (从8080精确提取)
  // ============================================================
  colors: {
    // 主题色 (Figma设计)
    blue: '#3DBAFB',
    green: '#8ED1A9',
    orange: '#FFA726',
    purple: '#C49CFF',
    
    // iView系统色
    iviewBlue: '#2d8cf0',        // iView主色，用于激活和hover
    
    // 文本颜色 (Tailwind精确值)
    text: {
      dark: '#171717',           // gray-900
      primary: '#333',           // 主要文字
      secondary: '#495060',      // 次要文字 (iView默认)
      600: '#525252',            // gray-600
      500: '#737373',            // gray-500
      400: '#a3a3a3',            // gray-400
    },
    
    // 背景颜色
    bg: {
      white: '#ffffff',
      gray: '#F5F7FA',           // Figma背景灰
      grayLight: '#f5f5f5',      // hover背景
      grayBorder: '#e5e5e5',     // gray-200边框
    },
    
    // 渐变 (精确定义)
    gradients: {
      logoBluePurple: 'linear-gradient(to bottom right, #3DBAFB, #C49CFF)',
      btnBlueGreen: 'linear-gradient(to right, #3DBAFB, #8ED1A9)',
      titleMulti: 'linear-gradient(90deg, #3DBAFB 0%, #8ED1A9 50%, #C49CFF 100%)',
      heroBackground: 'linear-gradient(135deg, #F5F7FA 0%, #ffffff 50%, #F5F7FA 100%)',
    }
  },

  // ============================================================
  // 间距系统 (从8080精确提取)
  // ============================================================
  spacing: {
    // Header导航
    headerHeight: '60px',
    headerPaddingX: '2%',
    navItemPadding: '0 20px',
    navItemHeight: '60px',
    
    // 按钮
    buttonHeight: '36px',
    buttonHeightLg: '44px',
    buttonPadding: '8px 16px',
    buttonPaddingLg: '0 32px',
    
    // Hero区域
    heroPaddingTop: '128px',    // pt-32
    heroPaddingBottom: '80px',  // pb-20
    heroGridGap: '48px',        // gap-12
    heroContentGap: '24px',     // space-y-6
    
    // Section通用
    sectionPaddingY: '80px',    // py-20
    sectionHeaderMarginBottom: '64px',  // mb-16
    
    // Container
    containerPadding: '0 24px', // px-6
    containerMaxWidths: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // 卡片间距
    cardGap: '24px',            // gap-6
    cardPadding: '24px',        // p-6
    cardPaddingLg: '32px',      // p-8
  },

  // ============================================================
  // 字体系统 (从8080精确提取)
  // ============================================================
  typography: {
    // Header导航
    logo: {
      fontSize: '20px',
      fontWeight: 500,
      letterSpacing: '-0.025em',
      color: '#333',
    },
    navItem: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#495060',
      colorHover: '#2d8cf0',
      colorActive: '#2d8cf0',
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
    },
    
    // Hero区域
    heroTitle: {
      fontSize: {
        base: '36px',    // text-4xl
        md: '48px',      // md:text-5xl
        lg: '60px',      // lg:text-6xl
      },
      fontWeight: 600,
      lineHeight: 1.1,
    },
    heroDescription: {
      fontSize: '18px',
      lineHeight: 1.6,
      color: '#525252',
      maxWidth: '576px',
    },
    
    // Section标题
    sectionTitle: {
      fontSize: {
        base: '30px',    // text-3xl
        md: '36px',      // md:text-4xl
      },
      fontWeight: 'bold',
      color: '#171717',
    },
    sectionDesc: {
      fontSize: '16px',
      color: '#525252',
      maxWidth: '672px',
    },
    
    // 统计数字
    statNumber: {
      fontSize: '32px',
      fontWeight: 600,
      color: '#3DBAFB',
    },
    statLabel: {
      fontSize: '14px',
      color: '#737373',
    },
  },

  // ============================================================
  // 效果系统 (从8080精确提取)
  // ============================================================
  effects: {
    // 阴影
    headerShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
    cardShadow: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    
    // 圆角
    radius: {
      sm: '4px',
      md: '6px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '24px',
      full: '9999px',
    },
    
    // 过渡动画
    transition: {
      fast: '0.2s ease',
      base: '0.3s',
      slow: '0.5s',
      colors: 'color 0.2s ease',
      all: 'all 0.2s ease',
      transform: 'transform 0.3s',
    },
    
    // 边框
    activeBorder: '2px solid #2d8cf0',
    borderColor: '#e5e5e5',
    borderColorLight: '#f5f5f5',
  },

  // ============================================================
  // 组件特定样式 (从8080精确提取)
  // ============================================================
  components: {
    header: {
      height: '60px',
      background: '#fff',
      boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      zIndex: 1000,
      minWidth: '300px',
    },
    
    logo: {
      iconSize: '40px',
      iconRadius: '12px',
      iconGradient: 'linear-gradient(to bottom right, #3DBAFB, #C49CFF)',
      textSize: '20px',
      textWeight: 500,
      textColor: '#333',
      marginLeft: '2%',
      marginRight: '2%',
    },
    
    navButton: {
      height: '36px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: 500,
      borderRadius: '6px',
      ghost: {
        background: 'transparent',
        color: '#333',
        hoverBg: '#f5f5f5',
      },
      primary: {
        background: 'linear-gradient(to right, #3DBAFB, #8ED1A9)',
        color: 'white',
        hoverOpacity: 0.9,
      }
    },
    
    heroButton: {
      height: '44px',
      padding: '0 32px',
      fontSize: '16px',
      fontWeight: 500,
      borderRadius: '6px',
      primary: {
        background: 'linear-gradient(90deg, #3DBAFB, #8ED1A9)',
        color: 'white',
        hoverScale: 1.05,
        hoverShadow: '0 12px 32px rgba(61, 186, 251, 0.3)',
      },
      ghost: {
        background: 'white',
        color: '#171717',
        border: '1px solid #e5e5e5',
        hoverScale: 1.05,
        hoverBorder: '#3DBAFB',
        hoverColor: '#3DBAFB',
      }
    },
  },

  // ============================================================
  // 动画系统 (从8080精确提取)
  // ============================================================
  animations: {
    // 浮动元素
    float1: {
      duration: '6s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: {
        '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
        '50%': { transform: 'translateY(-20px) rotate(5deg)' }
      }
    },
    float2: {
      duration: '5s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: {
        '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
        '50%': { transform: 'translateY(20px) rotate(-5deg)' }
      }
    },
    float3: {
      duration: '7s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-15px)' }
      }
    },
    float4: {
      duration: '8s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: {
        '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
        '50%': { transform: 'translateY(25px) rotate(10deg)' }
      }
    },
    
    // 页面进入动画
    slideInLeft: {
      duration: '0.8s',
      timing: 'ease-out',
      from: { opacity: 0, transform: 'translateX(-50px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    slideInRight: {
      duration: '0.8s',
      timing: 'ease-out',
      from: { opacity: 0, transform: 'translateX(50px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    fadeInUp: {
      duration: '0.6s',
      timing: 'ease-out',
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    fadeInDown: {
      duration: '0.6s',
      timing: 'ease-out',
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
  },

  // ============================================================
  // 响应式断点 (Tailwind标准)
  // ============================================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default DesignTokens;

