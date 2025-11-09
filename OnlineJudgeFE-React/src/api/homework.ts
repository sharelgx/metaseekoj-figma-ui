import axios from './axios'

export interface Homework {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  create_time: string
  problems: Array<{
    id: number
    _id: string
    title: string
  }>
  class_name?: string
  status?: string
  submitted_count?: number
  student_count?: number
}

export interface HomeworkSubmission {
  homework_id: number
  problem_id: number
  code: string
  language: string
  submission_id?: string
}

export const homeworkAPI = {
  // 获取作业列表
  async getHomeworkList(params: { offset: number, limit: number }) {
    const response = await axios.get<{ error: null, data: { total: number, results: Homework[] } }>('/homework', {
      params
    })
    return response.data.data
  },

  // 获取作业详情
  async getHomeworkDetail(homeworkId: string) {
    const response = await axios.get<{ error: null, data: Homework }>(`/homework`, {
      params: {
        homework_id: homeworkId
      }
    })
    return response.data.data
  },

  // 提交作业（单题）
  async submitHomework(data: HomeworkSubmission) {
    const response = await axios.post('/homework/submission', data)
    return response.data
  },

  // 获取作业提交记录
  async getHomeworkSubmissions(homeworkId: string) {
    const response = await axios.get(`/homework/submissions`, {
      params: {
        homework_id: homeworkId
      }
    })
    return response.data.data
  }
}

