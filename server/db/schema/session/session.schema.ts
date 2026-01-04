import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  secretHash: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export type SessionInsert = InferInsertModel<typeof sessionsTable>
export type SessionSelect = InferSelectModel<typeof sessionsTable>
