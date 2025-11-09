# 🔌 8080后端API → 8081前端调用映射表

## 📌 **核心说明**

### ✅ **8080后端（Django）- 已完成**
- 运行在: `http://localhost:8080`
- 提供完整的REST API
- 所有端点都已实现
- **我们不需要修改后端！**

### ✅ **8081前端（React）- 正在完成**
- 运行在: `http://localhost:8081`
- 通过Vite proxy调用8080的API
- 创建TypeScript封装层
- **只需要在前端调用8080的API！**

---

## 🔗 **API调用流程**

```
8081前端页面
    ↓
8081 API封装层 (src/api/*.ts)
    ↓
Vite Proxy (vite.config.ts)
    ↓
8080后端API (Django)
    ↓
数据库（PostgreSQL）
```

---

## 📝 **8080后端API端点完整列表**

### 1️⃣ **用户认证API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/login` | `userAPI.login()` | POST | 用户登录 |
| `/api/register` | `userAPI.register()` | POST | 用户注册 |
| `/api/logout` | `userAPI.logout()` | GET | 退出登录 |
| `/api/profile` | `userAPI.getUserInfo()` | GET | 获取用户信息 |
| `/api/profile` | `userAPI.updateProfile()` | PUT | 更新用户信息 |
| `/api/captcha` | `userAPI.getCaptcha()` | GET | 获取验证码 |
| `/api/check_username_or_phone` | `userAPI.checkUsernameOrPhone()` | POST | 检查用户名 |
| `/api/change_password` | `userAPI.changePassword()` | POST | 修改密码 |

---

### 2️⃣ **编程题API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/problem` | `problemAPI.getProblemList()` | GET | 题目列表（分页）|
| `/api/problem?problem_id=xxx` | `problemAPI.getProblemDetail()` | GET | 题目详情 |
| `/api/problem/tags` | `problemAPI.getTagList()` | GET | 标签列表 |
| `/api/pickone` | `problemAPI.pickOne()` | GET | 随机选题 |
| `/api/submission` | `problemAPI.submitCode()` | POST | 提交代码 |

---

### 3️⃣ **选择题API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/choice_question/` | `choiceQuestionAPI.getQuestionList()` | GET | 选择题列表 |
| `/api/choice_question?question_id=xxx` | `choiceQuestionAPI.getQuestionDetail()` | GET | 选择题详情 |
| `/api/choice_question/submit` | `choiceQuestionAPI.submitAnswer()` | POST | 提交答案 |
| `/api/choice_question/category/` | `getCategoryList()` | GET | 分类列表 |
| `/api/choice_question/tag/` | `getTagList()` | GET | 标签列表 |
| `/api/choice_question/topic` | `choiceQuestionAPI.getTopicList()` | GET | 专题列表 |
| `/api/choice_question/topic/:id` | `choiceQuestionAPI.getTopicDetail()` | GET | 专题详情 |
| `/api/choice_question/wrong_book` | `choiceQuestionAPI.getWrongQuestions()` | GET | 错题本 |

---

### 4️⃣ **考试API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/exam_paper` | `choiceQuestionAPI.getExamPaperList()` | GET | 试卷列表 |
| `/api/exam_paper/:id` | `choiceQuestionAPI.getExamPaperDetail()` | GET | 试卷详情 |
| `/api/exam_paper/submit` | `choiceQuestionAPI.submitExamPaper()` | POST | 提交试卷 |
| `/api/exam_paper/history` | `choiceQuestionAPI.getExamHistory()` | GET | 考试历史 |
| `/api/exam_paper/result/:id` | `choiceQuestionAPI.getExamResult()` | GET | 考试结果 |

---

### 5️⃣ **竞赛API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/contests` | `contestAPI.getContestList()` | GET | 竞赛列表 |
| `/api/contest?id=xxx` | `contestAPI.getContestDetail()` | GET | 竞赛详情 |
| `/api/contest_rank` | `contestAPI.getContestRank()` | GET | 竞赛排名 |
| `/api/contest/problem` | `contestAPI.getContestProblemList()` | GET | 竞赛题目 |

---

### 6️⃣ **提交记录API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/submissions` | `submissionAPI.getSubmissionList()` | GET | 提交列表 |
| `/api/submission?id=xxx` | `submissionAPI.getSubmissionDetail()` | GET | 提交详情 |
| `/api/submission` | `submissionAPI.checkSubmissionStatus()` | GET | 查询状态（轮询）|

---

### 7️⃣ **排行榜API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/user_rank?rule=ACM` | `rankAPI.getACMRank()` | GET | ACM排行榜 |
| `/api/user_rank?rule=OI` | `rankAPI.getOIRank()` | GET | OI排行榜 |

