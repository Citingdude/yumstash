import type { DB } from '~~/server/db'
import type { Session, SessionWithToken } from '~~/shared/types/session/session.type'
import { constantTimeEqual, generateSecureRandomString, hashSecret } from '#shared/utils/crypto/crypto.util'
import { decodeBase64, encodeBase64 } from '#shared/utils/encode/encode.util'
import { eq } from 'drizzle-orm'
import { sessionsTable } from '~~/server/db/schema'

export async function createSession(db: DB, userId: string): Promise<SessionWithToken> {
  const now = new Date()

  const id = generateSecureRandomString()
  const secret = generateSecureRandomString()
  const secretHash = await hashSecret(secret)
  const base64SecretHash = encodeBase64(secretHash)

  const token = `${id}.${secret}`

  const session: SessionWithToken = {
    id,
    secretHash: base64SecretHash,
    createdAt: now,
    token,
  }

  await db.insert(sessionsTable).values({
    id: session.id,
    userId,
    secretHash: session.secretHash!,
    createdAt: session.createdAt,
  })

  return session
}

export async function validateSessionToken(db: DB, token: string): Promise<Session | null> {
  const tokenParts = token.split('.')
  if (tokenParts.length !== 2) {
    return null
  }
  const sessionId = tokenParts[0]
  const sessionSecret = tokenParts[1]

  if (!sessionId) {
    return null
  }

  const session = await getSession(db, sessionId)
  if (!session) {
    return null
  }

  if (sessionSecret === undefined) {
    return null
  }

  if (!session.secretHash) {
    return null
  }

  const tokenSecretHash = await hashSecret(sessionSecret)
  const storedSecretHash = decodeBase64(session.secretHash)
  const validSecret = constantTimeEqual(tokenSecretHash, storedSecretHash)
  if (!validSecret) {
    return null
  }

  return session
}

async function getSession(db: DB, sessionId: string): Promise<Session | null> {
  const result = await db.query.sessionsTable.findFirst({
    where: ({ id }) => eq(id, sessionId),
  })

  if (!result) {
    return null
  }

  if (!result.id) {
    return null
  }

  const session: Session = {
    id: result.id,
    userId: result.userId,
    secretHash: result.secretHash,
    createdAt: result.createdAt,
  }

  return session
}
