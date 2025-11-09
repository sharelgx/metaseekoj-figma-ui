import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import Home from '@/pages/Home'
import ProblemList from '@/pages/ProblemList'
import ProblemDetail from '@/pages/problem/ProblemDetail'
import QuestionList from '@/pages/choice-question/QuestionList'
import QuestionDetail from '@/pages/choice-question/QuestionDetail'

// 专题练习页面
import TopicList from '@/pages/topic/TopicList'
import TopicDetail from '@/pages/topic/TopicDetail'

// 试卷页面
import ExamHistory from '@/pages/exam/ExamHistory'
import ExamPaper from '@/pages/exam/ExamPaper'
import ExamResult from '@/pages/exam/ExamResult'

// 用户页面
import UserHome from '@/pages/user/UserHome'
import SubmissionList from '@/pages/submission/SubmissionList'
import Settings from '@/pages/setting/Settings'
import WrongQuestionBook from '@/pages/wrong-question/WrongQuestionBook'

// 作业页面
import HomeworkList from '@/pages/homework/HomeworkList'
import HomeworkDetail from '@/pages/homework/HomeworkDetail'

// 排名页面
import ACMRank from '@/pages/rank/ACMRank'
import OIRank from '@/pages/rank/OIRank'

// 竞赛页面
import ContestList from '@/pages/contest/ContestList'

// 智慧课堂页面
import CreativeClassroomHome from '@/pages/creative-classroom/Home'
import TeacherCourseList from '@/pages/creative-classroom/teacher/CourseList'
import CourseEditor from '@/pages/creative-classroom/teacher/CourseEditor'
import CourseEditorClaude from '@/pages/creative-classroom/teacher/CourseEditorClaude'
import CourseEditorSplit from '@/pages/creative-classroom/teacher/CourseEditorSplit'
import StudentCourseList from '@/pages/creative-classroom/student/CourseList'
import ScratchProjectList from '@/pages/creative-classroom/scratch/ProjectList'
import ScratchEditor from '@/pages/creative-classroom/scratch/Editor'
import ScratchEditorTest from '@/pages/creative-classroom/scratch/EditorTest'
import ScratchDiagnostic from '@/pages/creative-classroom/scratch/DiagnosticPage'
import SlidePreview from '@/pages/creative-classroom/teacher/SlidePreview'
import SlideFullscreen from '@/pages/creative-classroom/teacher/SlideFullscreen'
import SlideFullscreenFigma from '@/pages/creative-classroom/teacher/SlideFullscreenFigma'
import KnowledgeBase from '@/pages/creative-classroom/teacher/KnowledgeBase'
import MarkdownToSlides from '@/pages/creative-classroom/teacher/MarkdownToSlides'

// 认证页面
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// 后台页面
import { AdminLayout } from '@/pages/admin/AdminLayout'
import AdminLogin from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import UserManagement from '@/pages/admin/User'
import AdminProblemList from '@/pages/admin/problem/ProblemList'
import AdminChoiceQuestionList from '@/pages/admin/choice-question/ChoiceQuestionList'
import AdminHomeworkList from '@/pages/admin/homework/HomeworkList'
import TopicManagement from '@/pages/admin/topic/TopicManagement'
import ExamPaperList from '@/pages/admin/exam/ExamPaperList'
import AdminContestList from '@/pages/admin/contest/ContestList'
import AdminCourseList from '@/pages/admin/classroom/CourseList'

function App() {
  // 移除全局预加载动画（参考 8080 的 App.vue）
  useEffect(() => {
    try {
      const loader = document.getElementById('app-loader')
      if (loader) {
        document.body.removeChild(loader)
      }
    } catch (e) {
      // 忽略错误
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem" element={<ProblemList />} />
        <Route path="/problem/:problemID" element={<ProblemDetail />} />
        <Route path="/contest/:contestID/problem/:problemID" element={<ProblemDetail />} />
        
        {/* 选择题路由 - 和8080完全一致 */}
        <Route path="/choice-questions" element={<QuestionList />} />
        <Route path="/choice-question" element={<QuestionList />} />
        <Route path="/choice-question/:id" element={<QuestionDetail />} />
        
        {/* 专题练习路由 - 和8080完全一致 */}
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topics/:id" element={<TopicDetail />} />
        
        {/* 试卷路由 - 和8080完全一致 */}
        <Route path="/exam-history" element={<ExamHistory />} />
        <Route path="/exam/:paperId" element={<ExamPaper />} />
        <Route path="/exam-result/:sessionId" element={<ExamResult />} />
        
        {/* 用户路由 - 和8080完全一致 */}
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/status" element={<SubmissionList />} />
        <Route path="/setting/profile" element={<Settings />} />
        <Route path="/setting/security" element={<Settings />} />
        <Route path="/setting/account" element={<Settings />} />
        <Route path="/wrong-questions" element={<WrongQuestionBook />} />
        
        {/* 作业路由 - 和8080完全一致 */}
        <Route path="/homework" element={<HomeworkList />} />
        <Route path="/homework/:id" element={<HomeworkDetail />} />
        
        {/* 排名路由 - 和8080完全一致 */}
        <Route path="/acm-rank" element={<ACMRank />} />
        <Route path="/oi-rank" element={<OIRank />} />
        
        {/* 竞赛路由 - 和8080完全一致 */}
        <Route path="/contest" element={<ContestList />} />
        
        {/* 智慧课堂路由 */}
        <Route path="/classroom" element={<CreativeClassroomHome />} />
        <Route path="/classroom/teacher/courses" element={<TeacherCourseList />} />
        <Route path="/classroom/teacher/courses/:courseId/edit" element={<CourseEditorSplit />} />
        <Route path="/classroom/teacher/courses/:courseId/edit-claude" element={<CourseEditorClaude />} />
        <Route path="/classroom/teacher/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/classroom/teacher/markdown-to-slides" element={<MarkdownToSlides />} />
        <Route path="/classroom/teacher/slide-preview" element={<SlidePreview />} />
        <Route path="/classroom/teacher/slide-fullscreen" element={<SlideFullscreen />} />
        <Route path="/classroom/teacher/slide-fullscreen-figma" element={<SlideFullscreenFigma />} />
        <Route path="/classroom/student/courses" element={<StudentCourseList />} />
        <Route path="/classroom/scratch/projects" element={<ScratchProjectList />} />
        <Route path="/classroom/scratch/editor" element={<ScratchEditor />} />
        <Route path="/classroom/scratch/editor/:id" element={<ScratchEditor />} />
        {/* 兼容简写路径 */}
        <Route path="/classroom/scratch/edit" element={<ScratchEditor />} />
        <Route path="/classroom/scratch/edit/:id" element={<ScratchEditor />} />
        <Route path="/classroom/scratch/test" element={<ScratchEditorTest />} />
        <Route path="/classroom/scratch/diagnostic" element={<ScratchDiagnostic />} />
        
        {/* 认证路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 后台路由 - 和8080完全一致 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="problems" element={<AdminProblemList />} />
          <Route path="choice-questions" element={<AdminChoiceQuestionList />} />
          <Route path="homework-list" element={<AdminHomeworkList />} />
          <Route path="topic/management" element={<TopicManagement />} />
          <Route path="exam-papers" element={<ExamPaperList />} />
          <Route path="contest" element={<AdminContestList />} />
          <Route path="classroom/courses" element={<AdminCourseList />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
