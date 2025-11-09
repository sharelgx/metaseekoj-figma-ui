import axios from './axios'

export interface Submission {
  id: string
  problem: {
    _id: string
    title: string
  }
  username: string
  result: number
  language: string
  code: string
  create_time: string
  statistic_info?: {
    time_cost: number
    memory_cost: number
  }
}

export const submissionAPI = {
  // 获取提交列表
  async getSubmissionList(params: {
    offset: number
    limit: number
    username?: string
    problem_id?: string
    myself?: boolean
    result?: string
  }) {
    const response = await axios.get<{ error: null, data: { total: number, results: Submission[] } }>('/submission', {
      params
    })
    return response.data.data
  },

  // 获取提交详情
  async getSubmissionDetail(submissionId: string) {
    const response = await axios.get<{ error: null, data: Submission }>(`/submission`, {
      params: {
        id: submissionId
      }
    })
    return response.data.data
  },

  // 查询提交状态（轮询用）
  async checkSubmissionStatus(submissionId: string) {
    const response = await axios.get<{ error: null, data: Submission }>(`/submission`, {
      params: {
        id: submissionId
      }
    })
    return response.data.data
  }
}

