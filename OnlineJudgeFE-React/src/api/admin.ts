import axios from './axios'

export const adminAPI = {
  // 用户管理
  async getUserList(params: { offset: number, limit: number, keyword?: string }) {
    const response = await axios.get('/admin/user', {
      params
    })
    return response.data.data
  },

  async createUser(data: any) {
    const response = await axios.post('/admin/user', data)
    return response.data
  },

  async updateUser(data: any) {
    const response = await axios.put('/admin/user', data)
    return response.data
  },

  async deleteUser(userId: number) {
    const response = await axios.delete(`/admin/user`, {
      params: { id: userId }
    })
    return response.data
  },

  // 题目管理
  async getProblemList(params: { offset: number, limit: number, keyword?: string }) {
    const response = await axios.get('/admin/problem', {
      params
    })
    return response.data.data
  },

  async createProblem(data: any) {
    const response = await axios.post('/admin/problem', data)
    return response.data
  },

  async updateProblem(data: any) {
    const response = await axios.put('/admin/problem', data)
    return response.data
  },

  async deleteProblem(problemId: number) {
    const response = await axios.delete(`/admin/problem`, {
      params: { id: problemId }
    })
    return response.data
  },

  // 选择题管理
  async getChoiceQuestionList(params: { offset: number, limit: number, keyword?: string }) {
    const response = await axios.get('/admin/choice_question', {
      params
    })
    return response.data.data
  },

  async createChoiceQuestion(data: any) {
    const response = await axios.post('/admin/choice_question', data)
    return response.data
  },

  // 竞赛管理
  async getContestList(params: { offset: number, limit: number }) {
    const response = await axios.get('/admin/contest', {
      params
    })
    return response.data.data
  },

  async createContest(data: any) {
    const response = await axios.post('/admin/contest', data)
    return response.data
  },

  // Dashboard数据
  async getDashboardInfo() {
    const response = await axios.get('/admin/dashboard_info')
    return response.data.data
  },

  // 作业管理
  async getHomeworkList(params: { offset: number, limit: number }) {
    const response = await axios.get('/admin/homework', {
      params
    })
    return response.data.data
  },

  // 试卷管理
  async getExamPaperList(params: { offset: number, limit: number }) {
    const response = await axios.get('/admin/exam_paper', {
      params
    })
    return response.data.data
  },

  // 专题管理
  async getTopicList(params: { offset: number, limit: number }) {
    const response = await axios.get('/admin/topic', {
      params
    })
    return response.data.data
  },

  // 课程管理
  async getCourseList(params: { offset: number, limit: number }) {
    const response = await axios.get('/admin/classroom/courses', {
      params
    })
    return response.data.data
  }
}

