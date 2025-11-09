# 🔧 登录问题调试指南

## 🐛 **问题：登录之后没有变化**

### **已修复的问题**

1. ✅ **用户信息获取路径错误**
   - 问题：`data.username` → 实际应该是 `data.data.user.username`
   - 修复：正确解析 API 返回的嵌套数据结构

2. ✅ **页面刷新逻辑错误**
   - 问题：在 iframe 内部刷新只会刷新 iframe 本身
   - 修复：刷新父窗口（`window.parent.location.reload()`）

---

## 🔍 **如何调试登录问题**

### **步骤 1：打开浏览器控制台**

按 `F12` 打开开发者工具，切换到 **Console** 标签。

---

### **步骤 2：测试登录 API**

在控制台中运行：

```javascript
// 测试登录
fetch('http://localhost:8086/api/login/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({
        username: 'root',
        password: 'lgx780504'
    })
})
.then(r => r.json())
.then(data => {
    console.log('登录结果:', data);
    if (data.error === null) {
        console.log('✅ 登录成功！');
    } else {
        console.log('❌ 登录失败:', data.data);
    }
});
```

**期望输出**：
```javascript
登录结果: {error: null, data: "Succeeded"}
✅ 登录成功！
```

---

### **步骤 3：检查 Cookie**

在控制台中运行：

```javascript
// 查看所有 Cookie
console.log('Cookies:', document.cookie);
```

**期望输出**：
```
Cookies: csrftoken=...; sessionid=...
```

**如果没有 Cookie**：
- 检查是否开启了第三方 Cookie 阻止
- 检查浏览器是否在隐私模式

---

### **步骤 4：测试用户信息获取**

```javascript
// 获取用户信息
fetch('http://localhost:8086/api/profile/', {
    credentials: 'include'
})
.then(r => r.json())
.then(data => {
    console.log('用户信息:', data);
    if (data.error === null && data.data) {
        console.log('✅ 已登录用户:', data.data.real_name || data.data.user.username);
    } else {
        console.log('❌ 未登录或获取失败');
    }
});
```

**期望输出（已登录）**：
```javascript
用户信息: {error: null, data: {user: {...}, real_name: "柳老师", ...}}
✅ 已登录用户: 柳老师
```

**期望输出（未登录）**：
```javascript
用户信息: {error: null, data: null}
❌ 未登录或获取失败
```

---

### **步骤 5：检查 window.scratchUserInfo**

```javascript
// 查看全局用户信息
console.log('Scratch 用户信息:', window.scratchUserInfo);
```

**期望输出（已登录）**：
```javascript
Scratch 用户信息: {
    isLoggedIn: true,
    username: "柳老师",
    avatarUrl: null
}
```

**期望输出（未登录）**：
```javascript
Scratch 用户信息: {
    isLoggedIn: false,
    username: null,
    avatarUrl: null
}
```

---

## 🔧 **常见问题和解决方案**

### **问题 1：登录后页面没有刷新**

**原因**：iframe 刷新逻辑错误

**解决方案**：已修复，现在会刷新父窗口

**验证方式**：
```javascript
// 在 Scratch 编辑器内的登录下拉框中
console.log('在 iframe 中？', window.parent !== window);
// 应该输出: true
```

---

### **问题 2：用户信息显示为"用户"而不是"柳老师"**

**原因**：数据解析路径错误

**解决方案**：已修复，正确路径是 `data.data.real_name`

**API 数据结构**：
```json
{
  "error": null,
  "data": {
    "user": {
      "username": "root"
    },
    "real_name": "柳老师"
  }
}
```

---

### **问题 3：登录后立即又显示未登录**

**原因**：Cookie 没有正确保存或发送

**检查方式**：
```javascript
// 1. 检查 Cookie 是否存在
console.log('Cookies:', document.cookie);

// 2. 检查 API 请求是否携带 Cookie
// 在 Network 标签中查看 /api/profile/ 请求
// Headers → Request Headers → Cookie
```

**解决方案**：
- 确保使用 `credentials: 'include'`
- 检查 CORS 配置
- 检查浏览器 Cookie 设置

---

### **问题 4：登录成功但右上角没有显示用户名**

**原因**：Scratch 编辑器没有读取 `window.scratchUserInfo`

**检查方式**：
```javascript
// 1. 检查外层页面
console.log('外层 scratchUserInfo:', window.scratchUserInfo);

// 2. 检查 iframe 内部
// 在开发者工具中切换到 iframe 的 context
// 然后运行：
console.log('iframe 内 scratchUserInfo:', window.scratchUserInfo);
```

**解决方案**：
- 确保外层页面的 `scratchUserInfo` 正确设置
- 刷新页面确保编辑器重新读取

