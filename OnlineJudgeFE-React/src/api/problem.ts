import axios from './axios'

export interface ProblemListParams {
  offset: number
  limit: number
  difficulty?: string
  tag?: string
  keyword?: string
}

export interface Problem {
  id: number
  _id: string
  title: string
  difficulty: string
  tags: string[]
  submission_number: number
  accepted_number: number
  my_status?: number
  created_by?: {
    username: string
  }
}

export interface ProblemListResponse {
  total: number
  results: Problem[]
}

export interface ProblemDetail extends Problem {
  description: string
  input_description: string
  output_description: string
  samples: Array<{
    input: string
    output: string
  }>
  hint: string
  languages: string[]
  template: Record<string, string>
  time_limit: number
  memory_limit: number
  io_mode?: {
    io_mode: string
    input_file_name?: string
    output_file_name?: string
  }
  rule_type: string
  difficulty: string
  visible: boolean
  tags: string[]
  source?: string
  total_score?: number
  statistic_info?: {
    submission_number: number
    accepted_number: number
  }
}

export const problemAPI = {
  // 获取题目列表
  async getProblemList(params: ProblemListParams) {
    const response = await axios.get<{ error: null, data: ProblemListResponse }>('/problem', {
      params: {
        paging: true,
        ...params
      }
    })
    return response.data.data
  },

  // 获取题目详情
  async getProblemDetail(problemId: string) {
    const response = await axios.get<{ error: null, data: ProblemDetail }>(`/problem`, {
      params: {
        problem_id: problemId
      }
    })
    return response.data.data
  },

  // 获取标签列表
  async getTagList() {
    const response = await axios.get<{ error: null, data: string[] }>('/problem/tags')
    return response.data.data
  },

  // 随机选题
  async pickOne() {
    const response = await axios.get<{ error: null, data: { _id: string } }>('/pickone')
    return response.data.data
  },

  // 提交代码
  async submitCode(data: {
    problem_id: number
    language: string
    code: string
    contest_id?: number
  }) {
    const response = await axios.post('/submission', data)
    return response.data
  }
}
