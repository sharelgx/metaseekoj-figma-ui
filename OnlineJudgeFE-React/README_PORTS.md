# 🌐 MetaSeekOJ 端口说明

## 📊 端口分配

| 端口 | 项目 | 技术栈 | 说明 | 访问地址 |
|------|------|--------|------|----------|
| **8080** | MetaSeekOJ 主站 | Vue.js 3 + Webpack | 原有的在线判题系统 | http://localhost:8080 |
| **8081** | 智慧课堂 | React 19 + Vite | 新的智慧课堂功能 | http://localhost:8081 |
| **8086** | Django 后端 | Django + DRF | API 服务器 | http://localhost:8086 |
| **8601** | Scratch 编辑器 | Scratch GUI | Scratch 3.0 编辑器 | http://localhost:8601 |

---

## 🚀 启动说明

### 1. 启动 Django 后端（必须）

```bash
cd /home/sharelgx/MetaSeekOJdev/OnlineJudge
source django_env/bin/activate
python manage.py runserver 0.0.0.0:8086
```

### 2. 启动 MetaSeekOJ 主站（8080，可选）

```bash
cd /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE
npm run dev
```

访问：http://localhost:8080

### 3. 启动智慧课堂（8081，新功能）

```bash
cd /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React
npm run dev
```

访问：http://localhost:8081

### 4. 启动 Scratch 编辑器（8601，可选）

```bash
cd /home/sharelgx/MetaSeekOJdev/scratch-editor
npm start
```

访问：http://localhost:8601

---

## 🎯 路由结构

### 8080 端口（Vue 主站）
```
http://localhost:8080/              # 主页
http://localhost:8080/problem       # 题目列表
http://localhost:8080/contest       # 竞赛
http://localhost:8080/status        # 提交记录
http://localhost:8080/rank          # 排名
```

### 8081 端口（React 智慧课堂）
```
# 主页（与 8080 设计一致，不冲突）
http://localhost:8081/              # 主页

# 智慧课堂（新功能）
http://localhost:8081/classroom                        # 智慧课堂首页
http://localhost:8081/classroom/teacher/courses        # 教师端-课程列表
http://localhost:8081/classroom/student/courses        # 学生端-课程列表
http://localhost:8081/classroom/scratch/projects       # Scratch 项目列表
http://localhost:8081/classroom/scratch/editor         # Scratch 编辑器
http://localhost:8081/classroom/scratch/editor/:id     # 编辑指定项目
```

---

## ⚠️ 重要说明

### 端口不冲突原因

1. **8080（Vue）** 和 **8081（React）** 是两个独立的前端项目
2. 它们可以同时运行，互不干扰
3. 8081 的主页（`/`）使用 8080 的设计风格，但是独立实现

### 设计风格

- **8080 和 8081 的主页**：使用相同的 MetaSeekOJ 设计风格
- **8081 的智慧课堂**（`/classroom/*`）：使用 MetaSeekOJ 品牌色，但布局独立

### 开发建议

1. **开发智慧课堂**：只需启动 8081 和 8086
2. **开发主站功能**：使用 8080 端口
3. **测试 Scratch**：需要同时启动 8081、8086、8601

---

## 🔌 API 代理配置

### 8081 端口（vite.config.ts）

```typescript
server: {
  port: 8081,
  proxy: {
    '/api': {
      target: 'http://localhost:8086',
      changeOrigin: true,
    }
  }
}
```

这意味着：
- `http://localhost:8081/api/*` → `http://localhost:8086/api/*`
- 前端可以直接使用 `/api/...` 访问后端

---

## 📝 快速测试

### 测试智慧课堂

1. 启动后端：
```bash
cd /home/sharelgx/MetaSeekOJdev/OnlineJudge
source django_env/bin/activate
python manage.py runserver 0.0.0.0:8086
```

2. 启动前端：
```bash
cd /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React
npm run dev
```

3. 访问：
```
http://localhost:8081/classroom/teacher/courses
```

---

## 🎨 设计统一性

| 特性 | 8080（Vue） | 8081（React） |
|------|-------------|---------------|
| 主色调 | #3DBAFB（蓝）、#8ED1A9（绿） | ✅ 相同 |
| 渐变 | linear-gradient(#3DBAFB, #8ED1A9) | ✅ 相同 |
| 背景 | #EEEEEE | ✅ 相同 |
| 文本色 | #525252 | ✅ 相同 |
| 按钮风格 | 蓝绿渐变 | ✅ 相同 |
| 卡片风格 | 白色 + 柔和阴影 | ✅ 相同 |
| 动画 | 0.3s 过渡 | ✅ 相同 |

---

**更新日期**：2025-11-03  
**维护者**：AI Assistant

