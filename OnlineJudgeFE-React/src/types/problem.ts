export interface Problem {
  _id: string
  id: string
  title: string
  difficulty: 'Low' | 'Mid' | 'High'
  tags: string[]
  submission_number: number
  accepted_number: number
  my_status?: 0 | 1 | 2 // 0: not attempted, 1: attempted, 2: accepted
  created_by?: {
    username: string
  }
}

export interface ProblemTag {
  name: string
}

export interface ProblemListParams {
  offset?: number
  limit?: number
  keyword?: string
  difficulty?: '' | 'Low' | 'Mid' | 'High'
  tag?: string
  page?: number
  paging?: boolean
}

export interface ProblemListResponse {
  total: number
  results: Problem[]
}

// Django API 通用响应格式
export interface ApiResponse<T> {
  error: string | null
  data: T
}

