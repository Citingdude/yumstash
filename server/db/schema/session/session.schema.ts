import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from '../user/user.schema'

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  secretHash: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export type SessionInsert = InferInsertModel<typeof sessionsTable>
export type SessionSelect = InferSelectModel<typeof sessionsTable>
