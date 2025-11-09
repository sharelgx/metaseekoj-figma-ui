import axios from './axios'

export interface Contest {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  create_time: string
  last_update_time: string
  created_by: {
    username: string
  }
  status: number
  rule_type: 'ACM' | 'OI'
  password?: string
  visible: boolean
  real_time_rank: boolean
  allowed_ip_ranges: string[]
}

export const contestAPI = {
  // 获取竞赛列表
  async getContestList(params: { offset: number, limit: number, status?: string }) {
    const response = await axios.get('/contest', {
      params
    })
    return response.data.data
  },

  // 获取竞赛详情
  async getContestDetail(contestId: string) {
    const response = await axios.get(`/contest`, {
      params: {
        id: contestId
      }
    })
    return response.data.data
  },

  // 获取竞赛排行榜
  async getContestRank(contestId: string, params: { offset: number, limit: number }) {
    const response = await axios.get(`/contest_rank`, {
      params: {
        contest_id: contestId,
        ...params
      }
    })
    return response.data.data
  }
}

