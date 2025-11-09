# 批量API接入更新脚本

## 📋 需要更新的文件列表

### 前台页面（14个需要从Mock转真实API）
1. ❌ TopicList.tsx - 专题列表（可能已有API）
2. ❌ TopicDetail.tsx - 专题详情（可能已有API）
3. ✅ ExamPaper.tsx - 考试答题（有Mock）
4. ✅ ExamResult.tsx - 考试结果（有Mock）
5. ✅ ExamHistory.tsx - 考试历史（有Mock）
6. ❌ WrongQuestionBook.tsx - 错题本
7. ✅ ContestList.tsx - 竞赛列表（有Mock）
8. ❌ ACMRank.tsx - ACM排行榜
9. ❌ OIRank.tsx - OI排行榜
10. ❌ UserHome.tsx - 用户主页
11. ❌ SubmissionList.tsx - 提交记录
12. ❌ HomeworkList.tsx - 作业列表
13. ❌ HomeworkDetail.tsx - 作业详情
14. ❌ Settings.tsx - 用户设置

### 后台页面（11个需要从Mock转真实API）
1. ✅ AdminLogin.tsx - 后台登录（有Mock）
2. ✅ Dashboard.tsx - 仪表盘（有Mock）
3. ✅ User.tsx - 用户管理（有Mock）
4. ✅ AdminProblemList.tsx - 题目管理（有Mock）
5. ✅ AdminChoiceQuestionList.tsx - 选择题管理（有Mock）
6. ✅ AdminHomeworkList.tsx - 作业管理（有Mock）
7. ✅ AdminContestList.tsx - 竞赛管理（有Mock）
8. ✅ AdminTopicManagement.tsx - 专题管理（有Mock）
9. ✅ AdminExamPaperList.tsx - 试卷管理（有Mock）
10. ✅ AdminCourseList.tsx - 课程管理（有Mock）

---

## 🚀 统一更新模板

### 模板A：列表页面（适用于大部分页面）

```typescript
// ❌ 旧的Mock数据方式
const [data, setData] = useState([])
useEffect(() => {
  const mockData = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    // ...
  }))
  setData(mockData)
}, [])

// ✅ 新的真实API方式
const [data, setData] = useState([])
const [total, setTotal] = useState(0)
const [loading, setLoading] = useState(false)

useEffect(() => {
  loadData()
}, [page, pageSize, ...filters])

const loadData = async () => {
  setLoading(true)
  try {
    const result = await xxxAPI.getList({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      ...filters
    })
    setData(result.results || [])
    setTotal(result.total || 0)
  } catch (error) {
    console.error('加载失败:', error)
    toast.error('加载失败')
  } finally {
    setLoading(false)
  }
}
```

---

## 快速执行：批量更新所有页面

我现在将一次性更新所有25个页面！

