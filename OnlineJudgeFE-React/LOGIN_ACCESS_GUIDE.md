# 🔍 页面访问问题排查指南

## ✅ 服务状态（已确认）

```
✅ React 前端 (8081) - HTTP 200 - 正常运行
✅ Scratch 编辑器 (8601) - HTTP 200 - 正常运行
✅ Django 后端 (8086) - HTTP 200 - 正常运行
```

---

## 🎯 **正确的访问地址**

### **方式 1：通过 React 前端访问（推荐）**

```
http://localhost:8081/classroom/scratch/editor
```

**特点**：
- ✅ 完整的登录功能
- ✅ 用户信息管理
- ✅ 项目保存功能
- ✅ 与后端完全集成

---

### **方式 2：直接访问 Scratch 编辑器（不推荐）**

```
http://localhost:8601/
```

**特点**：
- ❌ 没有登录功能
- ❌ 没有用户信息
- ❌ 无法保存到后端
- ⚠️ 仅用于测试编辑器本身

---

## 🚨 **如果页面无法访问，请按以下步骤操作**

### **步骤 1：清除浏览器缓存**

**Chrome/Edge**：
1. 按 `Ctrl + Shift + Delete`
2. 选择"缓存的图片和文件"
3. 点击"清除数据"
4. 或直接按 `Ctrl + Shift + R` 强制刷新

**Firefox**：
1. 按 `Ctrl + Shift + Delete`
2. 选择"缓存"
3. 点击"立即清除"
4. 或直接按 `Ctrl + F5` 强制刷新

---

### **步骤 2：检查 URL 是否正确**

**❌ 错误的URL**：
```
http://localhost:8601/classroom/scratch/editor  ← 端口错误！
http://localhost:8081/scratch/editor            ← 路径错误！
http://127.0.0.1:8081/classroom/scratch/editor  ← 可以，但建议用 localhost
```

**✅ 正确的URL**：
```
http://localhost:8081/classroom/scratch/editor
```

---

### **步骤 3：检查服务是否运行**

打开命令行，执行：

```bash
# 检查前端
curl http://localhost:8081/

# 检查编辑器
curl http://localhost:8601/

# 检查后端
curl http://localhost:8086/api/profile/
```

如果都返回 200，说明服务正常。

---

### **步骤 4：重启所有服务**

如果以上步骤都无效，尝试重启：

```bash
# 1. 停止所有服务
lsof -ti:8601 | xargs kill -9 2>/dev/null
lsof -ti:8081 | xargs kill -9 2>/dev/null

# 2. 启动 Scratch 编辑器
cd /home/sharelgx/MetaSeekOJdev/scratch-editor
./start-editor.sh > /tmp/scratch.log 2>&1 &

# 3. 等待编译（约 60 秒）
sleep 60

# 4. 启动 React 前端
cd /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React
npm run dev &

# 5. 等待启动（约 5 秒）
sleep 5

# 6. 访问页面
# http://localhost:8081/classroom/scratch/editor
```

---

## 🎨 **页面应该显示什么**

### **正确加载后应该看到**：

1. **Scratch 编辑器界面**
   - 绿色顶部菜单栏
   - 左侧代码块区域
   - 中间舞台区域
   - 右侧角色列表

2. **右上角应该有**：
   - "加入 Scratch" 按钮
   - "登录" 按钮

3. **点击"登录"后**：
   - 显示下拉登录表单
   - 有用户名输入框
   - 有密码输入框
   - 有"Sign in"按钮

---

## 🔧 **常见问题**

### **问题 1：页面一直加载中**

**原因**：Scratch 编辑器需要加载大量资源

**解决方案**：
- 等待 10-15 秒
- 检查网络连接
- 查看浏览器控制台是否有错误（F12）

---

### **问题 2：页面显示 404**

**原因**：URL 路径错误

**解决方案**：
- 确认 URL 是 `http://localhost:8081/classroom/scratch/editor`
- 检查 React 前端是否在运行

---

### **问题 3：页面空白**

**原因**：可能是编辑器未加载或 React 应用错误

**解决方案**：
1. 打开浏览器控制台（F12）
2. 查看 Console 是否有错误
3. 查看 Network 标签，确认资源是否加载
4. 强制刷新页面（Ctrl + Shift + R）

---

### **问题 4：看不到登录按钮**

**原因**：
- 浏览器缓存
- iframe 未正确加载
- `window.scratchUserInfo` 未设置

**解决方案**：
1. 强制刷新（Ctrl + Shift + R）
2. 打开控制台，输入：
   ```javascript
   console.log(window.scratchUserInfo);
   ```
3. 应该看到：
   ```javascript
   {isLoggedIn: false, username: null, avatarUrl: null}
   ```

---

## 📱 **浏览器兼容性**

**推荐浏览器**：
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

**不推荐**：
- ❌ IE 11（不支持）
- ❌ 旧版浏览器

---

## 🎯 **快速测试清单**

```
□ 访问 http://localhost:8081/classroom/scratch/editor
□ 页面完全加载（10-15秒）
□ 看到 Scratch 编辑器界面
□ 看到绿色顶部菜单栏
□ 右上角有"登录"按钮
□ 点击"登录"显示下拉框
□ 下拉框有用户名和密码输入框
□ 输入 root / lgx780504
□ 点击"Sign in"
□ 页面刷新后右上角显示"柳老师"
```

---

## 📞 **仍然无法访问？**

如果按照以上步骤操作后仍然无法访问，请提供以下信息：

1. **访问的完整 URL**
2. **浏览器类型和版本**
3. **浏览器控制台的错误信息**（F12 → Console）
4. **Network 标签的请求状态**（F12 → Network）
5. **服务状态检查结果**：
   ```bash
   curl http://localhost:8081/
   curl http://localhost:8601/
   curl http://localhost:8086/api/profile/
   ```

---

## 🚀 **立即测试**

**当前所有服务都在运行！请按以下步骤测试**：

1. **打开浏览器**
2. **清除缓存**：`Ctrl + Shift + R`
3. **访问**：`http://localhost:8081/classroom/scratch/editor`
4. **等待加载**（10-15秒）
5. **查看右上角是否有"登录"按钮**
6. **点击登录并测试**

**如果成功，请告诉我！** 🎉

