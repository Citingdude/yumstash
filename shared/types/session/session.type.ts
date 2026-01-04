export interface Session {
  id: string
  secretHash: string | null
  createdAt: Date
}

export interface SessionWithToken extends Session {
  token: string
}
