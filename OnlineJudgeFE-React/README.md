# MetaSeekOJ React Frontend

基于 React + TypeScript + Tailwind CSS 的现代化前端项目

## 技术栈

- **框架**: React 18 + TypeScript
- **UI**: Tailwind CSS
- **构建工具**: Vite 5
- **状态管理**: Zustand
- **数据请求**: @tanstack/react-query
- **路由**: React Router 6
- **HTTP客户端**: Axios
- **图标**: Lucide React

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

访问: http://localhost:8081

### 生产构建
```bash
npm run build
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── ui/             # UI组件
│   └── layout/         # 布局组件
├── pages/              # 页面
│   ├── classroom/      # 课堂功能
│   │   ├── teacher/    # 教师端
│   │   └── student/    # 学生端
│   └── admin/          # 管理后台
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
├── api/                # API封装
├── store/              # 状态管理
└── App.tsx
```

## API配置

API代理已配置，所有 `/api/*` 请求会转发到 `http://localhost:8086`

## 与Vue项目共存

- Vue 2前端: `http://localhost:8080`
- React前端: `http://localhost:8081`

两者通过不同端口共存，后端API统一使用 `http://localhost:8086`

## 开发指南

### 创建新页面
1. 在 `src/pages/` 创建页面组件
2. 使用TypeScript定义类型
3. 使用Tailwind CSS编写样式

### 调用API
```typescript
import { classroomAPI } from '@/api/classroom'

const courses = await classroomAPI.getCourses()
```

### 使用组件
```typescript
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

<Button variant="primary">点击</Button>
<Card>内容</Card>
```

## 注意事项

- 使用 `@/` 别名引用 src 目录
- 使用 TypeScript 确保类型安全
- 使用 Tailwind CSS 而不是写独立CSS文件
- 遵循 React Hooks 最佳实践

## Agent 5 专用

此项目由 Agent 5（前端开发）负责开发维护。

### 参考资料
- 转型指令: `.trae/documents/Agent5转型指令-React开发.md`
- Vue版本参考: `OnlineJudgeFE/src/pages/classroom/`
- API文档: `.trae/documents/API_CONTRACTS.md`

加油！🚀
