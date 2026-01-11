export interface Session {
  id: string
  userId?: string
  secretHash: string
  createdAt: Date
}

export interface SessionWithToken extends Session {
  token: string
}
