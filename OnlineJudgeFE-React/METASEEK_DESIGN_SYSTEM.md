# 🎨 MetaSeekOJ 智慧课堂设计系统

## 📋 概述

本文档定义了智慧课堂前端的设计系统，**完全遵循现有 MetaSeekOJ（8080端口）的设计风格**。

---

## 🎨 颜色系统

### 品牌色（与 8080 完全一致）

```css
/* 主色调 */
--metaseek-blue: #3DBAFB;      /* 主蓝色 - 用于主要交互 */
--metaseek-green: #8ED1A9;     /* 绿色 - 用于成功状态 */
--metaseek-orange: #FFA726;    /* 橙色 - 用于 Scratch/强调 */
--metaseek-purple: #C49CFF;    /* 紫色 - 用于 C++/高级 */

/* 背景色 */
--metaseek-bg-gray: #F5F7FA;   /* 浅灰背景 */
--body-bg: #EEEEEE;            /* 页面背景 */

/* 文本色 */
--metaseek-text-600: #525252;  /* 主文本 */
--metaseek-text-500: #737373;  /* 次文本 */
--metaseek-text-400: #a3a3a3;  /* 辅助文本 */
--metaseek-text-200: #e5e5e5;  /* 边框 */
```

### 渐变色

```css
/* Logo 渐变 */
background: linear-gradient(to bottom right, #3DBAFB, #C49CFF);

/* 按钮渐变 */
background: linear-gradient(to right, #3DBAFB, #8ED1A9);

/* Hero 区域渐变 */
background: linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 50%, #F5F7FA 100%);
```

### 编程语言配色

```tsx
const languageColors = {
  scratch: {
    bg: '#FFA726',        // 橙色
    text: '#F57C00',
    gradient: 'from-orange-500 to-orange-600'
  },
  python: {
    bg: '#3DBAFB',        // 蓝色
    text: '#0288D1',
    gradient: 'from-blue-500 to-blue-600'
  },
  cpp: {
    bg: '#C49CFF',        // 紫色
    text: '#8E24AA',
    gradient: 'from-purple-500 to-purple-600'
  }
}
```

---

## 🧩 组件样式

### 按钮（Button）

```tsx
// 主要按钮（使用 MetaSeekOJ 渐变）
<Button className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white hover:opacity-90">
  马上开始闯关
</Button>

// 次要按钮
<Button variant="outline" className="border-metaseek-text-200">
  编辑
</Button>

// Ghost 按钮
<Button variant="ghost" className="hover:bg-metaseek-bg-gray">
  取消
</Button>
```

### 卡片（Card）

```tsx
// 标准卡片（白色背景 + 柔和阴影）
<Card className="bg-white shadow-sm hover:shadow-lg transition-shadow rounded-lg">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>

// 统计卡片
<Card className="bg-white shadow-sm border-l-4 border-metaseek-blue">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-metaseek-text-600">
        课程总数
      </CardTitle>
      <BookOpen className="h-4 w-4 text-metaseek-blue" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-metaseek-text-600">12</div>
  </CardContent>
</Card>
```

### Badge（标签）

```tsx
// 难度标签
const levelConfig = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

// 语言标签
const typeConfig = {
  scratch: 'border-[#FFA726] text-[#F57C00]',
  python: 'border-[#3DBAFB] text-[#0288D1]',
  cpp: 'border-[#C49CFF] text-[#8E24AA]'
}
```

---

## 📐 间距系统

```tsx
// 容器内边距
container: 'px-6 py-4'

// 卡片间距
gap: 'gap-6'

// 组件间距
margin: 'mb-8'  // 32px
padding: 'p-4'  // 16px
```

---

## ✨ 动画效果

### 卡片进入动画

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
>
  <Card>...</Card>
</motion.div>
```

### Hover 效果

```tsx
// 卡片 Hover
<Card className="hover:shadow-lg transition-shadow">

// 按钮 Hover
<Button className="hover:opacity-90 transition-opacity">

