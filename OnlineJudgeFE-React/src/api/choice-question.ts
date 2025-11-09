import axios from './axios'

export interface ChoiceQuestion {
  id: number
  _id: string
  title: string
  question_type: 'single' | 'multiple'
  content: string
  options: Array<{
    key: string
    text: string
    content?: string
  }>
  answer: string | string[]
  difficulty: number
  tags?: string[]
  category?: string
  explanation?: string
  my_status?: number
}

export interface ChoiceQuestionListParams {
  offset: number
  limit: number
  difficulty?: number
  tag?: string
  keyword?: string
  category?: string
}

export interface Category {
  id: number
  name: string
  parent_id?: number
}

export interface Tag {
  id: number
  name: string
}

export const choiceQuestionAPI = {
  // 获取选择题列表
  async getQuestionList(params: ChoiceQuestionListParams) {
    const response = await axios.get('/plugin/choice/questions/', {
      params: {
        paging: true,
        ...params
      }
    })
    return response.data.data
  },

  // 获取选择题详情
  async getQuestionDetail(questionId: string) {
    const response = await axios.get(`/plugin/choice/questions/${questionId}/`)
    return response.data.data
  },

  // 提交答案
  async submitAnswer(data: {
    question_id: number
    answer: string | string[]
  }) {
    const response = await axios.post(`/plugin/choice/questions/${data.question_id}/submit/`, data)
    return response.data
  },

  // 获取错题本
  async getWrongQuestions(params: { offset: number, limit: number }) {
    const response = await axios.get('/plugin/choice/wrong-questions/', {
      params
    })
    return response.data.data
  },

  // 获取专题列表
  async getTopicList() {
    const response = await axios.get('/plugin/choice/topics/')
    return response.data.data
  },

  // 获取专题详情
  async getTopicDetail(topicId: string) {
    const response = await axios.get(`/plugin/choice/topics/${topicId}/`)
    return response.data.data
  },

  // 获取试卷列表
  async getExamPaperList() {
    const response = await axios.get('/plugin/choice/exam-papers/')
    return response.data.data
  },

  // 获取试卷详情
  async getExamPaperDetail(paperId: string) {
    const response = await axios.get(`/plugin/choice/exam-papers/${paperId}/`)
    return response.data.data
  },

  // 提交试卷
  async submitExamPaper(data: {
    paper_id: number
    answers: Record<number, string | string[]>
    time_used: number
  }) {
    const response = await axios.post(`/plugin/choice/exam-sessions/${data.paper_id}/action/`, data)
    return response.data
  },

  // 获取考试历史
  async getExamHistory(params: { offset: number, limit: number }) {
    const response = await axios.get('/plugin/choice/exam-sessions/', {
      params
    })
    return response.data.data
  },

  // 获取考试结果
  async getExamResult(sessionId: string) {
    const response = await axios.get(`/plugin/choice/exam-sessions/${sessionId}/`)
    return response.data.data
  }
}

// 导出独立函数供页面使用
export const getChoiceQuestionList = async (params: any) => {
  const response = await axios.get('/plugin/choice/questions/', {
    params: {
      paging: true,
      ...params
    }
  })
  return response.data.data
}

export const getCategoryList = async () => {
  const response = await axios.get('/plugin/choice/categories/')
  return response.data.data
}

export const getTagList = async () => {
  const response = await axios.get('/plugin/choice/tags/')
  return response.data.data
}

export const createExamPaper = async (config: any) => {
  const response = await axios.post('/plugin/choice/exam-papers/', config)
  return response.data
}

export const getAdjacentQuestion = async (questionId: string, direction: 'prev' | 'next') => {
  const response = await axios.get(`/plugin/choice/questions/${questionId}/adjacent/`, {
    params: { direction }
  })
  return response.data.data
}

export const getChoiceQuestionDetail = async (questionId: number) => {
  const response = await axios.get(`/plugin/choice/questions/${questionId}/`)
  return response.data.data
}

export const submitAnswer = async (data: { question_id: number; user_answer: string }) => {
  const response = await axios.post(`/plugin/choice/questions/${data.question_id}/submit/`, data)
  return response.data.data
}
