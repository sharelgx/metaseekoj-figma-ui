import axios from './axios'

export interface RankUser {
  user: {
    id: number
    username: string
    real_name?: string
    avatar?: string
  }
  accepted_number: number
  submission_number: number
  total_score?: number
}

export const rankAPI = {
  // 获取ACM排行榜
  async getACMRank(params: { offset: number, limit: number, rule?: string }) {
    const response = await axios.get<{ error: null, data: { total: number, results: RankUser[] } }>('/user_rank', {
      params: {
        ...params,
        rule: 'ACM'
      }
    })
    return response.data.data
  },

  // 获取OI排行榜
  async getOIRank(params: { offset: number, limit: number, rule?: string }) {
    const response = await axios.get<{ error: null, data: { total: number, results: RankUser[] } }>('/user_rank', {
      params: {
        ...params,
        rule: 'OI'
      }
    })
    return response.data.data
  }
}

