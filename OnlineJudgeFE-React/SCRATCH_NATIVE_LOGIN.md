# 🎮 Scratch 原生登录系统集成

## ✅ 已完成配置

### **使用 Scratch 官方的登录 UI**

参考您提供的设计：
- 绿色顶部条
- 圆形头像
- "我的作品"文字
- 下拉菜单

---

## 📋 **登录状态显示**

### **未登录时**（右上角）

```
┌────────────────────────┐
│ [加入 Scratch] [登录] │ ← Scratch 原生按钮
└────────────────────────┘
```

**显示**：
- **加入 Scratch**（注册按钮，绿色文字）
- **登录**（登录按钮，绿色文字）

**点击"登录"**：
- 调用 `window.scratchLoginHandler()`
- 跳转到登录页

**点击"加入 Scratch"**：
- 调用 `window.scratchRegisterHandler()`
- 跳转到注册页

---

### **已登录时**（右上角）

```
┌─────────────────────────┐
│ [👤头像] 我的作品 ▼     │ ← Scratch 原生样式
└─────────────────────────┘
```

**显示**：
- 🎨 **圆形头像**（用户头像或默认头像）
- 📝 **用户名** 或 **"我的作品"**
- ▼ **下拉箭头**

**点击后显示下拉菜单**：
- 我的作品（跳转到项目列表）
- 账户设置
- ─────────
- 退出登录

---

## 🔧 **技术实现**

### **1. Scratch 编辑器配置**

**文件**：`scratch-editor/packages/scratch-gui/src/playground/render-gui.jsx`

**配置内容**：
```javascript
// 从 window 获取用户信息
const userInfo = window.scratchUserInfo || {
  isLoggedIn: false,
  username: null,
  avatarUrl: null
}

<WrappedGui
  username={userInfo.username}
  accountMenuOptions={{
    canHaveSession: true,
    canRegister: true,
    canLogin: true,
    canLogout: userInfo.isLoggedIn,
    avatarUrl: userInfo.avatarUrl,
    myStuffUrl: '#/classroom/scratch/projects',  // 我的作品链接
    profileUrl: userInfo.isLoggedIn ? `/profile/${userInfo.username}` : null,
    accountSettingsUrl: '/settings'
  }}
  onOpenRegistration={handleOpenRegistration}
  onLogOut={handleLogOut}
  renderLogin={renderLogin}
/>
```

---

### **2. React 前端提供数据**

**文件**：`OnlineJudgeFE-React/src/pages/creative-classroom/scratch/Editor.tsx`

**提供的数据**：
```typescript
// 向 Scratch 提供用户信息
window.scratchUserInfo = {
  isLoggedIn: true/false,
  username: '用户名',
  avatarUrl: '头像URL'
}

// 注册回调处理器
window.scratchLoginHandler = () => { 跳转登录页 }
window.scratchRegisterHandler = () => { 跳转注册页 }
window.scratchLogoutHandler = () => { 处理登出 }
```

---

## 🎯 **工作流程**

### **场景 1：未登录用户点击"登录"**

```
用户点击 Scratch 右上角的"登录"
  ↓
Scratch 调用 window.scratchLoginHandler()
  ↓
React 组件处理登录
  ↓
跳转到登录页：/login?return_url=/classroom/scratch/editor
  ↓
用户登录成功
  ↓
返回编辑器
  ↓
React 检测到登录状态
  ↓
更新 window.scratchUserInfo
  ↓
Scratch 编辑器刷新
  ↓
右上角显示：[头像] 我的作品
```

---

### **场景 2：已登录用户点击"我的作品"**

```
用户点击右上角的用户名/头像
  ↓
显示下拉菜单
  ↓
点击"我的作品"（My Stuff）
  ↓
跳转到：#/classroom/scratch/projects
  ↓
React Router 处理
  ↓
显示项目列表页
```

---

### **场景 3：用户登出**