---

## 📊 **完整的登录流程检查**

### **流程图**

```
用户点击登录
    ↓
输入用户名密码
    ↓
提交表单到 /api/login/
    ↓
后端验证 ✅
    ↓
返回 {error: null, data: "Succeeded"}
    ↓
设置 Cookie (sessionid)
    ↓
关闭下拉框
    ↓
刷新父窗口 (window.parent.location.reload())
    ↓
React 应用重新加载
    ↓
调用 checkLoginStatus()
    ↓
请求 /api/profile/ (携带 Cookie)
    ↓
获取用户信息 {error: null, data: {real_name: "柳老师"}}
    ↓
设置 isLoggedIn = true
    ↓
设置 username = "柳老师"
    ↓
更新 window.scratchUserInfo
    ↓
Scratch 编辑器读取用户信息
    ↓
显示用户名和头像 ✅
```

---

## 🧪 **完整测试脚本**

在浏览器控制台运行：

```javascript
async function testLogin() {
    console.log('=== 开始测试登录流程 ===');
    
    // 1. 测试登录
    console.log('\n1️⃣ 测试登录 API...');
    try {
        const loginResp = await fetch('http://localhost:8086/api/login/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                username: 'root',
                password: 'lgx780504'
            })
        });
        const loginData = await loginResp.json();
        console.log('登录响应:', loginData);
        
        if (loginData.error === null) {
            console.log('✅ 登录成功！');
        } else {
            console.log('❌ 登录失败:', loginData.data);
            return;
        }
    } catch (error) {
        console.error('❌ 登录请求失败:', error);
        return;
    }
    
    // 2. 检查 Cookie
    console.log('\n2️⃣ 检查 Cookie...');
    const cookies = document.cookie;
    console.log('Cookies:', cookies);
    if (cookies.includes('sessionid')) {
        console.log('✅ Session Cookie 已设置');
    } else {
        console.log('❌ Session Cookie 未找到');
    }
    
    // 3. 获取用户信息
    console.log('\n3️⃣ 获取用户信息...');
    try {
        const profileResp = await fetch('http://localhost:8086/api/profile/', {
            credentials: 'include'
        });
        const profileData = await profileResp.json();
        console.log('用户信息:', profileData);
        
        if (profileData.error === null && profileData.data) {
            const username = profileData.data.real_name || profileData.data.user?.username;
            console.log('✅ 用户:', username);
        } else {
            console.log('❌ 未获取到用户信息');
        }
    } catch (error) {
        console.error('❌ 获取用户信息失败:', error);
    }
    
    // 4. 检查 window.scratchUserInfo
    console.log('\n4️⃣ 检查 Scratch 用户信息...');
    console.log('window.scratchUserInfo:', window.scratchUserInfo);
    
    console.log('\n=== 测试完成 ===');
    console.log('\n💡 如果所有步骤都显示 ✅，但登录后仍然没有变化，请：');
    console.log('1. 刷新页面（Ctrl + Shift + R）');
    console.log('2. 检查浏览器控制台是否有报错');
    console.log('3. 确认访问的是 http://localhost:8081/classroom/scratch/editor');
}

// 运行测试
testLogin();
```

---

## 📝 **修复历史**

### **v1.0 - 初始实现**
- ✅ 基本登录表单
- ✅ API 调用
- ❌ 数据解析错误
- ❌ 刷新逻辑错误

### **v2.0 - 修复数据解析**
- ✅ 正确解析 `data.data.real_name`
- ✅ 添加控制台日志
- ❌ 刷新逻辑仍有问题

### **v3.0 - 修复刷新逻辑**（当前版本）
- ✅ iframe 内刷新父窗口
- ✅ 正确的数据解析路径
- ✅ 完善的错误处理
- ✅ 控制台调试信息

---

## 🚀 **现在测试**

### **操作步骤**

1. **清除浏览器缓存**
   ```
   Ctrl + Shift + Delete
   或
   Ctrl + Shift + R (强制刷新)
   ```

2. **访问编辑器**
   ```
   http://localhost:8081/classroom/scratch/editor
   ```

3. **打开控制台**
   ```
   按 F12
   ```

4. **点击"登录"按钮**

5. **输入账号**
   - 用户名：`root`
   - 密码：`lgx780504`

6. **点击"Sign in"**

7. **观察控制台输出**
   - 应该看到：`✅ 用户登录成功: 柳老师`

8. **页面刷新后**
   - 右上角应该显示：`[👤 柳老师 ▼]`

---

## 💡 **如果还是不行**

运行上面的 `testLogin()` 函数，将输出结果发送给我，我会帮你进一步排查！