// 缩放效果
<motion.div whileHover={{ scale: 1.05 }}>
```

### 图标旋转

```css
.icon-box:hover {
  transform: rotate(360deg);
  transition: transform 0.6s ease;
}
```

---

## 🖼️ 布局系统

### 响应式容器

```tsx
<div className="container mx-auto px-6 max-w-7xl">
  {/* 内容 */}
</div>
```

### 网格布局

```tsx
// 统计卡片（3列）
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// 课程卡片（自适应）
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 项目卡片（4列）
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

---

## 🎯 页面模板

### 标准页面结构

```tsx
export default function Page() {
  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
              页面标题
            </h1>
            <Button className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9]">
              操作按钮
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* 内容区域 */}
      </main>
    </div>
  )
}
```

---

## 🔤 字体系统

```css
font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", 
             "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

/* 标题 */
.title {
  font-size: 24px;    /* text-2xl */
  font-weight: 700;   /* font-bold */
  line-height: 1.2;
}

/* 正文 */
.body {
  font-size: 14px;    /* text-sm */
  font-weight: 400;   /* font-normal */
  line-height: 1.6;
}

/* 小字 */
.caption {
  font-size: 12px;    /* text-xs */
  color: #737373;     /* text-metaseek-text-500 */
}
```

---

## 📦 Tailwind 配置

在 `tailwind.config.js` 中添加 MetaSeekOJ 颜色：

```js
theme: {
  extend: {
    colors: {
      'metaseek-blue': '#3DBAFB',
      'metaseek-green': '#8ED1A9',
      'metaseek-orange': '#FFA726',
      'metaseek-purple': '#C49CFF',
      'metaseek-bg-gray': '#F5F7FA',
      'metaseek-text': {
        600: '#525252',
        500: '#737373',
        400: '#a3a3a3',
        200: '#e5e5e5',
      },
    }
  }
}
```

---

## 🎨 使用示例

### 教师端课程列表

```tsx
// Header 使用 MetaSeekOJ 渐变
<h1 className="text-3xl font-bold bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
  🎨 智慧课堂
</h1>

// 按钮使用 MetaSeekOJ 渐变
<Button className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white">
  <PlusCircle className="h-5 w-5 mr-2" />
  创建新课程
</Button>

// 统计卡片使用 MetaSeekOJ 颜色
<Card>
  <CardHeader>
    <BookOpen className="h-4 w-4 text-[#FFA726]" />
    <CardTitle>课程总数</CardTitle>
  </CardHeader>
</Card>
```

### 学生端课程列表

```tsx
// 学习统计使用渐变卡片
<Card className="bg-gradient-to-br from-[#FFA726] to-[#F57C00] text-white">
  <CardContent>
    <div className="text-4xl font-bold">8</div>
    <p className="text-sm">在学课程</p>
  </CardContent>
</Card>
```

---

## ✅ 设计原则

1. **颜色一致性** - 严格使用 MetaSeekOJ 定义的颜色
2. **渐变使用** - 标题和主要按钮使用蓝绿渐变
3. **圆角统一** - 卡片 8px，按钮 6px，图标容器 12px
4. **阴影柔和** - 使用 `shadow-sm` 和 `shadow-lg`
5. **动画流畅** - 使用 Motion 实现 0.3s 过渡
6. **响应式优先** - 移动端优先，逐步增强

---

## 🔗 参考资源

- **MetaSeekOJ 主站（Vue）**：http://localhost:8080
- **智慧课堂（React）**：http://localhost:8081/classroom
- **Django 后端 API**：http://localhost:8086/api
- **Figma 设计稿**：https://www.figma.com/design/4PcNCHfczO7mdSczWoNziF/
- **Lucide 图标**：https://lucide.dev/
- **Tailwind CSS**：https://tailwindcss.com/

---

## 📝 更新日志

### v1.0.0 (2025-11-03)
- ✅ 定义 MetaSeekOJ 品牌色系
- ✅ 统一组件样式规范
- ✅ 提供 Tailwind 配置
- ✅ 添加使用示例

---

**开发者**：AI Assistant  
**最后更新**：2025-11-03  
**状态**：✅ 已完成