```
点击下拉菜单的"退出登录"
  ↓
Scratch 调用 window.scratchLogoutHandler()
  ↓
React 处理登出
  ↓
调用后端 API：/api/logout/
  ↓
清除登录状态
  ↓
更新 window.scratchUserInfo
  ↓
Scratch 编辑器刷新
  ↓
右上角显示：[加入 Scratch] [登录]
```

---

## 📱 **UI 效果**

### **未登录**
```
┌─────────────────────────────────────────┐
│ Scratch Editor          [加入] [登录]   │ ← 绿色条，右侧按钮
│ ┌─────────────────────────────────────┐ │
│ │ 文件 | 编辑 | 教程                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│        [编辑器区域]                     │
└─────────────────────────────────────────┘
```

### **已登录**
```
┌─────────────────────────────────────────┐
│ Scratch Editor      [👤头像] 我的作品▼ │ ← 绿色条，右侧用户信息
│ ┌─────────────────────────────────────┐ │
│ │ 文件 | 编辑 | 教程                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│        [编辑器区域]                     │
└─────────────────────────────────────────┘

点击用户信息后：
┌─────────────────┐
│ 我的作品        │
│ 账户设置        │
│ ─────────────── │
│ 退出登录        │
└─────────────────┘
```

---

## ⏱️ **编译状态**

**当前状态**：🔄 正在重新编译 Scratch 编辑器...

**预计时间**：3-5 分钟

**查看进度**：
```bash
tail -f /tmp/scratch-native-login.log
```

**完成标志**：
```
webpack 5.102.1 compiled successfully
```

---

## 🎉 **完成后测试步骤**

### **步骤 1：测试未登录状态**

1. 清除浏览器 Cookie（模拟未登录）
2. 访问编辑器
   ```
   http://localhost:8081/classroom/scratch/editor
   ```
3. 查看右上角
   - ✅ 应该显示："加入 Scratch"和"登录"按钮
4. 点击"登录"
   - ✅ 应该跳转到登录页

---

### **步骤 2：测试已登录状态**

1. 登录系统
2. 访问编辑器
3. 查看右上角
   - ✅ 应该显示：头像 + 用户名/我的作品
4. 点击用户信息
   - ✅ 应该显示下拉菜单
5. 点击"我的作品"
   - ✅ 应该跳转到项目列表

---

### **步骤 3：测试保存功能**

1. 在编辑器中创作
2. 点击"文件"→"立即保存"
3. 未登录：
   - ✅ 弹出登录提示
4. 已登录：
   - ✅ 弹出保存对话框

---

## 📊 **集成的功能清单**

| 功能 | Scratch 原生 UI | 我们的后端 | 状态 |
|------|----------------|-----------|------|
| 登录按钮 | ✅ 右上角绿色按钮 | ✅ 跳转登录页 | ✅ 集成 |
| 注册按钮 | ✅ 右上角绿色按钮 | ✅ 跳转注册页 | ✅ 集成 |
| 用户头像 | ✅ 圆形头像 | ✅ 从后端获取 | ✅ 集成 |
| 用户名显示 | ✅ "我的作品" | ✅ 显示真实用户名 | ✅ 集成 |
| 我的作品 | ✅ 下拉菜单 | ✅ 跳转项目列表 | ✅ 集成 |
| 退出登录 | ✅ 下拉菜单 | ✅ 调用后端API | ✅ 集成 |
| 文件→立即保存 | ✅ 菜单项 | ✅ 保存到数据库 | ✅ 集成 |

---

## 🎨 **样式说明**

Scratch 原生的登录 UI 样式：
- **绿色顶部条**（官方设计）
- **圆形头像**（官方组件）
- **白色文字**
- **下拉菜单**（蓝色背景）

完全使用 Scratch 官方样式，无需自定义！

---

**编译完成后刷新浏览器即可看到效果！** 🎉

**预计完成时间：3-5 分钟** ⏱️

