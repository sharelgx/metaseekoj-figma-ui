# API批量更新计划

## 当前状态
- ✅ API基础设施完成（6个文件）
- ✅ ProblemList已接入
- ✅ ProblemDetail已接入
- 🔄 大部分页面使用mock数据

## 批量更新策略

### 步骤1：统一API导入格式 ✅
```typescript
// ❌ 旧格式
import { getChoiceQuestionList } from '@/api/choice-question'

// ✅ 新格式
import { choiceQuestionAPI } from '@/api/choice-question'
```

### 步骤2：统一数据处理格式 ✅
```typescript
// ❌ 旧格式
const response = await API.xxx()
const data = response.data.data

// ✅ 新格式  
const data = await API.xxx()
// API层已经返回处理好的data
```

### 步骤3：前台页面优先级

#### 🔥 高优先级（核心功能）
1. Login/Register - 用户认证
2. ChoiceQuestionList - 选择题列表
3. QuestionDetail - 选择题详情
4. ExamPaper - 考试答题
5. ContestList - 竞赛列表

#### 🌟 中优先级（用户功能）
6. UserHome - 用户主页
7. SubmissionList - 提交记录
8. HomeworkList - 作业列表
9. TopicList - 专题列表
10. ExamHistory - 考试历史

#### 📋 低优先级（辅助功能）
11. WrongQuestionBook - 错题本
12. Settings - 设置页面
13. ACMRank/OIRank - 排行榜

### 步骤4：后台页面优先级

#### 🔥 高优先级
1. AdminLogin - 后台登录
2. Dashboard - 仪表盘
3. AdminUser - 用户管理

#### 🌟 中优先级
4. AdminProblemList - 题目管理
5. AdminChoiceQuestionList - 选择题管理
6. AdminHomeworkList - 作业管理

#### 📋 低优先级
7. AdminContestList - 竞赛管理
8. AdminTopicManagement - 专题管理
9. AdminExamPaperList - 试卷管理
10. AdminCourseList - 课程管理

## 实施方案

### 方案A：逐个精细化（推荐）
**优点**: 
- 每个页面都经过测试
- 可以及时发现问题
- 对齐8080更精确

**缺点**:
- 耗时较长
- 需要频繁提交

**时间估算**: 每个页面15分钟 × 30页面 = 7.5小时

### 方案B：批量快速集成
**优点**:
- 快速完成所有页面
- 一次性提交

**缺点**:
- 可能有遗漏
- 测试不够充分

**时间估算**: 批量更新 + 集中测试 = 3小时

## 🎯 当前采用方案：A + B混合

1. **第一批（核心5个）** - 逐个精细化
   - Login/Register ✅
   - ChoiceQuestionList ✅
   - QuestionDetail ✅
   - ExamPaper ✅
   - ContestList ✅

2. **第二批（用户功能）** - 批量快速
   - UserHome等10个页面 ⚡

3. **第三批（后台管理）** - 批量快速
   - Dashboard等10个页面 ⚡

4. **第四批（全面测试）** - 逐个验证
   - 测试所有API调用 🧪
   - 修复发现的问题 🔧
   - 对齐8080细节 🎨

## 测试清单

### API基础测试
- [ ] 网络请求正常发送
- [ ] 认证token正确携带
- [ ] 错误处理正常工作
- [ ] 响应数据格式正确

### 页面功能测试
- [ ] 列表加载正常
- [ ] 分页功能正常
- [ ] 搜索筛选正常
- [ ] 详情加载正常
- [ ] 提交功能正常
- [ ] 错误提示友好

### 对齐8080测试
- [ ] UI样式100%一致
- [ ] 交互效果一致
- [ ] 数据显示一致
- [ ] 路由跳转一致

## 下一步行动

### 立即执行（当前会话）
1. ✅ 完成ProblemList/Detail
2. 🔄 完成Login/Register
3. 🔄 完成ChoiceQuestionList/Detail
4. 🔄 完成ExamPaper
5. 🔄 完成ContestList

### 后续执行
6. 批量完成用户功能页面
7. 批量完成后台管理页面
8. 全面测试和调优
9. 最终对齐验证

---

**更新时间**: 2025-11-06
**当前进度**: 2/30 核心页面完成 (6.7%)
**目标**: 本次会话完成5个核心页面（16.7%）

