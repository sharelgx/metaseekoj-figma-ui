export interface Statistics {
  user_count?: number
  problem_count?: number
  submission_count?: number
  contest_count?: number
}

export interface Problem {
  id: number
  _id: string
  title: string
  difficulty: string
  tags: string[]
  total_score?: number
  submission_number?: number
  accepted_number?: number
}

export interface Announcement {
  id: number
  title: string
  content: string
  created_by: {
    id: number
    username: string
  }
  create_time: string
  last_update_time: string
  visible: boolean
}

export interface UserProfile {
  id: number
  username: string
  real_name?: string
  email: string
  admin_type: string
  problem_permission: string
  create_time: string
  last_login: string
  two_factor_auth: boolean
  open_api: boolean
  is_disabled: boolean
}