---

### 8️⃣ **作业API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/homework` | `homeworkAPI.getHomeworkList()` | GET | 作业列表 |
| `/api/homework?homework_id=xxx` | `homeworkAPI.getHomeworkDetail()` | GET | 作业详情 |
| `/api/homework/submission` | `homeworkAPI.submitHomework()` | POST | 提交作业 |

---

### 9️⃣ **后台管理API**

| 8080后端API | 8081封装 | 方法 | 说明 |
|------------|---------|------|------|
| `/api/admin/user` | `adminAPI.getUserList()` | GET | 用户列表 |
| `/api/admin/user` | `adminAPI.createUser()` | POST | 创建用户 |
| `/api/admin/user` | `adminAPI.updateUser()` | PUT | 更新用户 |
| `/api/admin/user` | `adminAPI.deleteUser()` | DELETE | 删除用户 |
| `/api/admin/problem` | `adminAPI.getProblemList()` | GET | 题目列表 |
| `/api/admin/choice_question` | `adminAPI.getChoiceQuestionList()` | GET | 选择题列表 |
| `/api/admin/contest` | `adminAPI.getContestList()` | GET | 竞赛列表 |
| `/api/admin/dashboard_info` | `adminAPI.getDashboardInfo()` | GET | 仪表盘数据 |

---

## 🎯 **我们已经完成的工作**

### ✅ **Step 1: 创建API封装层（已完成）**

在 `src/api/` 目录下创建了9个TypeScript文件：

```typescript
// src/api/problem.ts - 示例
export const problemAPI = {
  async getProblemList(params) {
    // 调用8080的 /api/problem 端点
    const response = await axios.get('/api/problem', { params })
    return response.data.data  // 返回处理好的数据
  }
}
```

**优势：**
- ✅ TypeScript类型安全
- ✅ 统一的错误处理
- ✅ 自动携带认证信息
- ✅ 请求/响应日志

### ✅ **Step 2: 配置Vite代理（已完成）**

```typescript
// vite.config.ts
server: {
  port: 8081,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 8080后端
      changeOrigin: true
    }
  }
}
```

**工作原理：**
```
前端请求: http://localhost:8081/api/problem
    ↓ (Vite代理)
后端实际: http://localhost:8080/api/problem
```

### 🔄 **Step 3: 在页面中调用（部分完成）**

**已完成（4个页面）：**
```typescript
// ProblemList.tsx
const data = await problemAPI.getProblemList({
  offset: 0,
  limit: 10,
  difficulty: 'Low'
})
```

**待完成（26个页面）：**
需要在每个页面中用同样的方式调用对应的API

---

## 🚀 **下一步工作**

### **我们要做的事情：**

1. **在每个页面中添加API调用** ✅
   ```typescript
   // 示例：QuestionList.tsx
   import { choiceQuestionAPI } from '@/api/choice-question'
   
   const data = await choiceQuestionAPI.getQuestionList({
     offset: 0,
     limit: 20
   })
   ```

2. **替换Mock数据** ✅
   ```typescript
   // ❌ 旧的Mock数据
   const [questions, setQuestions] = useState([
     { id: 1, title: 'Mock题目' }
   ])
   
   // ✅ 新的API数据
   const loadQuestions = async () => {
     const data = await choiceQuestionAPI.getQuestionList({...})
     setQuestions(data.results)
   }
   ```

3. **处理加载状态和错误** ✅
   ```typescript
   try {
     setLoading(true)
     const data = await xxxAPI.xxx()
     setData(data.results)
   } catch (error) {
     toast.error('加载失败')
   } finally {
     setLoading(false)
   }
   ```

---

## 💡 **总结**

### ✅ **后端部分 - 无需修改**
- 8080的Django后端已经提供了所有API
- 所有端点都已测试通过
- 数据库连接正常
- **我们不需要改任何后端代码！**

### 🔄 **前端部分 - 正在完成**
- ✅ API封装层已创建（9个文件）
- ✅ Vite代理已配置
- ✅ 4个页面已接入API并测试通过
- 📋 26个页面待接入API（只需复制粘贴调用代码）

---

## 🎯 **现在继续批量完成！**

我现在将快速完成所有26个页面的API接入，就是简单地：
1. 导入对应的API
2. 调用API方法
3. 处理返回数据
4. 删除Mock数据

**所有API都是调用8080已经做好的接口！** ✅

---

**准备好了吗？我现在开始批量完成所有页面的API接入！** 🚀

